<?php 
require 'partials/header.php'; 
enforce_security(2);
$sales_agent_id = $_SESSION['user_id'];
?>

<h2>General Leads</h2>
<p>This is your list of active leads awaiting a site visit. Click "Update" to add notes or schedule a visit.</p>
<table class="responsive-table">
    <thead>
        <tr>
            <th>Client Name</th>
            <th>Last Update Note</th>
            <th>Interest Level</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $sql = "SELECT 
                    l.lead_id, l.client_name, l.has_unread_update,
                    (SELECT notes FROM lead_updates WHERE lead_id = l.lead_id ORDER BY update_timestamp DESC LIMIT 1) as last_note,
                    (SELECT interest_level FROM lead_updates WHERE lead_id = l.lead_id ORDER BY update_timestamp DESC LIMIT 1) as interest
                FROM leads l 
                JOIN lead_assignments la ON l.lead_id = la.lead_id
                WHERE la.sales_agent_id = ? 
                AND l.status = 'Active'
                AND l.lead_id NOT IN (SELECT lead_id FROM hidden_by_agent WHERE user_id = ?)
                AND l.lead_id NOT IN (SELECT lead_id FROM bookings)
                AND l.lead_id NOT IN (SELECT lead_id FROM site_visits WHERE status = 'Completed')
                ORDER BY l.has_unread_update DESC, l.lead_id DESC";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $sales_agent_id, $sales_agent_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Client Name'>";
                echo htmlspecialchars($row['client_name']);
                if ($row['has_unread_update']) {
                    echo ' <span style="background-color: #e63946; color: white; font-size: 0.7em; padding: 2px 6px; border-radius: 10px; font-weight: bold;">NEW</span>';
                }
                echo "</td>";
                echo "<td data-label='Last Note'>" . htmlspecialchars($row['last_note']) . "</td>";
                echo "<td data-label='Interest'>" . htmlspecialchars($row['interest']) . "</td>";
                echo "<td data-label='Action'><a href='update_lead.php?lead_id=" . $row['lead_id'] . "' class='btn-action btn-manage'>Update</a></td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='4'>You have no general leads.</td></tr>";
        }
        $stmt->close();
        ?>
    </tbody>
</table>
<?php require 'partials/footer.php'; ?>