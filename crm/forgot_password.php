<?php
require_once 'includes/functions.php';
$message = '';
$message_type = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var(sanitize_input($_POST['email']), FILTER_VALIDATE_EMAIL);
    if ($email) {
        $stmt = $conn->prepare("SELECT user_id, username, email FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if ($user) {
            $user_id = $user['user_id'];
            $otp = rand(100000, 999999);
            $otp_expiry = date('Y-m-d H:i:s', time() + 600); // 10 minute expiry

            $update_stmt = $conn->prepare("UPDATE users SET otp = ?, otp_expiry = ? WHERE user_id = ?");
            $update_stmt->bind_param("ssi", $otp, $otp_expiry, $user_id);
            $update_stmt->execute();
            $update_stmt->close();
            
            // Send email with User ID and OTP
            $subject = "Your CRM Password Reset Request";
            $body = "<h2>Password Reset</h2>
                     <p>You requested a password reset. Your username is: <strong>" . htmlspecialchars($user['username']) . "</strong></p>
                     <p>Your One-Time Password (OTP) for resetting your password is:</p>
                     <h3 style='font-size: 24px;'>$otp</h3>
                     <p>This code is valid for 10 minutes.</p>";
            
            if (send_email($user['email'], $subject, $body)) {
                // Redirect to the next step, passing email in URL
                header("Location: reset_with_otp.php?email=" . urlencode($email));
                exit();
            } else {
                $message = "Error: Could not send the reset email. Please try again later.";
                $message_type = 'error';
            }
        } else {
            $message = "If an account with that email exists, a reset code has been sent."; // Generic message for security
            $message_type = 'success';
        }
    } else {
        $message = "Please enter a valid email address.";
        $message_type = 'error';
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Forgot Password</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="login-container">
        <h2>Reset Password</h2>
        <p>Enter your email address to receive your username and a password reset code.</p>
        <?php if(!empty($message)): ?>
            <p class='status-message <?php echo $message_type; ?>'><?php echo $message; ?></p>
        <?php endif; ?>
        <form action="" method="post">
            <input type="email" name="email" placeholder="Your Email Address" required>
            <button type="submit">Send Reset Code</button>
        </form>
        <p style="text-align:center; margin-top:20px;"><a href="login.php">&larr; Back to Login</a></p>
    </div>
</body>
</html>