<?php
// STEP 1: All PHP logic MUST be at the top of the file, before any HTML.
require_once '../includes/functions.php'; // Use require_once for functions.php
enforce_security(2); // Enforce security first

$message = '';

// Check for lead_id right away
if (!isset($_GET['lead_id']) || !filter_var($_GET['lead_id'], FILTER_VALIDATE_INT)) {
    // We cannot proceed without a lead_id, redirect to the customer page.
    header("Location: our_customers.php");
    exit();
}
$lead_id = (int)$_GET['lead_id'];
$sales_agent_id = $_SESSION['user_id'];


// --- START: NEW, STREAMLINED FORM PROCESSING ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize plot details
    $plot_name = sanitize_input($_POST['plot_name']);
    $plot_info = sanitize_input($_POST['plot_info']);
    $price_closed = filter_var($_POST['price_closed'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

    // Sanitize initial payment details
    $paid_amount = filter_var($_POST['paid_amount'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $payment_mode = sanitize_input($_POST['payment_mode']);

    // Sanitize next installment details (these are optional)
    $next_payment_amount = !empty($_POST['next_payment_amount']) ? filter_var($_POST['next_payment_amount'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : null;
    $next_payment_date = !empty($_POST['next_payment_date']) ? sanitize_input($_POST['next_payment_date']) : null;

    // Begin a transaction to ensure all-or-nothing data insertion
    $conn->begin_transaction();
    try {
        // Step 1: Create the main booking record
        $stmt_book = $conn->prepare("INSERT INTO bookings (lead_id, sales_agent_id, plot_name, plot_info, price_closed) VALUES (?, ?, ?, ?, ?)");
        $stmt_book->bind_param("iisss", $lead_id, $sales_agent_id, $plot_name, $plot_info, $price_closed);
        $stmt_book->execute();
        $new_booking_id = $stmt_book->insert_id;
        $stmt_book->close();

        // Step 2: Insert the initial payment record (the amount paid TODAY)
        if ($paid_amount > 0) {
            $today = date('Y-m-d');
            $stmt_paid = $conn->prepare("INSERT INTO payment_schedules (booking_id, amount, due_date, status, payment_option, payment_date) VALUES (?, ?, ?, 'Paid', ?, ?)");
            $stmt_paid->bind_param("issss", $new_booking_id, $paid_amount, $today, $payment_mode, $today);
            $stmt_paid->execute();
            $stmt_paid->close();
        }

        // Step 3: Insert the next scheduled payment record (if provided)
        if ($next_payment_amount > 0 && !empty($next_payment_date)) {
            $stmt_next = $conn->prepare("INSERT INTO payment_schedules (booking_id, amount, due_date, status, payment_option) VALUES (?, ?, ?, 'Upcoming', 'Scheduled Installment')");
            $stmt_next->bind_param("iss", $new_booking_id, $next_payment_amount, $next_payment_date);
            $stmt_next->execute();
            $stmt_next->close();
        }

        // Step 4: Hide the original lead from the agent's main dashboard
        $stmt_hide = $conn->prepare("INSERT IGNORE INTO hidden_by_agent (lead_id, user_id) VALUES (?, ?)");
        $stmt_hide->bind_param("ii", $lead_id, $sales_agent_id);
        $stmt_hide->execute();
        $stmt_hide->close();
        
        // If everything was successful, commit the transaction
        $conn->commit();
        
        // THIS IS THE CRITICAL PART: Redirect BEFORE any HTML is sent
        header("Location: manage_customer.php?booking_id=" . $new_booking_id . "&status=created_with_schedule");
        exit(); // Always exit after a header redirect

    } catch (mysqli_sql_exception $exception) {
        $conn->rollback();
        if ($exception->getCode() == 1062) {
             $message = "<p class='error-message'>Error: This lead has already been converted into a customer.</p>";
        } else {
             $message = "<p class='error-message'>Database Error: Could not create booking. Please check your data. " . $exception->getMessage() . "</p>";
        }
    }
}
// --- END: NEW, STREAMLINED FORM PROCESSING ---


// STEP 2: Now that all processing is done, we can fetch data for displaying the page.
$lead_stmt = $conn->prepare("SELECT client_name FROM leads WHERE lead_id = ?");
$lead_stmt->bind_param("i", $lead_id);
$lead_stmt->execute();
$lead = $lead_stmt->get_result()->fetch_assoc();
if (!$lead) {
    // If we still can't find the lead, redirect.
    header("Location: our_customers.php");
    exit();
}
$lead_stmt->close();

// STEP 3: Finally, we can include the header and start sending HTML output.
require 'partials/header.php'; 
?>

<!-- Add some inline CSS for the new form layout -->
<style>
    .form-section {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 30px;
    }
    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    .form-grid .full-width {
        grid-column: 1 / -1;
    }
    .error-message { text-align:center; background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #f5c6cb;}
    @media (max-width: 768px) {
        .form-grid { grid-template-columns: 1fr; }
    }
</style>

<h3>Convert Lead to Customer: <?php echo htmlspecialchars($lead['client_name']); ?></h3>
<p>Enter the final deal information and payment details below.</p>

<?php if(!empty($message)) echo $message; ?>

<form action="" method="post">
    <!-- Section 1: Plot & Deal Information -->
    <div class="form-section">
        <h4 class="section-title">Plot & Deal Details</h4>
        <div class="form-grid">
            <div class="full-width">
                <label for="plot_name">Plot Name / Number:</label>
                <input type="text" name="plot_name" placeholder="E.g., A-14, Bajrang Vatika Phase 2" required>
            </div>
            <div class="full-width">
                <label for="plot_info">Plot Information (Size, Facing, etc.):</label>
                <textarea name="plot_info" rows="3" placeholder="E.g., 100 sq. yards, East facing, near park"></textarea>
            </div>
            <div>
                <label for="price_closed">Final Closed Amount (₹):</label>
                <input type="number" name="price_closed" step="0.01" placeholder="E.g., 1650000" required>
            </div>
        </div>
    </div>
    
    <!-- Section 2: Initial Payment (Paid Today) -->
    <div class="form-section">
        <h4 class="section-title">Initial Payment (Paid Today)</h4>
        <div class="form-grid">
            <div>
                <label for="paid_amount">Booking Amount Paid (₹):</label>
                <input type="number" name="paid_amount" step="0.01" placeholder="Amount paid right now" required>
            </div>
            <div>
                <label for="payment_mode">Payment Mode:</label>
                <input type="text" name="payment_mode" placeholder="E.g., UPI, Cheque, Bank Transfer" required>
            </div>
        </div>
    </div>

    <!-- Section 3: Next Payment (Optional) -->
    <div class="form-section">
        <h4 class="section-title">Next Installment (Optional)</h4>
        <p style="padding:0; margin-top:-10px; margin-bottom:15px; font-size:0.9em; color:#666;">Fill this out to automatically schedule the next reminder.</p>
        <div class="form-grid">
            <div>
                <label for="next_payment_amount">Next Payment Amount (₹):</label>
                <input type="number" name="next_payment_amount" step="0.01" placeholder="Amount for the next installment">
            </div>
            <div>
                <label for="next_payment_date">Next Payment Due Date:</label>
                <input type="date" name="next_payment_date">
            </div>
        </div>
    </div>

    <button type="submit" style="background-color: #1A5D1A; font-size: 1.2em;">Create Booking & Finalize</button>
</form>

<?php require 'partials/footer.php'; ?>