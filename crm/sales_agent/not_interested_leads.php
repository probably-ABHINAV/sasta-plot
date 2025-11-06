<?php 
require 'partials/header.php'; 
$sales_agent_id = $_SESSION['user_id'];

// --- START: PROCESSING FOR "MAKE ACTIVE" ACTION ---
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action'], $_POST['lead_id'])) {
    if ($_POST['action'] === 'make_active') {
        $lead_id = (int)$_POST['lead_id'];
        
        // Security Check: Ensure this agent is actually assigned to the lead before un-archiving
        $check_stmt = $conn->prepare("SELECT lead_id FROM lead_assignments WHERE lead_id = ? AND sales_agent_id = ?");
        $check_stmt->bind_param("ii", $lead_id, $sales_agent_id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows === 1) {
            // If ownership is confirmed, update the lead's status back to 'Active'
            $stmt = $conn->prepare("UPDATE leads SET status = 'Active' WHERE lead_id = ?");
            $stmt->bind_param("i", $lead_id);
            $stmt->execute();
            $stmt->close();
        }
        $check_stmt->close();
        
        // Redirect to refresh the page
        header("Location: not_interested_leads.php");
        exit();
    }
}
// --- END: PROCESSING ---
?>
<h2>Not Interested Leads (Archived)</h2>
<p>These are leads you marked as "Not Interested" that have been automatically archived.</p>
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
        $sql = "SELECT l.lead_id, l.client_name, l.client_phone,
                    (SELECT notes FROM lead_updates WHERE lead_id = l.lead_id ORDER BY update_timestamp DESC LIMIT 1) as last_note
                FROM leads l JOIN lead_assignments la ON l.lead_id = la.lead_id
                WHERE la.sales_agent_id = ? AND l.status = 'Not Interested'
                ORDER BY l.lead_id DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $sales_agent_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Client Name'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Client Phone'>" . htmlspecialchars($row['client_phone']) . "</td>";
                echo "<td data-label='Last Note'>" . htmlspecialchars($row['last_note']) . "</td>";
                
                // --- NEW "MAKE ACTIVE" BUTTON ---
                echo "<td data-label='Action'>
                        <form action='not_interested_leads.php' method='post' style='margin:0;'>
                            <input type='hidden' name='action' value='make_active'>
                            <input type='hidden' name='lead_id' value='".$row['lead_id']."'>
                            <button type='submit' style='background-color:#2a9d8f; border:none; color:white; padding:5px 10px; border-radius:4px; cursor:pointer;'>Make Active</button>
                          </form>
                      </td>";
                echo "</tr>";
            }
        } else { echo "<tr><td colspan='4'>You have no leads in the 'Not Interested' archive.</td></tr>"; }
        $stmt->close();
        ?>
    </tbody>
</table>
<?php require 'partials/footer.php'; ?>