<?php
require_once '../includes/functions.php';
enforce_security(2); // Sales Agent Role ID

$current_page = basename($_SERVER['PHP_SELF']);

$agent_id_for_count = $_SESSION['user_id'];
$sql_count = "SELECT COUNT(*) as count FROM payment_schedules ps JOIN bookings b ON ps.booking_id = b.booking_id WHERE b.sales_agent_id = ? AND ps.due_date = CURDATE() AND ps.status != 'Paid'";
$stmt_count = $conn->prepare($sql_count);
$stmt_count->bind_param("i", $agent_id_for_count);
$stmt_count->execute();
$payment_reminder_count = $stmt_count->get_result()->fetch_assoc()['count'];
$stmt_count->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Agent Dashboard</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        body { font-size: 14px; overflow-x: hidden; }
        .container { width: 100%; padding: 15px 10px; box-sizing: border-box; margin: 0; box-shadow: none; border-radius: 0; }
        h2 { font-size: 1.4em; padding: 0 10px; }
        header { flex-direction: column; align-items: flex-start; padding: 10px; }
        header h1 { font-size: 1.1em; margin-bottom: 10px; }
        header nav { display: flex; width: 100%; justify-content: space-around; background-color: #005f73; padding: 8px 0; border-radius: 5px; flex-wrap: wrap; gap: 5px; }
        header nav a { padding: 8px 5px; font-size: 0.9em; text-align: center; color: white; text-decoration: none; border-radius: 5px; transition: background-color 0.2s; }
        .responsive-table { width: 100%; border-collapse: collapse; }
        header nav a.active-nav { background-color: #ffffff; color: #005f73; font-weight: bold; }
        header nav a:hover:not(.active-nav) { background-color: #007f8f; }
        #payment-reminder-fab { position: fixed; bottom: 25px; right: 25px; width: 60px; height: 60px; background-color: #005f73; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer; z-index: 1000; transition: transform 0.2s ease-in-out; text-decoration: none; }
        #payment-reminder-fab:hover { transform: scale(1.1); }
        .fab-badge { position: absolute; top: -5px; right: -5px; background-color: #e63946; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; }
        .btn-convert { display: block; width: 100%; padding: 12px 15px; background-color: #2a9d8f; color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center; box-sizing: border-box; border: none; cursor: pointer; transition: background-color 0.2s, transform 0.2s; }
        .btn-convert:hover { background-color: #268a7f; transform: translateY(-2px); color: white; }
        .btn-action { display: inline-block; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-weight: 500; font-size: 0.9em; text-align: center; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .btn-action:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
        .btn-manage { background-color: #0a9396; color: white; }
        .btn-manage:hover { color: white; }
        .btn-view { background-color: #005f73; color: white; }
        .btn-view:hover { color: white; }
        @media (min-width: 1200px) { /* Changed to a wider breakpoint for better wrapping */
            body { font-size: 16px; overflow-x: auto; }
            .container { width: 90%; max-width: 1200px; margin: 20px auto; padding: 25px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; }
            header { flex-direction: row; align-items: center; justify-content: space-between; padding: 15px 30px; }
            header h1 { font-size: 1.5em; }
            header nav { width: auto; background-color: transparent; padding: 0; flex-wrap: nowrap; }
            header nav a { margin-left: 15px; font-size: 1em; }
        }
    </style>
</head>
<body>
    <header>
        <h1>Agent Panel - Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></h1>
        
        <!-- ===== RESTORED AND REORGANIZED NAVIGATION ===== -->
        <nav>
            <a href="index.php" class="<?php echo ($current_page == 'index.php') ? 'active-nav' : ''; ?>">Dashboard</a>
            <a href="general_leads.php" class="<?php echo in_array($current_page, ['general_leads.php', 'update_lead.php']) ? 'active-nav' : ''; ?>">General Leads</a>
            <a href="completed_visits.php" class="<?php echo ($current_page == 'completed_visits.php') ? 'active-nav' : ''; ?>">Site Visit Done</a>
            <a href="active_visits.php" class="<?php echo ($current_page == 'active_visits.php') ? 'active-nav' : ''; ?>">My Active Visits</a>
            <a href="our_customers.php" class="<?php echo in_array($current_page, ['our_customers.php', 'manage_customer.php', 'create_booking.php']) ? 'active-nav' : ''; ?>">Customers</a>
            <a href="visit_history.php" class="<?php echo ($current_page == 'visit_history.php') ? 'active-nav' : ''; ?>">Visit History</a>
            
            <!-- Restored Archive & Management Links -->
            <a href="hidden_leads.php" class="<?php echo ($current_page == 'hidden_leads.php') ? 'active-nav' : ''; ?>">Hidden Leads</a>
            <a href="not_interested_leads.php" class="<?php echo ($current_page == 'not_interested_leads.php') ? 'active-nav' : ''; ?>">Not Interested</a>
            <a href="completed_payments.php" class="<?php echo ($current_page == 'completed_payments.php') ? 'active-nav' : ''; ?>">Completed Payments</a>
            
            <a href="../logout.php">Logout</a>
        </nav>
        <!-- ===== END OF RESTORATION ===== -->
        
    </header>
    <div class="container">