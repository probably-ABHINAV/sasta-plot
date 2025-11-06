<?php
// STEP 1: All PHP logic runs before any HTML
require_once '../includes/functions.php';
enforce_security(2);

if (!isset($_GET['lead_id']) || !filter_var($_GET['lead_id'], FILTER_VALIDATE_INT)) {
    header("Location: index.php");
    exit();
}
$lead_id = (int)$_GET['lead_id'];
$sales_agent_id = $_SESSION['user_id'];
$status_message = '';

// This is the important check that was causing the "broken" feeling.
// It correctly redirects if the lead is already a customer.
$booking_check_stmt = $conn->prepare("SELECT booking_id FROM bookings WHERE lead_id = ? LIMIT 1");
$booking_check_stmt->bind_param("i", $lead_id);
$booking_check_stmt->execute();
$booking_result = $booking_check_stmt->get_result();
if ($booking_result->num_rows > 0) {
    $booking_id = $booking_result->fetch_assoc()['booking_id'];
    $booking_check_stmt->close();
    header("Location: manage_customer.php?booking_id=" . $booking_id);
    exit();
}
$booking_check_stmt->close();

// --- FORM PROCESSING LOGIC ---
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'add_follow_up') {
        $follow_up_date = sanitize_input($_POST['follow_up_date']);
        $notes = sanitize_input($_POST['notes']);
        $interest_level = sanitize_input($_POST['interest_level']);
        $follow_up_date_for_db = !empty($follow_up_date) ? $follow_up_date : null;
        
        $should_archive = false;
        if ($interest_level === 'Not Interested') {
            $prev_update_q = $conn->prepare("SELECT interest_level FROM lead_updates WHERE lead_id = ? ORDER BY update_timestamp DESC LIMIT 1");
            $prev_update_q->bind_param("i", $lead_id);
            $prev_update_q->execute();
            $prev_update_result = $prev_update_q->get_result()->fetch_assoc();
            if ($prev_update_result && $prev_update_result['interest_level'] === 'Not Interested') {
                $should_archive = true;
            }
            $prev_update_q->close();
        }
        
        $stmt = $conn->prepare("INSERT INTO lead_updates (lead_id, sales_agent_id, follow_up_date, notes, interest_level) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisss", $lead_id, $sales_agent_id, $follow_up_date_for_db, $notes, $interest_level);
        if ($stmt->execute()) {
            if ($should_archive) {
                $archive_stmt = $conn->prepare("UPDATE leads SET status = 'Not Interested' WHERE lead_id = ?");
                $archive_stmt->bind_param("i", $lead_id);
                $archive_stmt->execute();
                $archive_stmt->close();
                header("Location: index.php?status=archived");
                exit();
            } else {
                $status_message = 'success_followup';
            }
        }
        $stmt->close();
    }
    elseif ($action === 'schedule_visit') {
        $visit_agent_id = (int)$_POST['site_visit_agent_id'];
        $visit_datetime = sanitize_input($_POST['visit_date_time']);
        
        $stmt = $conn->prepare("INSERT INTO site_visits (lead_id, sales_agent_id, site_visit_agent_id, visit_date_time) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiis", $lead_id, $sales_agent_id, $visit_agent_id, $visit_datetime);
        
        if ($stmt->execute()) {
            $stmt->close();
            header("Location: active_visits.php?status=scheduled");
            exit();
        } else {
            $stmt->close();
            $status_message = 'error_visit';
        }
    }
}

// --- MARK NOTIFICATION FLAG AS 'READ' ---
$clear_flag_query = "UPDATE leads l JOIN lead_assignments la ON l.lead_id = la.lead_id SET l.has_unread_update = FALSE WHERE l.lead_id = ? AND la.sales_agent_id = ?";
$stmt_clear = $conn->prepare($clear_flag_query);
$stmt_clear->bind_param("ii", $lead_id, $sales_agent_id);
$stmt_clear->execute();
$stmt_clear->close();

// STEP 2: Fetch data for displaying the page.
$stmt_lead = $conn->prepare("SELECT * FROM leads WHERE lead_id = ?");
$stmt_lead->bind_param("i", $lead_id);
$stmt_lead->execute();
$lead = $stmt_lead->get_result()->fetch_assoc();
$stmt_lead->close();

if (!$lead) {
    header("Location: index.php");
    exit();
}

$updates_result = $conn->query("SELECT * FROM lead_updates WHERE lead_id = $lead_id ORDER BY update_timestamp DESC");
$visits_result = $conn->query("SELECT sv.*, u.username as site_visit_agent_name 
                               FROM site_visits sv 
                               JOIN users u ON sv.site_visit_agent_id = u.user_id 
                               WHERE sv.lead_id = $lead_id ORDER BY sv.visit_date_time DESC");

// STEP 3: Finally, include the header and start HTML output.
require 'partials/header.php'; 
?>
<style>
    .lead-header { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
    .lead-header h2 { margin-top: 0; color: #005f73; }
    .lead-header p { margin: 5px 0; font-size: 1.1em; }
    .section-title { border-bottom: 2px solid #0a9d8f; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.5em; color: #333; }
    .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .status-message { text-align:center; background-color: #e8f5e9; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #c3e6cb;}
    .archive-message { background-color: #fff3cd; color: #856404; border-color: #ffeeba; }
    .visit-image { max-width: 150px; border-radius: 5px; margin-top: 10px; display: block; }
    @media (max-width: 900px) { .grid-container { grid-template-columns: 1fr; } }
</style>

<?php
if (!empty($status_message)) {
    if ($status_message === 'success_followup') { echo "<p class='status-message'>New follow-up recorded successfully!</p>"; }
    if ($status_message === 'success_visit') { echo "<p class='status-message'>New site visit scheduled successfully!</p>"; }
    if ($status_message === 'error_visit') { echo "<p class='status-message' style='background-color:#f8d7da; color:#721c24;'>Error scheduling visit.</p>"; }
}
?>

<div class="lead-header">
    <h2><?php echo htmlspecialchars($lead['client_name']); ?></h2>
    <p><strong>Email:</strong> <?php echo htmlspecialchars($lead['client_email']); ?></p>
    <p><strong>Phone:</strong> <?php echo htmlspecialchars($lead['client_phone']); ?></p>
    <p><strong>Location:</strong> <?php echo htmlspecialchars($lead['location']); ?></p>
    <p><strong>Interested In:</strong> <?php echo htmlspecialchars($lead['interested_in']); ?></p>
</div>

<div class="grid-container">
    <div class="forms-section">
        <h4 class="section-title">Take Action</h4>
        <form action="" method="post">
            <input type="hidden" name="action" value="add_follow_up">
            <label for="follow_up_date">Follow-Up Date:</label>
            <input type="date" name="follow_up_date">
            <label for="notes">Notes:</label>
            <textarea name="notes" rows="4" placeholder="Discussion details, client feedback..." required></textarea>
            <label for="interest_level">Interest Level:</label>
            <select name="interest_level" required>
                <option value="High">High</option>
                <option value="Medium" selected>Medium</option>
                <option value="Low">Low</option>
                <option value="Not Interested">Not Interested</option>
            </select>
            <button type="submit">Add Follow-Up</button>
        </form>
        <hr style="margin: 40px 0;">
        
        <h4 class="section-title">Schedule Site Visit</h4>
        <form action="" method="post">
            <input type="hidden" name="action" value="schedule_visit">
            <input type="hidden" name="site_visit_agent_id" value="<?php echo $_SESSION['user_id']; ?>">
            <label for="visit_date_time">Date & Time of Visit:</label>
            <input type="datetime-local" name="visit_date_time" required>
            <button type="submit">Schedule Visit</button>
        </form>
    </div>
    
    <div class="history-section">
        <h4 class="section-title">Interaction History</h4>
        <div class="history-table-wrapper">
            <table>
                <thead> <tr> <th>#</th> <th>Date</th> <th>Notes</th> <th>Interest</th> </tr> </thead>
                <tbody>
                <?php
                if ($updates_result->num_rows > 0) {
                    $follow_up_count = $updates_result->num_rows;
                    while($update = $updates_result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td><strong>" . $follow_up_count-- . "</strong></td>";
                        echo "<td>" . ($update['follow_up_date'] ? date("d M, Y", strtotime($update['follow_up_date'])) : 'N/A') . "</td>";
                        echo "<td>" . nl2br(htmlspecialchars($update['notes'])) . "</td>";
                        echo "<td>" . htmlspecialchars($update['interest_level']) . "</td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='4'>No follow-up history found.</td></tr>";
                }
                ?>
                </tbody>
            </table>
        </div>

        <h4 class="section-title" style="margin-top: 40px;">Site Visit History</h4>
        <div class="history-table-wrapper">
            <table>
                <thead> <tr> <th>Visit Details</th> <th>Proof / Action</th> </tr> </thead>
                <tbody>
                <?php
                if ($visits_result->num_rows > 0) {
                    while($visit = $visits_result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . date("d M, Y - h:i A", strtotime($visit['visit_date_time'])) . "<br><small>Agent: " . htmlspecialchars($visit['site_visit_agent_name']) . "</small><br><strong>Status: " . htmlspecialchars($visit['status']) . "</strong></td>";
                        echo "<td>";
                        if ($visit['image_filename']) {
                            echo "<a href='../uploads/" . htmlspecialchars($visit['image_filename']) . "' target='_blank'><img src='../uploads/" . htmlspecialchars($visit['image_filename']) . "' alt='Visit Proof' class='visit-image'></a>";
                        }
                        
                        $booking_info_q = $conn->query("SELECT booking_id FROM bookings WHERE lead_id = " . $lead['lead_id']);
                        $booking_info = $booking_info_q->fetch_assoc();
                        $is_booked = $booking_info_q->num_rows > 0;

                        if ($visit['status'] === 'Completed') {
                            if ($is_booked) {
                                echo "<div style='margin-top:10px; text-align:center;'>
                                        <p style='font-weight:bold; color: #1A5D1A;'>This lead is already a customer!</p>
                                        <a href='manage_customer.php?booking_id=" . $booking_info['booking_id'] . "' class='btn-action btn-manage'>View in Customers</a>
                                      </div>";
                            } else {
                                echo "<div style='margin-top:10px; text-align:center;'>
                                        <p style='font-weight:bold;'>Site Visit Completed!</p>
                                        <a href='create_booking.php?lead_id=" . $lead['lead_id'] . "' class='btn-convert'>
                                            Convert to Customer
                                        </a>
                                      </div>";
                            }
                        }
                        echo "</td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='2'>No site visits scheduled.</td></tr>";
                }
                ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require 'partials/footer.php'; ?>