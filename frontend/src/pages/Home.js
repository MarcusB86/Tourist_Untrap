import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, TrendingUp } from 'lucide-react';

const gold = '#FFD700';
const heroBg = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80'; // Cityscape placeholder

const Home = () => {
  return (
    <div className="space-y-16 bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <img
          src={heroBg}
          alt="Cityscape background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
        <div className="relative z-20 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Avoid the Crowds,
            <span style={{ color: gold }}> Enjoy the Experience</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Find the perfect time to visit tourist attractions and make the most of your travel experience without the hassle of long lines and overwhelming crowds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/attractions"
              className="px-8 py-3 text-lg font-semibold rounded-md border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors shadow"
            >
              Explore Attractions
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 text-lg font-semibold rounded-md bg-yellow-400 text-black hover:bg-yellow-300 transition-colors shadow"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#18181b] rounded-2xl shadow-sm mx-4">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose <span style={{ color: gold }}>Tourist Untrap?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2" style={{ borderColor: gold }}>
                <Clock className="h-8 w-8" style={{ color: gold }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Smart Timing
              </h3>
              <p className="text-gray-300">
                Get personalized recommendations for the best times to visit based on historical crowd data and real-time updates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2" style={{ borderColor: gold }}>
                <Users className="h-8 w-8" style={{ color: gold }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Crowd Predictions
              </h3>
              <p className="text-gray-300">
                Advanced algorithms predict crowd levels using weather, events, holidays, and historical patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2" style={{ borderColor: gold }}>
                <TrendingUp className="h-8 w-8" style={{ color: gold }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-300">
                Stay informed with live crowd updates and wait times from other travelers and official sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">
                Search Attractions
              </h3>
              <p className="text-gray-300">
                Browse popular tourist attractions in your destination or search for specific places.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">
                Check Crowd Levels
              </h3>
              <p className="text-gray-300">
                View current crowd levels, wait times, and predictions for different times and dates.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">
                Plan Your Visit
              </h3>
              <p className="text-gray-300">
                Choose the optimal time to visit and enjoy a crowd-free experience at your favorite attractions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-400 rounded-2xl text-center mx-4">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to Transform Your Travel Experience?
          </h2>
          <p className="text-black mb-8 text-lg">
            Join thousands of travelers who are already enjoying crowd-free visits to their favorite attractions.
          </p>
          <Link
            to="/register"
            className="bg-black text-yellow-400 font-semibold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors inline-block border-2 border-black"
          >
            Start Planning Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 