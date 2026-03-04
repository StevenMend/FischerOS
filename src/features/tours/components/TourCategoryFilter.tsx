// // src/components/tours/TourCategoryFilter.tsx - MINIMAL LUXURY STYLE
// import React from 'react';
// import { Filter } from 'lucide-react';

// interface TourCategoryFilterProps {
//   categories: string[];
//   selectedCategory: string;
//   onCategoryChange: (category: string) => void;
// }

// export const TourCategoryFilter: React.FC<TourCategoryFilterProps> = ({
//   categories,
//   selectedCategory,
//   onCategoryChange
// }) => {
//   return (
//     <div className="mb-12">
//       <div className="flex items-center space-x-4 mb-6">
//         <div className="w-10 h-10 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center">
//           <Filter className="w-5 h-5 text-primary" />
//         </div>
//         <span className="font-medium text-foreground font-display text-lg">Filter by activity:</span>
//       </div>
//       <div className="flex flex-wrap gap-3">
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => onCategoryChange(category)}
//             className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
//               selectedCategory === category
//                 ? 'bg-primary text-white shadow-lg border-2 border-primary'
//                 : 'bg-white text-foreground hover:shadow-md border-2 border-surface-dark hover:border-primary'
//             }`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };
// src/components/tours/TourCategoryFilter.tsx - MOBILE SCROLLABLE
import React from 'react';
import { Filter } from 'lucide-react';

interface TourCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const TourCategoryFilter: React.FC<TourCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-surface-dark rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <span className="font-medium text-foreground text-sm sm:text-base lg:text-lg">Filter by activity:</span>
      </div>
      
      {/* MOBILE: Horizontal scroll, DESKTOP: Wrap */}
      <div className="overflow-x-auto scrollbar-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex sm:flex-wrap gap-2 sm:gap-3 min-w-max sm:min-w-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg border-2 border-primary'
                  : 'bg-white text-foreground hover:shadow-md border-2 border-surface-dark hover:border-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};