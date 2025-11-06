<?php
require 'partials/header.php';

$message = '';
// Check if a user ID is provided in the URL
if (!isset($_GET['user_id'])) {
    header("Location: manage_users.php");
    exit();
}
$user_id_to_edit = (int)$_GET['user_id'];

// --- PROCESS FORM SUBMISSION ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize inputs
    $username = sanitize_input($_POST['username']);
    $email = sanitize_input($_POST['email']);
    $role_id = (int)$_POST['role_id'];
    $password = $_POST['password']; // Get the password field

    
    
    
   if (!empty($password)) {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, role_id = ?, password_hash = ? WHERE user_id = ?");
        $stmt->bind_param("ssisi", $username, $email, $role_id, $password_hash, $user_id_to_edit);
        
        // --- START: NEW SECURITY LOGOUT ---
        if ($stmt->execute()) {
            // Also delete any persistent login tokens for this user
            $del_token_stmt = $conn->prepare("DELETE FROM persistent_logins WHERE user_id = ?");
            $del_token_stmt->bind_param("i", $user_id_to_edit);
            $del_token_stmt->execute();
            $del_token_stmt->close();
            
            // Also force logout from any active sessions
            $logout_stmt = $conn->prepare("UPDATE user_sessions SET is_active = FALSE, logout_time = NOW() WHERE user_id = ? AND is_active = TRUE");
            $logout_stmt->bind_param("i", $user_id_to_edit);
            $logout_stmt->execute();
            $logout_stmt->close();
        }
        // --- END: NEW SECURITY LOGOUT ---
    } else {
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, role_id = ? WHERE user_id = ?");
        $stmt->bind_param("ssii", $username, $email, $role_id, $user_id_to_edit);
    }




    if ($stmt->execute()) {
        $message = "<p style='color:green;'>User details updated successfully.</p>";
    } else {
        $message = "<p style='color:red;'>Error: Could not update user. The username or email might already be taken.</p>";
    }
    $stmt->close();
}

// --- FETCH CURRENT USER DATA TO PRE-FILL THE FORM ---
$stmt = $conn->prepare("SELECT username, email, role_id FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id_to_edit);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    // If no user found with that ID, redirect
    header("Location: manage_users.php");
    exit();
}
$user = $result->fetch_assoc();
$stmt->close();

?>

<h3>Edit User: <?php echo htmlspecialchars($user['username']); ?></h3>
<p><a href="manage_users.php">&larr; Back to User List</a></p>

<?php if (!empty($message)) echo $message; ?>

<form action="edit_user.php?user_id=<?php echo $user_id_to_edit; ?>" method="post">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($user['username']); ?>" required>

    <label for="email">Email Address:</label>
    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>

    <label for="role_id">Role:</label>
    <select id="role_id" name="role_id" required>
        <!-- Pre-select the user's current role -->
        <option value="2" <?php if ($user['role_id'] == 2) echo 'selected'; ?>>Sales Agent</option>
        <option value="3" <?php if ($user['role_id'] == 3) echo 'selected'; ?>>Site Visit Agent</option>
    </select>

    <label for="password">New Password:</label>
    <input type="password" id="password" name="password" placeholder="Leave blank to keep current password">
    
    <button type="submit">Update User</button>
</form>

<?php require 'partials/footer.php'; ?>