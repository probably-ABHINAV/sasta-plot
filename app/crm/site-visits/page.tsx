'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, MapPin } from 'lucide-react'

interface SiteVisit {
  id: number
  visit_date_time: string
  status: string
  notes: string | null
  confirmation_summary: string | null
  crm_leads: {
    id: number
    name: string
    phone: string
    email: string | null
  } | null
}

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState<SiteVisit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/crm/site-visits')
      const data = await res.json()
      setVisits(data.visits || [])
    } catch (error) {
      console.error('Error fetching visits:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupedVisits = visits.reduce((acc, visit) => {
    const date = new Date(visit.visit_date_time).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(visit)
    return acc
  }, {} as Record<string, SiteVisit[]>)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Visits</h1>
          <p className="text-gray-600 mt-1">Schedule and track site visits</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          <Plus size={20} />
          <span>Schedule Visit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">
            {visits.filter(v => v.status === 'scheduled').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {visits.filter(v => v.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Rescheduled</p>
          <p className="text-2xl font-bold text-yellow-600">
            {visits.filter(v => v.status === 'rescheduled').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">
            {visits.filter(v => v.status === 'cancelled').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : Object.keys(groupedVisits).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedVisits).map(([date, dateVisits]) => (
              <div key={date}>
                <h3 className="font-semibold text-gray-900 mb-3">{date}</h3>
                <div className="space-y-3">
                  {dateVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <MapPin size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {visit.crm_leads?.name || 'Unknown Lead'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(visit.visit_date_time).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {visit.crm_leads?.phone && ` • ${visit.crm_leads.phone}`}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        visit.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        visit.status === 'completed' ? 'bg-green-100 text-green-700' :
                        visit.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No site visits scheduled</h3>
            <p className="text-gray-600 mb-4">Schedule site visits for your leads</p>
            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Schedule First Visit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
