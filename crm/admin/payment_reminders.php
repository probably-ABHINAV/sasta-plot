<?php 
require 'partials/header.php'; 
enforce_security(1); // Admin Only

$admin_id = $_SESSION['user_id'];

// --- MODIFICATION: Filter the Overdue update by admin_id ---
$conn->query("UPDATE payment_schedules ps 
              JOIN bookings b ON ps.booking_id = b.booking_id 
              JOIN leads l ON b.lead_id = l.lead_id
              SET ps.status = 'Overdue' 
              WHERE l.admin_id = $admin_id
              AND ps.due_date <= CURDATE() - INTERVAL 15 DAY 
              AND ps.status = 'Upcoming'");

// --- Fetch Today's Reminders (Filtered) ---
$today_reminders = [];
$sql_today = "SELECT l.client_name, ps.amount, ps.payment_option, b.plot_name, u.username AS sales_agent_name
              FROM payment_schedules ps
              JOIN bookings b ON ps.booking_id = b.booking_id
              JOIN leads l ON b.lead_id = l.lead_id
              JOIN users u ON b.sales_agent_id = u.user_id
              WHERE ps.due_date = CURDATE() AND ps.status != 'Paid' AND l.admin_id = ?
              ORDER BY u.username, l.client_name";
$stmt_today = $conn->prepare($sql_today);
$stmt_today->bind_param("i", $admin_id);
$stmt_today->execute();
$result_today = $stmt_today->get_result();
while($row = $result_today->fetch_assoc()) { $today_reminders[] = $row; }
$stmt_today->close();

// --- Fetch Overdue Reminders (Filtered) ---
$overdue_reminders = [];
$sql_overdue = "SELECT l.client_name, ps.amount, ps.due_date, ps.payment_option, b.plot_name, u.username AS sales_agent_name
                FROM payment_schedules ps
                JOIN bookings b ON ps.booking_id = b.booking_id
                JOIN leads l ON b.lead_id = l.lead_id
                JOIN users u ON b.sales_agent_id = u.user_id
                WHERE ps.status = 'Overdue' AND l.admin_id = ?
                ORDER BY ps.due_date ASC, u.username";
$stmt_overdue = $conn->prepare($sql_overdue);
$stmt_overdue->bind_param("i", $admin_id);
$stmt_overdue->execute();
$result_overdue = $stmt_overdue->get_result();
while($row = $result_overdue->fetch_assoc()) { $overdue_reminders[] = $row; }
$stmt_overdue->close();
?>
<!-- (Styles are unchanged) -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
    body { font-family: 'Poppins', sans-serif; }
    .reminder-section { margin-bottom: 40px; }
    .reminder-section h2 { border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 1.5em; }
    .overdue h2 { color: #c62828; border-color: #ffebee; }
    .today h2 { color: #005f73; border-color: #e0f7fa; }
    .due-date { font-weight: bold; color: #c62828; }
</style>

<div class="section-header" style="margin-bottom: 25px;">
    <h3>Your Payment Reminders</h3>
    <p>This dashboard shows payments for your team's customers.</p>
</div>

<!-- Today's Payments Section -->
<div class="reminder-section today">
    <h2>Today's Payments</h2>
    <table class="responsive-table">
        <thead><tr><th>Customer</th><th>Sales Agent</th><th>Plot</th><th>Amount Due (₹)</th><th>Payment Method</th></tr></thead>
        <tbody>
            <?php if (!empty($today_reminders)): ?>
                <?php foreach ($today_reminders as $r): ?>
                <tr>
                    <td data-label="Customer"><?php echo htmlspecialchars($r['client_name']); ?></td>
                    <td data-label="Sales Agent"><strong><?php echo htmlspecialchars($r['sales_agent_name']); ?></strong></td>
                    <td data-label="Plot"><?php echo htmlspecialchars($r['plot_name']); ?></td>
                    <td data-label="Amount"><strong><?php echo number_format($r['amount'], 2); ?></strong></td>
                    <td data-label="Method"><?php echo htmlspecialchars($r['payment_option']); ?></td>
                </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr><td colspan="5">No payments due today for your team.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- Overdue Payments Section -->
<div class="reminder-section overdue">
    <h2>Overdue Payments (15+ Days)</h2>
    <table class="responsive-table">
        <thead><tr><th>Customer</th><th>Sales Agent</th><th>Plot</th><th>Amount Due (₹)</th><th>Was Due On</th></tr></thead>
        <tbody>
            <?php if (!empty($overdue_reminders)): ?>
                <?php foreach ($overdue_reminders as $r): ?>
                <tr>
                    <td data-label="Customer"><?php echo htmlspecialchars($r['client_name']); ?></td>
                    <td data-label="Sales Agent"><strong><?php echo htmlspecialchars($r['sales_agent_name']); ?></strong></td>
                    <td data-label="Plot"><?php echo htmlspecialchars($r['plot_name']); ?></td>
                    <td data-label="Amount"><strong><?php echo number_format($r['amount'], 2); ?></strong></td>
                    <td data-label="Due Date" class="due-date"><?php echo date("d M, Y", strtotime($r['due_date'])); ?></td>
                </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr><td colspan="5">No payments from your team are overdue by 15 days or more.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php require 'partials/footer.php'; ?>