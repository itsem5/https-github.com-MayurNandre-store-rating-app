import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import StoreCard from './StoreCard';
import api from '../../services/api';

const StoreListing = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    address: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchStores();
  }, [searchFilters]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stores', { params: searchFilters });
      setStores(response.data.stores || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchFilters({ ...searchFilters, page: 1 });
  };

  const updateFilter = (key, value) => {
    setSearchFilters({ ...searchFilters, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Directory</h1>
        <p className="text-gray-600">Discover and rate amazing stores</p>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by store name..."
                  value={searchFilters.name}
                  onChange={(e) => updateFilter('name', e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                placeholder="Search by address..."
                value={searchFilters.address}
                onChange={(e) => updateFilter('address', e.target.value)}
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search Stores</span>
          </button>
        </form>
      </div>

      {/* Results */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
              <StoreCard 
                key={store.id} 
                store={store}
                onRatingUpdate={fetchStores}
              />
            ))}
          </div>
        )}
      </div>

      {stores.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No stores found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default StoreListing;