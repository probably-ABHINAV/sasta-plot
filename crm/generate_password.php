<?php
// Put the password you want to use inside the quotes
$my_password = 'CRM@drrealtor2409#';

$hashed_password = password_hash($my_password, PASSWORD_DEFAULT);

echo "Copy this hash into phpMyAdmin: <br><br>";
echo "<b>" . $hashed_password . "</b>";
?>