// // src/components/tours/ExclusiveExperiencesBanner.tsx - CON CAROUSEL PRO
// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Star, Clock, Users, ArrowRight, Crown } from 'lucide-react';

// interface PremiumTour {
//   id: string;
//   name: string;
//   image: string;
//   price: string;
//   originalPrice?: string;
//   rating: number;
//   duration: string;
//   groupSize: string;
//   description: string;
//   badge?: string;
// }

// interface ExclusiveExperiencesBannerProps {
//   availableToday?: number;
//   memberDiscount?: number;
//   limitedSpots?: boolean;
// }

// export const ExclusiveExperiencesBanner: React.FC<ExclusiveExperiencesBannerProps> = ({
//   availableToday = 3,
//   memberDiscount = 25,
//   limitedSpots = true
// }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const premiumTours: PremiumTour[] = [
//     {
//       id: '1',
//       name: 'VIP Catamaran Sunset Experience',
//       image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop&auto=format',
//       price: '$195',
//       originalPrice: '$260',
//       rating: 4.9,
//       duration: '4 hours',
//       groupSize: 'Max 12',
//       description: 'Private deck • Premium bar • Gourmet dinner • Professional photos',
//       badge: 'Most Popular'
//     },
//     {
//       id: '2', 
//       name: 'Helicopter Coastal Adventure',
//       image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop&auto=format',
//       price: '$350',
//       originalPrice: '$450',
//       rating: 5.0,
//       duration: '2 hours',
//       groupSize: 'Max 4',
//       description: 'Aerial coastline views • Landing on secluded beach • Champagne service',
//       badge: 'Exclusive'
//     },
//     {
//       id: '3',
//       name: 'Private Beach & Spa Retreat',
//       image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop&auto=format',
//       price: '$280',
//       originalPrice: '$370',
//       rating: 4.8,
//       duration: '6 hours',
//       groupSize: 'Max 8',
//       description: 'Secluded cove access • Couples massage • Gourmet picnic • Butler service',
//       badge: 'New'
//     }
//   ];

//   // Auto-advance carousel
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % premiumTours.length);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, []);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % premiumTours.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + premiumTours.length) % premiumTours.length);
//   };

//   const currentTour = premiumTours[currentSlide];

//   return (
//     <div className="mb-12 bg-white/90 backdrop-blur-xl rounded-3xl border border-surface-dark shadow-lg overflow-hidden">
//       {/* Carousel Container */}
//       <div className="relative h-96">
//         {/* Background Image */}
//         <div 
//           className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
//           style={{ backgroundImage: `url(${currentTour.image})` }}
//         >
//           <div className="absolute inset-0 bg-black/40"></div>
//         </div>

//         {/* Navigation Arrows */}
//         <button 
//           onClick={prevSlide}
//           className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 z-10"
//         >
//           <ChevronLeft className="w-6 h-6 text-white" />
//         </button>
        
//         <button 
//           onClick={nextSlide}
//           className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 z-10"
//         >
//           <ChevronRight className="w-6 h-6 text-white" />
//         </button>

//         {/* Content Overlay */}
//         <div className="absolute inset-0 flex items-end p-8 z-10">
//           <div className="w-full">
//             <div className="flex items-start justify-between mb-6">
//               <div className="max-w-2xl">
//                 {/* Badge */}
//                 {currentTour.badge && (
//                   <div className="inline-flex items-center space-x-2 bg-accent/90 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
//                     <Crown className="w-4 h-4 text-white" />
//                     <span className="text-white font-semibold text-sm">{currentTour.badge}</span>
//                   </div>
//                 )}

//                 {/* Title */}
//                 <h2 className="text-4xl font-bold text-white font-display mb-3">
//                   {currentTour.name}
//                 </h2>

//                 {/* Description */}
//                 <p className="text-xl text-white/90 mb-4 leading-relaxed">
//                   {currentTour.description}
//                 </p>

//                 {/* Stats */}
//                 <div className="flex items-center space-x-6 text-white/80 mb-6">
//                   <div className="flex items-center space-x-2">
//                     <Star className="w-5 h-5 text-yellow-400 fill-current" />
//                     <span className="font-medium">{currentTour.rating}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Clock className="w-5 h-5" />
//                     <span>{currentTour.duration}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Users className="w-5 h-5" />
//                     <span>{currentTour.groupSize}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Pricing & CTA */}
//               <div className="text-right">
//                 <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-4">
//                   <div className="mb-3">
//                     {currentTour.originalPrice && (
//                       <div className="text-gray-500 line-through text-lg">{currentTour.originalPrice}</div>
//                     )}
//                     <div className="text-3xl font-bold text-foreground">{currentTour.price}</div>
//                     <div className="text-sm text-green-600 font-medium">{memberDiscount}% Member Discount</div>
//                   </div>
                  
//                   {limitedSpots && (
//                     <div className="text-center mb-4">
//                       <div className="text-accent font-bold">{availableToday} spots left</div>
//                       <div className="text-xs text-foreground/70">available today</div>
//                     </div>
//                   )}

//                   <button className="w-full bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105">
//                     <span>Book Now</span>
//                     <ArrowRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Carousel Indicators */}
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
//           {premiumTours.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 index === currentSlide ? 'bg-white' : 'bg-white/50'
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Bottom Info Bar */}
//       <div className="p-6 bg-white/95 backdrop-blur-sm">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-8">
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
//               <span className="text-sm text-foreground/70">Concierge curated</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
//               <span className="text-sm text-foreground/70">Small groups only</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
//               <span className="text-sm text-foreground/70">Premium partners</span>
//             </div>
//           </div>
          
//           <button className="bg-white border-2 border-surface-dark text-foreground px-6 py-3 rounded-2xl font-semibold hover:shadow-md transition-all duration-300">
//             View All Premium Tours
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// src/components/tours/ExclusiveExperiencesBanner.tsx - MOBILE FIXED NO OVERFLOW
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, Users, Crown } from 'lucide-react';

interface PremiumTour {
  id: string;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: number;
  duration: string;
  groupSize: string;
  description: string;
  badge?: string;
}

interface ExclusiveExperiencesBannerProps {
  availableToday?: number;
  memberDiscount?: number;
  limitedSpots?: boolean;
}

export const ExclusiveExperiencesBanner: React.FC<ExclusiveExperiencesBannerProps> = ({
  availableToday = 3,
  memberDiscount = 25,
  limitedSpots = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const premiumTours: PremiumTour[] = [
    {
      id: '1',
      name: 'VIP Catamaran Sunset',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop&auto=format',
      price: '$195',
      originalPrice: '$260',
      rating: 4.9,
      duration: '4 hours',
      groupSize: 'Max 12',
      description: 'Private deck • Premium bar • Gourmet dinner',
      badge: 'Popular'
    },
    {
      id: '2', 
      name: 'Helicopter Coastal',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop&auto=format',
      price: '$350',
      originalPrice: '$450',
      rating: 5.0,
      duration: '2 hours',
      groupSize: 'Max 4',
      description: 'Aerial views • Beach landing • Champagne',
      badge: 'Exclusive'
    },
    {
      id: '3',
      name: 'Beach & Spa Retreat',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop&auto=format',
      price: '$280',
      originalPrice: '$370',
      rating: 4.8,
      duration: '6 hours',
      groupSize: 'Max 8',
      description: 'Cove • Massage • Picnic • Butler',
      badge: 'New'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % premiumTours.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % premiumTours.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + premiumTours.length) % premiumTours.length);

  const currentTour = premiumTours[currentSlide];

  return (
    <div className="mb-6 sm:mb-8 bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-surface-dark shadow-lg overflow-hidden">
      
      {/* Carousel - MOBILE OPTIMIZED */}
      <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
        {/* Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${currentTour.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>

        {/* Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 z-10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 z-10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-5 z-10">
          
          {/* Badge */}
          {currentTour.badge && (
            <div className="inline-flex items-center space-x-1 bg-accent/90 backdrop-blur-sm px-2 py-0.5 rounded-full mb-2 w-fit">
              <Crown className="w-3 h-3 text-white" />
              <span className="text-white font-semibold text-[10px]">{currentTour.badge}</span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
            {currentTour.name}
          </h2>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-white/90 mb-2 leading-snug">
            {currentTour.description}
          </p>

          {/* Stats & Price */}
          <div className="flex items-end justify-between gap-2">
            {/* Stats */}
            <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-[10px] sm:text-xs flex-1 min-w-0">
              <div className="flex items-center space-x-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                <span className="font-medium">{currentTour.rating}</span>
              </div>
              <div className="flex items-center space-x-0.5">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{currentTour.duration}</span>
              </div>
              <div className="flex items-center space-x-0.5">
                <Users className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{currentTour.groupSize}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 flex-shrink-0">
              <div className="text-right">
                {currentTour.originalPrice && (
                  <div className="text-gray-500 line-through text-[10px]">{currentTour.originalPrice}</div>
                )}
                <div className="text-lg sm:text-xl font-bold text-foreground leading-none">{currentTour.price}</div>
                <div className="text-[9px] text-green-600 font-medium">{memberDiscount}% off</div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-10">
          {premiumTours.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-3 sm:p-4 bg-white/95">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
              <span className="text-foreground/70">Curated</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <span className="text-foreground/70">Small groups</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-foreground rounded-full animate-pulse"></div>
              <span className="text-foreground/70">Premium</span>
            </div>
          </div>
          
          <button className="bg-white border-2 border-surface-dark text-foreground px-3 py-1.5 rounded-xl font-semibold text-[10px] sm:text-xs hover:shadow-md transition-all whitespace-nowrap">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};