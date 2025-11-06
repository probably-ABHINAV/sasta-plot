<?php 
require 'partials/header.php'; 

?>

<?php if(isset($_GET['status']) && $_GET['status'] === 'payment_completed') echo "<p class='status-message'>Final payment recorded! The customer has been moved to the 'Completed Payments' archive.</p>"; ?>
<h2>Active Customers</h2>
<p>This page lists all leads that have been converted into customers after a successful site visit.</p>

<table class="responsive-table">
    <thead>
        <tr>
            <th>Customer Name</th>
            <th>Plot Name</th>
            <th>Closed Price</th>
            <th>Booking Date</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $sales_agent_id = $_SESSION['user_id'];
        $sql = "SELECT b.booking_id, l.client_name, b.plot_name, b.price_closed, b.booking_date
                FROM bookings b
                JOIN leads l ON b.lead_id = l.lead_id
                WHERE b.sales_agent_id = ? AND b.status = 'Active'

                ORDER BY b.booking_date DESC";
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
                echo "<td data-label='Booking Date'>" . date("d M, Y", strtotime($row['booking_date'])) . "</td>";
                echo "<td data-label='Action'><a href='manage_customer.php?booking_id=" . $row['booking_id'] . "' class='btn-action btn-manage'>Manage Payments</a></td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='5'>You have not converted any leads into customers yet.</td></tr>";
        }
        $stmt->close();
        ?>
    </tbody>
</table>

<?php require 'partials/footer.php'; ?>