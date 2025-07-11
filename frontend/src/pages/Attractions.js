import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Users, Star, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const cardBg = 'bg-[#18181b]';
const cardText = 'text-white';
const placeholderImg = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80';

const Attractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

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
    if (crowdLevel < 0.3) return 'text-green-400 bg-green-900';
    if (crowdLevel < 0.6) return 'text-yellow-400 bg-yellow-900';
    return 'text-red-400 bg-red-900';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">NYC Attractions</h1>
        <p className="text-gray-300">Discover the best times to visit New York's most popular attractions</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#18181b] rounded-lg shadow-sm border border-gray-800 p-6 mb-8">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors text-yellow-400 border border-yellow-400"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
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
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
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
        <p className="text-gray-400">
          Showing {filteredAttractions.length} of {attractions.length} attractions
        </p>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((attraction) => (
          <div key={attraction.id} className={`${cardBg} ${cardText} rounded-lg shadow-lg border border-gray-800 hover:shadow-xl transition-shadow relative`}>
            {/* Image Placeholder */}
            <div className="h-48 rounded-t-lg flex items-center justify-center relative overflow-hidden">
              <img src={placeholderImg} alt="Attraction" className="absolute inset-0 w-full h-full object-cover object-center opacity-60" />
              <MapPin className="text-yellow-400 h-12 w-12 z-10" />
              {/* Best Time Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-400">
                  <TrendingUp className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs font-medium text-yellow-400">
                    {attraction.averageWaitTime < 30 ? 'Best Time' : 'Peak Time'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-yellow-400 line-clamp-2">
                  {attraction.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">{attraction.rating || 'N/A'}</span>
                </div>
              </div>
              <p className="text-gray-300 mb-2 line-clamp-3">{attraction.description}</p>
              <div className="flex flex-wrap gap-2 text-sm mb-4">
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-900 text-yellow-400">
                  <DollarSign className="h-4 w-4" /> {getPriceRangeDisplay(attraction.priceRange)}
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-900 text-yellow-400">
                  <Calendar className="h-4 w-4" /> {getOpeningHours(attraction.openingHours)}
                </span>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${getCrowdLevelColor(attraction.crowdLevel)}`}>
                  <Users className="h-4 w-4" /> {getCrowdLevelText(attraction.crowdLevel)}
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-900 text-yellow-400">
                  <Clock className="h-4 w-4" /> {attraction.averageWaitTime ? `${attraction.averageWaitTime} min wait` : 'N/A'}
                </span>
              </div>
              <div className="mt-2">
                <span className="inline-block px-3 py-1 rounded-full border border-yellow-400 text-yellow-400 text-xs font-semibold">
                  {getBestTimeToVisit(attraction)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attractions; 