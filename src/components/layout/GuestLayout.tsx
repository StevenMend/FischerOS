// src/components/layout/GuestLayout.tsx - MOBILE REAL OPTIMIZADO
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { NAV_CONFIG } from '../../config/routes';
import { 
  Home, UtensilsCrossed, MapPin, Flower2, MessageCircle, 
  LogOut, Bell, Menu, X, Phone, MessageSquare, Sparkles
} from 'lucide-react';

export default function GuestLayout() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const unreadUpdatesCount = 3;
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { path: '/guest/dashboard', label: 'Dashboard', icon: Home },
    { path: '/guest/restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { path: '/guest/tours', label: 'Tours', icon: MapPin },
    { path: '/guest/spa', label: 'Spa', icon: Flower2 },
    { path: '/guest/requests', label: 'My Requests', icon: MessageCircle }
  ];

  const LOGO_BASE64 = "data:image/webp;base64,UklGRnQEAABXRUJQVlA4WAoAAAAQAAAAIwAAIwAAQUxQSG4DAAARoDZt2+I0X9h1PZMEt5C6G7K1lNTdm0yoB7YWqYVgwWFgkVka3CcUq7sjr7u720f/LbvJGxETgKgXzWHGFqNITzbMiSMBgAARLbkg3NHda6t3ldy8ebOYAAiSBKghtM6FcZutsZvl2KUuiyKgJUACAAmAhJw215Pnayk457HH1QoCIMgoCACOmpYBb3t9ZcXlQHAYAAjqUEfXOlZRuqlY9lavcT+uJ8GIAEgQBNPGPOVeW61Dqc0LBjbvIghAhyA0NN4K9FTYXa3m8a09qnLUYQMAkgRBggSYNSkvk7x2o7Ql/oq8rnR/kABJAkRELpk80NA97TAVWTa5+ktdfidAQqshQEIEG8LjDfJlZ87L6pYmVRUaRiAglApCFD29NzE+O91YfHbs4W0zIPYfn63Rkin3rxNb3bv37/fv4Am3xban/iwg+ztGFwGg3qgKhOYAoL8lKEBmNICDJ+1n10USc32dsbiWIhJMTHnbAC4xZdRBDChGEiA0Cf4rYT+aU7KaggkigUapfaukYO5YIAFExB337riLVtRnxOfYhEmIRdm7dtlCyx4P+weTAICakslwMP7P0NNkSVo0XFBhFmddl9+7vnnq6Pj+KIo+nyk1fLBuNKNy5u1wfuVX3R89dOX2Jk/2v9wNQt/2MKge+KPuvXvKysEssSFkGfv2ZvjDt5+2l6YR+jSNT/bPzZizpMlp8LtFZ65RfropwZIxle8OZ0QSD2qbCLM8sN0cbFk3HlhoLqh2UoStFvdWPVLMDN8m1ILcdVZVCjhPNq274r4GrOxtqoynHjj13ygZOu532P1SkTNn1fk6uRWAMclAPQArvWlpUvf2IvVcRevaXTOb6/rPNVvm4v/SNOF8T/E481vzaHr9jeLzLybdz0U0BMi4W+Y7l07ucgVMFGOdG6wVw3UdURBaMjmkdAYD1XcIjtbYCs73WAUJEAD1QO6vGT20Q5UB9IfsNQP96dAlQZIAyJw7lU29dx7eJzhxpDZUfv+4IAASAEEQYO+iNyvVjokQwPCe7iu+6ctLEZEASAC7dv3cXKt0HgfoGxoduP1eRjwjRMmU92pcOxQVYH+/Z5PzgYlRUQfijmOTdOoWwFu2ZWulsNAhQZKghnQ/fHDvSS2A3NEX3/4YEoisAUiQYtnaNatMAGhMTk8R0CUIAlZQOCDgAAAAEAYAnQEqJAAkAD6RKqRSJaGlpZOQsBIJZGv+V7JAXR5uyYUP4x/mQGd7XT2dgUwE95vrxy8aE6PAAP7pC+5973LYp3vSXS4tbXAy1MkMqIzIl+sawdmEBklMNptGNDQpUUr/7AJG8A894cMRyrGeiTvQOjUYlMsN98sHST6dKbnVXoLuE3uVODjk+Zo/waSEKnfy+3ylI6urOWyBE3splQ4rA7LKVsVIAL9Uk1O55SVAEKUeS2SsZYZyg7EvTgyl+di5NDoCxgXsj5+P5r3YzL4r/Rz24VUI6ihoCHC/AAA=";

  // Get user context string
  const getUserContext = () => {
    if (!user) return '';
    return user.room ? `Room ${user.room}` : 'Guest';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark">
      {/* Sticky Header - MOBILE OPTIMIZED */}
      <header className="sticky-header bg-white/95 backdrop-blur-xl border-b border-surface-dark shadow-sm safe-top z-50">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-2.5 sm:py-3">
            {/* Logo + Welcome */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 mr-2">
              <img 
                src={LOGO_BASE64} 
                alt="Tamarindo Diriá" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-xs text-foreground/70 block leading-tight">Welcome Back,</span>
                <span className="font-bold text-foreground text-xs sm:text-sm block truncate leading-tight">{user?.name}</span>
              </div>
            </div>

            {/* Actions - COMPACT */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              <button className="relative w-9 h-9 sm:w-10 sm:h-10 bg-white border-2 border-surface-dark rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-300 flex items-center justify-center">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {unreadUpdatesCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-white">{unreadUpdatesCount}</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white border-2 border-surface-dark rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-300 flex items-center justify-center"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Revenue Navigation - MOBILE SCROLL */}
      <nav className="sticky top-[52px] sm:top-[64px] bg-white/95 backdrop-blur-xl border-b border-surface-dark z-40">
        <div className="w-full overflow-x-auto scrollbar-hidden">
          <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-start md:justify-center items-center gap-1 sm:gap-1.5 md:gap-3 py-1.5 sm:py-2 min-w-max md:min-w-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 px-2.5 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl md:rounded-2xl font-medium transition-all duration-300 whitespace-nowrap border-2 flex-shrink-0 ${
                      isActive
                        ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                        : 'bg-white text-foreground/70 border-surface-dark hover:text-foreground hover:border-primary/40 hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Hamburger Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ top: '52px' }}
          />
          
          <div className="fixed top-[52px] sm:top-[64px] left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-surface-dark z-[46] shadow-2xl modal-content">
            <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-2 sm:space-y-3 max-h-[80vh] overflow-y-auto">
              <button className="w-full h-12 sm:h-14 bg-white border-2 border-red-200 text-red-600 rounded-xl sm:rounded-2xl font-semibold hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Emergency</span>
              </button>
              
              <button className="w-full h-12 sm:h-14 bg-white border-2 border-surface-dark text-foreground rounded-xl sm:rounded-2xl font-semibold hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>Front Desk</span>
              </button>

              <button className="w-full h-12 sm:h-14 bg-white border-2 border-surface-dark text-foreground rounded-xl sm:rounded-2xl font-semibold hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                <span>AI Concierge</span>
              </button>

              <div className="border-t border-surface-dark my-3 sm:my-4"></div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-surface/30 rounded-xl sm:rounded-2xl">
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">{user?.name}</p>
                  <p className="text-xs sm:text-sm text-foreground/70">{getUserContext()}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white border-2 border-red-200 text-red-600 rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-300 flex items-center justify-center"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 safe-bottom pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}