<?php
require_once 'includes/functions.php';

// --- START: NEW "REMEMBER ME" CHECK ---
if (isset($_COOKIE['remember_me_selector']) && !isset($_SESSION['user_id'])) {
    $selector = $_COOKIE['remember_me_selector'];
    
    $stmt = $conn->prepare("SELECT * FROM persistent_logins WHERE selector = ? AND expires >= NOW()");
    $stmt->bind_param("s", $selector);
    $stmt->execute();
    $token = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($token && hash_equals($token['validator_hash'], hash('sha256', $_COOKIE['remember_me_validator']))) {
        // Token is valid, log the user in directly
        $user_id = $token['user_id'];
        
        $user_stmt = $conn->prepare("SELECT username, role_id FROM users WHERE user_id = ?");
        $user_stmt->bind_param("i", $user_id);
        $user_stmt->execute();
        $user = $user_stmt->get_result()->fetch_assoc();
        $user_stmt->close();
        
        // Start a new session
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $user['username'];
        $_SESSION['role_id'] = $user['role_id'];
        
        // Log the new session in the database
        $log_stmt = $conn->prepare("INSERT INTO user_sessions (user_id, user_agent) VALUES (?, ?)");
        $log_stmt->bind_param("is", $user_id, $_SERVER['HTTP_USER_AGENT']);
        $log_stmt->execute();
        $_SESSION['session_id'] = $log_stmt->insert_id;
        $log_stmt->close();
        
        // Redirect to the correct dashboard
        if ($user['role_id'] == 1) { header("Location: admin/"); }
        elseif ($user['role_id'] == 2) { header("Location: sales_agent/"); }
        elseif ($user['role_id'] == 3) { header("Location: site_visit_agent/"); }
        exit();
    }
}
// --- END: NEW "REMEMBER ME" CHECK ---


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = sanitize_input($_POST['username']);
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT user_id, username, email, password_hash, is_disabled FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($user && !$user['is_disabled'] && password_verify($password, $user['password_hash'])) {
        $user_id = $user['user_id'];
        
        $deactivate_stmt = $conn->prepare("UPDATE user_sessions SET is_active = FALSE, logout_time = NOW() WHERE user_id = ? AND is_active = TRUE");
        $deactivate_stmt->bind_param("i", $user_id);
        $deactivate_stmt->execute();
        $deactivate_stmt->close();

        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $log_stmt = $conn->prepare("INSERT INTO user_sessions (user_id, user_agent) VALUES (?, ?)");
        $log_stmt->bind_param("is", $user_id, $user_agent);
        $log_stmt->execute();
        $new_session_id = $log_stmt->insert_id;
        $log_stmt->close();
        
        $otp = rand(100000, 999999);
        $otp_expiry = date('Y-m-d H:i:s', time() + 120);

        $update_stmt = $conn->prepare("UPDATE users SET otp = ?, otp_expiry = ? WHERE user_id = ?");
        $update_stmt->bind_param("ssi", $otp, $otp_expiry, $user_id);
        $update_stmt->execute();
        $update_stmt->close();

        $subject = "Your CRM Login Verification Code";
        $body = "<h2>Login Verification</h2><p>Your One-Time Password (OTP) is: <h3>$otp</h3></p><p>This code is valid for 2 minutes.</p>";
        send_email($user['email'], $subject, $body);
        
        $_SESSION['temp_user_id'] = $user_id;
        $_SESSION['temp_session_id'] = $new_session_id;
        
        // Store the "Remember Me" choice in the session temporarily
        if (isset($_POST['remember_me']) && $_POST['remember_me'] == '1') {
            $_SESSION['remember_me'] = true;
        } else {
            $_SESSION['remember_me'] = false;
        }
        
        header("Location: otp_verify.php");
        exit();
    }
    
    header("Location: login.php?error=1");
    exit();
}
?>