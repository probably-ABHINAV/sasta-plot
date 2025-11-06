<?php
// STEP 1: Load core functions and run security checks FIRST.
require_once '../includes/functions.php';
enforce_security(2); // Sales Agent role

$sales_agent_id = $_SESSION['user_id'];

// STEP 2: Handle actions that might exit the script, like a file download.
// --- START: CSV DOWNLOAD LOGIC (MOVED TO THE TOP) ---
if (isset($_GET['action']) && $_GET['action'] == 'download_csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=completed_payments_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    
    fputcsv($output, ['Customer Name', 'Plot Name', 'Closed Price', 'Final Payment Date']);
    
    $sql_csv = "SELECT l.client_name, b.plot_name, b.price_closed,
                       (SELECT MAX(payment_date) FROM payment_schedules WHERE booking_id = b.booking_id AND status = 'Paid') as final_payment_date
                FROM bookings b
                JOIN leads l ON b.lead_id = l.lead_id
                WHERE b.sales_agent_id = ? AND b.status = 'Completed'
                ORDER BY final_payment_date DESC";
    
    $stmt_csv = $conn->prepare($sql_csv);
    $stmt_csv->bind_param("i", $sales_agent_id);
    $stmt_csv->execute();
    $result_csv = $stmt_csv->get_result();

    if ($result_csv->num_rows > 0) {
        while ($row = $result_csv->fetch_assoc()) {
            fputcsv($output, $row);
        }
    }
    
    $stmt_csv->close();
    fclose($output);
    exit(); // CRITICAL: Stop the script here. No HTML will be sent.
}
// --- END: CSV DOWNLOAD LOGIC ---


// STEP 3: If the script did not exit, we can now safely include the header and display the HTML page.
require 'partials/header.php'; 
?>

<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
    <div>
        <h2>Completed Payments</h2>
        <p style="margin:0; padding:0;">This page lists all customers who have completed their payment schedules.</p>
    </div>
    <a href="completed_payments.php?action=download_csv" style="background-color: #1a73e8; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">
        Download as CSV
    </a>
</div>

<table class="responsive-table">
    <thead>
        <tr>
            <th>Customer Name</th>
            <th>Plot Name</th>
            <th>Closed Price</th>
            <th>Final Payment Date</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        // This display logic is unchanged.
        $sql = "SELECT b.booking_id, l.client_name, b.plot_name, b.price_closed,
                       (SELECT MAX(payment_date) FROM payment_schedules WHERE booking_id = b.booking_id AND status = 'Paid') as final_payment_date
                FROM bookings b
                JOIN leads l ON b.lead_id = l.lead_id
                WHERE b.sales_agent_id = ? AND b.status = 'Completed'
                ORDER BY final_payment_date DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $sales_agent_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Customer Name'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Plot Name'>" . htmlspecialchars($row['plot_name']) . "</td>";
                echo "<td data-label='Closed Price'>₹" . number_format($row['price_closed'], 2) . "</td>";
                echo "<td data-label='Final Payment'>" . ($row['final_payment_date'] ? date("d M, Y", strtotime($row['final_payment_date'])) : 'N/A') . "</td>";
                echo "<td data-label='Action'><a href='manage_customer.php?booking_id=" . $row['booking_id'] . "' class='btn-action btn-view'>View History</a></td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='5'>You have no fully paid customers yet.</td></tr>";
        }
        $stmt->close();
        ?>
    </tbody>
</table>

<?php require 'partials/footer.php'; ?>