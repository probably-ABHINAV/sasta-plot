import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'
import { getCurrentUserProfile, ROLES } from '@/lib/crm/auth'

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const profile = await getCurrentUserProfile()

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]

    const [
      leadsResult,
      agentsResult,
      siteVisitsResult,
      paymentsResult,
      confirmationsResult
    ] = await Promise.all([
      supabase.from('crm_leads').select('id', { count: 'exact' }),
      supabase.from('crm_profiles').select('id', { count: 'exact' }).eq('role_id', ROLES.SALES_AGENT).eq('is_disabled', false),
      supabase.from('crm_site_visits').select('id', { count: 'exact' }).gte('visit_date_time', today).lt('visit_date_time', `${today}T23:59:59`).in('status', ['scheduled', 'rescheduled']),
      supabase.from('crm_payment_schedules').select('id, amount', { count: 'exact' }).eq('due_date', today).neq('status', 'paid'),
      supabase.from('crm_site_visits').select('id', { count: 'exact' }).gte('visit_date_time', today).lt('visit_date_time', `${today}T23:59:59`).not('confirmation_summary', 'is', null)
    ])

    const stats = {
      total_leads: leadsResult.count || 0,
      total_agents: agentsResult.count || 0,
      todays_site_visits: siteVisitsResult.count || 0,
      todays_due_payments: paymentsResult.count || 0,
      todays_due_amount: paymentsResult.data?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0,
      today_confirmations: confirmationsResult.count || 0
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
