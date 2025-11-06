 <a href="confirmations.php" class="<?php echo ($current_page == 'confirmations.php') ? 'active-nav' : ''; ?>">
                <?php if ($unread_confirmations_count > 0): ?>
                    <!-- If there are unread notifications, show the BELL ICON -->
                    <svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 125.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-74.8-55-134-128-148.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 430 112 383.3 112 335.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"/></svg>
                <?php endif; ?>
                <span>Confirmations</span>
            </a>





<?php 
require_once '../includes/functions.php';
enforce_security(1);

// --- Handle CSV Download ---
if (isset($_GET['action']) && $_GET['action'] == 'download_csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=confirmations_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Client Name', 'Visit Date', 'Sales Agent', 'Confirmation Summary']);
    $sql = "SELECT l.client_name, sv.visit_date_time, u.username as sales_agent_name, sv.confirmation_summary FROM site_visits sv JOIN leads l ON sv.lead_id = l.lead_id JOIN users u ON sv.sales_agent_id = u.user_id WHERE sv.confirmation_summary IS NOT NULL ORDER BY sv.visit_date_time DESC";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) { while ($row = $result->fetch_assoc()) { fputcsv($output, $row); } }
    fclose($output);
    exit();
}

// Mark notifications as read
$conn->query("UPDATE site_visits SET is_viewed_by_admin = TRUE WHERE is_viewed_by_admin = FALSE");

require 'partials/header.php'; 
?>
<style>.visit-proof-thumb { max-width: 100px; border-radius: 5px; margin-top: 10px; display: block; }</style>
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <div>
        <h2>Site Visit Confirmations</h2>
        <p>This page shows all confirmation summaries sent by Sales Agents.</p>
    </div>
    <a href="confirmations.php?action=download_csv" style="display: inline-block; padding: 10px 15px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Download as CSV</a>
</div>
<table class="responsive-table">
    <thead>
        <tr><th>Client Name</th><th>Visit Details</th><th>Sales Agent</th><th>Confirmation Summary & Proof</th></tr>
    </thead>
    <tbody>
        <?php
        $sql_confirmations = "SELECT sv.visit_date_time, sv.confirmation_summary, sv.image_filename, l.client_name, u.username as sales_agent_name, sv.is_viewed_by_admin FROM site_visits sv JOIN leads l ON sv.lead_id = l.lead_id JOIN users u ON sv.sales_agent_id = u.user_id WHERE sv.confirmation_summary IS NOT NULL ORDER BY sv.is_viewed_by_admin ASC, sv.visit_date_time DESC";
        $confirmations_result = $conn->query($sql_confirmations);
        if ($confirmations_result->num_rows > 0) {
            while ($row = $confirmations_result->fetch_assoc()) {
                $row_style = !$row['is_viewed_by_admin'] ? 'style="background-color: #e8f5e9;"' : '';
                echo "<tr ".$row_style.">";
                echo "<td data-label='Client Name'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Visit Date'>" . date("d M, Y - h:i A", strtotime($row['visit_date_time'])) . "</td>";
                echo "<td data-label='Sales Agent'>" . htmlspecialchars($row['sales_agent_name']) . "</td>";
                echo "<td data-label='Summary & Proof'>";
                echo nl2br(htmlspecialchars($row['confirmation_summary']));
                if ($row['image_filename']) {
                    echo "<a href='../uploads/" . htmlspecialchars($row['image_filename']) . "' target='_blank'><img src='../uploads/" . htmlspecialchars($row['image_filename']) . "' class='visit-proof-thumb' alt='Site Visit Proof'></a>";
                }
                echo "</td></tr>";
            }
        } else { echo "<tr><td colspan='4'>No site visit confirmations have been sent yet.</td></tr>"; }
        ?>
    </tbody>
</table>
<?php require 'partials/footer.php'; ?>