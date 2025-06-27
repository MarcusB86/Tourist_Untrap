import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Avoid the Crowds,
            <span className="text-primary-600"> Enjoy the Experience</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find the perfect time to visit tourist attractions and make the most of your travel experience without the hassle of long lines and overwhelming crowds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/attractions"
              className="btn-primary text-lg px-8 py-3"
            >
              Explore Attractions
            </Link>
            <Link
              to="/register"
              className="btn-secondary text-lg px-8 py-3"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white rounded-2xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Tourist Untrap?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Timing
              </h3>
              <p className="text-gray-600">
                Get personalized recommendations for the best times to visit based on historical crowd data and real-time updates.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Crowd Predictions
              </h3>
              <p className="text-gray-600">
                Advanced algorithms predict crowd levels using weather, events, holidays, and historical patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Stay informed with live crowd updates and wait times from other travelers and official sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Search Attractions
              </h3>
              <p className="text-gray-600">
                Browse popular tourist attractions in your destination or search for specific places.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Check Crowd Levels
              </h3>
              <p className="text-gray-600">
                View current crowd levels, wait times, and predictions for different times and dates.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Plan Your Visit
              </h3>
              <p className="text-gray-600">
                Choose the optimal time to visit and enjoy a crowd-free experience at your favorite attractions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 rounded-2xl text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Travel Experience?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of travelers who are already enjoying crowd-free visits to their favorite attractions.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Start Planning Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 