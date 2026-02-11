// src/features/service-requests/components/RatingModal.tsx
import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { logger } from '../../../core/utils/logger';

interface ServiceRequest {
  id: string;
  title: string;
  assigned_to_name: string | null;
}

interface RatingModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback?: string) => Promise<void>;
}

export default function RatingModal({ request, isOpen, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      logger.info('ServiceRequests', 'Submitting rating', { rating, feedback });
      await onSubmit(rating, feedback);
      
      // Reset
      setRating(0);
      setFeedback('');
      onClose();
    } catch (error) {
      logger.error('ServiceRequests', 'Failed to submit rating', { error });
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Experience</h2>
          <p className="text-sm text-gray-600">
            Request: <span className="font-semibold text-gray-900">{request.title}</span>
          </p>
          {request.assigned_to_name && (
            <p className="text-sm text-gray-600">
              Handled by: <span className="font-semibold text-gray-900">{request.assigned_to_name}</span>
            </p>
          )}
        </div>

        {/* Stars */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">How was your experience?</p>
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center mt-2 text-sm font-medium text-gray-700">
              {rating === 5 && '🎉 Excellent!'}
              {rating === 4 && '😊 Great!'}
              {rating === 3 && '👍 Good'}
              {rating === 2 && '😐 Fair'}
              {rating === 1 && '😞 Poor'}
            </p>
          )}
        </div>

        {/* Feedback */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us more about your experience..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#8B6F47] to-[#6B5537] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Rating</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}