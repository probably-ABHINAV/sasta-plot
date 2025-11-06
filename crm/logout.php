<?php
session_start();
require 'includes/db.php';

if (isset($_SESSION['session_id'])) {
    $session_id = $_SESSION['session_id'];
    $stmt = $conn->prepare("UPDATE user_sessions SET is_active = FALSE, logout_time = NOW() WHERE session_id = ?");
    $stmt->bind_param("i", $session_id);
    $stmt->execute();
    $stmt->close();
}

// --- START: NEW LOGIC TO DELETE "REMEMBER ME" TOKEN ---
if (isset($_COOKIE['remember_me_selector'])) {
    // Delete the token from the database
    $stmt_del = $conn->prepare("DELETE FROM persistent_logins WHERE selector = ?");
    $stmt_del->bind_param("s", $_COOKIE['remember_me_selector']);
    $stmt_del->execute();
    $stmt_del->close();
    
    // Unset the cookies by setting their expiry to the past
    setcookie('remember_me_selector', '', time() - 3600, '/');
    setcookie('remember_me_validator', '', time() - 3600, '/');
}
// --- END: NEW LOGIC ---

$_SESSION = array();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

header("Location: login.php");
exit();
?>