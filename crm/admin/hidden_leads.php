<?php
require_once '../includes/functions.php';
enforce_security(1);

$admin_id = $_SESSION['user_id'];

// (CSV Download logic should also be updated if you use it)
if (isset($_GET['action']) && $_GET['action'] == 'download_csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=hidden_leads_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Lead ID', 'Client Name', 'Email', 'Phone', 'Assigned Agent']);
    $sql_csv = "SELECT l.lead_id, l.client_name, l.client_email, l.client_phone, u.username as agent_name 
                FROM leads l 
                LEFT JOIN lead_assignments la ON l.lead_id = la.lead_id 
                LEFT JOIN users u ON la.sales_agent_id = u.user_id 
                WHERE l.status = 'Hidden' AND l.admin_id = ?";
    $stmt_csv = $conn->prepare($sql_csv);
    $stmt_csv->bind_param("i", $admin_id);
    $stmt_csv->execute();
    $result_csv = $stmt_csv->get_result();
    if ($result_csv->num_rows > 0) { while ($row = $result_csv->fetch_assoc()) { fputcsv($output, $row); } }
    $stmt_csv->close();
    fclose($output);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action'], $_POST['lead_id'])) {
    if ($_POST['action'] === 'unhide_lead') {
        $lead_id = (int)$_POST['lead_id'];
        
        $stmt_check = $conn->prepare("SELECT lead_id FROM leads WHERE lead_id = ? AND admin_id = ?");
        $stmt_check->bind_param("ii", $lead_id, $admin_id);
        $stmt_check->execute();
        if($stmt_check->get_result()->num_rows === 1) {
            $stmt = $conn->prepare("UPDATE leads SET status = 'Active' WHERE lead_id = ?");
            $stmt->bind_param("i", $lead_id);
            $stmt->execute();
            $stmt->close();
        }
        $stmt_check->close();
        header("Location: hidden_leads.php");
        exit();
    }
}
require 'partials/header.php'; 
?>
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <div>
        <h2>Your Hidden Leads</h2>
        <p>This page shows all leads from your account that are currently hidden.</p>
    </div>
    <a href="hidden_leads.php?action=download_csv" style="display: inline-block; padding: 10px 15px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Download as CSV</a>
</div>
<table class="responsive-table">
    <thead>
        <tr><th>Client Name</th><th>Contact</th><th>Assigned To</th><th>Action</th></tr>
    </thead>
    <tbody>
        <?php
        $sql = "SELECT l.lead_id, l.client_name, l.client_email, l.client_phone, u.username as agent_name 
                FROM leads l 
                LEFT JOIN lead_assignments la ON l.lead_id = la.lead_id 
                LEFT JOIN users u ON la.sales_agent_id = u.user_id 
                WHERE l.status = 'Hidden' AND l.admin_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $admin_id);
        $stmt->execute();
        $leads_result = $stmt->get_result();
        
        if ($leads_result->num_rows > 0) {
            while($lead = $leads_result->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Client'>" . htmlspecialchars($lead['client_name']) . "</td>";
                echo "<td data-label='Contact'>" . htmlspecialchars($lead['client_email']) . "<br>" . htmlspecialchars($lead['client_phone']) . "</td>";
                echo "<td data-label='Assigned To'>" . htmlspecialchars($lead['agent_name'] ?? 'N/A') . "</td>";
                echo "<td data-label='Action'><form action='hidden_leads.php' method='post' style='margin:0;'><input type='hidden' name='action' value='unhide_lead'><input type='hidden' name='lead_id' value='".$lead['lead_id']."'><button type='submit' style='background-color:#2a9d8f; border:none; color:white; padding:5px 10px; border-radius:4px; cursor:pointer;'>Make Active</button></form></td>";
                echo "</tr>";
            }
        } else { echo "<tr><td colspan='4'>No hidden leads found for your account.</td></tr>"; }
        $stmt->close();
        ?>
    </tbody>
</table>
<?php require 'partials/footer.php'; ?>