export interface CRMUser {
  user_id: number
  username: string
  email: string
  phone_number?: string
  role_id: number
  is_disabled: boolean
  owned_by_admin_id?: number
  created_at: string
  updated_at: string
}

export interface CRMRole {
  role_id: number
  role_name: string
  description?: string
}

export interface CRMLead {
  lead_id: number
  name: string
  email?: string
  phone: string
  source?: string
  status: string
  admin_id?: number
  notes?: string
  is_hidden: boolean
  interested: boolean
  created_at: string
  updated_at: string
}

export interface CRMSiteVisit {
  visit_id: number
  lead_id: number
  visit_date_time: string
  status: string
  agent_id?: number
  confirmation_summary?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CRMBooking {
  booking_id: number
  lead_id: number
  plot_id?: number
  booking_amount: number
  booking_date: string
  status: string
  agent_id?: number
  created_at: string
}

export interface CRMPaymentSchedule {
  payment_id: number
  booking_id: number
  amount: number
  due_date: string
  status: string
  paid_date?: string
  notes?: string
  created_at: string
}

export interface CRMCampaign {
  campaign_id: number
  campaign_name: string
  description?: string
  start_date?: string
  end_date?: string
  budget?: number
  admin_id?: number
  status: string
  created_at: string
}

export interface CRMApplication {
  application_id: number
  name: string
  email: string
  phone?: string
  message?: string
  application_type?: string
  status: string
  created_at: string
}
