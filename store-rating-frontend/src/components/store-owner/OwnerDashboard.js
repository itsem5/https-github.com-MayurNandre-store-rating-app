import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Star, 
  Users, 
  TrendingUp, 
  BarChart3,
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    ratingDistribution: [],
    recentRatings: []
  });

  useEffect(() => {
    if (user?.ownedStore) {
      fetchStoreData();
    } else {
      fetchUserStore();
    }
  }, [user]);

  const fetchUserStore = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      if (response.data.user.ownedStore) {
        setStoreData(response.data.user.ownedStore);
        await fetchStoreRatings(response.data.user.ownedStore.id);
      } else {
        setError('No store associated with your account');
      }
    } catch (error) {
      setError('Failed to fetch store data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      await fetchStoreRatings(user.ownedStore.id);
      setStoreData(user.ownedStore);
    } catch (error) {
      setError('Failed to fetch store data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreRatings = async (storeId) => {
    try {
      const response = await api.get(`/ratings/store/${storeId}`);
      const ratingsData = response.data.ratings || [];
      setRatings(ratingsData);
      
      // Calculate statistics
      const totalRatings = ratingsData.length;
      const averageRating = ratingsData.length > 0 
        ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length 
        : 0;

      // Rating distribution
      const distribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: ratingsData.filter(r => r.rating === rating).length
      }));

      // Recent ratings (last 5)
      const recentRatings = ratingsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution: distribution,
        recentRatings
      });
    } catch (error) {
      console.error('Failed to fetch store ratings:', error);
    }
  };

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

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loading message="Loading your store dashboard..." />;
  }

  if (error || !storeData) {
    return (
      <ErrorMessage 
        title="Store Not Found" 
        message={error || "No store is associated with your account. Please contact an administrator."} 
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{storeData.name}</h1>
            <p className="text-gray-600">{storeData.address}</p>
            <p className="text-sm text-gray-500">{storeData.email}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 mb-2">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
            <p className="text-sm text-gray-500">{stats.totalRatings} ratings</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Ratings"
          value={stats.totalRatings}
          icon={Star}
          color="blue"
          subtitle="All time"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Award}
          color="yellow"
          subtitle="Out of 5.0"
        />
        <StatCard
          title="Happy Customers"
          value={stats.ratingDistribution.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0)}
          icon={Users}
          color="green"
          subtitle="4-5 star ratings"
        />
        <StatCard
          title="This Month"
          value={ratings.filter(r => {
            const ratingDate = new Date(r.createdAt);
            const now = new Date();
            return ratingDate.getMonth() === now.getMonth() && ratingDate.getFullYear() === now.getFullYear();
          }).length}
          icon={Calendar}
          color="purple"
          subtitle="New ratings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {stats.ratingDistribution.map(({ rating, count }) => {
              const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center space-x-1 w-20">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-sm text-gray-600 w-16 text-right">
                    {count} ({Math.round(percentage)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Ratings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Ratings</h3>
          {stats.recentRatings.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-sm font-medium text-gray-900">No ratings yet</h4>
              <p className="mt-1 text-sm text-gray-500">When customers rate your store, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentRatings.map((rating) => (
                <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(rating.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {rating.user.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-600 mt-2">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All Ratings Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Customer Ratings</h3>
        </div>
        
        {ratings.length === 0 ? (
          <div className="p-8 text-center">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-2 text-sm font-medium text-gray-900">No ratings yet</h4>
            <p className="mt-1 text-sm text-gray-500">
              When customers rate your store, you'll see detailed feedback here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ratings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {rating.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {rating.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {renderStars(rating.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {rating.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {rating.comment || (
                          <span className="text-gray-500 italic">No comment</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats.ratingDistribution.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0) / Math.max(stats.totalRatings, 1)) * 100)}%
            </div>
            <div className="text-sm text-green-700">Satisfied Customers</div>
            <div className="text-xs text-gray-500 mt-1">4-5 star ratings</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.averageRating >= 4.5 ? '🏆' : stats.averageRating >= 4.0 ? '🥈' : stats.averageRating >= 3.5 ? '🥉' : '📈'}
            </div>
            <div className="text-sm text-blue-700">
              {stats.averageRating >= 4.5 ? 'Excellent' : 
               stats.averageRating >= 4.0 ? 'Great' :
               stats.averageRating >= 3.5 ? 'Good' : 'Improving'}
            </div>
            <div className="text-xs text-gray-500 mt-1">Overall rating</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {ratings.filter(r => r.comment && r.comment.trim()).length}
            </div>
            <div className="text-sm text-purple-700">Detailed Reviews</div>
            <div className="text-xs text-gray-500 mt-1">With comments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;