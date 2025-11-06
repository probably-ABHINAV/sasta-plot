<?php
// STEP 1: Include core functions and run security checks FIRST.
require_once '../includes/functions.php';
enforce_security(2); // Unified Agent Role

$agent_id = $_SESSION['user_id'];
$message = '';

// STEP 2: MOVED - All form processing logic is now at the top, before any HTML output.
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {
    if ($_POST['action'] == 'update_status') {
        $visit_id = (int)$_POST['visit_id'];
        $status = sanitize_input($_POST['status']);
        $image_filename = $_POST['existing_image'];

        if ($status === 'Completed' && empty($image_filename) && (!isset($_FILES['visit_image']) || $_FILES['visit_image']['error'] !== UPLOAD_ERR_OK)) {
            $message = "<p class='status-message error'>Error: An image upload is required to mark a visit as 'Completed'.</p>";
        } else {
            if (isset($_FILES['visit_image']) && $_FILES['visit_image']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['visit_image']; $upload_dir = '../uploads/'; $allowed_types = ['jpg', 'jpeg', 'png'];
                $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                if (in_array($file_extension, $allowed_types) && $file['size'] < 8000000) {
                    $image_filename = 'visit_' . uniqid() . '.' . $file_extension;
                    if (!move_uploaded_file($file['tmp_name'], $upload_dir . $image_filename)) {
                        $image_filename = null; 
                        $message = "<p class='status-message error'>Error: Could not save the uploaded file.</p>";
                    }
                } else { 
                    $message = "<p class='status-message error'>Invalid file type or size.</p>";
                    $image_filename = null;
                }
            }

            if (empty($message)) {
                $stmt = $conn->prepare("UPDATE site_visits SET status = ?, image_filename = ? WHERE visit_id = ? AND site_visit_agent_id = ?");
                $stmt->bind_param("ssii", $status, $image_filename, $visit_id, $agent_id);
                
                if ($stmt->execute()) {
                    $lead_id_result = $conn->query("SELECT lead_id FROM site_visits WHERE visit_id = $visit_id");
                    if ($lead_id_result->num_rows > 0) {
                        $lead_id = $lead_id_result->fetch_assoc()['lead_id'];
                        $flag_stmt = $conn->prepare("UPDATE leads SET has_unread_update = TRUE WHERE lead_id = ?");
                        $flag_stmt->bind_param("i", $lead_id);
                        $flag_stmt->execute();
                        $flag_stmt->close();
                    }
                    
                    // The redirects can now work correctly because no HTML has been sent yet.
                    if ($status === 'Completed') {
                        header("Location: completed_visits.php?status=just_completed");
                        exit();
                    } elseif ($status === 'Canceled') {
                        header("Location: visit_history.php?status=just_canceled");
                        exit();
                    } else {
                        $message = "<p class='status-message success'>Status updated successfully!</p>";
                    }
                } else { 
                    $message = "<p class='status-message error'>Error updating status in the database.</p>"; 
                }
                $stmt->close();
            }
        }
    }
}

// Check for status messages from other pages (this can run after processing)
if (isset($_GET['status']) && $_GET['status'] === 'scheduled') {
    $message = "<p class='status-message success'>New site visit scheduled successfully!</p>";
}

// Mark new visits as "viewed"
$conn->query("UPDATE site_visits SET is_viewed = TRUE WHERE site_visit_agent_id = $agent_id AND is_viewed = FALSE");

// STEP 3: Now that all logic is done, we can safely include the header and start printing HTML.
require 'partials/header.php'; 
?>
<style>
    .status-message { padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-weight: bold; }
    .status-message.success { background-color: #d4edda; color: #155724; }
    .status-message.error { background-color: #f8d7da; color: #721c24; }
    .camera-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 2000; display: none; align-items: center; justify-content: center; }
    .camera-modal-content { background: #333; padding: 20px; border-radius: 8px; text-align: center; max-width: 90%; width: 640px; }
    #camera-feed { width: 100%; height: auto; border-radius: 4px; background: black; }
    .camera-controls { margin-top: 15px; display: flex; justify-content: center; gap: 10px; }
    .camera-btn { padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer; font-weight: bold; }
    .btn-capture { background-color: #e63946; color: white; }
    .btn-use-photo { background-color: #2a9d8f; color: white; display: none; }
    .btn-retake { background-color: #fca311; color: white; display: none; }
    .btn-cancel { background-color: #6c757d; color: white; }
    .capture-feedback { color: #2a9d8f; font-weight: bold; margin-top: 10px; display: none; }
    #camera-canvas { display: none; }
</style>

<?php if (!empty($message)) echo $message; ?>
<h2>My Active Site Visits</h2>
<p>Update the status below. Use 'Completed' to upload a live photo as proof of visit.</p>
<table class="responsive-table">
    <thead>
        <tr><th>Client Name</th><th>Visit Details</th><th>Current Status & Proof</th><th>Update Action</th></tr>
    </thead>
    <tbody>
        <?php
        $sql = "SELECT sv.visit_id, sv.visit_date_time, sv.status, sv.is_viewed, sv.image_filename, l.client_name, u.username AS sales_agent_name, u.phone_number AS sales_agent_phone 
                FROM site_visits sv 
                JOIN leads l ON sv.lead_id = l.lead_id 
                JOIN users u ON sv.sales_agent_id = u.user_id 
                WHERE sv.site_visit_agent_id = ? 
                AND sv.status IN ('Scheduled', 'Rescheduled')
                ORDER BY sv.is_viewed ASC, sv.visit_date_time ASC";
        
        $stmt_display = $conn->prepare($sql);
        $stmt_display->bind_param("i", $agent_id);
        $stmt_display->execute();
        $result = $stmt_display->get_result();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $visit_id = $row['visit_id'];
                echo "<tr>";
                echo "<td data-label='Client Name'>" . htmlspecialchars($row['client_name']) . "</td>";
                echo "<td data-label='Visit Details'>" . date("d M, Y - h:i A", strtotime($row['visit_date_time'])) . "<br><small>Scheduled By: " . htmlspecialchars($row['sales_agent_name']) . "</small></td>";
                echo "<td data-label='Status & Proof'><strong>" . htmlspecialchars($row['status']) . "</strong>";
                if (!empty($row['image_filename'])) { echo "<a href='../uploads/" . htmlspecialchars($row['image_filename']) . "' target='_blank'><img src='../uploads/" . htmlspecialchars($row['image_filename']) . "' alt='Visit Proof' style='max-width: 80px; border-radius: 4px; margin-top: 5px; display: block;'></a>"; }
                echo "</td>";
                echo "<td data-label='Update Action'>
                        <form action='active_visits.php' method='post' enctype='multipart/form-data'>
                            <input type='hidden' name='action' value='update_status'>
                            <input type='hidden' name='visit_id' value='$visit_id'>
                            <input type='hidden' name='existing_image' value='" . htmlspecialchars($row['image_filename']) . "'>
                            <select name='status' style='width:100%;' onchange='toggleImageUpload(this, $visit_id)'>
                                <option value='Scheduled' " . ($row['status'] == 'Scheduled' ? 'selected' : '') . ">Scheduled</option>
                                <option value='Completed' " . ($row['status'] == 'Completed' ? 'selected' : '') . ">Completed</option>
                                <option value='Rescheduled' " . ($row['status'] == 'Rescheduled' ? 'selected' : '') . ">Rescheduled</option>
                                <option value='Canceled' " . ($row['status'] == 'Canceled' ? 'selected' : '') . ">Canceled</option>
                            </select>
                            <div id='image-upload-wrapper-$visit_id' style='display: none; margin-top: 10px;'>
                                <button type='button' class='camera-btn' onclick='openCamera($visit_id)'>Open Camera</button>
                                <input type='file' name='visit_image' id='visit_image_$visit_id' accept='image/*' style='display: none;'>
                                <div id='capture-feedback-$visit_id' class='capture-feedback'>Photo captured! Ready to update.</div>
                            </div>
                            <button type='submit' name='update_status' style='margin-top:5px;'>Update</button>
                        </form>
                      </td>";
                echo "</tr>";
            }
        } else { echo "<tr><td colspan='4'>You have no active site visits assigned.</td></tr>"; }
        $stmt_display->close();
        ?>
    </tbody>
</table>

<div id="camera-modal" class="camera-modal-overlay">
    <div class="camera-modal-content">
        <video id="camera-feed" playsinline></video>
        <canvas id="camera-canvas"></canvas>
        <div class="camera-controls">
            <button type="button" id="btn-capture" class="camera-btn btn-capture">Take Picture</button>
            <button type="button" id="btn-use-photo" class="camera-btn btn-use-photo">Use This Photo</button>
            <button type="button" id="btn-retake" class="camera-btn btn-retake">Retake</button>
            <button type="button" id="btn-cancel" class="camera-btn btn-cancel">Cancel</button>
        </div>
    </div>
</div>

<script>
function toggleImageUpload(selectElement, visitId) {
    const wrapper = document.getElementById('image-upload-wrapper-' + visitId);
    const fileInput = document.getElementById('visit_image_' + visitId);
    if (selectElement.value === 'Completed') {
        wrapper.style.display = 'block';
    } else {
        wrapper.style.display = 'none';
        fileInput.required = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('select[name="status"]').forEach(select => {
        const visitId = select.form.querySelector('input[name="visit_id"]').value;
        toggleImageUpload(select, visitId);
    });
});

const modal = document.getElementById('camera-modal');
const video = document.getElementById('camera-feed');
const canvas = document.getElementById('camera-canvas');
const btnCapture = document.getElementById('btn-capture');
const btnUsePhoto = document.getElementById('btn-use-photo');
const btnRetake = document.getElementById('btn-retake');
const btnCancel = document.getElementById('btn-cancel');
let currentVisitId = null;
let stream = null;

async function openCamera(visitId) {
    currentVisitId = visitId;
    video.style.display = 'block';
    canvas.style.display = 'none';
    btnCapture.style.display = 'inline-block';
    btnUsePhoto.style.display = 'none';
    btnRetake.style.display = 'none';
    modal.style.display = 'flex';
    try {
        if (stream) { stream.getTracks().forEach(track => track.stop()); }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        video.srcObject = stream;
        video.play();
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access the camera. Please ensure you have given permission.");
        closeCamera();
    }
}

function stopCamera() { if (stream) { stream.getTracks().forEach(track => track.stop()); stream = null; } }
function closeCamera() { stopCamera(); modal.style.display = 'none'; }

function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    video.style.display = 'none';
    canvas.style.display = 'block';
    btnCapture.style.display = 'none';
    btnUsePhoto.style.display = 'inline-block';
    btnRetake.style.display = 'inline-block';
    stopCamera();
}

function finalizeImage() {
    canvas.toBlob(function(blob) {
        const fileInput = document.getElementById('visit_image_' + currentVisitId);
        const feedback = document.getElementById('capture-feedback_' + currentVisitId);
        
        const imageFile = new File([blob], "live_capture.jpg", { type: "image/jpeg" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFile);
        fileInput.files = dataTransfer.files;
        
        if (feedback) {
            feedback.style.display = 'block';
        }
        closeCamera();
    }, 'image/jpeg', 0.9);
}

btnCapture.addEventListener('click', captureImage);
btnUsePhoto.addEventListener('click', finalizeImage);
btnRetake.addEventListener('click', () => openCamera(currentVisitId));
btnCancel.addEventListener('click', closeCamera);
</script>

<?php require 'partials/footer.php'; ?>