<?php
require_once 'includes/functions.php';

// Check if a user is in the middle of a login attempt
if (!isset($_SESSION['temp_user_id'])) {
    // If not, just redirect to login to prevent direct access
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['temp_user_id'];

// Fetch the user's email from the database
$stmt = $conn->prepare("SELECT username, email FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($user) {
    // Generate a new OTP and a new 2-minute expiry time
    $otp = rand(100000, 999999);
    $otp_expiry = date('Y-m-d H:i:s', time() + 120); // 120 seconds = 2 minutes

    // Update the user's record in the database with the new OTP and expiry time
    $update_stmt = $conn->prepare("UPDATE users SET otp = ?, otp_expiry = ? WHERE user_id = ?");
    $update_stmt->bind_param("ssi", $otp, $otp_expiry, $user_id);
    $update_stmt->execute();
    $update_stmt->close();

    // --- SEND THE NEW OTP EMAIL ---
    $subject = "Your New CRM Login Verification Code";
    $body = "<h2>Login Verification</h2>
             <p>Dear " . htmlspecialchars($user['username']) . ",</p>
             <p>Your new One-Time Password (OTP) is:</p>
             <h3 style='font-size: 24px; color: #005f73;'>$otp</h3>
             <p>This code is valid for 2 minutes.</p>";
    
    send_email($user['email'], $subject, $body);

    // Set a success message in the session to be displayed on the OTP page
    $_SESSION['resend_status'] = 'success';
} else {
    $_SESSION['resend_status'] = 'error';
}

// Redirect back to the OTP verification page
header("Location: otp_verify.php");
exit();
?>