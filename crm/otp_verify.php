<?php
require_once 'includes/functions.php';

if (!isset($_SESSION['temp_user_id'])) {
    header('Location: login.php');
    exit();
}

$stmt_expiry = $conn->prepare("SELECT otp_expiry FROM users WHERE user_id = ?");
$stmt_expiry->bind_param("i", $_SESSION['temp_user_id']);
$stmt_expiry->execute();
$result = $stmt_expiry->get_result();
$user_data = $result->fetch_assoc();
$stmt_expiry->close();
$otp_expiry_timestamp = $user_data ? strtotime($user_data['otp_expiry']) : 0;

$resend_message = '';
if (isset($_SESSION['resend_status'])) {
    if ($_SESSION['resend_status'] === 'success') {
        $resend_message = '<p class="resend-success">A new OTP has been sent to your email.</p>';
    }
    unset($_SESSION['resend_status']);
}

$error_message = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['verify_otp'])) {
    $submitted_otp = sanitize_input($_POST['otp']);
    $user_id = $_SESSION['temp_user_id'];
    $stmt = $conn->prepare("SELECT username, role_id, otp, otp_expiry FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($user && $user['otp'] == $submitted_otp && new DateTime() < new DateTime($user['otp_expiry'])) {
        $clear_otp_stmt = $conn->prepare("UPDATE users SET otp = NULL, otp_expiry = NULL WHERE user_id = ?");
        $clear_otp_stmt->bind_param("i", $user_id);
        $clear_otp_stmt->execute();
        $clear_otp_stmt->close();
        
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $user['username'];
        $_SESSION['role_id'] = $user['role_id'];
        $_SESSION['session_id'] = $_SESSION['temp_session_id'];
        
        if (isset($_SESSION['remember_me']) && $_SESSION['remember_me'] === true) {
            $selector = bin2hex(random_bytes(16));
            $validator = bin2hex(random_bytes(32));
            $validator_hash = hash('sha256', $validator);
            $expires = date('Y-m-d H:i:s', time() + (86400 * 30));
            
            $token_stmt = $conn->prepare("INSERT INTO persistent_logins (user_id, selector, validator_hash, expires) VALUES (?, ?, ?, ?)");
            $token_stmt->bind_param("isss", $user_id, $selector, $validator_hash, $expires);
            $token_stmt->execute();
            $token_stmt->close();
            
            setcookie('remember_me_selector', $selector, time() + (86400 * 30), '/', '', false, true);
            setcookie('remember_me_validator', $validator, time() + (86400 * 30), '/', '', false, true);
        }
        
        unset($_SESSION['temp_user_id']);
        unset($_SESSION['temp_session_id']);
        unset($_SESSION['remember_me']);
       
        // ===== START OF KEY CHANGE: ADDED SUPER ADMIN REDIRECTION =====
        if ($user['role_id'] == 4) {         // If user is Super Admin
            header("Location: superadmin/index.php");
        } elseif ($user['role_id'] == 1) {   // If user is Admin
            header("Location: admin/");
        } elseif ($user['role_id'] == 2) {   // If user is Sales Agent
            header("Location: sales_agent/");
        } elseif ($user['role_id'] == 3) {   // If user is Site Visit Agent
            header("Location: site_visit_agent/");
        }
        // ===== END OF KEY CHANGE =====
        exit();
    } else {
        $error_message = "Invalid or expired OTP. Please try again.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify OTP</title>
    <!-- (Styles are unchanged) -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        body { font-family: 'Poppins', sans-serif; margin: 0; background: linear-gradient(120deg, #005f73, #0a9396); display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .login-card { background-color: #ffffff; padding: 40px 30px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); width: 90%; max-width: 400px; box-sizing: border-box; text-align: center; }
        .login-card h2 { margin: 0 0 10px 0; color: #003d47; }
        .login-card p { margin: 0 0 25px 0; color: #666; font-size: 0.9em; }
        input[type="text"] { width: 100%; padding: 12px 15px; border: 1px solid #ccc; border-radius: 5px; font-size: 1em; font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: linear-gradient(120deg, #0a9396, #005f73); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em; font-weight: 500; margin-top: 20px; }
        .error-message { color: #c62828; font-size: 0.9em; margin-top: 15px; }
        #timer { font-weight: bold; color: #005f73; font-size: 1.2em; margin-bottom: 20px; }
        #resend-link { display: none; margin-top: 15px; font-size: 0.9em; }
        .resend-success { color: green; font-weight: bold; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="login-card">
        <h2>Two-Factor Authentication</h2>
        <p>An OTP has been sent to your email. Please enter it below.</p>
        <?php echo $resend_message; ?>

        <div id="timer">02:00</div>
        
        <form action="otp_verify.php" method="post">
            <input type="text" name="otp" placeholder="Enter 6-Digit OTP" required pattern="\d{6}">
            <button type="submit" name="verify_otp">Verify & Login</button>
        </form>
        
        <a href="resend_otp.php" id="resend-link">Didn't receive code? Resend OTP</a>
        
        <?php if(!empty($error_message)): ?>
            <p class="error-message"><?php echo $error_message; ?></p>
        <?php endif; ?>
    </div>

    <script>
        const timerElement = document.getElementById('timer');
        const resendLink = document.getElementById('resend-link');
        const expiryTimestamp = <?php echo $otp_expiry_timestamp * 1000; ?>;
        function updateTimer() {
            const now = new Date().getTime();
            const distance = expiryTimestamp - now;
            if (distance < 0) {
                clearInterval(timerInterval);
                timerElement.innerHTML = "OTP Expired";
                resendLink.style.display = 'block';
                return;
            }
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const displayMinutes = String(minutes).padStart(2, '0');
            const displaySeconds = String(seconds).padStart(2, '0');
            timerElement.innerHTML = displayMinutes + ":" + displaySeconds;
        }
        const timerInterval = setInterval(updateTimer, 1000);
    </script>
</body>
</html>