<?php
require 'partials/header.php';

if (!isset($_GET['booking_id']) || !filter_var($_GET['booking_id'], FILTER_VALIDATE_INT)) {
    echo "Invalid Booking ID."; exit();
}
$booking_id = (int)$_GET['booking_id'];
$sales_agent_id = $_SESSION['user_id'];
$message = '';

// --- Handle Form Submissions (Add Payment, Mark as Paid) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    
    if ($_POST['action'] === 'add_payment') {
        $amount = filter_var($_POST['amount'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $due_date = sanitize_input($_POST['due_date']);
        $payment_option = sanitize_input($_POST['payment_option']);
        
        $stmt = $conn->prepare("INSERT INTO payment_schedules (booking_id, amount, due_date, payment_option, status) VALUES (?, ?, ?, ?, 'Upcoming')");
        $stmt->bind_param("isss", $booking_id, $amount, $due_date, $payment_option);
        if ($stmt->execute()) { $message = "<p class='status-message'>New payment scheduled successfully.</p>"; }
        $stmt->close();
    }
    
    elseif ($_POST['action'] === 'mark_paid' && isset($_POST['payment_id'])) {
        $payment_id = (int)$_POST['payment_id'];
        $payment_date = date('Y-m-d');
        
        $conn->begin_transaction();
        try {
            // Step 1: Mark the payment as paid
            $stmt_pay = $conn->prepare("UPDATE payment_schedules SET status = 'Paid', payment_date = ? WHERE payment_id = ? AND booking_id = ?");
            $stmt_pay->bind_param("sii", $payment_date, $payment_id, $booking_id);
            $stmt_pay->execute();
            $stmt_pay->close();

            // Step 2: Recalculate the new total paid amount
            $total_paid_q = $conn->query("SELECT SUM(amount) as total FROM payment_schedules WHERE booking_id = $booking_id AND status = 'Paid'");
            $new_total_paid = $total_paid_q->fetch_assoc()['total'];

            // Step 3: Get the total deal price
            $deal_price_q = $conn->query("SELECT price_closed FROM bookings WHERE booking_id = $booking_id");
            $deal_price = $deal_price_q->fetch_assoc()['price_closed'];

            // Step 4: Check if the balance is zero or less (using a small tolerance)
            if (($deal_price - $new_total_paid) <= 0.01) {
                // If paid in full, update the booking status to 'Completed'
                $conn->query("UPDATE bookings SET status = 'Completed' WHERE booking_id = $booking_id");
                
                // CRITICAL: Commit the transaction and redirect to break the loop
                $conn->commit();
                header("Location: our_customers.php?status=payment_completed");
                exit();

            } else {
                $message = "<p class='status-message'>Payment marked as paid successfully.</p>";
            }
            
            $conn->commit();
        } catch (mysqli_sql_exception $exception) {
            $conn->rollback();
            $message = "<p class='error-message'>Error updating payment: " . $exception->getMessage() . "</p>";
        }
    }
}

// --- Fetch Booking and Customer Details ---
$sql_booking = "SELECT b.*, l.client_name, l.client_phone, l.client_email FROM bookings b JOIN leads l ON b.lead_id = l.lead_id WHERE b.booking_id = ? AND b.sales_agent_id = ?";
$stmt_booking = $conn->prepare($sql_booking);
$stmt_booking->bind_param("ii", $booking_id, $sales_agent_id);
$stmt_booking->execute();
$booking = $stmt_booking->get_result()->fetch_assoc();
if (!$booking) { echo "Booking not found or you do not have permission to view it."; exit(); }
$stmt_booking->close();

// --- Fetch Payment History ---
$sql_payments = "SELECT * FROM payment_schedules WHERE booking_id = ? ORDER BY due_date ASC";
$stmt_payments = $conn->prepare($sql_payments);
$stmt_payments->bind_param("i", $booking_id);
$stmt_payments->execute();
$payments_result = $stmt_payments->get_result();
$stmt_payments->close();

$total_paid = 0;
?>
<style>
    .status-message { text-align:center; background-color: #e8f5e9; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #c3e6cb;}
    .error-message { text-align:center; background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #f5c6cb;}
    .lead-header { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
    .section-title { border-bottom: 2px solid #0a9d8f; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.5em; color: #333; }
</style>

<?php if(!empty($message)) echo $message; ?>
<?php if(isset($_GET['status']) && $_GET['status'] === 'created_with_schedule') echo "<p class='status-message'>Booking finalized successfully! You can manage the payment schedule below.</p>"; ?>
<?php if(isset($_GET['status']) && $_GET['status'] === 'payment_updated') echo "<p class='status-message'>Payment schedule updated successfully!</p>"; ?>

<!-- Customer & Booking Details Header -->
<div class="lead-header">
    <h2><?php echo htmlspecialchars($booking['client_name']); ?></h2>
    <p><strong>Phone:</strong> <?php echo htmlspecialchars($booking['client_phone']); ?> | <strong>Email:</strong> <?php echo htmlspecialchars($booking['client_email']); ?></p>
    <hr>
    <p><strong>Plot:</strong> <?php echo htmlspecialchars($booking['plot_name']); ?> | <strong>Deal Price:</strong> ₹<?php echo number_format($booking['price_closed'], 2); ?></p>
    <p><strong>Details:</strong> <?php echo nl2br(htmlspecialchars($booking['plot_info'])); ?></p>
</div>

<!-- Payment History Table -->
<h3 class="section-title">Payment History & Schedule</h3>
<table class="responsive-table">
    <thead>
        <tr><th>Due Date</th><th>Amount (₹)</th><th>Payment Method / Note</th><th>Status</th><th>Action</th></tr>
    </thead>
    <tbody>
    <?php
    if ($payments_result->num_rows > 0) {
        while($p = $payments_result->fetch_assoc()) {
            if ($p['status'] === 'Paid') $total_paid += $p['amount'];

            $status_color = ($p['status'] == 'Paid') ? 'green' : (($p['status'] == 'Overdue') ? 'red' : 'orange');
            echo "<tr>";
            echo "<td data-label='Due Date'>" . date("d M, Y", strtotime($p['due_date'])) . "</td>";
            echo "<td data-label='Amount'>₹" . number_format($p['amount'], 2) . "</td>";
            echo "<td data-label='Method'>" . htmlspecialchars($p['payment_option']) . "</td>";
            echo "<td data-label='Status'><strong style='color:$status_color;'>" . htmlspecialchars($p['status']) . "</strong></td>";
            echo "<td data-label='Action'>";
            if ($p['status'] === 'Upcoming' || $p['status'] === 'Overdue') {
                echo "<div style='display:flex; gap:10px; align-items:center;'>";
                echo "<form method='post' action='' style='margin:0;'><input type='hidden' name='action' value='mark_paid'><input type='hidden' name='payment_id' value='{$p['payment_id']}'><button type='submit'>Mark Paid</button></form>";
                echo "<a href='edit_payment.php?payment_id={$p['payment_id']}' style='background-color:#1a73e8; color:white; padding: 8px 12px; border-radius:4px; text-decoration:none; font-size:0.9em;'>Reschedule</a>";
                echo "</div>";
            } else {
                echo "Paid on " . date("d M, Y", strtotime($p['payment_date']));
            }
            echo "</td></tr>";
        }
    } else {
        echo "<tr><td colspan='5'>No payments have been scheduled yet.</td></tr>";
    }
    ?>
    </tbody>
</table>

<!-- Payment Summary -->
<div style="padding: 20px; text-align: right; font-size: 1.2em;">
    <p><strong>Total Paid:</strong> ₹<?php echo number_format($total_paid, 2); ?></p>
    <p><strong>Total Remaining:</strong> ₹<?php echo number_format($booking['price_closed'] - $total_paid, 2); ?></p>
</div>

<!-- Add New Payment Form (only if the booking is still active) -->
<?php if ($booking['status'] === 'Active'): ?>
<hr>
<h3 class="section-title">Add New Payment Schedule</h3>
<form action="" method="post">
    <input type="hidden" name="action" value="add_payment">
    <label for="due_date">Next Payment Due Date:</label>
    <input type="date" name="due_date" required>
    <label for="amount">Amount (₹):</label>
    <input type="number" name="amount" step="0.01" placeholder="Amount for this installment" required>
    <label for="payment_option">Payment Mode / Note:</label>
    <input type="text" name="payment_option" placeholder="E.g., Cheque, UPI, Bank Transfer" required>
    <button type="submit">Add Scheduled Payment</button>
</form>
<?php else: ?>
<hr>
<div style="text-align:center; padding: 20px; background-color:#e8f5e9; border-radius: 8px;">
    <h3 style="color:#155724; margin-top:0;">Payment Complete!</h3>
    <p>This customer's payment schedule is complete. The record has been moved to the 'Completed Payments' archive.</p>
</div>
<?php endif; ?>

<?php require 'partials/footer.php'; ?>