<?php
// This MUST be the absolute first thing in the file.
// Check if a session is not already active before starting one.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once 'db.php';
// ... rest of the file


require_once 'config.php';
require_once __DIR__ . '/../vendor/autoload.php'; // This loads all our libraries, including DeviceDetector
require_once 'mail_config.php';

// These 'use' statements are required for the Device Detector library to work.
use DeviceDetector\DeviceDetector;
use DeviceDetector\Parser\Device\DeviceParserAbstract;

// These 'use' statements are required for PHPMailer to work.
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


// ===== START: NEW, SMARTER HELPER FUNCTION FOR DEVICE NAMES =====
/**
 * Parses a raw User Agent string and returns a clean, human-readable device/browser name.
 * This version prioritizes the specific device model over the generic browser/OS.
 *
 * @param string $userAgent The raw $_SERVER['HTTP_USER_AGENT'] string.
 * @return string The clean device name (e.g., "POCO M6 5G", "Chrome on Windows").
 */
function parse_user_agent($userAgent) {
    if (empty($userAgent)) {
        return 'Unknown Device';
    }

    // Create a new instance of the DeviceDetector
    $dd = new DeviceDetector($userAgent);
    
    // Parse the user agent
    $dd->parse();

    if ($dd->isBot()) {
        return 'Bot / Crawler';
    } else {
        $clientInfo = $dd->getClient(); // Browser info
        $osInfo = $dd->getOs();         // OS info
        
        // --- START OF IMPROVED LOGIC ---
        
        $brand = $dd->getBrandName();
        $model = $dd->getModel();

        // Check if a specific model name was detected.
        if (!empty($model)) {
            // Check if the brand name is already part of the model name to avoid repetition (e.g., "Samsung Samsung Galaxy")
            if (stripos($model, $brand) !== false) {
                return $model; // e.g., Model is "Samsung Galaxy S21" and Brand is "Samsung" -> return "Samsung Galaxy S21"
            } else {
                return $brand . ' ' . $model; // e.g., Brand is "Xiaomi", Model is "POCO M6" -> return "Xiaomi POCO M6"
            }
        }
        
        // FALLBACK: If no specific model was found, use the Browser + OS combination.
        if ($clientInfo && $osInfo) {
            $browserName = ($dd->isMobile() && $clientInfo['name'] == 'Chrome') ? 'Chrome Mobile' : $clientInfo['name'];
            return $browserName . ' on ' . $osInfo['name'];
        }
        
        // --- END OF IMPROVED LOGIC ---
        
        // Final fallback for very unusual user agents
        return 'Unknown Device';
    }
}
// ===== END: NEW, SMARTER HELPER FUNCTION =====


/**
 * This is the main security function called at the top of every protected page.
 */
function enforce_security($required_role_id) {
    check_login();
    check_active_session();
    check_role($required_role_id);
    // check_session_timeout(); // Timeout is currently disabled.
}

/**
 * Checks if a user is logged in by looking for a user_id in the session.
 */
function check_login() {
    if (!isset($_SESSION['user_id'])) {
        header("Location: ../logout.php");
        exit();
    }
}

/**
 * Checks if the current session is still marked as active in the database.
 */
function check_active_session() {
    if (!isset($_SESSION['session_id'])) {
        header("Location: ../logout.php");
        exit();
    }
    global $conn;
    $stmt = $conn->prepare("SELECT is_active FROM user_sessions WHERE session_id = ?");
    $stmt->bind_param("i", $_SESSION['session_id']);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    if (!$result || !$result['is_active']) {
        header("Location: ../logout.php");
        exit();
    }
}

/**
 * Enforces role-based access control.
 */
function check_role($required_roles) {
    $user_role = isset($_SESSION['role_id']) ? (int)$_SESSION['role_id'] : 0;

    // If the requirement is not an array, make it one for consistent checking.
    if (!is_array($required_roles)) {
        $required_roles = [$required_roles];
    }

    // Check if the user's role is in the array of allowed roles.
    if (!in_array($user_role, $required_roles)) {
        // You can customize this page or redirect
        echo "<div style='text-align:center; padding-top:50px; font-family:sans-serif;'>
                <h1>Access Denied</h1>
                <p>You do not have the required permissions to view this page.</p>
                <p><a href='../index.php'>Return to Login</a></p>
              </div>";
        exit();
    }
}


/**
 * Checks for user inactivity (currently disabled).
 */
function check_session_timeout() {
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
        header("Location: ../logout.php");
        exit();
    }
    $_SESSION['last_activity'] = time();
}

/**
 * Sanitizes user input to prevent XSS attacks.
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Sends an email using PHPMailer.
 */
function send_email($to, $subject, $body) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = 'bajrangvatikaa@gmail.com';
        $mail->Password   = 'wneh czcx xyrn kyrt';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;
        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody = strip_tags($body);
        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}
?>