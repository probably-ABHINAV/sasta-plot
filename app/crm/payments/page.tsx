'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'

interface Payment {
  id: number
  amount: number
  due_date: string
  status: string
  paid_date: string | null
  notes: string | null
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const todaysDue = payments.filter(p => p.due_date === today && p.status !== 'paid')
  const weeksDue = payments.filter(p => p.due_date <= weekFromNow && p.due_date >= today && p.status !== 'paid')
  const overdue = payments.filter(p => p.due_date < today && p.status !== 'paid')

  const todaysAmount = todaysDue.reduce((sum, p) => sum + Number(p.amount), 0)
  const weeksAmount = weeksDue.reduce((sum, p) => sum + Number(p.amount), 0)
  const overdueAmount = overdue.reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Schedules</h1>
        <p className="text-gray-600 mt-1">Track due payments and payment history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Today's Due</p>
          <p className="text-2xl font-bold text-orange-600">₹{todaysAmount.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-500 mt-1">{todaysDue.length} payments</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">This Week</p>
          <p className="text-2xl font-bold text-blue-600">₹{weeksAmount.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-500 mt-1">{weeksDue.length} payments</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">₹{overdueAmount.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-500 mt-1">{overdue.length} payments</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment schedules</h3>
            <p className="text-gray-600">Payment schedules will appear here once bookings are created</p>
          </div>
        )}
      </div>
    </div>
  )
}
