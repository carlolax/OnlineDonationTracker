import { useState, useMemo } from 'react';
import axiosInstance from '../axiosConfig';

const DonationEventList = ({ donationEvents, onDonationDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { activeDonations, completedDonations } = useMemo(() => {
    return {
      activeDonations: donationEvents.filter(event => event.status !== 'completed'),
      completedDonations: donationEvents.filter(event => event.status === 'completed')
    };
  }, [donationEvents]);

  const handleDeleteDonation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation event?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('userToken');
      await axiosInstance.delete(`/api/admin/donation-events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (onDonationDeleted) {
        onDonationDeleted(id);
      }
      
    } catch (err) {
      setError('Failed to delete donation event');
      console.error('Delete donation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  
  const renderDonationTable = (events, title, emptyMessage) => (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      
      {events.length === 0 ? (
        <p className="text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Goal</th>
                <th className="py-2 px-4 text-left">Raised</th>
                <th className="py-2 px-4 text-left">Remaining</th>
                <th className="py-2 px-4 text-left">Progress</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">{event.title}</td>
                  <td className="py-2 px-4">${event.amount.toFixed(2)}</td>
                  <td className="py-2 px-4">${(event.raisedAmount || 0).toFixed(2)}</td>
                  <td className="py-2 px-4">${Math.max(0, (event.amount - (event.raisedAmount || 0))).toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, ((event.raisedAmount || 0) / event.amount) * 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteDonation(event._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm mr-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="bg-white shadow-md rounded p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Donation Events</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {donationEvents.length === 0 ? (
        <p className="text-gray-500">No donation events found.</p>
      ) : (
        <>
          {renderDonationTable(activeDonations, 'Ongoing Donations', 'No ongoing donations.')} 
          {renderDonationTable(completedDonations, 'Completed Donations', 'No completed donations.')}
        </>
      )}
    </div>
  );
};

export default DonationEventList;
