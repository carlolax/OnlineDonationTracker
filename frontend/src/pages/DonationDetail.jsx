import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const DonationDetail = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/public/donation-events/${id}`);
        setDonation(response.data.data);
      } catch (err) {
        console.error('Error fetching donation details:', err);
        setError('Failed to load donation details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      handleStripePayment();
      return;
    }

    handleStripePayment();
  };

  const handleStripePayment = async () => {
    
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/payments/create-checkout-session', {
        amount: parseFloat(donationAmount),
        donationEventId: id,
        donorId: user ? user.id : null,
        isAnonymous: !user,
        successUrl: `${window.location.origin}/donation/success`,
        cancelUrl: `${window.location.origin}/donate/${id}`
      });
      
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('Invalid response from payment server');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Unable to process payment. Please check if Stripe API keys are configured.');
    } finally {
      setLoading(false);
      setDonationAmount('');
    }
  };
  
  const handleLoginRedirect = () => {
    navigate(`/login?redirect=/donate/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="animate-pulse text-center py-10">Loading donation details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="text-red-600 text-center py-10">
              {error || 'Donation event not found'}
            </div>
            <div className="text-center">
              <Link to="/" className="text-blue-600 hover:underline">Return to home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
            &larr; Back to all donations
          </Link>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{donation.title}</h1>
              
              {donation.imageUrl && (
                <img 
                  src={donation.imageUrl} 
                  alt={donation.title} 
                  className="w-full h-64 object-cover mb-6 rounded-md"
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-lg text-gray-600">Goal</div>
                  <div className="text-xl font-semibold">${donation.amount.toFixed(2)}</div>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <div className="text-lg text-gray-600">Raised</div>
                  <div className="text-xl font-semibold text-blue-800">
                    ${donation.raisedAmount ? donation.raisedAmount.toFixed(2) : '0.00'}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-lg text-gray-600">Remaining</div>
                  <div className="text-xl font-semibold text-green-800">
                    ${Math.max(0, (donation.amount - (donation.raisedAmount || 0))).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: donation.raisedAmount ? `${Math.min(100, (donation.raisedAmount / donation.amount) * 100)}%` : '0%' 
                  }}
                ></div>
              </div>
              
              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <p className="whitespace-pre-line">{donation.details}</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h2 className="text-xl font-semibold mb-4">Make a Donation</h2>
                
                <form onSubmit={handleDonationSubmit}>
                  <div className="mb-4">
                    <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Donation Amount ($)
                    </label>
                    <input
                      type="number"
                      id="donationAmount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      min="1"
                      step="0.01"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  >
                    <span className="mr-2">Pay with</span>
                    <svg className="h-6" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#ffffff" d="M59.98 14.8c0-3.45-1.68-6.17-4.87-6.17-3.21 0-5.13 2.72-5.13 6.13 0 4.05 2.3 6.05 5.57 6.05 1.6 0 2.81-.36 3.73-.97v-2.7c-.92.48-1.96.78-3.28.78-1.3 0-2.45-.47-2.6-2.1h6.55c0-.21.03-1.02.03-1.02zm-6.63-1.28c0-1.51.92-2.14 1.77-2.14.82 0 1.7.63 1.7 2.14h-3.47zm-8.01-4.89c-1.3 0-2.13.61-2.59 1.04l-.17-1.04h-2.89c.04.86.08 1.72.08 2.8v9.23h3.27v-6.24c0-.21.02-.42.08-.58.18-.5.64-1.02 1.39-1.02.98 0 1.38.75 1.38 1.83v6.01h3.29V13.1c0-2.79-1.44-4.47-3.84-4.47zm-9.01 1.69c-.51-.4-1.22-.57-2.01-.57-1.11 0-1.83.26-2.47.69l.24 2.01c.54-.35 1.22-.58 1.94-.58 1.21 0 1.63.5 1.63 1.22v.1a5.4 5.4 0 00-1.72-.24c-1.9 0-3.53.8-3.53 3.04 0 1.75 1.29 2.87 3.03 2.87 1.01 0 1.74-.23 2.22-.79l.17.65h2.74V14.4c0-2.19-1.56-3.08-3.24-3.08zm-.33 5.72c0 .55-.42 1.05-1.29 1.05-.55 0-1.01-.29-1.01-.9 0-.67.6-.93 1.28-.93.42 0 .77.08 1.02.15v.63zm-7.46-7.41l.04-1.04h-2.89v10.85h3.27v-7.37c.78-.96 2.09-.79 2.5-.65V8.63c-.42-.16-1.93-.36-2.92 1.17zM16.7 8.63h-4.91v10.85h4.91c3.58 0 6.03-2.24 6.03-5.42 0-3.27-2.45-5.43-6.03-5.43zm-.02 8.19h-1.78v-5.52h1.78c1.7 0 2.88 1.18 2.88 2.76 0 1.57-1.18 2.76-2.88 2.76zM10.94 8.63H7.3v10.85h3.65V8.63z" />
                    </svg>
                  </button>
                </form>
                
                {!user && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Want to track your donations and support history?
                    </p>
                    <button
                      onClick={handleLoginRedirect}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-150 ease-in-out inline-block"
                    >
                      Login or Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationDetail;
