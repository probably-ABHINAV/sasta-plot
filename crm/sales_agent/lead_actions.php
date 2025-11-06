<?php
// This file handles all server-side processing for lead updates.
require_once 'functions.php';

// Security: Ensure a user is logged in and this is a POST request
check_login();
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit("Invalid request method.");
}

// Security: Ensure lead_id and action are set
if (!isset($_POST['lead_id']) || !isset($_POST['action'])) {
    exit("Missing required parameters.");
}

$lead_id = (int)$_POST['lead_id'];
$sales_agent_id = $_SESSION['user_id'];
$action = $_POST['action'];
$status_message = '';

// --- Process "Add New Follow-Up" Action ---
if ($action === 'add_follow_up') {
    $follow_up_date = sanitize_input($_POST['follow_up_date']);
    $notes = sanitize_input($_POST['notes']);
    $interest_level = sanitize_input($_POST['interest_level']);
    
    // Convert empty date string to NULL for the database
    $follow_up_date_for_db = !empty($follow_up_date) ? $follow_up_date : null;

    $stmt = $conn->prepare("INSERT INTO lead_updates (lead_id, sales_agent_id, follow_up_date, notes, interest_level) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iisss", $lead_id, $sales_agent_id, $follow_up_date_for_db, $notes, $interest_level);
    
    if ($stmt->execute()) {
        $status_message = 'success_followup';
    } else {
        $status_message = 'error_followup';
    }
    $stmt->close();
}

// --- Process "Schedule New Site Visit" Action ---
elseif ($action === 'schedule_visit') {
    $visit_agent_id = (int)$_POST['site_visit_agent_id'];
    $visit_datetime = sanitize_input($_POST['visit_date_time']);
    
    $stmt = $conn->prepare("INSERT INTO site_visits (lead_id, sales_agent_id, site_visit_agent_id, visit_date_time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $lead_id, $sales_agent_id, $visit_agent_id, $visit_datetime);
    
    if ($stmt->execute()) {
        $status_message = 'success_visit';
    } else {
        $status_message = 'error_visit';
    }
    $stmt->close();
}

// --- Redirect back to the lead page with a status message ---
header("Location: ../sales_agent/update_lead.php?lead_id=" . $lead_id . "&status=" . $status_message);
exit();
?>