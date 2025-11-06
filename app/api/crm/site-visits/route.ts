import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/crm/auth'

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const profile = await getCurrentUserProfile()

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: visits, error } = await supabase
      .from('crm_site_visits')
      .select(`
        *,
        crm_leads (
          id,
          name,
          phone,
          email
        )
      `)
      .order('visit_date_time', { ascending: true })

    if (error) {
      console.error('Error fetching site visits:', error)
      return NextResponse.json({ error: 'Failed to fetch site visits' }, { status: 500 })
    }

    return NextResponse.json({ visits: visits || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getServerSupabase()
    const profile = await getCurrentUserProfile()

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lead_id, visit_date_time, agent_id, notes } = body

    const { data: visit, error } = await supabase
      .from('crm_site_visits')
      .insert([{
        lead_id,
        visit_date_time,
        agent_id: agent_id || profile.id,
        notes,
        status: 'scheduled'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating site visit:', error)
      return NextResponse.json({ error: 'Failed to create site visit' }, { status: 500 })
    }

    return NextResponse.json({ visit })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
