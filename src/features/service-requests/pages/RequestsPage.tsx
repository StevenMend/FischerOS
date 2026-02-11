// // src/features/service-requests/pages/RequestsPage.tsx - UPDATED WITH REAL-TIME
// import React, { useState } from 'react';
// import { Plus, Filter, Sparkles, X } from 'lucide-react';
// import { useGuestRequests } from '../../../hooks/guest/useGuestRequests';
// import GuestRequestCard from '../components/GuestRequestCard';
// import RatingModal from '../components/RatingModal';
// import { REQUEST_TYPES } from '../hooks/useServiceRequests';
// import { supabase } from '../../../lib/api/supabase';
// import { AuthService, GuestService, DepartmentService, PropertyService } from '../../../lib/services';

// export default function RequestsPage() {
//   console.log('📋 RequestsPage render - UPDATED with real-time');
  
//   const {
//     activeRequests,
//     completedRequests,
//     allRequests,
//     loading,
//     error,
//     submitRating,
//     hasUnratedCompleted,
//     newCompletedIds,
//     markAsViewed,
//     refetch
//   } = useGuestRequests();

//   const [showNewRequestModal, setShowNewRequestModal] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('all');
//   const [ratingModalOpen, setRatingModalOpen] = useState(false);
//   const [selectedRequestForRating, setSelectedRequestForRating] = useState<any>(null);
//   const [newRequest, setNewRequest] = useState<Partial<CreateRequestDTO>>({
//     type: 'general',
//     priority: 'medium',
//     title: '',
//     description: ''
//   });
//   const [submittingRequest, setSubmittingRequest] = useState(false);

//   const getTypeLabel = (type: RequestType): string => {
//     return type.split('-').map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1)
//     ).join(' ');
//   };

//   const handleOpenRating = (request: any) => {
//     console.log('⭐ Opening rating modal for:', request.id);
//     setSelectedRequestForRating(request);
//     setRatingModalOpen(true);
//     markAsViewed(request.id);
//   };

//   const handleSubmitRating = async (rating: number, feedback?: string) => {
//     if (!selectedRequestForRating) return;
//     await submitRating(selectedRequestForRating.id, rating, feedback);
//   };

//   const handleSubmitRequest = async () => {
//   if (!newRequest.title || !newRequest.description || !newRequest.type) {
//     alert('Please fill all required fields');
//     return;
//   }

//   try {
//     setSubmittingRequest(true);
//     console.log('📝 Creating new request:', newRequest);

//     // Get user ID
//     const userId = await AuthService.getCurrentUserId();
    
//     // Get guest info
//     const guestInfo = await GuestService.getGuestInfo(userId);
    
//     // Get department ID
//     const departmentId = await DepartmentService.getDepartmentIdByType(newRequest.type || 'general');
    
//     // Get property ID
//     const propertyId = await PropertyService.getDefaultPropertyId();

//     // Create request
//     const { data, error } = await supabase
//       .from('service_requests')
//       .insert({
//         guest_id: userId,
//         guest_name: guestInfo.name,
//         room_number: guestInfo.room_number,
//         title: newRequest.title,
//         description: newRequest.description,
//         type: newRequest.type,
//         priority: newRequest.priority || 'medium',
//         status: 'pending',
//         department_id: departmentId,
//         property_id: propertyId
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     console.log('✅ Request created successfully:', data);
    
//     // Reset form
//     setNewRequest({
//       type: 'general',
//       priority: 'medium',
//       title: '',
//       description: ''
//     });
//     setShowNewRequestModal(false);
    
//     // Refetch requests
//     await refetch();
//   } catch (error) {
//     console.error('❌ Failed to create request:', error);
//     alert('Failed to create request. Please try again.');
//   } finally {
//     setSubmittingRequest(false);
//   }
// };

//   const handleQuickRequest = (type: RequestType) => {
//     console.log('⚡ Quick request:', type);
//     setNewRequest({
//       type,
//       priority: 'medium',
//       title: getTypeLabel(type),
//       description: ''
//     });
//     setShowNewRequestModal(true);
//   };

//   // Filter requests
//   const displayedRequests = selectedFilter === 'all' 
//     ? allRequests 
//     : selectedFilter === 'active' 
//       ? activeRequests 
//       : completedRequests;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-foreground font-semibold">Loading your requests...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center p-4">
//         <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 max-w-md">
//           <h3 className="text-red-800 font-bold text-xl mb-2">Error Loading Requests</h3>
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark relative overflow-hidden p-4 sm:p-6 lg:p-8">
//       {/* Background decorations */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 right-20 w-40 h-40 bg-foreground/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       <div className="relative z-10 max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
//           <div className="flex-1">
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2 flex items-center space-x-2">
//               <span>My Requests</span>
//               {hasUnratedCompleted && (
//                 <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center space-x-1">
//                   <Sparkles className="w-3 h-3" />
//                   <span>Rate Now</span>
//                 </span>
//               )}
//             </h1>
//             <p className="text-sm sm:text-base text-foreground/80">
//               {allRequests.length} total • {activeRequests.length} active • {completedRequests.length} completed
//             </p>
//           </div>
          
//           <button 
//             onClick={() => setShowNewRequestModal(true)}
//             className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
//           >
//             <Plus className="w-5 h-5" />
//             <span>New Request</span>
//           </button>
//         </div>

//         {/* Filter tabs */}
//         <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
//           <Filter className="w-4 h-4 text-foreground flex-shrink-0" />
//           <button
//             onClick={() => setSelectedFilter('all')}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
//               selectedFilter === 'all'
//                 ? 'bg-foreground text-white shadow-md'
//                 : 'bg-white text-foreground border border-surface-dark'
//             }`}
//           >
//             All ({allRequests.length})
//           </button>
//           <button
//             onClick={() => setSelectedFilter('active')}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
//               selectedFilter === 'active'
//                 ? 'bg-foreground text-white shadow-md'
//                 : 'bg-white text-foreground border border-surface-dark'
//             }`}
//           >
//             Active ({activeRequests.length})
//           </button>
//           <button
//             onClick={() => setSelectedFilter('completed')}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
//               selectedFilter === 'completed'
//                 ? 'bg-foreground text-white shadow-md'
//                 : 'bg-white text-foreground border border-surface-dark'
//             }`}
//           >
//             Completed ({completedRequests.length})
//           </button>
//         </div>

//         {/* Requests list */}
//         <div className="space-y-4 mb-8">
//           {displayedRequests.map((request) => (
//             <GuestRequestCard
//               key={request.id}
//               request={request}
//               isNew={newCompletedIds.includes(request.id)}
//               onRate={request.status === 'completed' && !request.rating ? () => handleOpenRating(request) : undefined}
//             />
//           ))}
//         </div>

//         {displayedRequests.length === 0 && (
//           <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-surface-dark">
//             <p className="text-foreground/70 font-medium">No requests found</p>
//             <p className="text-foreground/50 text-sm mt-1">Create your first request to get started</p>
//           </div>
//         )}

//         {/* Quick requests section */}
//         <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-surface-dark shadow-lg">
//           <h2 className="text-xl font-bold text-foreground mb-4">Quick Requests</h2>
//           <div className="grid grid-cols-2 gap-3">
//             {['housekeeping', 'concierge', 'maintenance', 'dining'].map((type) => (
//               <button 
//                 key={type}
//                 onClick={() => handleQuickRequest(type as RequestType)}
//                 className="bg-white border-2 border-surface-dark text-foreground p-4 rounded-xl font-semibold hover:shadow-md hover:border-primary transition-all text-sm"
//               >
//                 {getTypeLabel(type as RequestType)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Rating Modal */}
//       <RatingModal
//         request={selectedRequestForRating}
//         isOpen={ratingModalOpen}
//         onClose={() => {
//           setRatingModalOpen(false);
//           setSelectedRequestForRating(null);
//         }}
//         onSubmit={handleSubmitRating}
//       />

//       {/* New Request Modal */}
//       {showNewRequestModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
//             <button
//               onClick={() => setShowNewRequestModal(false)}
//               className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             <h2 className="text-2xl font-bold text-foreground mb-6">New Request</h2>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">Type</label>
//                 <select
//                   value={newRequest.type}
//                   onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value as RequestType })}
//                   className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   {REQUEST_TYPES.map(type => (
//                     <option key={type} value={type}>{getTypeLabel(type)}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
//                 <select
//                   value={newRequest.priority}
//                   onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as any })}
//                   className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                   <option value="urgent">Urgent</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">Title</label>
//                 <input
//                   type="text"
//                   value={newRequest.title}
//                   onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
//                   className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="Brief description"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">Description</label>
//                 <textarea
//                   value={newRequest.description}
//                   onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
//                   rows={4}
//                   className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
//                   placeholder="Detailed description of your request..."
//                 />
//               </div>

//               <button
//                 onClick={handleSubmitRequest}
//                 disabled={submittingRequest}
//                 className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {submittingRequest ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     <span>Creating...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="w-4 h-4" />
//                     <span>Submit Request</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/features/service-requests/pages/RequestsPage.tsx - REFACTORED WITH REACT QUERY
import React, { useState } from 'react';
import { Plus, Filter, Sparkles, X } from 'lucide-react';
import { useGuestRequests } from '../../../hooks/guest/useGuestRequests';
import { useCreateRequestMutation } from '../queries';
import { useAuthStore } from '../../../lib/stores/useAuthStore';
import GuestRequestCard from '../components/GuestRequestCard';
import RatingModal from '../components/RatingModal';
import { REQUEST_TYPES } from '../hooks/useServiceRequests';
import type { CreateRequestDTO, RequestType } from '../api/types';
import { logger } from '../../../core/utils/logger';

export default function RequestsPage() {
  logger.debug('ServiceRequests', 'RequestsPage render - REFACTORED with React Query');
  
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?.id || '';
  
  const {
    activeRequests,
    completedRequests,
    allRequests,
    loading,
    error,
    submitRating,
    hasUnratedCompleted,
  } = useGuestRequests();

  // Create mutation
  const createMutation = useCreateRequestMutation(userId);

  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedRequestForRating, setSelectedRequestForRating] = useState<any>(null);
  const [newRequest, setNewRequest] = useState<Partial<CreateRequestDTO>>({
    type: 'general',
    priority: 'medium',
    title: '',
    description: ''
  });

  const getTypeLabel = (type: RequestType): string => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleOpenRating = (request: any) => {
    logger.debug('ServiceRequests', 'Opening rating modal for request', { requestId: request.id });
    setSelectedRequestForRating(request);
    setRatingModalOpen(true);
  };

  const handleSubmitRating = async (rating: number, feedback?: string) => {
    if (!selectedRequestForRating) return;
    await submitRating(selectedRequestForRating.id, rating, feedback);
    setRatingModalOpen(false);
    setSelectedRequestForRating(null);
  };

  const handleSubmitRequest = async () => {
    if (!newRequest.title || !newRequest.description || !newRequest.type) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await createMutation.mutateAsync({
        type: newRequest.type,
        priority: newRequest.priority || 'medium',
        title: newRequest.title,
        description: newRequest.description,
      });
      
      // Reset form
      setNewRequest({
        type: 'general',
        priority: 'medium',
        title: '',
        description: ''
      });
      setShowNewRequestModal(false);
    } catch (error) {
      logger.error('ServiceRequests', 'Failed to create request', { error });
    }
  };

  const handleQuickRequest = (type: RequestType) => {
    logger.debug('ServiceRequests', 'Quick request', { type });
    setNewRequest({
      type,
      priority: 'medium',
      title: getTypeLabel(type),
      description: ''
    });
    setShowNewRequestModal(true);
  };

  // Filter requests
  const displayedRequests = selectedFilter === 'all' 
    ? allRequests 
    : selectedFilter === 'active' 
      ? activeRequests 
      : completedRequests;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-semibold">Loading your requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 max-w-md">
          <h3 className="text-red-800 font-bold text-xl mb-2">Error Loading Requests</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-foreground/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2 flex items-center space-x-2">
              <span>My Requests</span>
              {hasUnratedCompleted && (
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Rate Now</span>
                </span>
              )}
            </h1>
            <p className="text-sm sm:text-base text-foreground/80">
              {allRequests.length} total • {activeRequests.length} active • {completedRequests.length} completed
            </p>
          </div>
          
          <button 
            onClick={() => setShowNewRequestModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Request</span>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-foreground flex-shrink-0" />
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'all'
                ? 'bg-foreground text-white shadow-md'
                : 'bg-white text-foreground border border-surface-dark'
            }`}
          >
            All ({allRequests.length})
          </button>
          <button
            onClick={() => setSelectedFilter('active')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'active'
                ? 'bg-foreground text-white shadow-md'
                : 'bg-white text-foreground border border-surface-dark'
            }`}
          >
            Active ({activeRequests.length})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'completed'
                ? 'bg-foreground text-white shadow-md'
                : 'bg-white text-foreground border border-surface-dark'
            }`}
          >
            Completed ({completedRequests.length})
          </button>
        </div>

        {/* Requests list */}
        <div className="space-y-4 mb-8">
          {displayedRequests.map((request) => (
            <GuestRequestCard
              key={request.id}
              request={request}
              onRate={request.status === 'completed' && !request.rating ? () => handleOpenRating(request) : undefined}
            />
          ))}
        </div>

        {displayedRequests.length === 0 && (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-surface-dark">
            <p className="text-foreground/70 font-medium">No requests found</p>
            <p className="text-foreground/50 text-sm mt-1">Create your first request to get started</p>
          </div>
        )}

        {/* Quick requests section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-surface-dark shadow-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Requests</h2>
          <div className="grid grid-cols-2 gap-3">
            {['housekeeping', 'concierge', 'maintenance', 'dining'].map((type) => (
              <button 
                key={type}
                onClick={() => handleQuickRequest(type as RequestType)}
                className="bg-white border-2 border-surface-dark text-foreground p-4 rounded-xl font-semibold hover:shadow-md hover:border-primary transition-all text-sm"
              >
                {getTypeLabel(type as RequestType)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        request={selectedRequestForRating}
        isOpen={ratingModalOpen}
        onClose={() => {
          setRatingModalOpen(false);
          setSelectedRequestForRating(null);
        }}
        onSubmit={handleSubmitRating}
      />

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowNewRequestModal(false)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-foreground mb-6">New Request</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value as RequestType })}
                  className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {REQUEST_TYPES.map(type => (
                    <option key={type} value={type}>{getTypeLabel(type)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                <select
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Detailed description of your request..."
                />
              </div>

              <button
                onClick={handleSubmitRequest}
                disabled={createMutation.isPending}
                className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}