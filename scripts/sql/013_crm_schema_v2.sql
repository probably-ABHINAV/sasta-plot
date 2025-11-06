-- Complete CRM Schema v2 - Integrates with Supabase Auth
-- This version properly extends Supabase auth.users instead of duplicating authentication

-- Create CRM roles table
CREATE TABLE IF NOT EXISTS crm_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO crm_roles (id, name, description) VALUES
(1, 'admin', 'Administrative access to CRM'),
(2, 'sales_agent', 'Sales agent with lead management'),
(3, 'site_visit_agent', 'Handles site visits and confirmations'),
(4, 'superadmin', 'Full system access')
ON CONFLICT (name) DO NOTHING;

-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS crm_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255),
  phone_number VARCHAR(20),
  role_id INTEGER REFERENCES crm_roles(id) DEFAULT 2,
  is_disabled BOOLEAN DEFAULT FALSE,
  owned_by_admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leads table
CREATE TABLE IF NOT EXISTS crm_leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  admin_id UUID REFERENCES auth.users(id),
  notes TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  interested BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lead assignments table
CREATE TABLE IF NOT EXISTS crm_lead_assignments (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES crm_leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(lead_id, agent_id)
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS crm_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12, 2),
  admin_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site visits table
CREATE TABLE IF NOT EXISTS crm_site_visits (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES crm_leads(id) ON DELETE CASCADE,
  visit_date_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  agent_id UUID REFERENCES auth.users(id),
  confirmation_summary TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS crm_bookings (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES crm_leads(id) ON DELETE CASCADE,
  plot_id INTEGER,
  booking_amount DECIMAL(12, 2),
  booking_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'pending',
  agent_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment schedules table
CREATE TABLE IF NOT EXISTS crm_payment_schedules (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES crm_bookings(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS crm_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  application_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create end customers table
CREATE TABLE IF NOT EXISTS crm_end_customers (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES crm_leads(id),
  booking_id INTEGER REFERENCES crm_bookings(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS crm_notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity log table
CREATE TABLE IF NOT EXISTS crm_activity_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_profiles_role ON crm_profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_admin ON crm_leads(admin_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_site_visits_date ON crm_site_visits(visit_date_time);
CREATE INDEX IF NOT EXISTS idx_crm_payment_schedules_due ON crm_payment_schedules(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_notifications_user ON crm_notifications(user_id);

-- Add Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE crm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_end_customers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON crm_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON crm_profiles FOR UPDATE USING (auth.uid() = id);

-- Leads policies
CREATE POLICY "Admins can view all their leads" ON crm_leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
  OR admin_id = auth.uid()
);

CREATE POLICY "Agents can view assigned leads" ON crm_leads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM crm_lead_assignments 
    WHERE lead_id = crm_leads.id AND agent_id = auth.uid()
  )
);

CREATE POLICY "Admins can create leads" ON crm_leads FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY "Admins can update their leads" ON crm_leads FOR UPDATE USING (
  admin_id = auth.uid() OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id = 4)
);

CREATE POLICY "Admins can delete their leads" ON crm_leads FOR DELETE USING (
  admin_id = auth.uid() OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id = 4)
);

-- Site visits policies
CREATE POLICY "Users can view their site visits" ON crm_site_visits FOR SELECT USING (
  agent_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM crm_leads WHERE id = crm_site_visits.lead_id AND admin_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY "Admins can create site visits" ON crm_site_visits FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 2, 3, 4))
);

CREATE POLICY "Admins can update site visits" ON crm_site_visits FOR UPDATE USING (
  agent_id = auth.uid() OR
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

CREATE POLICY "Admins can delete site visits" ON crm_site_visits FOR DELETE USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON crm_notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON crm_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON crm_notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own notifications" ON crm_notifications FOR DELETE USING (user_id = auth.uid());

-- Activity log policies
CREATE POLICY "Activity log is viewable by admins" ON crm_activity_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM crm_profiles WHERE id = auth.uid() AND role_id IN (1, 4))
);
CREATE POLICY "System can create activity logs" ON crm_activity_log FOR INSERT WITH CHECK (true);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.crm_profiles (id, username, role_id)
  VALUES (NEW.id, NEW.email, 2);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_crm_profiles_updated_at ON crm_profiles;
CREATE TRIGGER update_crm_profiles_updated_at BEFORE UPDATE ON crm_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_leads_updated_at ON crm_leads;
CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON crm_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_site_visits_updated_at ON crm_site_visits;
CREATE TRIGGER update_crm_site_visits_updated_at BEFORE UPDATE ON crm_site_visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_campaigns_updated_at ON crm_campaigns;
CREATE TRIGGER update_crm_campaigns_updated_at BEFORE UPDATE ON crm_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_bookings_updated_at ON crm_bookings;
CREATE TRIGGER update_crm_bookings_updated_at BEFORE UPDATE ON crm_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_payment_schedules_updated_at ON crm_payment_schedules;
CREATE TRIGGER update_crm_payment_schedules_updated_at BEFORE UPDATE ON crm_payment_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
