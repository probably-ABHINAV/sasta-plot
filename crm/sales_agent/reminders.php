<?php 
require 'partials/header.php'; 

$agent_id = $_SESSION['user_id'];

// --- START: KEY CHANGE - UPDATED OVERDUE LOGIC ---
// This query now ONLY sets status to 'Overdue' if the due date is 15 or more days in the past.
$conn->query("UPDATE payment_schedules ps 
              JOIN bookings b ON ps.booking_id = b.booking_id 
              SET ps.status = 'Overdue' 
              WHERE b.sales_agent_id = $agent_id 
              AND ps.due_date <= CURDATE() - INTERVAL 15 DAY 
              AND ps.status = 'Upcoming'");
// --- END: KEY CHANGE ---

// --- Fetch Overdue Reminders (Now uses the updated status) ---
$overdue_reminders = [];
$sql_overdue = "SELECT l.client_name, ps.amount, ps.due_date, ps.payment_option, b.plot_name, b.booking_id
                FROM payment_schedules ps
                JOIN bookings b ON ps.booking_id = b.booking_id
                JOIN leads l ON b.lead_id = l.lead_id
                WHERE b.sales_agent_id = ? AND ps.status = 'Overdue'
                ORDER BY ps.due_date ASC";
$stmt_overdue = $conn->prepare($sql_overdue);
$stmt_overdue->bind_param("i", $agent_id);
$stmt_overdue->execute();
$result_overdue = $stmt_overdue->get_result();
while($row = $result_overdue->fetch_assoc()) {
    $overdue_reminders[] = $row;
}
$stmt_overdue->close();

// --- Fetch Today's Reminders (Unchanged) ---
$today_reminders = [];
$sql_today = "SELECT l.client_name, ps.amount, ps.payment_option, b.plot_name, b.booking_id
              FROM payment_schedules ps
              JOIN bookings b ON ps.booking_id = b.booking_id
              JOIN leads l ON b.lead_id = l.lead_id
              WHERE b.sales_agent_id = ? AND ps.due_date = CURDATE() AND ps.status != 'Paid'";
$stmt_today = $conn->prepare($sql_today);
$stmt_today->bind_param("i", $agent_id);
$stmt_today->execute();
$result_today = $stmt_today->get_result();
while($row = $result_today->fetch_assoc()) {
    $today_reminders[] = $row;
}
$stmt_today->close();

// The "Future Upcoming Payments" section has been completely removed.
?>

<!-- Add some specific styles for this page -->
<style>
.reminder-section { margin-bottom: 40px; }
.reminder-section h2 { border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 1.5em; }
.overdue h2 { color: #c62828; border-color: #ffebee; }
.today h2 { color: #005f73; border-color: #e0f7fa; }
.due-date { font-weight: bold; }
.overdue .due-date { color: #c62828; }
.responsive-table a { font-weight: bold; color: #005f73; text-decoration: none; }
.responsive-table a:hover { text-decoration: underline; }
</style>

<h2>Payment Reminders</h2>

<!-- Today's Payments Section -->
<div class="reminder-section today">
    <h2>Today's Payments</h2>
    <table class="responsive-table">
        <thead><tr><th>Customer</th><th>Plot</th><th>Amount Due (₹)</th><th>Payment Method</th><th>Action</th></tr></thead>
        <tbody>
            <?php if (!empty($today_reminders)): ?>
                <?php foreach ($today_reminders as $r): ?>
                <tr>
                    <td data-label="Customer"><?php echo htmlspecialchars($r['client_name']); ?></td>
                    <td data-label="Plot"><?php echo htmlspecialchars($r['plot_name']); ?></td>
                    <td data-label="Amount"><strong><?php echo number_format($r['amount'], 2); ?></strong></td>
                    <td data-label="Method"><?php echo htmlspecialchars($r['payment_option']); ?></td>
                    <td data-label="Action"><a href="manage_customer.php?booking_id=<?php echo $r['booking_id']; ?>">Manage &rarr;</a></td>
                </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr><td colspan="5">No payments due today.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- Overdue Payments Section -->
<div class="reminder-section overdue">
    <h2>Overdue Payments (15+ Days)</h2>
    <table class="responsive-table">
        <thead><tr><th>Customer</th><th>Plot</th><th>Amount Due (₹)</th><th>Was Due On</th><th>Action</th></tr></thead>
        <tbody>
            <?php if (!empty($overdue_reminders)): ?>
                <?php foreach ($overdue_reminders as $r): ?>
                <tr>
                    <td data-label="Customer"><?php echo htmlspecialchars($r['client_name']); ?></td>
                    <td data-label="Plot"><?php echo htmlspecialchars($r['plot_name']); ?></td>
                    <td data-label="Amount"><strong><?php echo number_format($r['amount'], 2); ?></strong></td>
                    <td data-label="Due Date" class="due-date"><?php echo date("d M, Y", strtotime($r['due_date'])); ?></td>
                    <td data-label="Action"><a href="manage_customer.php?booking_id=<?php echo $r['booking_id']; ?>">Manage &rarr;</a></td>
                </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr><td colspan="5">No payments are overdue by 15 days or more.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- The "Future Upcoming Payments" HTML block has been completely removed. -->

<?php require 'partials/footer.php'; ?>