-- Additional RLS policies for CRM tables

-- Campaigns policies
CREATE POLICY IF NOT EXISTS "Admins can view campaigns" ON crm_campaigns FOR SELECT USING (
  admin_id = auth.uid() OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can create campaigns" ON crm_campaigns FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can update campaigns" ON crm_campaigns FOR UPDATE USING (
  admin_id = auth.uid() OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id = 4)
);

CREATE POLICY IF NOT EXISTS "Admins can delete campaigns" ON crm_campaigns FOR DELETE USING (
  admin_id = auth.uid() OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id = 4)
);

-- Lead assignments policies
CREATE POLICY IF NOT EXISTS "Users can view lead assignments" ON crm_lead_assignments FOR SELECT USING (
  agent_id = auth.uid() OR
  assigned_by = auth.uid() OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can create lead assignments" ON crm_lead_assignments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can delete lead assignments" ON crm_lead_assignments FOR DELETE USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

-- Bookings policies
CREATE POLICY IF NOT EXISTS "Admins can view bookings" ON crm_bookings FOR SELECT USING (
  agent_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM crm_leads WHERE id = crm_bookings.lead_id AND admin_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can create bookings" ON crm_bookings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 2, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can update bookings" ON crm_bookings FOR UPDATE USING (
  agent_id = auth.uid() OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

-- Payment schedules policies
CREATE POLICY IF NOT EXISTS "Users can view payment schedules" ON crm_payment_schedules FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM crm_bookings 
    WHERE id = crm_payment_schedules.booking_id 
    AND (
      agent_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM crm_leads 
        WHERE id = crm_bookings.lead_id AND admin_id = auth.uid()
      )
    )
  ) OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can create payment schedules" ON crm_payment_schedules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 2, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can update payment schedules" ON crm_payment_schedules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can delete payment schedules" ON crm_payment_schedules FOR DELETE USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

-- Applications policies (for contact forms, etc.)
CREATE POLICY IF NOT EXISTS "Anyone can create applications" ON crm_applications FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admins can view applications" ON crm_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

-- End customers policies
CREATE POLICY IF NOT EXISTS "Admins can view end customers" ON crm_end_customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can create end customers" ON crm_end_customers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 2, 4))
);

CREATE POLICY IF NOT EXISTS "Admins can update end customers" ON crm_end_customers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);
