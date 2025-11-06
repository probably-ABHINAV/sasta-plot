<?php 
require 'partials/header.php'; 
enforce_security(1); // Enforce admin role

// Get the ID of the currently logged-in admin
$admin_id = $_SESSION['user_id'];

// --- GATHER ALL DASHBOARD STATISTICS (NOW FILTERED BY ADMIN ID) ---
$total_leads = $conn->query("SELECT COUNT(*) as count FROM leads WHERE admin_id = $admin_id")->fetch_assoc()['count'];
$unassigned_leads = $conn->query("SELECT COUNT(*) FROM leads WHERE admin_id = $admin_id AND lead_id NOT IN (SELECT lead_id FROM lead_assignments)")->fetch_assoc()['COUNT(*)'];
$total_agents = $conn->query("SELECT COUNT(*) as count FROM users WHERE role_id = 2 AND owned_by_admin_id = $admin_id")->fetch_assoc()['count'];
$active_sv_agents = $conn->query("SELECT COUNT(*) as count FROM users WHERE role_id = 3 AND is_disabled = FALSE AND owned_by_admin_id = $admin_id")->fetch_assoc()['count'];
$today_confirmations = $conn->query("SELECT COUNT(sv.visit_id) as count FROM site_visits sv JOIN leads l ON sv.lead_id = l.lead_id WHERE l.admin_id = $admin_id AND sv.confirmation_summary IS NOT NULL AND DATE(sv.visit_date_time) = CURDATE()")->fetch_assoc()['count'];
$todays_due_payments = $conn->query("SELECT COUNT(ps.payment_id) as count FROM payment_schedules ps JOIN bookings b ON ps.booking_id = b.booking_id JOIN leads l ON b.lead_id = l.lead_id WHERE l.admin_id = $admin_id AND ps.due_date = CURDATE() AND ps.status != 'Paid'")->fetch_assoc()['count'];
$todays_site_visits = $conn->query("SELECT COUNT(sv.visit_id) as count FROM site_visits sv JOIN leads l ON sv.lead_id = l.lead_id WHERE l.admin_id = $admin_id AND DATE(sv.visit_date_time) = CURDATE() AND sv.status IN ('Scheduled', 'Rescheduled')")->fetch_assoc()['count'];
// Applications are global for now, but could be filtered if needed
$total_applications = $conn->query("SELECT COUNT(*) as count FROM applications")->fetch_assoc()['count'];
?>

<!-- ===== PROFESSIONAL CSS FOR THE DASHBOARD ===== -->
<style>
    /* Main Dashboard Greeting */
    .dashboard-header { margin-bottom: 30px; }
    .dashboard-header h2 { font-size: 1.8em; font-weight: 600; color: #003d47; margin: 0; }
    .dashboard-header p { font-size: 1.1em; color: #6c757d; padding-left: 0; }

    /* Redesigned Stat Cards Grid */
    .dashboard-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 25px; 
        margin-bottom: 40px; 
    }
    .stat-card { 
        background-color: #ffffff;
        padding: 25px; 
        border-radius: 8px; 
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
        display: flex;
        align-items: center;
        gap: 20px;
        transition: transform 0.2s, box-shadow 0.2s;
        text-decoration: none;
        color: inherit;
    }
    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    /* Icon styling within the cards */
    .stat-card .icon {
        flex-shrink: 0;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e0f7fa;
    }
    .stat-card .icon svg { width: 28px; height: 28px; fill: #0a9396; }

    /* Text styling within the cards */
    .stat-card .info h3 { margin: 0 0 5px 0; font-size: 1em; color: #6c757d; font-weight: 500; }
    .stat-card .info p { font-size: 2em; font-weight: 600; margin: 0; color: #003d47; padding: 0; }

    /* CTA Card for Monitoring Link */
    .cta-card { text-align: center; padding: 30px; background: linear-gradient(120deg, #005f73, #0a9396); border-radius: 8px; color: white; }
    .cta-card h3 { color: white; margin-top: 0; font-size: 1.5em; }
    .cta-card a { display: inline-block; padding: 12px 25px; background-color: #ffffff; color: #005f73; text-decoration: none; border-radius: 5px; font-size: 1em; font-weight: bold; margin-top: 15px; transition: transform 0.2s; }
    .cta-card a:hover { transform: scale(1.05); }
</style>

<div class="dashboard-header">
    <h2>Dashboard Overview</h2>
    <p>Here is a real-time summary of your CRM activity.</p>
</div>

<div class="dashboard-grid">
    <!-- Stat Card: Total Leads -->
    <div class="stat-card">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M152 120c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zM448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v40c0 13.3 10.7 24 24 24h144c13.3 0 24-10.7 24-24v-40h96c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zM448 352H64V64h384v288z"/></svg></div>
        <div class="info"><h3>Total Leads</h3><p><?php echo $total_leads; ?></p></div>
    </div>

    <!-- Stat Card: Unassigned Leads -->
    <div class="stat-card">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-64 256c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm128 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-64 128c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-64-128c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm128-128c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z"/></svg></div>
        <div class="info"><h3>Unassigned Leads</h3><p><?php echo $unassigned_leads; ?></p></div>
    </div>
    
    <!-- ===== UPDATED & LINKED CARD: Today's Due Payments ===== -->
    <a href="payment_reminders.php" class="stat-card">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm224 80c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32z"/></svg></div>
        <div class="info"><h3>Today's Due Payments</h3><p><?php echo $todays_due_payments; ?></p></div>
    </a>
    <!-- ===== END OF UPDATE ===== -->

    <!-- ===== UPDATED & LINKED CARD: Today's Site Visits ===== -->
    <a href="site_visits_report.php" class="stat-card">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg></div>
        <div class="info"><h3>Today's Site Visits</h3><p><?php echo $todays_site_visits; ?></p></div>
    </a>
    <!-- ===== END OF UPDATE ===== -->

    <!-- Stat Card: Total Sales Agents -->
    <div class="stat-card">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm32 32h-16c-18.5 10.3-38.9 16-60 16s-41.5-5.7-60-16h-16c-61.9 0-112 50.1-112 112v28.8c0 26.5 21.5 48 48 48H608c13.3 0 24-10.7 24-24v-5.2c0-69.9-50.5-129.5-117.8-141.6-5.4-1-10.7-1.5-16.2-1.5z"/></svg></div>
        <div class="info"><h3>Total Sales Agents</h3><p><?php echo $total_agents; ?></p></div>
    </div>

    <!-- Stat Card: Active Site Visit Agents -->
    <div class="stat-card">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm-94.7 32C72.2 320 0 392.2 0 481.3 0 498.2 13.8 512 30.7 512h450.6c16.9 0 30.7-13.8 30.7-30.7C512 392.2 439.8 320 350.7 320H161.3z"/></svg></div>
        <div class="info"><h3>Active Site Visit Agents</h3><p><?php echo $active_sv_agents; ?></p></div>
    </div>
    
    <!-- Stat Card: Today's Confirmations -->
    <div class="stat-card">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M432 112V96c0-17.7-14.3-32-32-32H48c-17.7 0-32 14.3-32 32v224c0 17.7 14.3 32 32 32h128v-64c0-17.7 14.3-32 32-32h160v-32c0-17.7-14.3-32-32-32h-32c-17.7 0-32-14.3-32-32v-32h160c17.7 0 32-14.3 32-32zM320 480c-17.7 0-32-14.3-32-32v-64H192v64c0 17.7-14.3 32-32 32H48c-17.7 0-32-14.3-32-32v-32c0-17.7 14.3-32 32-32h352c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32h-80z"/></svg></div>
        <div class="info"><h3>Today's Confirmations</h3><p><?php echo $today_confirmations; ?></p></div>
    </div>

    <!-- Card: Total Applications (Linked to view_applications.php) -->
    <a href="view_applications.php" class="stat-card">
        <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg></div>
        <div class="info"><h3>Total Applications</h3><p><?php echo $total_applications; ?></p></div>
    </a>
</div>

<div class="cta-card">
    <h3>Manage & Monitor Your Teams</h3>
    <a href="monitoring.php">Go to Monitoring Page</a>
</div>

<?php require 'partials/footer.php'; ?>