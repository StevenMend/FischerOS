// // src/pages/public/LandingPage.tsx - New Landing Page (Placeholder)
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, Users, BarChart3, Activity, Zap } from 'lucide-react';
// import { ROUTE_PATHS } from '../../config/routes';

// export default function LandingPage() {
//   const navigate = useNavigate();
//   const [selectedCard, setSelectedCard] = useState<string | null>(null);

//   const handleCardClick = (cardType: 'guest' | 'staff' | 'admin') => {
//     setSelectedCard(cardType);
//     navigate(ROUTE_PATHS.auth[cardType]);
//   };

//   const activityStats = {
//     guests: 47,
//     staff: 12,
//     properties: 3
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 relative overflow-hidden page-enter gpu-accelerated">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute top-20 left-20 w-32 h-32 bg-blue-900 rounded-full blur-3xl"></div>
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl opacity-10 animate-pulse"></div>
//           <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent rounded-full blur-3xl opacity-15 animate-pulse delay-1000"></div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary rounded-full blur-3xl opacity-8"></div>
//           <div className="absolute top-10 right-1/3 w-24 h-24 bg-accent rounded-full blur-2xl opacity-12 animate-pulse delay-500"></div>
//           <div className="absolute bottom-32 left-1/3 w-36 h-36 bg-primary rounded-full blur-3xl opacity-6"></div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
//         {/* Hero Section Premium */}
//         <div className="text-center mb-16 relative">
//           <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full blur-sm animate-float"></div>
//           <div className="absolute -top-4 -right-12 w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-sm animate-float delay-1000"></div>

//           <div className="relative mb-8">
//             <div className="w-28 h-28 mx-auto bg-gradient-to-br from-primary via-primary to-primary-dark rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-500 ease-out gpu-accelerated animate-float-subtle">
//               <span className="text-white font-bold text-3xl tracking-tight">TD</span>
//               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
//             </div>
//             <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-transparent to-primary/20 rounded-full blur-xl opacity-50 animate-pulse"></div>
//           </div>

//           <div className="relative">
//             <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
//               Tamarindo Diriá
//             </h1>
//             <div className="absolute -inset-2 bg-gradient-to-r from-accent/10 via-transparent to-primary/10 blur-2xl opacity-30 -z-10"></div>
//           </div>

//           <div className="relative">
//             <p className="text-2xl md:text-3xl font-medium bg-gradient-to-r from-primary/80 to-primary-dark/80 bg-clip-text text-transparent mb-6">
//               Digital Operations Hub
//             </p>
//             <div className="flex items-center justify-center space-x-8 text-primary/60 text-sm font-medium">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full animate-pulse"></div>
//                 <span>$25M Annual Operations</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse delay-500"></div>
//                 <span>Real-time Coordination</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full animate-pulse delay-1000"></div>
//                 <span>Luxury Hospitality</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Access Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
//           {/* Guest Access Card */}
//           <div 
//             onClick={() => handleCardClick('guest')}
//             className={`group relative bg-gradient-to-br from-surface/90 via-[#fefae0]/80 to-accent-light/70 backdrop-blur-xl rounded-3xl p-8 cursor-pointer card-interactive ripple-effect gpu-accelerated ${selectedCard === 'guest' ? 'ring-4 ring-amber-300 pulse-glow' : ''}`}
//           >
//             <div className="relative text-center">
//               <div className="relative w-20 h-20 mx-auto mb-8 icon-bounce">
//                 <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25">
//                   <User className="w-10 h-10 text-white" />
//                 </div>
//               </div>
//               <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-4">
//                 Guest Access
//               </h3>
//               <p className="text-primary/70 text-base leading-relaxed mb-8">
//                 Browse services, make requests, track reservations
//               </p>
//               <div className="mb-8">
//                 <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100/80 to-green-100/80 backdrop-blur-sm text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-200/50 hover:scale-105 transition-all duration-200 ease-out">
//                   <Activity className="w-4 h-4" />
//                   <span>{activityStats.guests} Active Guests</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Staff Portal Card */}
//           <div 
//             onClick={() => handleCardClick('staff')}
//             className={`group relative bg-gradient-to-br from-primary/95 via-primary-dark/90 to-primary/85 backdrop-blur-xl rounded-3xl p-8 cursor-pointer card-interactive ripple-effect gpu-accelerated ${selectedCard === 'staff' ? 'ring-4 ring-blue-400 pulse-glow' : ''}`}
//           >
//             <div className="relative text-center">
//               <div className="relative w-20 h-20 mx-auto mb-8 icon-bounce">
//                 <div className="w-full h-full bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl shadow-black/20 border border-white/20">
//                   <Users className="w-10 h-10 text-white" />
//                 </div>
//               </div>
//               <h3 className="text-3xl font-bold text-white mb-4">
//                 Staff Portal
//               </h3>
//               <p className="text-white/80 text-base leading-relaxed mb-8">
//                 Manage queues, coordinate services, guest communication
//               </p>
//               <div className="mb-8">
//                 <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 hover:scale-105 transition-all duration-200 ease-out">
//                   <Activity className="w-4 h-4" />
//                   <span>{activityStats.staff} On Duty</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Admin Dashboard Card */}
//           <div 
//             onClick={() => handleCardClick('admin')}
//             className={`group relative bg-gradient-to-br from-accent/95 via-accent-dark/90 to-accent/85 backdrop-blur-xl rounded-3xl p-8 cursor-pointer card-interactive ripple-effect gpu-accelerated ${selectedCard === 'admin' ? 'ring-4 ring-amber-200 pulse-glow' : ''}`}
//           >
//             <div className="relative text-center">
//               <div className="relative w-20 h-20 mx-auto mb-8 icon-bounce">
//                 <div className="w-full h-full bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl shadow-black/20 border border-white/20">
//                   <BarChart3 className="w-10 h-10 text-white" />
//                 </div>
//               </div>
//               <h3 className="text-3xl font-bold text-white mb-4">
//                 Admin Dashboard
//               </h3>
//               <p className="text-white/80 text-base leading-relaxed mb-8">
//                 Operations overview, analytics, system management
//               </p>
//               <div className="mb-8">
//                 <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 hover:scale-105 transition-all duration-200 ease-out">
//                   <Activity className="w-4 h-4" />
//                   <span>{activityStats.properties} Properties</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-20 text-center relative">
//           <div className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-lg hover:scale-105 transition-all duration-200 ease-out gpu-accelerated">
//             <div className="flex items-center space-x-2 text-primary font-medium">
//               <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full animate-pulse"></div>
//               <Zap className="w-4 h-4" />
//               <span className="text-sm">Live Operations Center</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }