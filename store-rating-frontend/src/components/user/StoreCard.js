import React, { useState } from 'react';
import { Star, MapPin, Mail } from 'lucide-react';
import RatingModal from './RatingModal';
import { useAuth } from '../../hooks/useAuth';

const StoreCard = ({ store, onRatingUpdate }) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { user } = useAuth();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const userRating = store.ratings?.find(r => r.userId === user?.id);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {store.name}
            </h3>
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(store.averageRating || 0))}
              <span className="text-sm text-gray-600 ml-1">
                ({store.totalRatings || 0})
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {store.email}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="line-clamp-2">{store.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-600">Avg Rating: </span>
              <span className="font-semibold text-gray-900">
                {store.averageRating?.toFixed(1) || '0.0'}
              </span>
            </div>

            {user && user.role === 'user' && (
              <div className="flex space-x-2">
                {userRating && (
                  <div className="text-xs text-gray-600">
                    Your rating: {userRating.rating} ⭐
                  </div>
                )}
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  {userRating ? 'Update' : 'Rate'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRatingModal && (
        <RatingModal
          store={store}
          existingRating={userRating}
          onClose={() => setShowRatingModal(false)}
          onSubmit={() => {
            setShowRatingModal(false);
            onRatingUpdate();
          }}
        />
      )}
    </>
  );
};

export default StoreCard;