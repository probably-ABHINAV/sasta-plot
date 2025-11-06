<?php
// Final Version: True single-background mobile view with maximum text width.

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require __DIR__ . '/vendor/autoload.php';

// This variable will hold our success/error message
$message = '';

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get client details from the form and sanitize them
    $clientName = htmlspecialchars(trim($_POST['client_name']));
    $recipientEmail = filter_var(trim($_POST['receiver_email']), FILTER_SANITIZE_EMAIL);

    // Basic validation
    if (!empty($clientName) && !empty($recipientEmail) && filter_var($recipientEmail, FILTER_VALIDATE_EMAIL)) {
        
        // --- CONFIGURATION ---
        // !!! IMPORTANT: REPLACE these four values !!!
        $sender_email = 'bajrangvatikaa@gmail.com'; // Your full Gmail address
        $sender_app_password = 'wneh czcx xyrn kyrt'; // Your 16-digit App Password
        $brochure_url = 'https://https://www.bajrangvatika.com/brouchers/bajrang-vatika-brochure.pdf'; // The public link to your PDF
        $website_url = 'https://www.bajrangvatika.com/'; // Your main website address
        // --- END OF CONFIGURATION ---

        // --- BAJRANG VATIKA: FINAL MOBILE-FIRST EMAIL BODY ---
        $subject = 'Project Details – Bajrang Vatika, Dehradun';

        $body = "
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Bajrang Vatika Project Details</title>
                <style>
                    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #f4f7f6; }
                    .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f6; padding: 40px 10px; }
                    .main { margin: 0 auto; width: 100%; max-width: 680px; background-color: #ffffff; border-spacing: 0; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                    .content { padding: 30px 40px; font-size: 16px; color: #333333; }
                    h2 { font-size: 26px; margin: 0 0 20px 0; }
                    p { line-height: 1.6; margin: 0 0 16px 0; }
                    hr { border: 0; border-top: 1px solid #e5e5e5; margin: 30px 0; }
                    .button-container { text-align: center; padding: 10px 0; }
                    .button { background-color: #1A5D1A; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px; }
                    .highlights-list { list-style: none; padding: 0; margin: 20px 0; }
                    .highlights-list li { padding-left: 25px; background-image: url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"%231A5D1A\" class=\"bi bi-check-circle-fill\" viewBox=\"0 0 16 16\"%3E%3Cpath d=\"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z\"/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: left 4px; background-size: 16px; margin-bottom: 12px; }

                    /* --- MOBILE OPTIMIZATIONS --- */
                    @media screen and (max-width: 600px) {
                        .wrapper { padding: 0; }
                        .main { width: 100% !important; border-radius: 0; box-shadow: none; }
                        .content { padding: 30px 20px; font-size: 15px; }
                        h2 { font-size: 24px; }
                    }
                </style>
            </head>
            <body>
                <div class='wrapper'>
                    <table class='main'>
                        <tr>
                            <td class='content'>
                                <h2>Bajrang Vatika, Dehradun</h2>
                                <p>Dear " . $clientName . ",</p>
                                <p>Thank you for your inquiry. Please find details of our project <strong>Bajrang Vatika</strong>, Dehradun’s first Hanuman-themed residential plotted development.</p>
                                <p>Located near Shimla Bypass, the project offers Vastu-compliant plots surrounded by Rajaji National Park greenery with views of the Mussoorie and Chakrata hills. A grand Hanuman temple inside the community creates a peaceful and spiritual environment for residents.</p>
                                
                                <hr>

                                <h3>Project Highlights:</h3>
                                <ul class='highlights-list'>
                                    <li><strong>Prime location</strong> with good connectivity</li>
                                    <li><strong>Gated community</strong> with 24×7 security</li>
                                    <li><strong>Natural surroundings</strong> & clean environment</li>
                                    <li><strong>Great future</strong> appreciation potential</li>
                                </ul>

                                <p style='font-size: 1.1em; margin-top: 25px;'>
                                    <strong>Current Rate:</strong> ₹16,500 per sq. yard<br>
                                    <small>(Special discounts available for early booking)</small>
                                </p>

                                <hr>
                                
                                <div class='button-container'>
                                    <a href='" . htmlspecialchars($brochure_url) . "' class='button'>&#128196; Download Brochure</a>
                                    <a href='" . htmlspecialchars($website_url) . "' class='button'>Visit Our Website</a>
                                </div>

                                <p style='margin-top: 30px; font-size: 14px; color: #888;'>
                                    Regards,<br>
                                    <strong>Team Bajrang Vatika</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>
        ";

        $mail = new PHPMailer(true);

        try {
            $mail->SMTPDebug = SMTP::DEBUG_OFF;
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = $sender_email;
            $mail->Password   = $sender_app_password;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;
            $mail->CharSet = 'UTF-8';

            $mail->setFrom($sender_email, 'Team Bajrang Vatika');
            $mail->addAddress($recipientEmail, $clientName);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            $mail->send();
            $message = "<div class='toast-notification success'><strong>Success!</strong> Email sent successfully.</div>";
        } catch (Exception $e) {
            $message = "<div class='toast-notification error'><strong>Error!</strong> Message could not be sent.</div>";
        }
    } else {
        $message = "<div class='toast-notification error'><strong>Error!</strong> Please enter a valid name and email.</div>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Send Bajrang Vatika Details</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .container { background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 500px; text-align: center; }
        h2 { margin-bottom: 20px; color: #333; }
        .form-group { margin-bottom: 20px; text-align: left; }
        label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
        input[type="email"], input[type="text"] { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px; }
        button { width: 100%; padding: 15px; background-color: #1A5D1A; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background-color 0.3s; }
        button:hover { background-color: #144714; }
        .toast-notification {
            margin-top: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            font-size: 15px;
            text-align: left;
            display: flex;
            align-items: center;
            opacity: 1;
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    
    <div class="container">
        <h2>Send Bajrang Vatika Details</h2>
        <p>Enter the client's details to send the project information packet.</p>
        
        <form method="post" action="">
            <div class="form-group">
                <label for="client_name">Client's Full Name:</label>
                <input type="text" id="client_name" name="client_name" placeholder="E.g. Rani Singh" required>
            </div>
            <div class="form-group">
                <label for="receiver_email">Client's Email ID:</label>
                <input type="email" id="receiver_email" name="receiver_email" placeholder="E.g. ranisingh@gmail.com" required>
            </div>
            <button type="submit">Send Project Details</button>
        </form>

        <?php 
        if (!empty($message)) {
            echo $message;
        }
        ?>
    </div>

    <!-- JavaScript to auto-hide the message box -->
    <script>
        const messageBox = document.querySelector('.toast-notification');
        if (messageBox) {
            setTimeout(() => {
                messageBox.style.opacity = '0';
                messageBox.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    messageBox.style.display = 'none';
                }, 500);
            }, 5000); // 5 seconds
        }
    </script>

</body>
</html>