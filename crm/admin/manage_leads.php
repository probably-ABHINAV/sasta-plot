<?php
require 'partials/header.php';
enforce_security(1);

$message = '';
$admin_id = $_SESSION['user_id'];

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {
    if ($_POST['action'] == 'create_campaign') {
        $campaign_name = sanitize_input($_POST['campaign_name']);
        $lead_source = sanitize_input($_POST['lead_source']);
        $campaign_budget = filter_var($_POST['campaign_budget'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $campaign_date = sanitize_input($_POST['campaign_date']);
        
        $stmt = $conn->prepare("INSERT INTO campaigns (campaign_name, lead_source, campaign_budget, campaign_date, admin_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $campaign_name, $lead_source, $campaign_budget, $campaign_date, $admin_id);
        if ($stmt->execute()) {
            $message = "<p class='status-message success'>New campaign created successfully!</p>";
        } else {
            $message = "<p class='status-message error'>Error: Could not create the campaign.</p>";
        }
        $stmt->close();
    }
}
?>
<!-- ===== STYLES FOR CAMPAIGN DASHBOARD ===== -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
    body { font-family: 'Poppins', sans-serif; }
    .status-message { padding: 12px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
    .status-message.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .status-message.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .section-container { background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.07); }
    .section-header { margin-bottom: 20px; }
    .section-header h3 { margin: 0; font-size: 1.6em; color: #003d47; }
    .section-header p { margin: 5px 0 0 0; color: #6c757d; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
    .campaign-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
    .campaign-card { background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; justify-content: space-between; }
    .campaign-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
    .campaign-card-content { padding: 20px; }
    .campaign-card h4 { margin: 0 0 15px 0; font-size: 1.3em; color: #005f73; display: flex; align-items: center; gap: 10px; }
    .campaign-card h4 svg { fill: #005f73; width: 24px; height: 24px; }
    .campaign-details span { display: block; margin-bottom: 10px; font-size: 1em; color: #333; }
    .campaign-card-footer { padding: 15px 20px; background-color: #f8f9fa; border-top: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; text-align: right; }
    .btn-manage { background-color: #0a9396; color: white !important; padding: 8px 18px; border-radius: 5px; text-decoration: none; font-weight: 500; transition: background-color 0.2s; }
    .btn-manage:hover { background-color: #005f73; }
</style>

<?php if (!empty($message)) echo $message; ?>

<div class="section-container">
    <div class="section-header">
        <h3>Campaign Dashboard</h3>
        <p>Create and manage your marketing campaigns from here.</p>
    </div>
    <form action="manage_leads.php" method="post" class="form-grid">
        <input type="hidden" name="action" value="create_campaign">
        <input type="text" name="campaign_name" placeholder="Campaign Name" required>
        <select name="lead_source" required>
            <option value="">-- Select Lead Source --</option>
            <option value="Meta">Meta</option>
            <option value="Google">Google</option>
            <option value="Organic">Organic</option>
            <option value="Other">Other</option>
        </select>
        <input type="number" name="campaign_budget" placeholder="Campaign Budget (₹)" step="0.01">
        <input type="date" name="campaign_date" required>
        <button type="submit">Create Campaign</button>
    </form>
</div>

<hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">

<div class="section-header" style="margin-bottom: 25px;">
    <h3>Your Campaigns</h3>
</div>

<div class="campaign-grid">
<?php
$sql_campaigns = "SELECT * FROM campaigns WHERE admin_id = ? ORDER BY campaign_date DESC, created_at DESC";
$stmt_campaigns = $conn->prepare($sql_campaigns);
$stmt_campaigns->bind_param("i", $admin_id);
$stmt_campaigns->execute();
$campaigns_result = $stmt_campaigns->get_result();

if ($campaigns_result->num_rows > 0) {
    while($campaign = $campaigns_result->fetch_assoc()) {
?>
    <div class="campaign-card">
        <div class="campaign-card-content">
            <h4>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352 128c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zM224 128c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zM128 224c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM64 64c0-35.3 28.7-64 64-64H384c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V64zm64 32v32c0 17.7 14.3 32 32 32H352c17.7 0 32-14.3 32-32V96h16v32c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16v32c0 17.7 14.3 32 32 32h16V96H128V64z"/></svg>
                <?php echo htmlspecialchars($campaign['campaign_name']); ?>
            </h4>
            <div class="campaign-details">
                <span><strong>Source:</strong> <?php echo htmlspecialchars($campaign['lead_source']); ?></span>
                <span><strong>Budget:</strong> ₹<?php echo number_format($campaign['campaign_budget']); ?></span>
                <span><strong>Date:</strong> <?php echo date("d M, Y", strtotime($campaign['campaign_date'])); ?></span>
            </div>
        </div>
        <div class="campaign-card-footer">
            <a href="campaign_details.php?campaign_id=<?php echo $campaign['campaign_id']; ?>" class="btn-manage">Manage Campaign &rarr;</a>
        </div>
    </div>
<?php
    }
} else {
    echo "<p>You have not created any campaigns yet. Use the form above to get started.</p>";
}
$stmt_campaigns->close();
?>
</div>

<?php require 'partials/footer.php'; ?>