<?php
require 'partials/header.php';
enforce_security(1);

$admin_id = $_SESSION['user_id'];
$message = '';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action'], $_POST['lead_id'])) {
    if ($_POST['action'] === 'delete_customer') {
        $lead_id_to_delete = (int)$_POST['lead_id'];

        $stmt_check = $conn->prepare("SELECT lead_id FROM leads WHERE lead_id = ? AND admin_id = ?");
        $stmt_check->bind_param("ii", $lead_id_to_delete, $admin_id);
        $stmt_check->execute();
        if ($stmt_check->get_result()->num_rows === 1) {
            $conn->begin_transaction();
            try {
                $stmt = $conn->prepare("DELETE FROM leads WHERE lead_id = ?");
                $stmt->bind_param("i", $lead_id_to_delete);
                if ($stmt->execute()) {
                    $conn->commit();
                    $message = "<p class='status-message success'>Customer record and all associated data have been permanently deleted.</p>";
                } else {
                    $conn->rollback();
                    $message = "<p class='status-message error'>Error: Could not delete the customer record.</p>";
                }
                $stmt->close();
            } catch (mysqli_sql_exception $exception) {
                $conn->rollback();
                $message = "<p class='status-message error'>Database Error: " . $exception->getMessage() . "</p>";
            }
        }
        $stmt_check->close();
    }
}
?>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
    body { font-family: 'Poppins', sans-serif; }
    .status-message { padding: 12px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
    .status-message.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .status-message.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .page-header h2 { font-size: 1.8em; color: #003d47; }
    .page-header p { margin-top: 5px; color: #6c757d; }
    .action-container { display: flex; flex-direction: column; gap: 8px; }
    .btn-action { display: block; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-weight: 500; font-size: 0.9em; text-align: center; border: none; cursor: pointer; }
    .btn-details { background-color: #007bff; color: white !important; }
    .btn-delete { background-color: #d90429; color: white; width: 100%; }
</style>

<div class="page-header">
    <h2>Your End Customers (Archived)</h2>
    <p>This section lists all customers from your account who have completed their payment schedules.</p>
</div>

<?php if (!empty($message)) echo $message; ?>

<table class="responsive-table">
    <thead>
        <tr>
            <th>Customer Name</th>
            <th>Contact Info</th>
            <th>Plot Details</th>
            <th>Sales Agent</th>
            <th>Final Payment Date</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $sql = "SELECT b.booking_id, l.lead_id, l.client_name, l.client_email, l.client_phone, b.plot_name, u.username as agent_name,
                       (SELECT MAX(payment_date) FROM payment_schedules WHERE booking_id = b.booking_id AND status = 'Paid') as final_payment_date
                FROM bookings b
                JOIN leads l ON b.lead_id = l.lead_id
                JOIN users u ON b.sales_agent_id = u.user_id
                WHERE b.status = 'Completed' AND l.admin_id = ?
                ORDER BY final_payment_date DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $admin_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Customer'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Contact'>" . htmlspecialchars($row['client_email']) . "<br>" . htmlspecialchars($row['client_phone']) . "</td>";
                echo "<td data-label='Plot'>" . htmlspecialchars($row['plot_name']) . "</td>";
                echo "<td data-label='Agent'>" . htmlspecialchars($row['agent_name']) . "</td>";
                echo "<td data-label='Final Payment'>" . ($row['final_payment_date'] ? date("d M, Y", strtotime($row['final_payment_date'])) : 'N/A') . "</td>";
                echo "<td data-label='Action'>
                        <div class='action-container'>
                            <a href='end_customer_details.php?booking_id=".$row['booking_id']."' class='btn-action btn-details'>See Details</a>
                            <form action='end_customers.php' method='post' onsubmit='return confirm(\"DANGER: Are you sure you want to permanently delete this customer and all their associated data? This action cannot be undone.\");' style='margin:0;'>
                                <input type='hidden' name='action' value='delete_customer'>
                                <input type='hidden' name='lead_id' value='".$row['lead_id']."'>
                                <button type='submit' class='btn-action btn-delete'>Delete</button>
                            </form>
                        </div>
                      </td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='6'>No customers from your account have completed their payments yet.</td></tr>";
        }
        $stmt->close();
        ?>
    </tbody>
</table>

<?php require 'partials/footer.php'; ?>