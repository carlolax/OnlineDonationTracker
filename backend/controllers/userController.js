const Donation = require('../models/Donation');
const DonationEvent = require('../models/DonationEvent');
const mongoose = require('mongoose');

exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.user.id;
    const donations = await Donation.find({ donor: userId })
      .populate('donationEvent', 'title amount status')
      .sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
};
