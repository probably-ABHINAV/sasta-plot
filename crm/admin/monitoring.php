<?php 
require 'partials/header.php';
enforce_security(1);

$admin_id = $_SESSION['user_id'];
$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'delete_session') {
    $session_id_to_delete = (int)$_POST['session_id'];
    if ($session_id_to_delete == $_SESSION['session_id']) {
        $message = "<p style='color:orange;'>You cannot delete your own active session record.</p>";
    } else {
        $stmt = $conn->prepare("DELETE FROM user_sessions WHERE session_id = ?");
        $stmt->bind_param("i", $session_id_to_delete);
        if ($stmt->execute()) { $message = "<p style='color:green;'>Session record deleted successfully.</p>"; }
        $stmt->close();
    }
}
?>
<style>
    .device-info { font-size: 0.9em; color: #333; font-weight: 500; }
    .raw-ua { font-size: 0.75em; color: #888; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
    .action-btn{display:inline-block;padding:5px 10px;border-radius:4px;text-decoration:none;color:white;border:none;cursor:pointer;font-size:0.9em;}
    .action-btn.logout{background-color:#e76f51;}
    .action-btn.delete{background-color:#dc3545;}
</style>

<?php if (!empty($message)) echo $message; ?>
<h3>Currently Active Agents (Your Team)</h3>
<table class="responsive-table">
    <thead><tr><th>Username</th><th>Role</th><th>Login Time</th><th>Device Information</th><th>Actions</th></tr></thead>
    <tbody>
        <?php
        $sql_active = "SELECT u.username, r.role_name, s.login_time, s.user_agent, s.session_id, u.user_id 
                       FROM user_sessions s 
                       JOIN users u ON s.user_id = u.user_id 
                       JOIN roles r ON u.role_id = r.role_id 
                       WHERE s.is_active = TRUE AND u.owned_by_admin_id = ?
                       ORDER BY s.login_time DESC";
        $stmt_active = $conn->prepare($sql_active);
        $stmt_active->bind_param("i", $admin_id);
        $stmt_active->execute();
        $result_active = $stmt_active->get_result();

        if ($result_active->num_rows > 0) {
            while($row = $result_active->fetch_assoc()) {
                $clean_device_name = parse_user_agent($row['user_agent']);
                echo "<tr>";
                echo "<td data-label='Username'>" . htmlspecialchars($row['username']) . "</td>";
                echo "<td data-label='Role'>" . htmlspecialchars($row['role_name']) . "</td>";
                echo "<td data-label='Login Time'>" . $row['login_time'] . "</td>";
                echo "<td data-label='Device'><div class='device-info'>" . htmlspecialchars($clean_device_name) . "</div><div class='raw-ua' title='".htmlspecialchars($row['user_agent'])."'>" . htmlspecialchars($row['user_agent']) . "</div></td>";
                echo "<td data-label='Actions'><div class='actions-container'>";
                if ($row['user_id'] != $_SESSION['user_id']) {
                    echo "<a href='force_logout.php?session_id=".$row['session_id']."' onclick='return confirm(\"Force this user to log out?\")' class='action-btn logout'>Force Logout</a>";
                }
                echo "<form method='post' action='monitoring.php' onsubmit='return confirm(\"Delete this session record?\");' style='margin:0;'><input type='hidden' name='session_id' value='".$row['session_id']."'><input type='hidden' name='action' value='delete_session'><button type='submit' class='action-btn delete'>Delete</button></form>";
                echo "</div></td></tr>";
            }
        } else { echo "<tr><td colspan='5'>No agents from your team are currently logged in.</td></tr>"; }
        $stmt_active->close();
        ?>
    </tbody>
</table>
<hr>
<h3>Recent Activity (Your Team, Last 24 Hours)</h3>
<table class="responsive-table">
    <thead><tr><th>Username</th><th>Action</th><th>Time</th><th>Device Information</th></tr></thead>
    <tbody>
        <?php
        $sql_log = "SELECT u.username, s.login_time, s.logout_time, s.user_agent, s.is_active 
                    FROM user_sessions s 
                    JOIN users u ON s.user_id = u.user_id
                    WHERE s.login_time >= NOW() - INTERVAL 24 HOUR AND u.owned_by_admin_id = ?
                    ORDER BY s.login_time DESC";
        $stmt_log = $conn->prepare($sql_log);
        $stmt_log->bind_param("i", $admin_id);
        $stmt_log->execute();
        $result_log = $stmt_log->get_result();

        if ($result_log->num_rows > 0) {
            while($row = $result_log->fetch_assoc()) {
                $clean_device_name = parse_user_agent($row['user_agent']);
                echo "<tr>";
                echo "<td data-label='Username'>" . htmlspecialchars($row['username']) . "</td>";
                if ($row['is_active']) {
                    echo "<td data-label='Action'><span style='color:green; font-weight:bold;'>Logged In</span></td>";
                    echo "<td data-label='Time'>" . $row['login_time'] . "</td>";
                } else {
                    echo "<td data-label='Action'><span style='color:red;'>Logged Out</span></td>";
                    echo "<td data-label='Time'>" . ($row['logout_time'] ?? 'N/A') . "</td>";
                }
                echo "<td data-label='Device'><div class='device-info'>" . htmlspecialchars($clean_device_name) . "</div><div class='raw-ua' title='".htmlspecialchars($row['user_agent'])."'>" . htmlspecialchars($row['user_agent']) . "</div></td>";
                echo "</tr>";
            }
        } else { echo "<tr><td colspan='4'>No activity from your team in the last 24 hours.</td></tr>"; }
        $stmt_log->close();
        ?>
    </tbody>
</table>
<?php require 'partials/footer.php'; ?>