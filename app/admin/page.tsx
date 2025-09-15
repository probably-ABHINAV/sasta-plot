
"use client"

import { useEffect } from "react"

export default function AdminRedirect() {
  useEffect(() => {
    // Redirect to the hidden admin panel
    window.location.replace("/dashboard-admin-2024")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to admin dashboard...</p>
      </div>
    </div>
  )
}
