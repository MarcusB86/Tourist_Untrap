import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Users, Star, DollarSign, Calendar, TrendingUp, Sparkles, Heart, Share2, Eye } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';

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
      const response = await fetch(API_ENDPOINTS.ATTRACTIONS);
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
      <div className="max-w-6xl mx-auto px-4 py-8 bg-black min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-center items-center h-64 space-y-6"
        >
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative"
          >
            <div className="w-16 h-16 border-4 border-yellow-400/30 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Discovering NYC Attractions</h3>
            <p className="text-gray-400">Loading the best places to visit...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-black min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <Sparkles className="h-8 w-8 text-yellow-400" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
            NYC Attractions
          </h1>
          <Sparkles className="h-8 w-8 text-yellow-400" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Discover the best times to visit New York's most popular attractions and avoid the crowds
        </motion.p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gradient-to-r from-[#18181b] to-[#1f1f23] rounded-2xl shadow-2xl border border-gray-800/50 p-6 mb-8 backdrop-blur-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search attractions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl bg-black/50 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400 transition-all duration-300 backdrop-blur-sm"
              />
            </motion.div>
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(251, 191, 36, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl transition-all duration-300 text-black font-semibold shadow-lg"
          >
            <Filter className="h-4 w-4" />
            Filters
          </motion.button>

          {/* Sort */}
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border-2 border-gray-700 rounded-xl bg-black/50 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by: {option.label}
              </option>
            ))}
          </motion.select>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-800/50 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-700 rounded-xl bg-black/50 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Price Range Filter */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Price Range</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-700 rounded-xl bg-black/50 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                  >
                    {priceRanges.map(price => (
                      <option key={price.value} value={price.value}>
                        {price.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Showing <span className="text-yellow-400 font-semibold">{filteredAttractions.length}</span> of <span className="text-yellow-400 font-semibold">{attractions.length}</span> attractions
          </p>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-yellow-400"
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.div>

      {/* Attractions Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAttractions.map((attraction, index) => (
          <motion.div
            key={attraction.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 1.2 + (index * 0.1), 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -10, 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(251, 191, 36, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-br from-[#18181b] to-[#1f1f23] rounded-2xl shadow-2xl border border-gray-800/50 hover:border-yellow-400/50 transition-all duration-500 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Image Placeholder */}
            <div className="h-48 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
              <motion.img 
                src={placeholderImg} 
                alt="Attraction" 
                className="absolute inset-0 w-full h-full object-cover object-center opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <MapPin className="text-yellow-400 h-12 w-12 z-10 drop-shadow-lg" />
              </motion.div>
              
              {/* Best Time Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + (index * 0.1) }}
                className="absolute top-3 right-3 z-20"
              >
                <div className="flex items-center gap-1 bg-black/90 backdrop-blur-md px-3 py-2 rounded-full border-2 border-yellow-400 shadow-lg">
                  <TrendingUp className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400">
                    {attraction.averageWaitTime < 30 ? 'Best Time' : 'Peak Time'}
                  </span>
                </div>
              </motion.div>
              
              {/* Action Buttons */}
              <div className="absolute top-3 left-3 z-20 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-black/80 backdrop-blur-md rounded-full border border-gray-600 hover:border-yellow-400 transition-colors"
                >
                  <Heart className="h-4 w-4 text-gray-400 hover:text-red-400 transition-colors" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-black/80 backdrop-blur-md rounded-full border border-gray-600 hover:border-yellow-400 transition-colors"
                >
                  <Share2 className="h-4 w-4 text-gray-400 hover:text-yellow-400 transition-colors" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-yellow-400 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                  {attraction.name}
                </h3>
                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.1 }}
                >
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-yellow-400">{attraction.rating || 'N/A'}</span>
                </motion.div>
              </div>
              
              <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">{attraction.description}</p>
              
              <div className="flex flex-wrap gap-2 text-sm mb-4">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-400 border border-gray-600 hover:border-yellow-400 transition-colors"
                >
                  <DollarSign className="h-4 w-4" /> {getPriceRangeDisplay(attraction.priceRange)}
                </motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-400 border border-gray-600 hover:border-yellow-400 transition-colors"
                >
                  <Calendar className="h-4 w-4" /> {getOpeningHours(attraction.openingHours)}
                </motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full border ${getCrowdLevelColor(attraction.crowdLevel)}`}
                >
                  <Users className="h-4 w-4" /> {getCrowdLevelText(attraction.crowdLevel)}
                </motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-400 border border-gray-600 hover:border-yellow-400 transition-colors"
                >
                  <Clock className="h-4 w-4" /> {attraction.averageWaitTime ? `${attraction.averageWaitTime} min wait` : 'N/A'}
                </motion.span>
              </div>
              
              <div className="flex items-center justify-between">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-4 py-2 rounded-full border-2 border-yellow-400 text-yellow-400 text-sm font-semibold bg-yellow-400/10 backdrop-blur-sm"
                >
                  {getBestTimeToVisit(attraction)}
                </motion.span>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Attractions; 