import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'
import { getCurrentUserProfile, ROLES } from '@/lib/crm/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const profile = await getCurrentUserProfile()

    if (!profile || (profile.role_id !== ROLES.ADMIN && profile.role_id !== ROLES.SUPERADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: agents, error } = await supabase
      .from('crm_profiles')
      .select(`
        *,
        crm_roles (
          name,
          description
        )
      `)
      .in('role_id', [ROLES.SALES_AGENT, ROLES.SITE_VISIT_AGENT])
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching agents:', error)
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    const agentsWithAuth = await Promise.all(
      (agents || []).map(async (agent) => {
        const { data: user } = await supabase.auth.admin.getUserById(agent.id)
        return {
          ...agent,
          email: user?.user?.email
        }
      })
    )

    return NextResponse.json({ agents: agentsWithAuth })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
