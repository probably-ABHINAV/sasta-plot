<?php
require 'partials/header.php';
enforce_security(1);

$admin_id = $_SESSION['user_id'];
if (!isset($_GET['user_id']) || !filter_var($_GET['user_id'], FILTER_VALIDATE_INT)) {
    header("Location: manage_agents.php"); exit();
}
$agent_id = (int)$_GET['user_id'];

$stmt_agent = $conn->prepare("SELECT user_id, username, role_id FROM users WHERE user_id = ? AND owned_by_admin_id = ?");
$stmt_agent->bind_param("ii", $agent_id, $admin_id);
$stmt_agent->execute();
$agent = $stmt_agent->get_result()->fetch_assoc();
$stmt_agent->close();

if (!$agent || $agent['role_id'] != 2) { // Ensure the user is an Agent (role 2)
    echo "Agent not found or you do not have permission to view this report.";
    exit();
}
?>
<!-- (Styles are unchanged) -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
    body { font-family: 'Poppins', sans-serif; }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; background-color: #f8f9fa; color: #343a40 !important; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: 600; border: 1px solid #dee2e6; transition: background-color 0.2s, box-shadow 0.2s; margin-bottom: 25px; }
    .btn-back:hover { background-color: #e9ecef; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .btn-back svg { width: 16px; height: 16px; fill: #343a40; }
    .page-header { background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.07); }
    .page-header h2 { margin: 0; font-size: 1.8em; color: #003d47; }
    .page-header p { margin: 5px 0 0 0; color: #6c757d; font-size: 1.1em; }
    .section-title { font-size: 1.5em; color: #003d47; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
</style>

<a href="manage_agents.php" class="btn-back">&larr; Back to All Agents</a>

<div class="page-header">
    <h2>Performance Report: <?php echo htmlspecialchars($agent['username']); ?></h2>
    <p>A combined view of all pending tasks for this agent.</p>
</div>

<!-- Combined Report for the Unified Agent Role -->
<div class="section-title">Un-updated Leads</div>
<p>Leads assigned to this agent that have no follow-up notes yet.</p>
<table class="responsive-table">
    <thead>
        <tr><th>Client Name</th><th>Contact</th><th>Interested In</th><th>Campaign</th></tr>
    </thead>
    <tbody>
    <?php
    $sql_leads = "SELECT l.lead_id, l.client_name, l.client_phone, l.client_email, l.interested_in, c.campaign_name
                  FROM leads l
                  JOIN lead_assignments la ON l.lead_id = la.lead_id
                  LEFT JOIN lead_updates lu ON l.lead_id = lu.lead_id
                  LEFT JOIN campaigns c ON l.campaign_id = c.campaign_id
                  WHERE la.sales_agent_id = ? AND l.status = 'Active'
                  AND l.lead_id NOT IN (SELECT lead_id FROM bookings)
                  AND lu.update_id IS NULL ORDER BY l.lead_id ASC";
    $stmt_leads = $conn->prepare($sql_leads);
    $stmt_leads->bind_param("i", $agent_id);
    $stmt_leads->execute();
    $leads_result = $stmt_leads->get_result();
    if ($leads_result->num_rows > 0) {
        while ($lead = $leads_result->fetch_assoc()) {
            echo "<tr>";
            echo "<td data-label='Client'>" . htmlspecialchars($lead['client_name']) . "</td>";
            echo "<td data-label='Contact'>" . htmlspecialchars($lead['client_email']) . "<br>" . htmlspecialchars($lead['client_phone']) . "</td>";
            echo "<td data-label='Interest'>" . htmlspecialchars($lead['interested_in']) . "</td>";
            echo "<td data-label='Campaign'>" . htmlspecialchars($lead['campaign_name'] ?? 'N/A') . "</td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='4'>Excellent! This agent has no un-updated leads.</td></tr>";
    }
    $stmt_leads->close();
    ?>
    </tbody>
</table>

<div class="section-title" style="margin-top: 40px;">All Pending & Rescheduled Site Visits</div>
<p>All future site visits this agent needs to conduct.</p>
<table class="responsive-table">
    <thead>
        <tr><th>Client Name</th><th>Date of Visit</th><th>Scheduled By</th><th>Status</th></tr>
    </thead>
    <tbody>
    <?php
    $sql_all = "SELECT l.client_name, sv.visit_date_time, u.username as sales_agent_name, sv.status
                FROM site_visits sv
                JOIN leads l ON sv.lead_id = l.lead_id
                JOIN users u ON sv.sales_agent_id = u.user_id
                WHERE sv.site_visit_agent_id = ? AND sv.status IN ('Scheduled', 'Rescheduled')
                ORDER BY sv.visit_date_time ASC";
    $stmt_all = $conn->prepare($sql_all);
    $stmt_all->bind_param("i", $agent_id);
    $stmt_all->execute();
    $all_result = $stmt_all->get_result();
    if ($all_result->num_rows > 0) {
        while ($visit = $all_result->fetch_assoc()) {
            echo "<tr>";
            echo "<td data-label='Client'>" . htmlspecialchars($visit['client_name']) . "</td>";
            echo "<td data-label='Date'>" . date("d M, Y - h:i A", strtotime($visit['visit_date_time'])) . "</td>";
            echo "<td data-label='Scheduled By'>" . htmlspecialchars($visit['sales_agent_name']) . "</td>";
            echo "<td data-label='Status'><strong>" . htmlspecialchars($visit['status']) . "</strong></td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='4'>This agent has no pending visits.</td></tr>";
    }
    $stmt_all->close();
    ?>
    </tbody>
</table>

<?php require 'partials/footer.php'; ?>