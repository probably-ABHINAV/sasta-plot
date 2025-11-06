import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'
import { getCurrentUserProfile, ROLES } from '@/lib/crm/auth'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabase()
    const profile = await getCurrentUserProfile()

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, source, status, notes, interested } = body

    const { data: lead, error } = await supabase
      .from('crm_leads')
      .update({
        name,
        email,
        phone,
        source,
        status,
        notes,
        interested
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
    }

    await supabase.from('crm_activity_log').insert({
      user_id: profile.id,
      action: 'updated_lead',
      entity_type: 'lead',
      entity_id: parseInt(params.id),
      details: { changes: body }
    })

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabase()
    const profile = await getCurrentUserProfile()

    if (!profile || ![ROLES.ADMIN, ROLES.SUPERADMIN].includes(profile.role_id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('crm_leads')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting lead:', error)
      return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
    }

    await supabase.from('crm_activity_log').insert({
      user_id: profile.id,
      action: 'deleted_lead',
      entity_type: 'lead',
      entity_id: parseInt(params.id)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
