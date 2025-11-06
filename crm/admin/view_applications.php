<?php
// This PHP block handles the CSV download request.
// It must be at the very top of the file, before any HTML.
if (isset($_GET['download_csv'])) {

require 'partials/db.php'; // Connect to the database

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="drrealtor_applications_' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');

// Add the header row to the CSV file
fputcsv($output, ['ID', 'Full Name', 'Email', 'Phone', 'City', 'Applying for Role', 'Portfolio Link', 'Application Date']);

// Fetch all applications from the database
$result = $conn->query("SELECT id, full_name, email, phone, city, role, portfolio_link, application_date FROM applications ORDER BY id DESC");

if ($result->num_rows > 0) {
while ($row = $result->fetch_assoc()) {
fputcsv($output, $row); // Add each row to the CSV file
}
}

fclose($output);
exit(); // Stop the script from rendering the rest of the page
}

// Continue with the normal page load if not downloading CSV
require 'partials/header.php';

// Fetch all applications to display in the HTML table
$applications_result = $conn->query("SELECT * FROM applications ORDER BY application_date DESC");
?>
<!-- Professional CSS for the Applications Page -->
<style>
.page-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 30px;
}
.page-header h2 {
font-size: 1.8em;
font-weight: 600;
color: #003d47;
margin: 0;
}
.btn-download-csv {
background-color: #0a9396;
color: white;
padding: 10px 20px;
border-radius: 5px;
text-decoration: none;
font-weight: 500;
transition: background-color 0.2s;
}
.btn-download-csv:hover {
background-color: #005f73;
color: white;
}
.table-container {
background-color: #ffffff;
padding: 25px;
border-radius: 8px;
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
}
.table th {
font-weight: 600;
color: #003d47;
}
.table td {
vertical-align: middle;
}
.btn-resume {
padding: 5px 12px;
font-size: 0.9em;
}
</style>
<div class="page-header">
<h2>Job Applications</h2>
<a href="view_applications.php?download_csv=true" class="btn-download-csv">
<i class="fas fa-file-csv"></i> Download as CSV
</a>
</div>
<div class="table-container">
<div class="table-responsive">
<table class="table table-striped table-hover">
<thead>
<tr>
<th>ID</th>
<th>Full Name</th>
<th>Contact Info</th>
<th>City</th>
<th>Applying for Role</th>
<th>Portfolio</th>
<th>Application Date</th>
<th>Resume</th>
</tr>
</thead>
<tbody>
<?php if ($applications_result->num_rows > 0): ?>
<?php while ($row = $applications_result->fetch_assoc()): ?>
<tr>
<td><?php echo htmlspecialchars($row['id']); ?></td>
<td><?php echo htmlspecialchars($row['full_name']); ?></td>
<td>
<?php echo htmlspecialchars($row['email']); ?><br>
<?php echo htmlspecialchars($row['phone']); ?>
</td>
<td><?php echo htmlspecialchars($row['city']); ?></td>
<td><?php echo htmlspecialchars($row['role']); ?></td>
<td>
<a href="<?php echo htmlspecialchars($row['portfolio_link']); ?>" target="_blank" rel="noopener noreferrer">View Portfolio</a>
</td>
<td><?php echo date('d M Y, h:i A', strtotime($row['application_date'])); ?></td>
<td>
<a href="<?php echo htmlspecialchars($row['resume_path']); ?>" class="btn btn-sm btn-outline-primary btn-resume" download>
<i class="fas fa-download"></i> Download
</a>
</td>
</tr>
<?php endwhile; ?>
<?php else: ?>
<tr>
<td colspan="8" class="text-center">No applications found.</td>
</tr>
<?php endif; ?>
</tbody>
</table>
</div>
</div>
<?php require 'partials/footer.php'; ?>