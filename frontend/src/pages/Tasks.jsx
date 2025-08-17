import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonorDonations = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axiosInstance.get('/api/users/donations', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDonations(response.data || []);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to fetch your donation history.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDonations();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Donation Dashboard</h1>
          
          {loading ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="animate-pulse text-center py-4">Loading your donation history...</div>
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
              <p className="text-gray-600 mb-4">Start supporting causes you care about today.</p>
              <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Browse Donation Events</Link>
            </div>
          ) : donations.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-3">No Donations Yet</h2>
              <p className="text-gray-600 mb-4">You haven't made any donations yet. Start supporting causes you care about today.</p>
              <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Browse Donation Events</Link>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Donation History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Donation Event</th>
                      <th className="py-2 px-4 text-left">Amount</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{donation.donationEvent?.title || 'Unknown Event'}</td>
                        <td className="py-2 px-4">${donation.amount.toFixed(2)}</td>
                        <td className="py-2 px-4">{new Date(donation.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
