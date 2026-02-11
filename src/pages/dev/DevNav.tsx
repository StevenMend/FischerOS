// src/pages/dev/DevNav.tsx - Development Navigation Hub
import { Link } from 'react-router-dom';

const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true';

export default function DevNav() {
  if (!DEV_BYPASS) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Dev Navigation Disabled</h1>
          <p className="text-gray-600 mt-2">Set VITE_DEV_BYPASS=true in .env to enable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400">🔧 Dev Navigation</h1>
          <p className="text-gray-400 mt-2">All routes accessible with auth bypass enabled</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Public Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">🌐 Public</h2>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400 transition">/ - Guest Landing</Link></li>
              <li><Link to="/portal" className="hover:text-blue-400 transition">/portal - Staff Portal</Link></li>
              <li><Link to="/auth/guest" className="hover:text-blue-400 transition">/auth/guest - Guest Login</Link></li>
              <li><Link to="/auth/staff" className="hover:text-blue-400 transition">/auth/staff - Staff Login</Link></li>
              <li><Link to="/auth/admin" className="hover:text-blue-400 transition">/auth/admin - Admin Login</Link></li>
            </ul>
          </div>

          {/* Guest Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">🏨 Guest</h2>
            <ul className="space-y-2">
              <li><Link to="/guest/dashboard" className="hover:text-green-400 transition">/guest/dashboard</Link></li>
              <li><Link to="/guest/restaurants" className="hover:text-green-400 transition">/guest/restaurants</Link></li>
              <li><Link to="/guest/tours" className="hover:text-green-400 transition">/guest/tours</Link></li>
              <li><Link to="/guest/spa" className="hover:text-green-400 transition">/guest/spa</Link></li>
              <li><Link to="/guest/requests" className="hover:text-green-400 transition">/guest/requests</Link></li>
              <li><Link to="/guest/profile" className="hover:text-green-400 transition">/guest/profile</Link></li>
            </ul>
          </div>

          {/* Staff Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">👷 Staff</h2>
            <ul className="space-y-2">
              <li><Link to="/staff/console" className="hover:text-yellow-400 transition">/staff/console</Link></li>
              <li><Link to="/staff/requests" className="hover:text-yellow-400 transition">/staff/requests</Link></li>
              <li><Link to="/staff/coordination" className="hover:text-yellow-400 transition">/staff/coordination</Link></li>
              <li><Link to="/staff/partners" className="hover:text-yellow-400 transition">/staff/partners</Link></li>
              <li><Link to="/staff/analytics" className="hover:text-yellow-400 transition">/staff/analytics</Link></li>
            </ul>
          </div>

          {/* Department Dashboards */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">🏢 Departments</h2>
            <ul className="space-y-2">
              <li><Link to="/staff/restaurant" className="hover:text-purple-400 transition">/staff/restaurant</Link></li>
              <li><Link to="/staff/spa" className="hover:text-purple-400 transition">/staff/spa</Link></li>
              <li><Link to="/staff/concierge" className="hover:text-purple-400 transition">/staff/concierge</Link></li>
              <li><Link to="/staff/concierge/tours" className="hover:text-purple-400 transition">/staff/concierge/tours</Link></li>
              <li><Link to="/staff/housekeeping" className="hover:text-purple-400 transition">/staff/housekeeping</Link></li>
              <li><Link to="/staff/maintenance" className="hover:text-purple-400 transition">/staff/maintenance</Link></li>
              <li><Link to="/staff/transportation" className="hover:text-purple-400 transition">/staff/transportation</Link></li>
            </ul>
          </div>

          {/* Admin Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">⚙️ Admin</h2>
            <ul className="space-y-2">
              <li><Link to="/admin/dashboard" className="hover:text-red-400 transition">/admin/dashboard</Link></li>
            </ul>
          </div>

          {/* Dev Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">ℹ️ Dev Info</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mode: {import.meta.env.MODE}</li>
              <li>Bypass: {DEV_BYPASS ? '✅ Active' : '❌ Disabled'}</li>
              <li>Supabase: {import.meta.env.VITE_SUPABASE_URL ? '✅ Connected' : '❌ Missing'}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💡 Tip: This page is only visible when VITE_DEV_BYPASS=true</p>
        </div>
      </div>
    </div>
  );
}
