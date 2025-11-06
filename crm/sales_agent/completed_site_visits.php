<?php 
require 'partials/header.php'; 
enforce_security(2);

$agent_id = $_SESSION['user_id'];
$conn->query("UPDATE leads l JOIN site_visits sv ON l.lead_id = sv.lead_id 
              SET l.has_unread_update = FALSE 
              WHERE sv.sales_agent_id = $agent_id AND sv.status = 'Completed'");
?>

<?php if (isset($_GET['status']) && $_GET['status'] === 'just_completed'): ?>
    <p class="status-message" style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 20px;">Visit marked as completed! You can now follow up with the client to convert them.</p>
<?php endif; ?>

<h2>Site Visit Done Leads</h2>
<p>These visits have been completed. Click "Update" to see the visit history and convert them to a customer.</p>

<table class="responsive-table">
    <thead>
        <tr>
            <th>Client Name</th>
            <th>Visit Details</th>
            <th>Proof of Visit</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $sql = "SELECT sv.visit_id, sv.visit_date_time, sv.image_filename,
                       l.lead_id, l.client_name, 
                       u_sv.username AS site_visit_agent_name
                FROM site_visits sv
                JOIN leads l ON sv.lead_id = l.lead_id
                JOIN users u_sv ON sv.site_visit_agent_id = u_sv.user_id
                WHERE sv.sales_agent_id = ? 
                AND sv.status = 'Completed'
                AND l.lead_id NOT IN (SELECT lead_id FROM bookings)
                ORDER BY sv.visit_date_time DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $agent_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Client Name'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Visit Details'>" . date("d M, Y - h:i A", strtotime($row['visit_date_time'])) . "<br><small>Visited by: " . htmlspecialchars($row['site_visit_agent_name']) . "</small></td>";
                echo "<td data-label='Proof of Visit'>";
                if (!empty($row['image_filename'])) {
                    echo "<a href='../uploads/" . htmlspecialchars($row['image_filename']) . "' target='_blank'>";
                    echo "<img src='../uploads/" . htmlspecialchars($row['image_filename']) . "' alt='Visit Proof' style='max-width: 100px; border-radius: 4px; display: block;'>";
                    echo "</a>";
                } else {
                    echo "No image uploaded.";
                }
                echo "</td>";
               
                // --- THIS IS THE KEY BUTTON CHANGE ---
                echo "<td data-label='Action'>
                        <a href='update_lead.php?lead_id=" . $row['lead_id'] . "' class='btn-action btn-manage'>
                            Update
                        </a>
                      </td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='4'>No completed site visits are awaiting follow-up.</td></tr>";
        }
        $stmt->close();
        ?>
    </tbody>
</table>

<?php require 'partials/footer.php'; ?>