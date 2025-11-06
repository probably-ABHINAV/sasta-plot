<?php
require_once 'includes/functions.php';
$message = '';
$message_type = 'error';

$email = isset($_GET['email']) ? sanitize_input($_GET['email']) : '';
if (empty($email)) {
    header("Location: forgot_password.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $otp = sanitize_input($_POST['otp']);
    $password = $_POST['password'];
    $password_confirm = $_POST['password_confirm'];

    if ($password !== $password_confirm) {
        $message = "Passwords do not match.";
    } elseif (strlen($password) < 6) {
        $message = "Password must be at least 6 characters long.";
    } else {
        $stmt = $conn->prepare("SELECT user_id, otp, otp_expiry FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if ($user && $user['otp'] == $otp && new DateTime() < new DateTime($user['otp_expiry'])) {
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $update_stmt = $conn->prepare("UPDATE users SET password_hash = ?, otp = NULL, otp_expiry = NULL WHERE user_id = ?");
            $update_stmt->bind_param("si", $password_hash, $user['user_id']);
            $update_stmt->execute();
            $update_stmt->close();
            
            $message = "Password updated successfully! You can now log in.";
            $message_type = 'success';
        } else {
            $message = "Invalid or expired OTP. Please try again.";
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Enter New Password</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="login-container">
        <h2>Create New Password</h2>
        <p>An OTP has been sent to <strong><?php echo htmlspecialchars($email); ?></strong>.</p>
        <?php if(!empty($message)): ?>
            <p class='status-message <?php echo $message_type; ?>'><?php echo $message; ?></p>
        <?php endif; ?>
        <form action="" method="post">
            <input type="text" name="otp" placeholder="Enter 6-Digit OTP" required>
            <input type="password" name="password" placeholder="Enter New Password" required>
            <input type="password" name="password_confirm" placeholder="Confirm New Password" required>
            <button type="submit">Reset Password</button>
        </form>
        <p style="text-align:center; margin-top:20px;"><a href="login.php">&larr; Back to Login</a></p>
    </div>
</body>
</html>