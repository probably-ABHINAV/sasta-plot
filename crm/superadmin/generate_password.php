<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Hash Generator</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 600px; text-align: center; }
        h2 { margin-bottom: 20px; color: #333; }
        .hash-box { background-color: #e9ecef; padding: 15px; border-radius: 5px; font-family: 'Courier New', Courier, monospace; word-wrap: break-word; text-align: left; border: 1px solid #dee2e6; margin-top: 15px; }
    </style>
</head>
<body>

<?php
// ===================================================================
//  1. SET THE NEW PASSWORD YOU WANT TO USE INSIDE THE QUOTES
// ===================================================================

$my_password = 'CRM@12345';

// ===================================================================

// This code will hash the password using the standard, secure method.
$hashed_password = password_hash($my_password, PASSWORD_DEFAULT);
?>

    <div class="container">
        <h2>Password Hash Generator</h2>
        <p>Your new password is: <strong><?php echo htmlspecialchars($my_password); ?></strong></p>
        <p>Copy the entire hash below and paste it into the <code>password_hash</code> column in your database for the desired user.</p>
        <div class="hash-box">
            <?php echo $hashed_password; ?>
        </div>
    </div>

</body>
</html>