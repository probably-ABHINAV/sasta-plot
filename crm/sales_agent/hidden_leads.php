<?php
// STEP 1: All PHP logic MUST be at the top.
require_once '../includes/functions.php';
enforce_security(2);

$sales_agent_id = $_SESSION['user_id'];

// --- Handle CSV Download (unchanged) ---
if (isset($_GET['action']) && $_GET['action'] == 'download_csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=hidden_leads_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Client Name', 'Client Email', 'Client Phone', 'Location', 'Interested In', 'Last Note']);
    $sql = "SELECT l.client_name, l.client_email, l.client_phone, l.location, l.interested_in,
                (SELECT notes FROM lead_updates WHERE lead_id = l.lead_id ORDER BY update_timestamp DESC LIMIT 1) as last_note
            FROM leads l JOIN hidden_by_agent h ON l.lead_id = h.lead_id
            WHERE h.user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $sales_agent_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) { fputcsv($output, $row); }
    }
    fclose($output);
    exit();
}

// --- START OF THE FIX: Correct UNHIDE Logic ---
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action']) && $_POST['action'] == 'unhide_lead') {
    $lead_id = (int)$_POST['lead_id'];
    
    // The correct action is to DELETE the record from the 'hidden_by_agent' table for this user.
    $stmt = $conn->prepare("DELETE FROM hidden_by_agent WHERE lead_id = ? AND user_id = ?");
    $stmt->bind_param("ii", $lead_id, $sales_agent_id);
    $stmt->execute();
    $stmt->close();
    
    header("Location: hidden_leads.php");
    exit();
}
// --- END OF THE FIX ---

// STEP 2: NOW that processing is done, we can safely include the header.
require 'partials/header.php'; 
?>
<style>
    /* Responsive styles for the header are unchanged */
    .page-header { display: flex; flex-direction: column; margin-bottom: 20px; gap: 15px; }
    .download-btn { display: block; width: 100%; padding: 10px 15px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center; box-sizing: border-box; }
    @media (min-width: 768px) {
        .page-header { flex-direction: row; justify-content: space-between; align-items: center; }
        .download-btn { width: auto; }
    }
</style>
<div class="page-header">
    <div>
        <h2>My Hidden Leads</h2>
        <p>These are leads you have previously hidden for archiving.</p>
    </div>
    <div>
        <a href="hidden_leads.php?action=download_csv" class="download-btn">Download as CSV</a>
    </div>
</div>

<table class="responsive-table">
    <thead>
        <tr>
            <th>Client Name</th>
            <th>Client Phone</th>
            <th>Last Update Note</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        // This query correctly finds leads that THIS agent has hidden.
        $sql_display = "SELECT l.lead_id, l.client_name, l.client_phone,
                            (SELECT notes FROM lead_updates WHERE lead_id = l.lead_id ORDER BY update_timestamp DESC LIMIT 1) as last_note
                        FROM leads l
                        JOIN hidden_by_agent h ON l.lead_id = h.lead_id
                        WHERE h.user_id = ? AND l.status = 'Active'";
        
        $stmt_display = $conn->prepare($sql_display);
        $stmt_display->bind_param("i", $sales_agent_id);
        $stmt_display->execute();
        $result_display = $stmt_display->get_result();
        if ($result_display->num_rows > 0) {
            while($row = $result_display->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Client Name'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Client Phone'>" . htmlspecialchars($row['client_phone']) . "</td>";
                echo "<td data-label='Last Note'>" . htmlspecialchars($row['last_note']) . "</td>";
                echo "<td data-label='Action'>
                        <form action='hidden_leads.php' method='post' style='margin:0;'>
                            <input type='hidden' name='action' value='unhide_lead'>
                            <input type='hidden' name='lead_id' value='".$row['lead_id']."'>
                            <button type='submit' style='background-color:#2a9d8f; border:none; color:white; padding:5px 10px; border-radius:4px; cursor:pointer;'>Make Active</button>
                          </form>
                      </td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='4'>You have no hidden leads.</td></tr>";
        }
        $stmt_display->close();
        ?>
    </tbody>
</table>
<?php require 'partials/footer.php'; ?>