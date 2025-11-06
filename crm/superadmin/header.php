<?php
// Use the main application's conditional session start.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// ===== NEW, UNIFIED SECURITY CHECK =====
// Check for a valid user ID and ensure the role_id is 4 (Super Admin)
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role_id']) || $_SESSION['role_id'] != 4) {
    // If check fails, redirect to the main login page, not the old superadmin one.
    header('Location: ../login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin Panel</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        body { font-family: 'Poppins', sans-serif; }
        header { background-color: #d90429; }
        .container { max-width: 900px; }
        .section-container { background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.07); }
        .section-container h3 { margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 15px; }
        .status-message { padding: 12px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
        .status-message.success { background-color: #d4edda; color: #155724; }
        .status-message.error { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <header>
        <h1>Super Admin Control Panel</h1>
        <!-- THIS NOW POINTS TO THE MAIN LOGOUT SCRIPT -->
        <a href="../logout.php">Logout</a>
    </header>
    <div class="container">