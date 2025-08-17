import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import DonationEventCard from '../components/DonationEventCard';

const Home = () => {
  const { user, isAdmin } = useAuth();
  // We're setting the events but only using the derived states (activeDonations and completedDonations)
  const [, setDonationEvents] = useState([]);
  const [activeDonations, setActiveDonations] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchDonationEvents = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/public/donation-events');
        const events = response.data.data || [];
        setDonationEvents(events);
        
        setActiveDonations(events.filter(event => event.status !== 'completed'));
        setCompletedDonations(events.filter(event => event.status === 'completed'));
        setError('');
      } catch (err) {
        console.error('Error fetching donation events:', err);
        setError('Failed to load donation events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonationEvents();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Online Donation Tracker</h1>
            <p className="text-xl mb-8">
              A simple and effective way to track and manage donations for your organization.
            </p>
            {!user ? (
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/register" 
                  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                >
                  Register as Donor
                </Link>
                <Link 
                  to="/login" 
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                <Link 
                  to={isAdmin() ? "/admin/dashboard" : "/tasks"} 
                  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                >
                  Go to {isAdmin() ? "Dashboard" : "Donations"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donations Lists Section */}
      <div className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8" style={{ gridAutoRows: '1fr' }}>
          {/* Ongoing Donations */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Ongoing Donations</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 text-red-600">
                  {error}
                </div>
              )}
              
              {/* Loading State */}
              {loading && (
                <div className="p-4 text-center">
                  <div className="animate-pulse">Loading donation events...</div>
                </div>
              )}
              
              {/* Empty State */}
              {!loading && activeDonations.length === 0 && !error && (
                <div className="p-4 text-center text-gray-500">
                  No active donation events at the moment.
                </div>
              )}
              
              {/* Active Donation List */}
              {!loading && activeDonations.length > 0 && (
                <ul className="space-y-6 p-4">
                  {activeDonations.map(event => (
                    <DonationEventCard key={event._id} event={event} />
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Completed Donations */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Completed Donations</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 text-red-600">
                  {error}
                </div>
              )}
              
              {/* Loading State */}
              {loading && (
                <div className="p-4 text-center">
                  <div className="animate-pulse">Loading completed donations...</div>
                </div>
              )}
              
              {/* Empty State */}
              {!loading && completedDonations.length === 0 && !error && (
                <div className="p-4 text-center text-gray-500">
                  No completed donation events yet.
                </div>
              )}
              
              {/* Completed Donation List */}
              {!loading && completedDonations.length > 0 && (
                <ul className="space-y-6 p-4">
                  {completedDonations.map(event => (
                    <DonationEventCard key={event._id} event={event} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">About the Platform</h2>
            <p className="text-gray-700 mb-4 text-center">
              Our Online Donation Tracker provides organizations with a simple yet powerful solution for 
              tracking and managing donations. With separate interfaces for donors and administrators,
              everyone has access to the features they need.
            </p>
            <p className="text-gray-700 text-center">
              Whether you're a small nonprofit or a large organization, our platform
              is designed to make donation management easier and more efficient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
