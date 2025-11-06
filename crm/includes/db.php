<?php

// Database configuration for XAMPP local server
$servername = "localhost";
$username = "root";  // Default username for XAMPP
$password = "";      // Default password is blank in XAMPP
$database = "crm";   // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    // Optional: you can uncomment this line to confirm connection during testing
    // echo "Database connected successfully!";
}
?>
