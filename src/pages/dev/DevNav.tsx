// src/pages/dev/DevNav.tsx - Development Navigation Hub
import { Link } from 'react-router-dom';
import { DEFAULT_SLUG } from '../../config/tenant-defaults';

const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true';
const SLUG = DEFAULT_SLUG;

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
          <h1 className="text-3xl font-bold text-green-400">Dev Navigation</h1>
          <p className="text-gray-400 mt-2">All routes accessible with auth bypass enabled</p>
          <p className="text-gray-500 mt-1 text-sm">Tenant slug: <code className="text-green-300">{SLUG}</code></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Public / Marketing Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Public</h2>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400 transition">/ - Guest Landing</Link></li>
              <li><Link to="/portal" className="hover:text-blue-400 transition">/portal - Staff Portal</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-400 transition">/pricing</Link></li>
              <li><Link to="/demo" className="hover:text-blue-400 transition">/demo</Link></li>
              <li><Link to="/auth/guest" className="hover:text-blue-400 transition">/auth/guest - Guest Login</Link></li>
              <li><Link to="/auth/staff" className="hover:text-blue-400 transition">/auth/staff - Staff Login</Link></li>
              <li><Link to="/auth/admin" className="hover:text-blue-400 transition">/auth/admin - Admin Login</Link></li>
            </ul>
          </div>

          {/* Guest Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">Guest</h2>
            <ul className="space-y-2">
              <li><Link to={`/${SLUG}/guest/dashboard`} className="hover:text-green-400 transition">/{SLUG}/guest/dashboard</Link></li>
              <li><Link to={`/${SLUG}/guest/restaurants`} className="hover:text-green-400 transition">/{SLUG}/guest/restaurants</Link></li>
              <li><Link to={`/${SLUG}/guest/tours`} className="hover:text-green-400 transition">/{SLUG}/guest/tours</Link></li>
              <li><Link to={`/${SLUG}/guest/spa`} className="hover:text-green-400 transition">/{SLUG}/guest/spa</Link></li>
              <li><Link to={`/${SLUG}/guest/requests`} className="hover:text-green-400 transition">/{SLUG}/guest/requests</Link></li>
              <li><Link to={`/${SLUG}/guest/profile`} className="hover:text-green-400 transition">/{SLUG}/guest/profile</Link></li>
            </ul>
          </div>

          {/* Staff Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Staff</h2>
            <ul className="space-y-2">
              <li><Link to={`/${SLUG}/staff/console`} className="hover:text-yellow-400 transition">/{SLUG}/staff/console</Link></li>
              <li><Link to={`/${SLUG}/staff/requests`} className="hover:text-yellow-400 transition">/{SLUG}/staff/requests</Link></li>
              <li><Link to={`/${SLUG}/staff/coordination`} className="hover:text-yellow-400 transition">/{SLUG}/staff/coordination</Link></li>
              <li><Link to={`/${SLUG}/staff/partners`} className="hover:text-yellow-400 transition">/{SLUG}/staff/partners</Link></li>
              <li><Link to={`/${SLUG}/staff/analytics`} className="hover:text-yellow-400 transition">/{SLUG}/staff/analytics</Link></li>
            </ul>
          </div>

          {/* Department Dashboards */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Departments</h2>
            <ul className="space-y-2">
              <li><Link to={`/${SLUG}/staff/restaurant`} className="hover:text-purple-400 transition">/{SLUG}/staff/restaurant</Link></li>
              <li><Link to={`/${SLUG}/staff/spa`} className="hover:text-purple-400 transition">/{SLUG}/staff/spa</Link></li>
              <li><Link to={`/${SLUG}/staff/concierge`} className="hover:text-purple-400 transition">/{SLUG}/staff/concierge</Link></li>
              <li><Link to={`/${SLUG}/staff/housekeeping`} className="hover:text-purple-400 transition">/{SLUG}/staff/housekeeping</Link></li>
              <li><Link to={`/${SLUG}/staff/maintenance`} className="hover:text-purple-400 transition">/{SLUG}/staff/maintenance</Link></li>
              <li><Link to={`/${SLUG}/staff/transportation`} className="hover:text-purple-400 transition">/{SLUG}/staff/transportation</Link></li>
            </ul>
          </div>

          {/* Admin Routes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Admin</h2>
            <ul className="space-y-2">
              <li><Link to={`/${SLUG}/admin/dashboard`} className="hover:text-red-400 transition">/{SLUG}/admin/dashboard</Link></li>
            </ul>
          </div>

          {/* Dev Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Dev Info</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mode: {import.meta.env.MODE}</li>
              <li>Bypass: {DEV_BYPASS ? 'Active' : 'Disabled'}</li>
              <li>Supabase: {import.meta.env.VITE_SUPABASE_URL ? 'Connected' : 'Missing'}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This page is only visible when VITE_DEV_BYPASS=true</p>
        </div>
      </div>
    </div>
  );
}
