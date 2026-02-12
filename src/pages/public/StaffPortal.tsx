// src/pages/public/StaffPortal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart3, Activity, Shield, Crown } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

export default function StaffPortal() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'staff' | 'admin' | null>(null);

  const handleRoleSelect = (role: 'staff' | 'admin') => {
    setSelectedRole(role);
    navigate(`/auth/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark relative overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo + Brand */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl sm:rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-white border-2 border-surface-dark rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
                  <span className="text-foreground font-bold text-lg sm:text-2xl">{SITE_CONFIG.shortName.split(' ').map(w => w[0]).join('')}</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  Operations Portal
                </h1>
                <p className="text-xs sm:text-sm text-foreground/80 font-medium">Staff & Administrative Access</p>
              </div>
            </div>
            
            {/* Guest Portal Link */}
            <a 
              href="/" 
              className="text-xs sm:text-sm text-foreground/70 hover:text-primary transition-colors font-medium px-3 py-2 rounded-xl hover:bg-white/50"
            >
              Guest Portal
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-surface-dark mb-4 sm:mb-6">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-foreground font-medium text-xs sm:text-sm">Secure Access Required</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Secure Access Portal
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80">
              Choose your access level to continue
            </p>
          </div>

          {/* Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto mb-8 sm:mb-12">
            
            {/* Staff Console Card */}
            <div 
              onClick={() => handleRoleSelect('staff')}
              className={`group relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 overflow-hidden ${
                selectedRole === 'staff' 
                  ? 'border-primary shadow-lg' 
                  : 'border-surface-dark shadow-lg'
              }`}
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-3xl"></div>
              
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Staff Console
                </h3>
                <p className="text-sm sm:text-base text-foreground/80 mb-4 sm:mb-6">
                  Manage guest requests, coordinate services, track operations
                </p>
                
                {/* Status Badge */}
                <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20">
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm text-primary font-medium">Staff Access</span>
                </div>
              </div>
            </div>

            {/* Admin Dashboard Card */}
            <div 
              onClick={() => handleRoleSelect('admin')}
              className={`group relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 overflow-hidden ${
                selectedRole === 'admin' 
                  ? 'border-accent shadow-lg' 
                  : 'border-surface-dark shadow-lg'
              }`}
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-3xl"></div>
              
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Admin Dashboard
                </h3>
                <p className="text-sm sm:text-base text-foreground/80 mb-4 sm:mb-6">
                  Operations overview, analytics, system management
                </p>
                
                {/* Status Badge */}
                <div className="inline-flex items-center space-x-2 bg-accent/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-accent/20">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                  <span className="text-xs sm:text-sm text-accent font-medium">Executive Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-surface-dark">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/80">Secure authenticated access required</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}