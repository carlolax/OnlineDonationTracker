import React from 'react';
import { Link } from 'react-router-dom';

const DonationEventCard = ({ event }) => {
  const percentageRaised = event.raisedAmount 
    ? Math.min(100, (event.raisedAmount / event.amount) * 100) 
    : 0;
    
  return (
    <li className="p-4 hover:bg-gray-50 block w-full rounded mb-2">
      <div className="flex items-center gap-4 h-full">
        {/* Image on the left */}
        <div className="flex-shrink-0">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-24 h-24 object-cover rounded shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-500 text-xl">📷</span>
            </div>
          )}
        </div>
        
        {/* Content on the right */}
        <div className="flex-grow min-w-0 w-full">
          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
            <div className="min-w-0 max-w-full overflow-hidden">
              <h3 className="font-medium text-lg truncate">{event.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Goal: <span className="font-semibold">${event.amount.toFixed(2)}</span></p>
            </div>
            <span className={`${event.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center whitespace-nowrap`}>
              {event.status === 'completed' ? 'Completed!' : `$${(event.raisedAmount || 0).toFixed(2)} raised`}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className={`${event.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'} h-2.5 rounded-full`} style={{ width: `${percentageRaised}%` }}></div>
          </div>
          
          <div className="mt-3 min-h-[28px] flex items-center">
            {event.status !== 'completed' ? (
              <Link 
                to={`/donate/${event._id}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded transition-colors inline-block"
              >
                Donate Now
              </Link>
            ) : (
              <div className="text-sm text-green-700 font-medium inline-block py-1.5 px-4">
                Goal successfully reached!
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default DonationEventCard;
