import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Users, Star, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const Attractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'landmark', label: 'Landmarks' },
    { value: 'museum', label: 'Museums' },
    { value: 'park', label: 'Parks' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: 'low', label: 'Low ($)' },
    { value: 'medium', label: 'Medium ($$)' },
    { value: 'high', label: 'High ($$$)' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'crowdLevel', label: 'Crowd Level' },
    { value: 'waitTime', label: 'Wait Time' }
  ];

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/attractions');
      if (response.ok) {
        const data = await response.json();
        setAttractions(data.attractions || data);
      } else {
        console.error('Failed to fetch attractions');
      }
    } catch (error) {
      console.error('Error fetching attractions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCrowdLevelColor = (crowdLevel) => {
    if (crowdLevel < 0.3) return 'text-green-600 bg-green-100';
    if (crowdLevel < 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCrowdLevelText = (crowdLevel) => {
    if (crowdLevel < 0.3) return 'Low';
    if (crowdLevel < 0.6) return 'Moderate';
    return 'High';
  };

  const getPriceRangeDisplay = (priceRange) => {
    switch (priceRange) {
      case 'free': return 'Free';
      case 'low': return '$';
      case 'medium': return '$$';
      case 'high': return '$$$';
      default: return 'N/A';
    }
  };

  const getBestTimeToVisit = (attraction) => {
    // Simple algorithm based on wait time and rating
    if (attraction.averageWaitTime < 15) return 'Excellent time to visit!';
    if (attraction.averageWaitTime < 30) return 'Good time to visit';
    if (attraction.averageWaitTime < 60) return 'Moderate crowds expected';
    return 'High crowds expected';
  };

  const getOpeningHours = (openingHours) => {
    if (!openingHours) return 'Hours vary';
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = openingHours[today];
    if (hours) {
      return `${hours.open} - ${hours.close}`;
    }
    return 'Hours vary';
  };

  const filteredAttractions = attractions
    .filter(attraction => {
      const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || attraction.category === selectedCategory;
      const matchesPrice = selectedPriceRange === 'all' || attraction.priceRange === selectedPriceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'crowdLevel':
          return (b.crowdLevel || 0) - (a.crowdLevel || 0);
        case 'waitTime':
          return (b.averageWaitTime || 0) - (a.averageWaitTime || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">NYC Attractions</h1>
        <p className="text-gray-600">Discover the best times to visit New York's most popular attractions</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search attractions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by: {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priceRanges.map(price => (
                    <option key={price.value} value={price.value}>
                      {price.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredAttractions.length} of {attractions.length} attractions
        </p>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((attraction) => (
          <div key={attraction.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center relative">
              <MapPin className="text-white h-12 w-12" />
              {/* Best Time Badge */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">
                    {attraction.averageWaitTime < 30 ? 'Best Time' : 'Peak Time'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {attraction.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{attraction.rating}</span>
                </div>
              </div>

              {/* Category and Price */}
              <div className="flex items-center gap-4 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                  {attraction.category}
                </span>
                <div className="flex items-center gap-1">
                  <DollarSign className="text-gray-400 h-4 w-4" />
                  <span className="text-sm text-gray-600">
                    {getPriceRangeDisplay(attraction.priceRange)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {attraction.description}
              </p>

              {/* Crowd and Wait Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="text-gray-400 h-4 w-4" />
                    <span className="text-sm text-gray-600">Crowd Level:</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCrowdLevelColor(attraction.crowdLevel || 0.5)}`}>
                    {getCrowdLevelText(attraction.crowdLevel || 0.5)}
                  </span>
                </div>
                
                {attraction.averageWaitTime > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-400 h-4 w-4" />
                      <span className="text-sm text-gray-600">Wait Time:</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {attraction.averageWaitTime} min
                    </span>
                  </div>
                )}

                {/* Best Time to Visit */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="text-blue-600 h-4 w-4" />
                    <span className="text-sm font-medium text-blue-800">Best Time</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    {getBestTimeToVisit(attraction)}
                  </p>
                </div>
              </div>

              {/* Location and Hours */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="text-gray-400 h-4 w-4" />
                  <span className="line-clamp-1">{attraction.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="text-gray-400 h-4 w-4" />
                  <span>{getOpeningHours(attraction.openingHours)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => setSelectedAttraction(attraction)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAttractions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No attractions found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Attraction Detail Modal */}
      {selectedAttraction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedAttraction.name}</h2>
                <button 
                  onClick={() => setSelectedAttraction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedAttraction.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="text-yellow-400 h-4 w-4 fill-current" />
                      <span className="font-medium">Rating</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedAttraction.rating}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="text-blue-600 h-4 w-4" />
                      <span className="font-medium">Wait Time</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedAttraction.averageWaitTime} min</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Visit Recommendation</h3>
                  <p className="text-blue-700">{getBestTimeToVisit(selectedAttraction)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attractions; 