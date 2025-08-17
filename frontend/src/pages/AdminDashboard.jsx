import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import DonationEventForm from '../components/DonationEventForm';
import DonationEventList from '../components/DonationEventList';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [donationEvents, setDonationEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const usersResponse = await axiosInstance.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setUsers(usersResponse.data);
        
        const eventsResponse = await axiosInstance.get('/api/admin/donation-events');
        setDonationEvents(eventsResponse.data?.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.put(`/api/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
    } catch (error) {
      setError('Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setUsers(users.filter(user => user._id !== userId));
      
    } catch (error) {
      setError('Failed to delete user.');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const handleDonationAdded = (newDonation) => {
    setDonationEvents([newDonation, ...donationEvents]);
  };

  const handleDonationDeleted = (deletedId) => {
    setDonationEvents(donationEvents.filter(event => event._id !== deletedId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Donation Events Section */}
      <DonationEventForm onDonationAdded={handleDonationAdded} />
      <DonationEventList 
        donationEvents={donationEvents} 
        onDonationDeleted={handleDonationDeleted} 
      />
      
      {/* User Management Section */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="donor">Donor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
