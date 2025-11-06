import { getServerSupabase } from '@/lib/supabase/server'

export type UserRole = 'admin' | 'sales_agent' | 'site_visit_agent' | 'superadmin'

export interface CRMProfile {
  id: string
  username: string | null
  phone_number: string | null
  role_id: number
  role_name?: UserRole
  is_disabled: boolean
  owned_by_admin_id: string | null
}

export async function getCurrentUser() {
  const supabase = getServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUserProfile(): Promise<CRMProfile | null> {
  const supabase = getServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('crm_profiles')
    .select(`
      *,
      crm_roles (
        name
      )
    `)
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    ...profile,
    role_name: profile.crm_roles?.name as UserRole
  }
}

export async function checkRole(allowedRoles: number[]): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  if (!profile) return false
  return allowedRoles.includes(profile.role_id)
}

export async function requireRole(allowedRoles: number[]) {
  const hasPermission = await checkRole(allowedRoles)
  if (!hasPermission) {
    throw new Error('Unauthorized: Insufficient permissions')
  }
}

export const ROLES = {
  ADMIN: 1,
  SALES_AGENT: 2,
  SITE_VISIT_AGENT: 3,
  SUPERADMIN: 4
} as const
