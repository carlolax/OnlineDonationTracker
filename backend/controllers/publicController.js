const DonationEvent = require('../models/DonationEvent');

// @desc    Get all public donation events
// @route   GET /api/public/donation-events
// @access  Public
exports.getPublicDonationEvents = async (req, res) => {
  try {
    const donationEvents = await DonationEvent.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: donationEvents.length,
      data: donationEvents
    });
    
  } catch (error) {
    console.error('Get public donation events error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve donation events'
    });
  }
};

// @desc    Get single public donation event
// @route   GET /api/public/donation-events/:id
// @access  Public
exports.getPublicDonationEvent = async (req, res) => {
  try {
    const donationEvent = await DonationEvent.findById(req.params.id);
    
    if (!donationEvent) {
      return res.status(404).json({
        success: false,
        message: 'Donation event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: donationEvent
    });
    
  } catch (error) {
    console.error('Get public donation event error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve donation event'
    });
  }
};
