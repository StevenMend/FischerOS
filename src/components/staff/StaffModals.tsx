import React from 'react';
import { X } from 'lucide-react';

interface CompletedItem {
  id: string;
  guest: string;
  request: string;
  completedAt: string;
  satisfaction: number | null;
  handledBy: string;
  duration: string;
  satisfactionCollected: boolean;
  guestFeedback: string | null;
}

interface StaffModalsProps {
  // Shift Handover Modal
  showShiftHandover: boolean;
  handoverNotes: string;
  onCloseShiftHandover: () => void;
  onUpdateHandoverNotes: (notes: string) => void;
  onSubmitHandover: () => void;

  // Satisfaction Modal
  showSatisfactionModal: boolean;
  selectedCompletedItem: CompletedItem | null;
  onCloseSatisfactionModal: () => void;
  onSubmitSatisfaction: (rating: number, feedback: string) => void;
}

export const StaffModals: React.FC<StaffModalsProps> = ({
  showShiftHandover,
  handoverNotes,
  onCloseShiftHandover,
  onUpdateHandoverNotes,
  onSubmitHandover,
  showSatisfactionModal,
  selectedCompletedItem,
  onCloseSatisfactionModal,
  onSubmitSatisfaction
}) => {
  return (
    <>
      {/* Shift Handover Modal */}
      {showShiftHandover && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-backdrop">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full modal-content">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">Shift Handover</h3>
                <button onClick={onCloseShiftHandover} className="btn-premium">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Pending Issues for Next Shift:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Carlos Mendez ATV tour - weather dependent</li>
                  <li>• David Chen fishing charter - awaiting partner confirmation</li>
                  <li>• Amanda White satisfaction - needs follow-up</li>
                </ul>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes:
                </label>
                <textarea
                  value={handoverNotes}
                  onChange={(e) => onUpdateHandoverNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                  rows={3}
                  placeholder="Any special instructions or concerns..."
                />
              </div>
              <button 
                onClick={onSubmitHandover}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors btn-premium ripple-effect"
              >
                Complete Handover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Satisfaction Collection Modal */}
      {showSatisfactionModal && selectedCompletedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-backdrop">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full modal-content">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">Collect Guest Satisfaction</h3>
                <button onClick={onCloseSatisfactionModal} className="btn-premium">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{selectedCompletedItem.guest}</strong> - {selectedCompletedItem.request}
                </p>
                <p className="text-xs text-gray-500">Completed at {selectedCompletedItem.completedAt}</p>
              </div>
              
              {/* Rating Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you rate your experience? (1-5 stars)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {/* Set rating state here */}}
                      className="w-8 h-8 text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Feedback (Optional):
                </label>
                <textarea
                  placeholder="Tell us about your experience..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                  rows={3}
                />
              </div>

              <button 
                onClick={() => onSubmitSatisfaction(5, "Sample feedback")}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors btn-premium ripple-effect"
              >
                Save Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};