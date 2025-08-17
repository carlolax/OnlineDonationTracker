import { useState } from 'react';
import axiosInstance from '../axiosConfig';

const DonationEventForm = ({ onDonationAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    details: '',
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('userToken');
      
      const response = await axiosInstance.post(
        '/api/admin/donation-events',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSuccess('Donation event created successfully!');
      setFormData({
        title: '',
        amount: '',
        details: '',
        imageUrl: ''
      });
      
      if (onDonationAdded) {
        onDonationAdded(response.data.data);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation event');
      console.error('Create donation error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Donation Event</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Donation Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter donation title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Donation Amount (in dollars):
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter donation amount"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
            Donation Details:
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter donation details"
            rows="4"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
            Image URL (optional):
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter image URL"
          />
          <p className="text-gray-500 text-xs italic mt-1">
            Enter a URL to an image for this donation event
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Donation Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationEventForm;
