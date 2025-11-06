<?php
require_once '../includes/functions.php';
enforce_security(1);

// --- START: NEW Admin Payment Reminder Count ---
$sql_admin_count = "SELECT COUNT(*) as count FROM payment_schedules WHERE due_date = CURDATE() AND status != 'Paid'";
$admin_payment_reminder_count = $conn->query($sql_admin_count)->fetch_assoc()['count'];
// --- END: NEW Admin Payment Reminder Count ---


$current_page = basename($_SERVER['PHP_SELF']);

// --- Check for unread confirmations to decide if the bell icon should be shown ---
$unread_confirmations_query = "SELECT COUNT(*) as count FROM site_visits WHERE is_viewed_by_admin = FALSE AND confirmation_summary IS NOT NULL";
$unread_confirmations_count = $conn->query($unread_confirmations_query)->fetch_assoc()['count'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../assets/css/style.css">
<style>
    /* --- GLOBAL MOBILE ADJUSTMENTS (Mobile First) --- */
    body { font-size: 14px; overflow-x: hidden; }
    .container { width: 100%; padding: 15px 10px; box-sizing: border-box; margin: 0; box-shadow: none; border-radius: 0; }
    h2, h3 { font-size: 1.4em; padding: 0 10px; }
    p { padding: 0 10px; }
    hr { margin: 25px 10px; }
    header { flex-direction: column; align-items: flex-start; padding: 10px; }
    header h1 { font-size: 1.1em; margin-bottom: 10px; }
    
    /* --- UNIFIED NAV STYLES FOR CONSISTENT SIZE --- */
    header nav {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: center;
        background-color: #005f73;
        padding: 8px 0;
        border-radius: 5px;
        gap: 5px;
    }
    header nav a {
        padding: 8px 10px;
        font-size: 0.8em;
        font-weight: 500; /* Use a medium weight for all links */
        text-align: center;
        flex-grow: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.2s;
    }
    header nav a:hover {
        background-color: #007f8f;
    }
    header nav a.active-nav {
        background-color: #ffffff;
        color: #005f73;
        /* KEY CHANGE: Removed font-weight: bold; to prevent size change */
    }
    /* --- END OF CORRECTION --- */

    /* --- MOBILE-FIRST TABLE STYLES --- */
    .responsive-table { width: 100%; border-collapse: collapse; }
    .responsive-table thead { display: none; }
    .responsive-table tr { display: block; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); background-color: #fff; }
    .responsive-table td { display: flex; justify-content: space-between; align-items: center; text-align: right; padding: 8px 10px; border-bottom: 1px solid #f1f1f1; }
    .responsive-table td:last-child { border-bottom: none; }
    .responsive-table td::before { content: attr(data-label); font-weight: bold; text-align: left; padding-right: 15px; white-space: nowrap; }
    .responsive-table td[data-label="Device"] { flex-wrap: wrap; }
    .device-info { word-break: break-all; white-space: normal; text-align: right; flex-grow: 1; }
    .responsive-table td[data-label="Actions"] .actions-container { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .responsive-table td[data-label="Actions"] .action-btn { width: 100%; text-align: center; }

    /* --- NOTIFICATION ICON STYLES --- */
    .notification-icon { width: 16px; height: 16px; fill: currentColor; }

    /* --- CSS FOR THE ADMIN FLOATING PAYMENT REMINDER BUTTON --- */
    #payment-reminder-fab { position: fixed; bottom: 25px; right: 25px; width: 60px; height: 60px; background-color: #005f73; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer; z-index: 1000; transition: transform 0.2s ease-in-out; text-decoration: none; }
    #payment-reminder-fab:hover { transform: scale(1.1); }
    .fab-badge { position: absolute; top: -5px; right: -5px; background-color: #e63946; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; }

    /* --- DESKTOP STYLES --- */
    @media (min-width: 768px) {
        body { font-size: 16px; overflow-x: auto; }
        .container { width: 90%; max-width: 1200px; margin: 20px auto; padding: 25px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; }
        header { flex-direction: row; align-items: center; justify-content: space-between; padding: 15px 30px; }
        header h1 { font-size: 1.5em; }
        header nav { flex-wrap: nowrap; width: auto; background-color: transparent; padding: 0; }
        
        /* KEY CHANGE for Desktop: Standardize size and font */
        header nav a { 
            margin-left: 15px; 
            font-size: 0.9em; /* Slightly smaller for the "small button" feel */
            padding: 8px 15px; /* Explicit padding for desktop */
            flex-grow: 0; 
            color: white;
        }
        
        header nav a:hover { color: white; background-color: #007f8f; }
        header nav a.active-nav { background-color: #ffffff; color: #005f73; }
        header nav a.active-nav:hover { color: #005f73; }
        
        .responsive-table thead { display: table-header-group; }
        .responsive-table tr { display: table-row; margin: 0; border: none; box-shadow: none; }
        .responsive-table td { display: table-cell; text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
        .responsive-table td::before { display: none; }
        .responsive-table td[data-label="Actions"] .actions-container { flex-direction: row; width: auto; }
        .responsive-table td[data-label="Actions"] .action-btn { width: auto; }
    }
</style>


</head>
<body>
    <header>
        <h1>Admin Panel - Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></h1>
        <nav>
            <a href="index.php" class="<?php echo ($current_page == 'index.php') ? 'active-nav' : ''; ?>">Dashboard</a>
            <a href="manage_users.php" class="<?php echo ($current_page == 'manage_users.php' || $current_page == 'edit_user.php') ? 'active-nav' : ''; ?>">Manage Users</a>

             <!-- ===== START: NEW LINK TO ADD ===== -->
            <a href="manage_agents.php" class="<?php echo in_array($current_page, ['manage_agents.php', 'agent_performance.php']) ? 'active-nav' : ''; ?>">Agent Performance</a>
            <!-- ===== END: NEW LINK TO ADD ===== -->
             
            <a href="manage_leads.php" class="<?php echo ($current_page == 'manage_leads.php') ? 'active-nav' : ''; ?>">Manage Leads</a>
            <a href="hidden_leads.php" class="<?php echo ($current_page == 'hidden_leads.php') ? 'active-nav' : ''; ?>">Hidden Leads</a>
            <a href="not_interested_leads.php" class="<?php echo ($current_page == 'not_interested_leads.php') ? 'active-nav' : ''; ?>">Not Interested</a>






           





            
            <a href="monitoring.php" class="<?php echo ($current_page == 'monitoring.php') ? 'active-nav' : ''; ?>">Monitoring</a>
            
            <!-- ===== START: NEW LINK TO ADD ===== -->
            <a href="end_customers.php" class="<?php echo ($current_page == 'end_customers.php') ? 'active-nav' : ''; ?>" style="color: #ffb703;">End Customers</a>
            <!-- ===== END: NEW LINK TO ADD ===== -->

            <a href="../logout.php">Logout</a>
        </nav>
    </header>
    <div class="container">