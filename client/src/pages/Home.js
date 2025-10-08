import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, Users, Shield, TrendingUp, ArrowRight, Car, Wrench, Droplet } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isRetailer } = useAuth();

  const features = [
    {
      icon: Package,
      title: 'Wide Product Range',
      description: 'Comprehensive selection of automobile spares and lubricants from trusted brands.'
    },
    {
      icon: Users,
      title: 'Trusted Retailers',
      description: 'Connect with verified retailers offering quality products and reliable service.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'All products are verified for authenticity and meet industry standards.'
    },
    {
      icon: TrendingUp,
      title: 'Competitive Pricing',
      description: 'Get the best deals on automotive parts and lubricants.'
    }
  ];

  const categories = [
    { name: 'Engine Oil', icon: Droplet, color: 'bg-blue-500' },
    { name: 'Brake Pads', icon: Wrench, color: 'bg-red-500' },
    { name: 'Air Filters', icon: Car, color: 'bg-green-500' },
    { name: 'Batteries', icon: Package, color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Trusted Source for
            <span className="block text-primary-200">Automobile Spares & Lubricants</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Connect with verified retailers and find the best automotive solutions for your needs.
            Quality products, competitive prices, and reliable service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </Link>
                <Link to="/products" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                  Browse Products
                </Link>
              </>
            ) : (
              <Link to="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Browse Products
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FastLube?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best platform for both retailers and customers in the automotive industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the automotive parts you need across various categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/products"
                className="group text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of retailers and customers who trust FastLube for their automotive needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Retailers */}
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary-400">For Retailers</h3>
              <p className="text-gray-300 mb-6">
                Expand your reach and manage your inventory efficiently with our comprehensive platform.
              </p>
              <ul className="text-left text-gray-300 mb-6 space-y-2">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary-400" />
                  Easy inventory management
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary-400" />
                  Reach more customers
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary-400" />
                  Analytics and insights
                </li>
              </ul>
              {!isAuthenticated ? (
                <Link to="/register?role=retailer" className="btn-primary inline-flex items-center">
                  Register as Retailer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : isRetailer ? (
                <Link to="/retailer/dashboard" className="btn-primary inline-flex items-center">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <span className="text-gray-400">Already registered as customer</span>
              )}
            </div>

            {/* For Customers */}
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary-400">For Customers</h3>
              <p className="text-gray-300 mb-6">
                Find the best automotive parts and lubricants from trusted retailers in your area.
              </p>
              <ul className="text-left text-gray-300 mb-6 space-y-2">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary-400" />
                  Wide product selection
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary-400" />
                  Quality assurance
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary-400" />
                  Competitive pricing
                </li>
              </ul>
              {!isAuthenticated ? (
                <Link to="/register?role=customer" className="btn-primary inline-flex items-center">
                  Register as Customer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : !isRetailer ? (
                <Link to="/products" className="btn-primary inline-flex items-center">
                  Browse Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <span className="text-gray-400">Already registered as retailer</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 