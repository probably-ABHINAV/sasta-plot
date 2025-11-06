<?php
require 'partials/header.php';
enforce_security(1); // Admin Only

// Get the ID of the currently logged-in admin
$admin_id = $_SESSION['user_id'];
?>
<!-- Styles for the Agent Dashboard -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
    body { font-family: 'Poppins', sans-serif; }
    .page-header h2 { font-size: 1.8em; color: #003d47; }
    .page-header p { margin-top: 5px; color: #6c757d; }
    .agent-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 25px;
        margin-top: 20px;
    }
    .agent-card {
        display: block;
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        padding: 20px;
    }
    .agent-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    .agent-card-header { display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
    .agent-card-header svg { width: 40px; height: 40px; fill: #005f73; }
    .agent-name { font-size: 1.3em; font-weight: 600; color: #005f73; margin: 0; }
    .agent-role { font-size: 0.9em; font-weight: 500; color: #fff; padding: 3px 10px; border-radius: 12px; }
    .role-sales { background-color: #2a9d8f; }
    .role-site-visit { background-color: #fca311; }
    .agent-contact { font-size: 0.9em; color: #555; }
</style>

<div class="page-header">
    <h2>Agent Performance Monitoring</h2>
    <p>Click on an agent to view their current pending tasks and performance.</p>
</div>

<div class="agent-grid">
    <?php
    // ***** MODIFICATION: ADDED "WHERE owned_by_admin_id = ?" TO THE QUERY *****
    $sql_agents = "SELECT user_id, username, email, phone_number, role_id 
                   FROM users 
                   WHERE role_id IN (2, 3) AND owned_by_admin_id = ?
                   ORDER BY role_id, username ASC";
    $stmt_agents = $conn->prepare($sql_agents);
    $stmt_agents->bind_param("i", $admin_id);
    $stmt_agents->execute();
    $result_agents = $stmt_agents->get_result();

    if ($result_agents->num_rows > 0) {
        while($agent = $result_agents->fetch_assoc()) {
    ?>
    <a href="agent_performance.php?user_id=<?php echo $agent['user_id']; ?>" class="agent-card">
        <div class="agent-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
            <div>
                <h3 class="agent-name"><?php echo htmlspecialchars($agent['username']); ?></h3>
                <?php if ($agent['role_id'] == 2): ?>
                    <span class="agent-role role-sales">Sales Agent</span>
                <?php else: ?>
                    <span class="agent-role role-site-visit">Site Visit Agent</span>
                <?php endif; ?>
            </div>
        </div>
        <div class="agent-contact">
            <p style="margin:0 0 5px 0;"><strong>Email:</strong> <?php echo htmlspecialchars($agent['email']); ?></p>
            <p style="margin:0;"><strong>Phone:</strong> <?php echo htmlspecialchars($agent['phone_number']); ?></p>
        </div>
    </a>
    <?php
        }
    } else {
        echo "<p>No Sales or Site Visit agents found for your account.</p>";
    }
    $stmt_agents->close();
    ?>
</div>

<?php require 'partials/footer.php'; ?>