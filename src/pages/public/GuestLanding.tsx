import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Waves, Flower2, Crown, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

export default function GuestLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo + Brand */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent/20 rounded-2xl sm:rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-300 border border-accent/20">
                  <span className="text-foreground font-bold text-lg sm:text-xl">TD</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {SITE_CONFIG.shortName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Beach Resort • Costa Rica</p>
              </div>
            </div>
            
            {/* Staff Portal Link */}
            <a 
              href="/portal" 
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-xl hover:bg-white/50"
            >
              Staff Portal
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-accent/30 mb-4 sm:mb-6 lg:mb-8 shadow-md">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Welcome to Paradise</span>
          </div>
          
          {/* Hero Title - with subtle shadow */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            Experience<br className="sm:hidden" /> Luxury
          </h2>
          
          {/* Hero Description */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Your digital concierge for adventures, dining, spa & wellness — all at your fingertips.
          </p>
          
          {/* CTA Button */}
          <button
            onClick={() => navigate('/auth/guest')}
            className="group inline-flex items-center space-x-2 sm:space-x-3 bg-white text-foreground px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base lg:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-accent/30"
          >
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            <span>Access Guest Services</span>
            <div className="w-2 h-2 bg-accent rounded-full group-hover:animate-pulse"></div>
          </button>
        </div>

        {/* Services Grid - with gold borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
          
          {/* Tours Card */}
          <div className="group bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-accent/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-md group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                <Waves className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Tours & Adventures</h3>
              <p className="text-xs sm:text-sm text-gray-600">60+ unique experiences</p>
            </div>
          </div>

          {/* Restaurants Card */}
          <div className="group bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-accent/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-md group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Restaurants</h3>
              <p className="text-xs sm:text-sm text-gray-600">8 world-class venues</p>
            </div>
          </div>

          {/* Spa Card */}
          <div className="group bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-accent/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-md group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                <Flower2 className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Spa & Wellness</h3>
              <p className="text-xs sm:text-sm text-gray-600">Rejuvenation & relaxation</p>
            </div>
          </div>

          {/* Concierge Card */}
          <div className="group bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-accent/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-md group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Digital Concierge</h3>
              <p className="text-xs sm:text-sm text-gray-600">24/7 assistance</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-accent/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-foreground"></div>
          
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Numbers That Matter</h3>
            <p className="text-xs sm:text-sm text-gray-600">Excellence in every detail</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>300</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Luxury Suites</div>
              <div className="w-8 sm:w-12 h-0.5 bg-accent rounded-full mx-auto mt-2"></div>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>8</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Restaurants</div>
              <div className="w-8 sm:w-12 h-0.5 bg-accent rounded-full mx-auto mt-2"></div>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>60+</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Adventures</div>
              <div className="w-8 sm:w-12 h-0.5 bg-accent rounded-full mx-auto mt-2"></div>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>24/7</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Concierge</div>
              <div className="w-8 sm:w-12 h-0.5 bg-accent rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium">Ready to begin your paradise experience?</span>
          </div>
        </div>
      </main>
    </div>
  );
}