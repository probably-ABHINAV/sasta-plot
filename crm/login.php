<?php
// This single file now handles all login logic.
require_once 'includes/functions.php';

$error_message = '';

// --- 1. "REMEMBER ME" COOKIE CHECK (Runs before anything else) ---
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
        
        $user_stmt = $conn->prepare("SELECT user_id, username, email, role_id FROM users WHERE user_id = ?");
        $user_stmt->bind_param("i", $user_id);
        $user_stmt->execute();
        $user = $user_stmt->get_result()->fetch_assoc();
        $user_stmt->close();
        
        // Finalize the session
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $user['username'];
        $_SESSION['role_id'] = $user['role_id'];
        
        // Log the new session
        $log_stmt = $conn->prepare("INSERT INTO user_sessions (user_id, user_agent) VALUES (?, ?)");
        $log_stmt->bind_param("is", $user_id, $_SERVER['HTTP_USER_AGENT']);
        $log_stmt->execute();
        $_SESSION['session_id'] = $log_stmt->insert_id;
        $log_stmt->close();
        
        // Redirect to the correct dashboard
        if ($user['role_id'] == 4) { header("Location: superadmin/"); }
        elseif ($user['role_id'] == 1) { header("Location: admin/"); }
        elseif ($user['role_id'] == 2) { header("Location: sales_agent/"); }
        elseif ($user['role_id'] == 3) { header("Location: site_visit_agent/"); }
        exit();
    }
}

// --- 2. FORM SUBMISSION PROCESSING ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // --- THIS IS THE CORRECTED LOGIC ---
    $email = sanitize_input($_POST['email']);
    $password = $_POST['password'];

    // Query the database using the email address
    $stmt = $conn->prepare("SELECT user_id, username, email, password_hash, role_id, is_disabled FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    // --- END OF CORRECTION ---

    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($user && !$user['is_disabled'] && password_verify($password, $user['password_hash'])) {
        // User authenticated, now start the OTP process
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
        $_SESSION['remember_me'] = isset($_POST['remember_me']) && $_POST['remember_me'] == '1';
        
        header("Location: otp_verify.php");
        exit();
    }
    
    // If authentication failed, set the error message
    $error_message = "Invalid email or password.";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRM Login</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        body { font-family: 'Poppins', sans-serif; margin: 0; background: linear-gradient(120deg, #005f73, #0a9396); display: flex; justify-content: center; align-items: center; min-height: 100vh; overflow: hidden; }
        .login-card { background-color: #ffffff; padding: 25px 20px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); width: 90%; max-width: 400px; box-sizing: border-box; text-align: center; }
        .login-card h2 { margin: 0 0 10px 0; color: #003d47; }
        .login-card p { margin: 0 0 25px 0; color: #666; font-size: 0.9em; }
        .input-group { margin-bottom: 20px; position: relative; }
        input[type="email"], input[type="password"] { width: 100%; padding: 12px 15px; border: 1px solid #ccc; border-radius: 5px; font-size: 1em; font-family: 'Poppins', sans-serif; box-sizing: border-box; transition: border-color 0.3s; }
        input[type="email"]:focus, input[type="password"]:focus { outline: none; border-color: #0a9396; }
        .toggle-password { position: absolute; top: 50%; right: 15px; transform: translateY(-50%); cursor: pointer; color: #888; user-select: none; }
        button { width: 100%; padding: 12px; background: linear-gradient(120deg, #0a9396, #005f73); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em; font-weight: 500; font-family: 'Poppins', sans-serif; transition: transform 0.2s; }
        button:hover { transform: scale(1.02); }
        .error-message { background-color: #ffebee; color: #c62828; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-size: 0.9em; border: 1px solid #c62828; }
        @media (min-width: 500px) { .login-card { padding: 40px 30px; } }
    </style>
</head>
<body>
    <div class="login-card">
        <h2>Real Estate CRM</h2>
        <p>Please sign in to continue</p>
        
        <?php 
        // Display the error message if one was set during form processing
        if (!empty($error_message)) {
            echo '<div class="error-message">' . $error_message . '</div>';
        } 
        ?>

        <form action="login.php" method="post">
            <div class="input-group">
                <input type="email" name="email" placeholder="Email Address" required>
            </div>
            
            <div class="input-group">
                <input type="password" name="password" id="password" placeholder="Password" required>
                <span class="toggle-password" id="togglePassword">👁️</span>
            </div>
            
            <button type="submit">Login</button>

            <div style="margin-top: 15px; text-align: left;">
                <input type="checkbox" id="remember_me" name="remember_me" value="1">
                <label for="remember_me" style="color: #555; font-size: 0.9em;">Remember me on this browser</label>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <a href="forgot_password.php" style="color: #005f73; font-size: 0.9em; text-decoration: none;">Forgot Password?</a>
            </div>
        </form>
    </div>

    <script>
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });
    </script>
</body>
</html>