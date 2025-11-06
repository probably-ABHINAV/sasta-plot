<?php
// This is the main Super Admin dashboard page.
// The security check is handled by the header file, so we just include it.
require_once 'header.php';

// Include necessary files from the main application
require_once '../includes/db.php';
require_once '../includes/functions.php'; // For sanitize_input() and send_email()

$message = '';
$message_type = '';

// --- Processing for Create Admin form ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_admin') {
    // Logic to create a new admin (using Full Name and Email)
    $full_name = sanitize_input($_POST['full_name']);
    $email = filter_var(sanitize_input($_POST['email']), FILTER_VALIDATE_EMAIL);
    $password = $_POST['password'];

    if ($full_name && $email && !empty($password)) {
        if (strlen($password) < 8) {
            $message = "Password must be at least 8 characters long.";
            $message_type = 'error';
        } else {
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $role_id = 1; // Standard Admin role

            try {
                // The Full Name is stored in the 'username' column for display purposes
                $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("sssi", $full_name, $email, $password_hash, $role_id);
                $stmt->execute();
                
                $subject = "Your CRM Admin Account Has Been Created";
                $body = "<h2>Welcome to the CRM</h2>
                         <p>An admin account has been created for you by the Super Admin.</p>
                         <p>Please use your email address to log in:</p>
                         <p><strong>Login Email:</strong> " . htmlspecialchars($email) . "</p>
                         <p><strong>Password:</strong> " . htmlspecialchars($password) . "</p>";
                
                if (send_email($email, $subject, $body)) {
                    $message = "Admin created successfully! Credentials sent to " . htmlspecialchars($email);
                    $message_type = 'success';
                } else {
                    $message = "Admin created, but the credential email could not be sent.";
                    $message_type = 'error';
                }
                $stmt->close();
            } catch (mysqli_sql_exception $e) {
                if ($e->getCode() == 1062) {
                    $message = "Error: An account with that name or email already exists.";
                    $message_type = 'error';
                } else {
                    $message = "A database error occurred: " . $e->getMessage();
                    $message_type = 'error';
                }
            }
        }
    } else {
        $message = "Please provide a valid name, email, and password.";
        $message_type = 'error';
    }
}
?>
<div class="page-header">
    <h2>Super Admin Dashboard</h2>
    <p>Create new administrator accounts for the CRM.</p>
</div>

<?php if(!empty($message)): ?>
    <p class='status-message <?php echo $message_type; ?>'><?php echo $message; ?></p>
<?php endif; ?>

<div class="section-container">
    <h3>Create New Admin</h3>
    <form action="index.php" method="post" class="form-grid" style="grid-template-columns: 1fr 1fr 1fr auto;">
        <input type="hidden" name="action" value="create_admin">
        <input type="text" name="full_name" placeholder="Admin's Full Name" required>
        <input type="email" name="email" placeholder="Admin's Login Email" required>
        <input type="password" name="password" placeholder="Set Admin's Password" required>
        <button type="submit">Create Admin</button>
    </form>
</div>

<div class="section-container">
    <h3>Existing Administrators</h3>
    <table class="responsive-table">
        <thead><tr><th>Full Name</th><th>Login Email</th><th>Phone</th></tr></thead>
        <tbody>
            <?php
            // We only show regular Admins (role_id = 1), not the Super Admin itself.
            $admins_result = $conn->query("SELECT username, email, phone_number FROM users WHERE role_id = 1");
            if ($admins_result->num_rows > 0) {
                while($admin = $admins_result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td data-label='Full Name'>" . htmlspecialchars($admin['username']) . "</td>";
                    echo "<td data-label='Login Email'>" . htmlspecialchars($admin['email']) . "</td>";
                    echo "<td data-label='Phone'>" . htmlspecialchars($admin['phone_number'] ?? 'N/A') . "</td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='3'>No admin accounts found.</td></tr>";
            }
            ?>
        </tbody>
    </table>
</div>

<?php 
// Use the local footer file
require_once 'footer.php'; 
?>