<?php
require_once '../includes/functions.php';

// Use the security function to ensure only an active admin can perform this action
enforce_security(1); 

if (isset($_GET['session_id'])) {
    // Sanitize the input to ensure it's an integer
    $session_id_to_end = (int)$_GET['session_id'];

    // Prepare a statement to mark the session as inactive (is_active = FALSE)
    // and record the current time as the logout time.
    $stmt = $conn->prepare("UPDATE user_sessions SET is_active = FALSE, logout_time = NOW() WHERE session_id = ?");
    $stmt->bind_param("i", $session_id_to_end);
    $stmt->execute();
    $stmt->close();
}

// Redirect the admin back to their monitoring dashboard after the action is complete
header("Location: monitoring.php");
exit();
?>