<?php
// This script marks all unread notifications for the current user as "read".
require_once 'functions.php';

// Security: Ensure a user is logged in
enforce_security(2); // Only sales agents can access this

$current_user_id = $_SESSION['user_id'];

// Prepare and execute the UPDATE query
$stmt = $conn->prepare("UPDATE notifications SET is_read = TRUE WHERE recipient_user_id = ? AND is_read = FALSE");
$stmt->bind_param("i", $current_user_id);
$stmt->execute();
$stmt->close();

// Redirect the user back to their main dashboard
header("Location: ../sales_agent/index.php");
exit();
?>