<?php
require 'partials/header.php';
enforce_security(1); // Admin Only

$message = '';
$admin_id = $_SESSION['user_id']; // Get current admin's ID

// Security: Get and validate the campaign_id from the URL
if (!isset($_GET['campaign_id']) || !filter_var($_GET['campaign_id'], FILTER_VALIDATE_INT)) {
    header("Location: manage_leads.php"); exit();
}
$campaign_id = (int)$_GET['campaign_id'];

// --- ACTION PROCESSING (LEADS & ASSIGNMENTS) ---
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {
    
    // 🟩 ACTION: Add a single lead to this campaign
    if ($_POST['action'] == 'add_lead_to_campaign') {
        $client_name = sanitize_input($_POST['client_name']);
        $client_email = sanitize_input($_POST['client_email']);
        $client_phone = sanitize_input($_POST['client_phone']);
        $location = sanitize_input($_POST['location']);
        $interested_in = sanitize_input($_POST['interested_project']);
        $client_message = sanitize_input($_POST['client_message']);

        // **MODIFICATION: Add admin_id to the INSERT query**
        $stmt = $conn->prepare("INSERT INTO leads (client_name, client_email, client_phone, location, interested_in, campaign_id, client_message, admin_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssisi", $client_name, $client_email, $client_phone, $location, $interested_in, $campaign_id, $client_message, $admin_id);
        if ($stmt->execute()) { $message = "<p class='status-message success'>New lead added successfully!</p>"; } 
        else { $message = "<p class='status-message error'>Error: Could not add the new lead.</p>"; }
        $stmt->close();
    }

    // 🟩 ACTION: Upload a CSV of leads to this campaign
    elseif ($_POST['action'] == 'upload_leads_to_campaign' && isset($_FILES['csv_file'])) {
        if ($_FILES['csv_file']['error'] === UPLOAD_ERR_OK) {
            $leads_added = 0; $leads_skipped = 0;
            if (($handle = fopen($_FILES['csv_file']['tmp_name'], "r")) !== FALSE) {
                fgetcsv($handle);
                $conn->begin_transaction();
                try {
                    // **MODIFICATION: Add admin_id to the INSERT query**
                    $stmt = $conn->prepare("INSERT INTO leads (client_name, client_email, client_phone, location, interested_in, campaign_id, client_message, admin_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                        if (count($data) >= 6) {
                            $stmt->bind_param("sssssisi", $data[0], $data[1], $data[2], $data[3], $data[4], $campaign_id, $data[5], $admin_id);
                            $stmt->execute();
                            $leads_added++;
                        } else { $leads_skipped++; }
                    }
                    $conn->commit();
                    $message = "<p class='status-message success'>CSV processed! Added: $leads_added leads. Skipped: $leads_skipped rows.</p>";
                } catch (mysqli_sql_exception $e) {
                    $conn->rollback();
                    $message = "<p class='status-message error'>Database error during CSV import.</p>";
                }
                $stmt->close(); fclose($handle);
            }
        }
    }
    
    // 🟨 ACTION: Assign or Re-assign a lead
    elseif ($_POST['action'] == 'assign_campaign_lead' && isset($_POST['lead_id'], $_POST['sales_agent_id'])) {
        $lead_id = (int)$_POST['lead_id'];
        $new_agent_id = (int)$_POST['sales_agent_id'];
        $check_stmt = $conn->prepare("SELECT assignment_id FROM lead_assignments WHERE lead_id = ?");
        $check_stmt->bind_param("i", $lead_id);
        $check_stmt->execute();
        if ($check_stmt->get_result()->num_rows > 0) {
            $stmt = $conn->prepare("UPDATE lead_assignments SET sales_agent_id = ? WHERE lead_id = ?");
        } else {
            $stmt = $conn->prepare("INSERT INTO lead_assignments (sales_agent_id, lead_id) VALUES (?, ?)");
        }
        $check_stmt->close();
        $stmt->bind_param("ii", $new_agent_id, $lead_id);
        if ($stmt->execute()) { $message = "<p class='status-message success'>Lead assigned successfully.</p>"; }
        $stmt->close();
    }
}

// Fetch Campaign details, ensuring the admin owns this campaign
$stmt_campaign = $conn->prepare("SELECT * FROM campaigns WHERE campaign_id = ? AND admin_id = ?");
$stmt_campaign->bind_param("ii", $campaign_id, $admin_id);
$stmt_campaign->execute();
$campaign = $stmt_campaign->get_result()->fetch_assoc();
$stmt_campaign->close();

if (!$campaign) {
    echo "Campaign not found or you do not have permission to view it.";
    exit();
}
?>
<!-- Styles for Campaign Details Page -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
    body { font-family: 'Poppins', sans-serif; }
    .status-message { padding: 12px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
    .status-message.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .status-message.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .page-header { background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.07); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;}
    .page-header-title h2 { margin: 0; font-size: 1.8em; color: #003d47; }
    .page-header-details { text-align: right; }
    .campaign-details-header span { margin-left: 20px; font-size: 1.1em; color: #333; }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; background-color: #f8f9fa; color: #343a40 !important; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: 600; border: 1px solid #dee2e6; transition: background-color 0.2s, box-shadow 0.2s; margin-bottom: 25px; }
    .btn-back:hover { background-color: #e9ecef; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .btn-back svg { width: 16px; height: 16px; fill: #343a40; }
    .lead-forms-container { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .form-card { background-color: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .form-card h3 { margin-top: 0; font-size: 1.4em; color: #003d47; }
    .lead-table { width: 100%; border-collapse: collapse; }
    .lead-table th, .lead-table td { padding: 14px; border: 1px solid #eee; text-align: left; }
    .lead-table th { background-color: #f8f9fa; font-weight: 600; }
    .lead-table tr:nth-child(even) { background-color: #fcfcfc; }
    @media (max-width: 900px) { .lead-forms-container { grid-template-columns: 1fr; } .page-header { flex-direction: column; align-items: flex-start; } .page-header-details { text-align: left; margin-top: 15px; } .campaign-details-header span { display: block; margin-left: 0; margin-bottom: 8px; } }
</style>

<a href="manage_leads.php" class="btn-back">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
    <span>Back</span>
</a>

<!-- Campaign Header -->
<div class="page-header">
    <div class="page-header-title"><h2><?php echo htmlspecialchars($campaign['campaign_name']); ?></h2></div>
    <div class="page-header-details">
        <span class="campaign-details-header"><strong>Source:</strong> <?php echo htmlspecialchars($campaign['lead_source']); ?></span>
        <span class="campaign-details-header"><strong>Budget:</strong> ₹<?php echo number_format($campaign['campaign_budget']); ?></span>
        <span class="campaign-details-header"><strong>Date:</strong> <?php echo date("d M, Y", strtotime($campaign['campaign_date'])); ?></span>
    </div>
</div>

<?php if (!empty($message)) echo $message; ?>

<!-- 🟩 LEAD ENTRY SECTION 🟩 -->
<div class="lead-forms-container">
    <div class="form-card">
        <h3>Add Lead Manually</h3>
        <form action="" method="post">
            <input type="hidden" name="action" value="add_lead_to_campaign">
            <input type="text" name="client_name" placeholder="Client Name" required>
            <input type="email" name="client_email" placeholder="Client Email">
            <input type="text" name="client_phone" placeholder="Phone Number" required>
            <input type="text" name="location" placeholder="Location" required>
            <input type="text" name="interested_project" placeholder="Interested Project">
            <textarea name="client_message" placeholder="Client Message" rows="3"></textarea>
            <button type="submit" style="margin-top:10px;">Add This Lead</button>
        </form>
    </div>
    <div class="form-card">
        <h3>Upload Leads from CSV</h3>
        <p style="font-size:0.9em; color:#666; margin-top: -10px;">Format: name, email, phone, location, project, message</p>
        <form action="" method="post" enctype="multipart/form-data">
            <input type="hidden" name="action" value="upload_leads_to_campaign">
            <input type="file" name="csv_file" accept=".csv" required>
            <button type="submit">Upload CSV File</button>
        </form>
    </div>
</div>

<hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">

<!-- 🟨 LEAD ASSIGNMENT TABLE 🟨 -->
<div class="section-header" style="margin-bottom: 25px;"><h3>Leads in this Campaign</h3></div>
<div style="background-color:#fff; padding:15px; border-radius:8px; box-shadow: 0 4px 15px rgba(0,0,0,0.07);">
    <table class="lead-table responsive-table">
        <thead><tr><th>Client</th><th>Contact</th><th>Message</th><th>Assigned To</th><th>Action</th></tr></thead>
        <tbody>
            <?php
            // **MODIFICATION: Filter agents dropdown to only show agents owned by THIS admin**
            $stmt_agents = $conn->prepare("SELECT user_id, username FROM users WHERE role_id = 2 AND owned_by_admin_id = ?");
            $stmt_agents->bind_param("i", $admin_id);
            $stmt_agents->execute();
            $agents_result = $stmt_agents->get_result();
            $agents = $agents_result->fetch_all(MYSQLI_ASSOC);
            $stmt_agents->close();

            // **MODIFICATION: Filter leads list to only show leads owned by THIS admin**
            $leads_sql = "SELECT l.*, u.username as agent_name FROM leads l LEFT JOIN lead_assignments la ON l.lead_id = la.lead_id LEFT JOIN users u ON la.sales_agent_id = u.user_id WHERE l.campaign_id = ? AND l.admin_id = ? ORDER BY l.lead_id DESC";
            $stmt_leads = $conn->prepare($leads_sql);
            $stmt_leads->bind_param("ii", $campaign_id, $admin_id);
            $stmt_leads->execute();
            $leads_result = $stmt_leads->get_result();
            
            if ($leads_result->num_rows > 0) {
                while ($lead = $leads_result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td data-label='Client'>" . htmlspecialchars($lead['client_name']) . "</td>";
                    echo "<td data-label='Contact'>" . htmlspecialchars($lead['client_email']) . "<br>" . htmlspecialchars($lead['client_phone']) . "</td>";
                    echo "<td data-label='Message'>" . htmlspecialchars($lead['client_message']) . "</td>";
                    echo "<td data-label='Assigned To'><strong>" . htmlspecialchars($lead['agent_name'] ?? 'Unassigned') . "</strong></td>";
                    echo "<td data-label='Action'><form action='' method='post' style='display:flex; gap:5px;'><input type='hidden' name='action' value='assign_campaign_lead'><input type='hidden' name='lead_id' value='{$lead['lead_id']}'><select name='sales_agent_id' required>";
                    echo "<option value=''>-- Select Agent --</option>";
                    if (!empty($agents)) {
                        foreach ($agents as $agent) { echo "<option value='{$agent['user_id']}'>" . htmlspecialchars($agent['username']) . "</option>"; }
                    }
                    echo "</select><button type='submit' style='padding:5px 8px;'>Assign</button></form></td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='5' style='text-align:center; padding: 20px;'>No leads have been added to this campaign yet.</td></tr>";
            }
            $stmt_leads->close();
            ?>
        </tbody>
    </table>
</div>

<?php require 'partials/footer.php'; ?>