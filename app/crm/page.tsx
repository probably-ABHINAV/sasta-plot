import { getServerSupabase } from '@/lib/supabase/server'
import { getCurrentUserProfile, ROLES } from '@/lib/crm/auth'
import { Users, Target, Calendar, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default async function CRMDashboard() {
  const supabase = getServerSupabase()
  const profile = await getCurrentUserProfile()

  const today = new Date().toISOString().split('T')[0]

  const [
    leadsResult,
    agentsResult,
    siteVisitsResult,
    paymentsResult,
    confirmationsResult,
    recentLeads,
    upcomingVisits
  ] = await Promise.all([
    supabase.from('crm_leads').select('id', { count: 'exact' }),
    supabase.from('crm_profiles').select('id', { count: 'exact' }).eq('role_id', ROLES.SALES_AGENT).eq('is_disabled', false),
    supabase.from('crm_site_visits').select('id', { count: 'exact' }).gte('visit_date_time', today).lt('visit_date_time', `${today}T23:59:59`).in('status', ['scheduled', 'rescheduled']),
    supabase.from('crm_payment_schedules').select('id, amount', { count: 'exact' }).eq('due_date', today).neq('status', 'paid'),
    supabase.from('crm_site_visits').select('id', { count: 'exact' }).gte('visit_date_time', today).lt('visit_date_time', `${today}T23:59:59`).not('confirmation_summary', 'is', null),
    supabase.from('crm_leads').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('crm_site_visits').select(`
      *,
      crm_leads (
        id,
        name,
        phone
      )
    `).gte('visit_date_time', new Date().toISOString()).order('visit_date_time', { ascending: true }).limit(5)
  ])

  const totalPaymentsAmount = paymentsResult.data?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0

  const stats = [
    {
      title: 'Total Leads',
      value: leadsResult.count || 0,
      icon: <Target className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      change: 'All time',
      href: '/crm/leads'
    },
    {
      title: 'Sales Agents',
      value: agentsResult.count || 0,
      icon: <Users className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-50',
      change: 'Active',
      href: '/crm/agents'
    },
    {
      title: "Today's Site Visits",
      value: siteVisitsResult.count || 0,
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50',
      change: 'Scheduled',
      href: '/crm/site-visits'
    },
    {
      title: "Today's Due Payments",
      value: `₹${totalPaymentsAmount.toLocaleString('en-IN')}`,
      icon: <DollarSign className="w-6 h-6 text-orange-600" />,
      bgColor: 'bg-orange-50',
      change: `${paymentsResult.count || 0} pending`,
      href: '/crm/payments'
    },
    {
      title: 'Confirmations Today',
      value: confirmationsResult.count || 0,
      icon: <CheckCircle className="w-6 h-6 text-teal-600" />,
      bgColor: 'bg-teal-50',
      change: 'Completed'
    },
    {
      title: 'Conversion Rate',
      value: '0%',
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      change: 'Last 30 days'
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back, {profile?.username || 'Admin'}! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          stat.href ? (
            <Link
              key={index}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          ) : (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <Link href="/crm/leads" className="text-sm text-orange-600 hover:text-orange-700">View all →</Link>
          </div>
          {recentLeads.data && recentLeads.data.length > 0 ? (
            <div className="space-y-3">
              {recentLeads.data.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No leads yet. Start adding leads to see them here.</p>
              <Link href="/crm/leads" className="mt-3 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Add First Lead
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Site Visits</h3>
            <Link href="/crm/site-visits" className="text-sm text-orange-600 hover:text-orange-700">View all →</Link>
          </div>
          {upcomingVisits.data && upcomingVisits.data.length > 0 ? (
            <div className="space-y-3">
              {upcomingVisits.data.map((visit: any) => (
                <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{visit.crm_leads?.name}</p>
                    <p className="text-sm text-gray-600">{new Date(visit.visit_date_time).toLocaleString('en-IN')}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                    {visit.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No site visits scheduled.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">CRM System Active</h3>
        <p className="text-orange-100 mb-4">
          Your complete CRM is now integrated with Sasta Plots. Manage leads, track site visits, monitor payments, and run campaigns all in one place.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/crm/leads"
            className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Manage Leads
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors border border-white"
          >
            View Website
          </Link>
        </div>
      </div>
    </div>
  )
}
