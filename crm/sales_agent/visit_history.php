<?php
// STEP 1: All processing logic MUST be at the very top.
// First, we need the core functions and database connection.
require_once '../includes/functions.php';
enforce_security([2, 3]); // Allow Sales Agents & Site Visit Agents

$site_visit_agent_id = $_SESSION['user_id'];
$message = '';

// --- START: CSV DOWNLOAD LOGIC (RUNS FIRST) ---
if (isset($_GET['action']) && $_GET['action'] == 'download_csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=completed_visits_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    
    fputcsv($output, ['Visit ID', 'Client Name', 'Visit Date', 'Final Status', 'Sales Agent']);
    
    $sql_csv = "SELECT sv.visit_id, l.client_name, sv.visit_date_time, sv.status, u.username AS sales_agent_name
                FROM site_visits sv
                JOIN leads l ON sv.lead_id = l.lead_id
                JOIN users u ON sv.sales_agent_id = u.user_id
                WHERE sv.site_visit_agent_id = ? AND sv.status IN ('Completed', 'Canceled')
                ORDER BY sv.visit_date_time DESC";
    
    $stmt_csv = $conn->prepare($sql_csv);
    $stmt_csv->bind_param("i", $site_visit_agent_id);
    $stmt_csv->execute();
    $result_csv = $stmt_csv->get_result();

    if ($result_csv->num_rows > 0) {
        while ($row = $result_csv->fetch_assoc()) {
            fputcsv($output, $row);
        }
    }
    
    $stmt_csv->close();
    fclose($output);
    exit(); // CRITICAL: Stop the script here so no HTML is ever sent.
}
// --- END: CSV DOWNLOAD LOGIC ---


// --- DELETE ACTION LOGIC (Only runs if not downloading) ---
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {
    if ($_POST['action'] == 'delete_visit' && isset($_POST['visit_id'])) {
        $visit_id_to_delete = (int)$_POST['visit_id'];
        
        $check_stmt = $conn->prepare("SELECT visit_id FROM site_visits WHERE visit_id = ? AND site_visit_agent_id = ?");
        $check_stmt->bind_param("ii", $visit_id_to_delete, $site_visit_agent_id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows === 1) {
            $delete_stmt = $conn->prepare("DELETE FROM site_visits WHERE visit_id = ?");
            $delete_stmt->bind_param("i", $visit_id_to_delete);
            if ($delete_stmt->execute()) {
                $message = "<p style='color:green; text-align:center;'>Visit record deleted successfully.</p>";
            } else {
                $message = "<p style='color:red; text-align:center;'>Error: Could not delete the visit record.</p>";
            }
            $delete_stmt->close();
        }
        $check_stmt->close();
    }
}

// STEP 2: Now that all processing is done, we can safely include the header for displaying the page.
require 'partials/header.php'; 
?>

<?php if (!empty($message)) echo $message; ?>

<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
    <div>
        <h2>Completed & Canceled Visits Archive</h2>
        <p style="margin:0; padding:0;">This page shows all your finished or canceled visits.</p>
    </div>
    <a href="completed_visits.php?action=download_csv" style="background-color: #1a73e8; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">
        Download as CSV
    </a>
</div>

<table class="responsive-table">
    <thead>
        <tr>
            <th>Client Name</th>
            <th>Visit Details</th>
            <th>Final Status & Proof</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $sql_display = "SELECT sv.visit_id, sv.visit_date_time, sv.image_filename, sv.status,
                       l.client_name, 
                       u.username AS sales_agent_name
                FROM site_visits sv
                JOIN leads l ON sv.lead_id = l.lead_id
                JOIN users u ON sv.sales_agent_id = u.user_id
                WHERE sv.site_visit_agent_id = ? 
                AND sv.status IN ('Completed', 'Canceled') 
                ORDER BY sv.visit_date_time DESC";
        
        $stmt_display = $conn->prepare($sql_display);
        $stmt_display->bind_param("i", $site_visit_agent_id);
        $stmt_display->execute();
        $result = $stmt_display->get_result();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $status_color = ($row['status'] == 'Completed') ? 'green' : 'red';
                echo "<tr>";
                echo "<td data-label='Client Name'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Visit Details'>" . date("d M, Y - h:i A", strtotime($row['visit_date_time'])) . "<br><small>Sales Agent: " . htmlspecialchars($row['sales_agent_name']) . "</small></td>";
                echo "<td data-label='Final Status & Proof'>";
                echo "<strong style='color:$status_color;'>" . htmlspecialchars($row['status']) . "</strong>";
                if (!empty($row['image_filename'])) {
                    echo "<a href='../uploads/" . htmlspecialchars($row['image_filename']) . "' target='_blank'>";
                    echo "<img src='../uploads/" . htmlspecialchars($row['image_filename']) . "' alt='Visit Proof' style='max-width: 80px; border-radius: 4px; display: block; margin-top: 5px;'>";
                    echo "</a>";
                }
                echo "</td>";
                echo "<td data-label='Action'>
                        <form action='completed_visits.php' method='post' onsubmit='return confirm(\"Are you sure you want to permanently delete this record?\");'>
                            <input type='hidden' name='action' value='delete_visit'>
                            <input type='hidden' name='visit_id' value='".$row['visit_id']."'>
                            <button type='submit' style='background-color:#c62828; border:none; color:white; padding:5px 10px; border-radius:4px; cursor:pointer; width:100%;'>Delete</button>
                          </form>
                      </td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='4'>You have no completed or canceled visits in your archive.</td></tr>";
        }
        $stmt_display->close();
        ?>
    </tbody>
</table>

<?php require 'partials/footer.php'; ?>