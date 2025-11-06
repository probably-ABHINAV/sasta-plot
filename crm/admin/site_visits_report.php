<?php
require 'partials/header.php';
enforce_security(1); // Admin Only

$admin_id = $_SESSION['user_id'];
?>
<!-- (Styles are unchanged) -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
    body { font-family: 'Poppins', sans-serif; }
    .page-header h2 { font-size: 1.8em; color: #003d47; }
    .page-header p { margin-top: 5px; color: #6c757d; }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; background-color: #f8f9fa; color: #343a40 !important; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: 600; border: 1px solid #dee2e6; transition: background-color 0.2s, box-shadow 0.2s; margin-bottom: 25px; }
    .btn-back:hover { background-color: #e9ecef; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .btn-back svg { width: 16px; height: 16px; fill: #343a40; }
</style>

<a href="index.php" class="btn-back">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
    <span>Back to Dashboard</span>
</a>

<div class="page-header">
    <h2>Today's Scheduled Site Visits (Your Team)</h2>
    <p>This report shows visits for today (<?php echo date("F j, Y"); ?>) scheduled by your agents.</p>
</div>

<table class="responsive-table">
    <thead><tr><th>Client Name</th><th>Visit Time</th><th>Sales Agent (Scheduler)</th><th>Site Visit Agent (Assigned)</th><th>Status</th></tr></thead>
    <tbody>
        <?php
        // ***** MODIFICATION: ADDED "WHERE l.admin_id = ?" TO THE QUERY *****
        $sql = "SELECT l.client_name, sv.visit_date_time, sv.status,
                       u_sales.username as sales_agent_name, u_site.username as site_visit_agent_name
                FROM site_visits sv
                JOIN leads l ON sv.lead_id = l.lead_id
                JOIN users u_sales ON sv.sales_agent_id = u_sales.user_id
                JOIN users u_site ON sv.site_visit_agent_id = u_site.user_id
                WHERE DATE(sv.visit_date_time) = CURDATE() 
                AND sv.status IN ('Scheduled', 'Rescheduled')
                AND l.admin_id = ?
                ORDER BY sv.visit_date_time ASC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $admin_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Client'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Time'><strong>" . date("h:i A", strtotime($row['visit_date_time'])) . "</strong></td>";
                echo "<td data-label='Sales Agent'>" . htmlspecialchars($row['sales_agent_name']) . "</td>";
                echo "<td data-label='Site Visit Agent'>" . htmlspecialchars($row['site_visit_agent_name']) . "</td>";
                echo "<td data-label='Status'>" . htmlspecialchars($row['status']) . "</td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='5'>No pending site visits scheduled for your team today.</td></tr>";
        }
        $stmt->close();
        ?>
    </tbody>
</table>

<?php require 'partials/footer.php'; ?>