<?php
require 'partials/header.php';
enforce_security(1); // Admin Only

$admin_id = $_SESSION['user_id'];

// Security: Ensure a booking_id is provided and is an integer
if (!isset($_GET['booking_id']) || !filter_var($_GET['booking_id'], FILTER_VALIDATE_INT)) {
    echo "Invalid Booking ID."; exit();
}
$booking_id = (int)$_GET['booking_id'];

// --- MODIFICATION: Fetch Booking and verify ownership by the current admin ---
$sql_booking = "SELECT b.*, l.client_name, l.client_phone, l.client_email, u.username as agent_name 
                FROM bookings b 
                JOIN leads l ON b.lead_id = l.lead_id 
                JOIN users u ON b.sales_agent_id = u.user_id
                WHERE b.booking_id = ? AND l.admin_id = ?"; // Check against leads.admin_id
$stmt_booking = $conn->prepare($sql_booking);
$stmt_booking->bind_param("ii", $booking_id, $admin_id);
$stmt_booking->execute();
$booking = $stmt_booking->get_result()->fetch_assoc();

if (!$booking) { 
    echo "Booking not found or you do not have permission to view this record."; 
    exit(); 
}
$stmt_booking->close();

// --- Fetch Payment History (This part doesn't need a filter as we already validated ownership) ---
$sql_payments = "SELECT * FROM payment_schedules WHERE booking_id = ? ORDER BY payment_date ASC, due_date ASC";
$stmt_payments = $conn->prepare($sql_payments);
$stmt_payments->bind_param("i", $booking_id);
$stmt_payments->execute();
$payments_result = $stmt_payments->get_result();
$stmt_payments->close();

$total_paid = 0;
?>
<!-- (Styles are unchanged) -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
    body { font-family: 'Poppins', sans-serif; }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; background-color: #f8f9fa; color: #343a40 !important; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: 600; border: 1px solid #dee2e6; transition: background-color 0.2s, box-shadow 0.2s; margin-bottom: 25px; }
    .btn-back:hover { background-color: #e9ecef; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .btn-back svg { width: 16px; height: 16px; fill: #343a40; }
    .customer-header { background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.07); }
    .customer-header h2 { margin-top: 0; color: #003d47; }
    .customer-header p { margin: 5px 0; font-size: 1.1em; }
    .section-title { font-size: 1.5em; color: #003d47; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .payment-summary { padding: 20px; text-align: right; font-size: 1.2em; background-color: #f8f9fa; border-radius: 8px; margin-top: 20px; }
</style>

<a href="end_customers.php" class="btn-back">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
    <span>Back</span>
</a>

<div class="customer-header">
    <h2>Payment History for: <?php echo htmlspecialchars($booking['client_name']); ?></h2>
    <p><strong>Phone:</strong> <?php echo htmlspecialchars($booking['client_phone']); ?> | <strong>Email:</strong> <?php echo htmlspecialchars($booking['client_email']); ?></p>
    <p><strong>Sales Agent:</strong> <?php echo htmlspecialchars($booking['agent_name']); ?></p>
    <hr>
    <p><strong>Plot:</strong> <?php echo htmlspecialchars($booking['plot_name']); ?></p>
    <p><strong>Final Deal Price:</strong> ₹<?php echo number_format($booking['price_closed'], 2); ?></p>
</div>

<h3 class="section-title">All Recorded Payments</h3>
<table class="responsive-table">
    <thead><tr><th>Payment Date</th><th>Amount Paid (₹)</th><th>Payment Method / Note</th><th>Original Due Date</th></tr></thead>
    <tbody>
    <?php
    if ($payments_result->num_rows > 0) {
        while($p = $payments_result->fetch_assoc()) {
            if ($p['status'] === 'Paid') $total_paid += $p['amount'];
            echo "<tr>";
            echo "<td data-label='Payment Date'><strong>" . date("d M, Y", strtotime($p['payment_date'])) . "</strong></td>";
            echo "<td data-label='Amount'>₹" . number_format($p['amount'], 2) . "</td>";
            echo "<td data-label='Method'>" . htmlspecialchars($p['payment_option']) . "</td>";
            echo "<td data-label='Due Date'>" . date("d M, Y", strtotime($p['due_date'])) . "</td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='4'>No payment records found for this booking.</td></tr>";
    }
    ?>
    </tbody>
</table>

<div class="payment-summary">
    <p><strong>Total Amount Paid:</strong> ₹<?php echo number_format($total_paid, 2); ?></p>
</div>

<?php require 'partials/footer.php'; ?>