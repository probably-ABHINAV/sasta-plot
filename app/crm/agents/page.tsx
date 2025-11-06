'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Users, Mail, Phone } from 'lucide-react'

interface Agent {
  id: string
  username: string | null
  email?: string
  phone_number: string | null
  role_id: number
  is_disabled: boolean
  crm_roles: {
    name: string
    description: string
  }
  created_at: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/crm/agents')
      const data = await res.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Agents</h1>
          <p className="text-gray-600 mt-1">Manage your sales team</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <UserPlus size={20} />
          <span>Add Agent</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Agents</p>
          <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Active Agents</p>
          <p className="text-2xl font-bold text-green-600">{agents.filter(a => !a.is_disabled).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Inactive Agents</p>
          <p className="text-2xl font-bold text-red-600">{agents.filter(a => a.is_disabled).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-6 border rounded-lg ${
                  agent.is_disabled ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-orange-600">
                      {(agent.username || agent.email || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    agent.is_disabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {agent.is_disabled ? 'Inactive' : 'Active'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {agent.username || 'Unnamed Agent'}
                </h3>
                <p className="text-sm text-gray-600 mb-3 capitalize">
                  {agent.crm_roles.name.replace('_', ' ')}
                </p>
                {agent.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Mail size={14} />
                    <span className="truncate">{agent.email}</span>
                  </div>
                )}
                {agent.phone_number && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <span>{agent.phone_number}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agents yet</h3>
            <p className="text-gray-600 mb-4">Add sales agents to help manage your leads</p>
            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Add First Agent
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
