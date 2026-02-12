// src/pages/marketing/DemoPage.tsx — FischerOS demo request (placeholder)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarCheck } from 'lucide-react';

const navy = '#1a2744';
const bg = '#fafafa';
const bgWarm = '#faf8f5';

export default function DemoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: navy }}
            >
              F
            </div>
            <span className="text-lg font-bold" style={{ color: navy }}>FischerOS</span>
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
          >
            Pricing
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="bg-white rounded-[20px] p-8 sm:p-12 border border-gray-100 shadow-sm text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: navy }}
          >
            <CalendarCheck className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: navy }}>
            Book a Demo
          </h1>

          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            See how FischerOS can transform your hotel operations.
            We&apos;ll walk you through the platform and answer all your questions.
          </p>

          {/* Placeholder form area */}
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 mb-8" style={{ backgroundColor: bgWarm }}>
            <p className="text-sm text-gray-400 font-medium">
              Scheduling widget coming soon.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              In the meantime, reach out at <span className="font-semibold" style={{ color: navy }}>hello@fischeros.com</span>
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
