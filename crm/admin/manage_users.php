<?php 
require 'partials/header.php'; 
enforce_security(1); // Admin Only

$message = '';
$admin_id = $_SESSION['user_id']; // Get current admin's ID

// --- ACTION PROCESSING (CREATE, TOGGLE DISABLE) ---
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {

    if ($_POST['action'] == 'create_user') {
        $username = sanitize_input($_POST['username']);
        $email = sanitize_input($_POST['email']);
        $phone = sanitize_input($_POST['phone_number']);
        $password = $_POST['password'];
        $role_id = 2; // **MODIFICATION: Role is now hardcoded to 2 (Sales Agent)**
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        try {
            $stmt = $conn->prepare("INSERT INTO users (username, email, phone_number, password_hash, role_id, owned_by_admin_id) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssii", $username, $email, $phone, $password_hash, $role_id, $admin_id);
            $stmt->execute();
            $message = "<p style='color:green;'>Agent created successfully!</p>";
        } catch (mysqli_sql_exception $exception) {
            if ($exception->getCode() == 1062) {
                $message = "<p style='color:red;'>Error: This email address or username is already in use.</p>";
            } else {
                $message = "<p style='color:red;'>A database error occurred. Please try again.</p>";
            }
        }
        if (isset($stmt)) { $stmt->close(); }
    }

    elseif ($_POST['action'] == 'toggle_disable' && isset($_POST['user_id'], $_POST['current_status'])) {
        $user_id = (int)$_POST['user_id'];
        $new_status = (int)$_POST['current_status'] == 0 ? 1 : 0;

        $check_owner = $conn->prepare("SELECT user_id FROM users WHERE user_id = ? AND owned_by_admin_id = ?");
        $check_owner->bind_param("ii", $user_id, $admin_id);
        $check_owner->execute();
        if ($check_owner->get_result()->num_rows === 1) {
            $stmt = $conn->prepare("UPDATE users SET is_disabled = ? WHERE user_id = ?");
            $stmt->bind_param("ii", $new_status, $user_id);
            $stmt->execute();
            $stmt->close();
            $message = "<p style='color:green;'>Agent status updated successfully.</p>";
        }
        $check_owner->close();
    }
}
?>

<h3>Your Agents</h3>
<p>This page lists all the Agents you have created. They can manage both sales and site visits.</p>
<?php if (!empty($message)) echo $message; ?>
<table class="responsive-table">
    <thead>
        <tr><th>Username</th><th>Contact</th><th>Role</th><th>Status</th><th>Actions</th></tr>
    </thead>
    <tbody>
        <?php
        $sql = "SELECT u.user_id, u.username, u.email, u.phone_number, u.is_disabled, r.role_name 
                FROM users u 
                JOIN roles r ON u.role_id = r.role_id 
                WHERE u.owned_by_admin_id = ? AND u.role_id = 2
                ORDER BY u.username ASC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $admin_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td data-label='Username'>" . htmlspecialchars($row['username']) . "</td>";
                echo "<td data-label='Contact'>" . htmlspecialchars($row['email']) . "<br><small>" . htmlspecialchars($row['phone_number']) . "</small></td>";
                echo "<td data-label='Role'>" . htmlspecialchars($row['role_name']) . "</td>";
                echo "<td data-label='Status'>" . ($row['is_disabled'] ? '<span style="color:red;">Disabled</span>' : '<span style="color:green;">Active</span>') . "</td>";
                echo "<td data-label='Actions'><div style='display:flex; gap:10px; flex-wrap: wrap;'>";
                echo "<a href='edit_user.php?user_id=" . $row['user_id'] . "' style='text-decoration:none; background-color:#0a9396; color:white; padding: 5px 10px; border-radius:4px;'>Edit</a>";
                echo "<form method='post' action='manage_users.php' style='margin:0;'>
                        <input type='hidden' name='action' value='toggle_disable'>
                        <input type='hidden' name='user_id' value='".$row['user_id']."'>
                        <input type='hidden' name='current_status' value='".$row['is_disabled']."'>";
                if ($row['is_disabled']) {
                    echo "<button type='submit' style='background-color:#2a9d8f; border:none; color:white; padding:5px 10px; border-radius:4px; cursor:pointer;'>Enable</button>";
                } else {
                    echo "<button type='submit' style='background-color:#fca311; border:none; color:white; padding:5px 10px; border-radius:4px; cursor:pointer;'>Disable</button>";
                }
                echo "</form></td></tr>";
            }
        } else {
            echo "<tr><td colspan='5'>You have not created any agents yet.</td></tr>";
        }
        $stmt->close();
        ?>
    </tbody>
</table>

<hr>
<h3>Add New Agent</h3>
<form action="manage_users.php" method="post">
    <input type="hidden" name="action" value="create_user">
    <input type="text" name="username" placeholder="Agent's Full Name" required>
    <input type="email" name="email" placeholder="Agent's Login Email" required>
    <input type="text" name="phone_number" placeholder="Phone Number (Optional)">
    <input type="password" name="password" placeholder="Temporary Password" required>
    <!-- The role selection dropdown has been removed -->
    <button type="submit">Add Agent</button>
</form>

<?php require 'partials/footer.php'; ?>