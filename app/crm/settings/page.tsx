
export default async function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">CRM Settings</h1>
        <p className="text-gray-600 mt-1">Configure your CRM preferences</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CRM Name
              </label>
              <input
                type="text"
                defaultValue="Sasta Plots CRM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Lead Status
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Interested</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email-leads"
                defaultChecked
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                disabled
              />
              <label htmlFor="email-leads" className="ml-2 text-sm text-gray-700">
                Email notifications for new leads
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remind-visits"
                defaultChecked
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                disabled
              />
              <label htmlFor="remind-visits" className="ml-2 text-sm text-gray-700">
                Remind me of upcoming site visits
              </label>
            </div>
          </div>
        </div>

        {/* System Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">System Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">CRM Version</span>
              <span className="text-sm font-medium text-gray-900">2.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-gray-900">Supabase PostgreSQL</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Authentication</span>
              <span className="text-sm font-medium text-gray-900">Supabase Auth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
