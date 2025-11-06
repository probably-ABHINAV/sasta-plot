<?php 
require 'partials/header.php'; 
enforce_security(2);

$sales_agent_id = $_SESSION['user_id'];

// --- Query 1: Count General Leads (Active, not hidden, not booked, and NO completed site visits) ---
$sql_general = "SELECT COUNT(l.lead_id) as count 
                FROM leads l 
                JOIN lead_assignments la ON l.lead_id = la.lead_id
                WHERE la.sales_agent_id = ? 
                AND l.status = 'Active'
                AND l.lead_id NOT IN (SELECT lead_id FROM hidden_by_agent WHERE user_id = ?)
                AND l.lead_id NOT IN (SELECT lead_id FROM bookings)
                AND l.lead_id NOT IN (SELECT lead_id FROM site_visits WHERE status = 'Completed')";
$stmt_general = $conn->prepare($sql_general);
$stmt_general->bind_param("ii", $sales_agent_id, $sales_agent_id);
$stmt_general->execute();
$general_leads_count = $stmt_general->get_result()->fetch_assoc()['count'];
$stmt_general->close();

// --- Query 2: Count Site Visit Done Leads (Ready for follow-up) ---
$sql_done = "SELECT COUNT(l.lead_id) as count 
             FROM site_visits sv
             JOIN leads l ON sv.lead_id = l.lead_id
             WHERE sv.sales_agent_id = ? 
             AND sv.status = 'Completed'
             AND l.lead_id NOT IN (SELECT lead_id FROM bookings)";
$stmt_done = $conn->prepare($sql_done);
$stmt_done->bind_param("i", $sales_agent_id);
$stmt_done->execute();
$done_leads_count = $stmt_done->get_result()->fetch_assoc()['count'];
$stmt_done->close();
?>
<style>
    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }
    .dashboard-card {
        display: block;
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 25px;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .dashboard-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .card-header { display: flex; align-items: center; gap: 15px; }
    .card-header svg { width: 40px; height: 40px; fill: #005f73; }
    .card-title { font-size: 1.6em; font-weight: 600; color: #003d47; margin: 0; }
    .card-count { font-size: 3em; font-weight: 600; color: #0a9396; text-align: right; margin: 20px 0; }
    .card-description { color: #6c757d; font-size: 1em; }
</style>

<h2>Agent Dashboard</h2>
<p>Select a section to view your leads.</p>

<div class="dashboard-grid">
    <!-- General Leads Card -->
    <a href="general_leads.php" class="dashboard-card">
        <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M152 120c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zM448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v40c0 13.3 10.7 24 24 24h144c13.3 0 24-10.7 24-24v-40h96c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zM448 352H64V64h384v288z"/></svg>
            <h3 class="card-title">General Leads</h3>
        </div>
        <p class="card-description">View all active leads assigned to you that are awaiting a site visit.</p>
        <div class="card-count"><?php echo $general_leads_count; ?></div>
    </a>

    <!-- Site Visit Done Leads Card -->
    <a href="completed_visits.php" class="dashboard-card">
        <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 92.9-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.8-35.7-46.1-87.7-92.9-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64s-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64z"/></svg>
            <h3 class="card-title">Site Visit Done Leads</h3>
        </div>
        <p class="card-description">Follow up with leads whose site visit is complete and convert them to customers.</p>
        <div class="card-count"><?php echo $done_leads_count; ?></div>
    </a>
</div>

<?php require 'partials/footer.php'; ?>