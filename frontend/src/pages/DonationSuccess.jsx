import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(10);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyDonation = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/payments/verify-session/${sessionId}`);
        
        if (response.data && response.data.success) {
          const donationData = response.data.donation;
          
          setDonation({
            amount: donationData.amount,
            donationEvent: {
              title: donationData.donationEvent.title,
              id: donationData.donationEvent._id
            },
            date: donationData.createdAt
          });
        } else {
          setError('Unable to verify donation. Please contact support.');
        }
        setLoading(false);
        
      } catch (err) {
        console.error('Error verifying donation:', err);
        setError('Failed to verify your donation. Please contact support.');
        setLoading(false);
      }
    };

    verifyDonation();
  }, [sessionId]);

  useEffect(() => {
    let timer;
    if (donation && !loading && !error) {
      timer = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [donation, loading, error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="animate-pulse text-center py-10">Verifying your donation...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="text-red-600 text-center py-10">
              {error}
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-100 p-4 flex items-center justify-center">
              <div className="bg-green-500 text-white p-3 rounded-full">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="p-6 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Your donation of ${donation?.amount.toFixed(2)} was successful.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Donation Details</h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${donation?.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Campaign:</span>
                  <span className="font-medium">{donation?.donationEvent.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(donation?.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-2">
                A receipt has been sent to your email address.
                {!user && (
                  <span className="block mt-2">
                    Create an account to keep track of all your donations.
                  </span>
                )}
              </p>
              
              <div className="bg-blue-50 p-3 rounded-lg text-blue-700 font-medium mb-6 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Redirecting to home page in {countdown} seconds...</span>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-150 ease-in-out"
                >
                  Return Home
                </Link>
                
                {donation?.donationEvent.id && (
                  <Link 
                    to={`/donate/${donation.donationEvent.id}`} 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition duration-150 ease-in-out"
                  >
                    View Campaign
                  </Link>
                )}
                
                {!user && (
                  <Link 
                    to="/register" 
                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md transition duration-150 ease-in-out"
                  >
                    Create Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;
