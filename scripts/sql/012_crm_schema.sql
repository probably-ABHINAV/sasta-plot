-- CRM Database Schema for Next.js Integration
-- This replaces the PHP CRM with integrated Next.js pages

-- Create CRM roles table
CREATE TABLE IF NOT EXISTS crm_roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO crm_roles (role_id, role_name, description) VALUES
(1, 'admin', 'Administrative access to CRM'),
(2, 'sales_agent', 'Sales agent with lead management'),
(3, 'site_visit_agent', 'Handles site visits and confirmations'),
(4, 'superadmin', 'Full system access')
ON CONFLICT (role_name) DO NOTHING;

-- Create CRM users table (extends existing auth)
CREATE TABLE IF NOT EXISTS crm_users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  otp VARCHAR(10),
  otp_expiry TIMESTAMP,
  role_id INTEGER REFERENCES crm_roles(role_id),
  is_disabled BOOLEAN DEFAULT FALSE,
  owned_by_admin_id INTEGER REFERENCES crm_users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leads table
CREATE TABLE IF NOT EXISTS crm_leads (
  lead_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  admin_id INTEGER REFERENCES crm_users(user_id),
  notes TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  interested BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lead assignments table
CREATE TABLE IF NOT EXISTS crm_lead_assignments (
  assignment_id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES crm_leads(lead_id) ON DELETE CASCADE,
  agent_id INTEGER REFERENCES crm_users(user_id),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER REFERENCES crm_users(user_id),
  UNIQUE(lead_id, agent_id)
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS crm_campaigns (
  campaign_id SERIAL PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12, 2),
  admin_id INTEGER REFERENCES crm_users(user_id),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site visits table
CREATE TABLE IF NOT EXISTS crm_site_visits (
  visit_id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES crm_leads(lead_id) ON DELETE CASCADE,
  visit_date_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  agent_id INTEGER REFERENCES crm_users(user_id),
  confirmation_summary TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS crm_bookings (
  booking_id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES crm_leads(lead_id) ON DELETE CASCADE,
  plot_id INTEGER,
  booking_amount DECIMAL(12, 2),
  booking_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'pending',
  agent_id INTEGER REFERENCES crm_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment schedules table
CREATE TABLE IF NOT EXISTS crm_payment_schedules (
  payment_id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES crm_bookings(booking_id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS crm_applications (
  application_id SERIAL PRIMARY KEY,
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
  customer_id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES crm_leads(lead_id),
  booking_id INTEGER REFERENCES crm_bookings(booking_id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS crm_notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES crm_users(user_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity log table
CREATE TABLE IF NOT EXISTS crm_activity_log (
  log_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES crm_users(user_id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_admin ON crm_leads(admin_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_site_visits_date ON crm_site_visits(visit_date_time);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_due ON crm_payment_schedules(due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON crm_notifications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_crm_users_updated_at BEFORE UPDATE ON crm_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON crm_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_site_visits_updated_at BEFORE UPDATE ON crm_site_visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
