</div> <!-- /container -->

    <!-- ===== START: NEW FLOATING PAYMENT REMINDER BUTTON ===== -->

    <!-- This is an 'a' tag that acts as a button. It is ALWAYS visible. -->
    <a href="reminders.php" id="payment-reminder-fab" title="View Payment Reminders">
    
        <!-- The red badge ONLY appears if there are payments due today -->
        <?php if ($payment_reminder_count > 0): ?>
            <span class="fab-badge"><?php echo $payment_reminder_count; ?></span>
        <?php endif; ?>

        <!-- The Bell Icon (always visible) -->
        <svg xmlns="http://www.w.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
        </svg>
    </a>
    
    <!-- ===== END: NEW FLOATING PAYMENT REMINDER BUTTON ===== -->

    <!-- No JavaScript is needed for this simple button -->
</body>
</html>