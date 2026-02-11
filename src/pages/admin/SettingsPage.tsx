import React from 'react';
import { Settings, Shield, Database, Wifi } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-accent">System Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          </div>
          <p className="text-gray-600">Security configuration coming soon...</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-8 h-8 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
          </div>
          <p className="text-gray-600">Data settings coming soon...</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Wifi className="w-8 h-8 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Integration</h3>
          </div>
          <p className="text-gray-600">Integration settings coming soon...</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-8 h-8 text-accent" />
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
          </div>
          <p className="text-gray-600">General configuration coming soon...</p>
        </div>
      </div>
    </div>
  );
}