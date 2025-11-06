<?php
// STEP 1: All PHP logic runs before any HTML
require_once '../includes/functions.php';
enforce_security(2);

$message = '';

// Security: Ensure a payment_id is provided
if (!isset($_GET['payment_id']) || !filter_var($_GET['payment_id'], FILTER_VALIDATE_INT)) {
    header("Location: our_customers.php");
    exit();
}
$payment_id = (int)$_GET['payment_id'];
$sales_agent_id = $_SESSION['user_id'];

// --- PROCESS THE UPDATE FORM SUBMISSION (POST request) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize all inputs from the form
    $new_due_date = sanitize_input($_POST['due_date']);
    $new_amount = filter_var($_POST['amount'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $new_payment_option = sanitize_input($_POST['payment_option']);
    $booking_id_for_redirect = (int)$_POST['booking_id']; // For redirecting back

    // Update the payment schedule in the database
    $stmt = $conn->prepare("UPDATE payment_schedules SET due_date = ?, amount = ?, payment_option = ? WHERE payment_id = ?");
    $stmt->bind_param("sssi", $new_due_date, $new_amount, $new_payment_option, $payment_id);
    
    if ($stmt->execute()) {
        // Redirect back to the main customer page with a success message
        header("Location: manage_customer.php?booking_id=" . $booking_id_for_redirect . "&status=payment_updated");
        exit();
    } else {
        $message = "<p class='error-message'>Error: Could not update the payment schedule.</p>";
    }
    $stmt->close();
}


// --- FETCH CURRENT PAYMENT DATA FOR THE FORM (GET request) ---
// This query includes a crucial security check to ensure the agent owns this payment
$sql = "SELECT ps.*, b.sales_agent_id, b.booking_id, l.client_name
        FROM payment_schedules ps
        JOIN bookings b ON ps.booking_id = b.booking_id
        JOIN leads l ON b.lead_id = l.lead_id
        WHERE ps.payment_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $payment_id);
$stmt->execute();
$payment = $stmt->get_result()->fetch_assoc();
$stmt->close();

// --- SECURITY CHECKS ---
// 1. If payment not found, or if it doesn't belong to the logged-in agent, deny access.
if (!$payment || $payment['sales_agent_id'] != $sales_agent_id) {
    exit("Access Denied: You do not have permission to edit this payment.");
}
// 2. If payment is already 'Paid', it cannot be edited. Redirect back.
if ($payment['status'] === 'Paid') {
    header("Location: manage_customer.php?booking_id=" . $payment['booking_id']);
    exit();
}


// STEP 2: Now we can include the header and display the HTML
require 'partials/header.php';
?>
<style>
    .error-message { text-align:center; background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #f5c6cb;}
</style>

<h3>Edit Payment for <?php echo htmlspecialchars($payment['client_name']); ?></h3>
<p><a href="manage_customer.php?booking_id=<?php echo $payment['booking_id']; ?>">&larr; Back to Customer Details</a></p>

<?php if (!empty($message)) echo $message; ?>

<form action="edit_payment.php?payment_id=<?php echo $payment_id; ?>" method="post">
    <!-- Hidden input to know where to redirect back to -->
    <input type="hidden" name="booking_id" value="<?php echo $payment['booking_id']; ?>">

    <label for="due_date">Due Date:</label>
    <input type="date" name="due_date" value="<?php echo htmlspecialchars($payment['due_date']); ?>" required>

    <label for="amount">Amount (₹):</label>
    <input type="number" name="amount" step="0.01" value="<?php echo htmlspecialchars($payment['amount']); ?>" required>

    <label for="payment_option">Payment Mode / Note:</label>
    <input type="text" name="payment_option" value="<?php echo htmlspecialchars($payment['payment_option']); ?>" required>
    
    <button type="submit">Update Payment</button>
</form>

<?php require 'partials/footer.php'; ?>