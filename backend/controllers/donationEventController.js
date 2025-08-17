const DonationEvent = require('../models/DonationEvent');

// @desc    Create a new donation event
// @route   POST /api/admin/donation-events
// @access  Private/Admin
exports.createDonationEvent = async (req, res) => {
  try {
    const { title, amount, details, imageUrl } = req.body;
    
    const donationEvent = await DonationEvent.create({
      title,
      amount,
      details,
      imageUrl: imageUrl || '',
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: donationEvent
    });
    
  } catch (error) {
    console.error('Create donation event error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Could not create donation event'
    });
  }
};

// @desc    Get all donation events
// @route   GET /api/admin/donation-events
// @access  Private/Admin
exports.getDonationEvents = async (req, res) => {
  try {
    const donationEvents = await DonationEvent.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: donationEvents.length,
      data: donationEvents
    });
    
  } catch (error) {
    console.error('Get donation events error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve donation events'
    });
  }
};

// @desc    Get single donation event
// @route   GET /api/admin/donation-events/:id
// @access  Private/Admin
exports.getDonationEvent = async (req, res) => {
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
    console.error('Get donation event error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve donation event'
    });
  }
};

// @desc    Update donation event
// @route   PUT /api/admin/donation-events/:id
// @access  Private/Admin
exports.updateDonationEvent = async (req, res) => {
  try {
    const { title, amount, details, imageUrl } = req.body;
    
    let donationEvent = await DonationEvent.findById(req.params.id);
    
    if (!donationEvent) {
      return res.status(404).json({
        success: false,
        message: 'Donation event not found'
      });
    }
    
    donationEvent = await DonationEvent.findByIdAndUpdate(
      req.params.id,
      { title, amount, details, imageUrl },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: donationEvent
    });
    
  } catch (error) {
    console.error('Update donation event error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Could not update donation event'
    });
  }
};

// @desc    Delete donation event
// @route   DELETE /api/admin/donation-events/:id
// @access  Private/Admin
exports.deleteDonationEvent = async (req, res) => {
  try {
    const donationEvent = await DonationEvent.findById(req.params.id);
    
    if (!donationEvent) {
      return res.status(404).json({
        success: false,
        message: 'Donation event not found'
      });
    }
    
    await donationEvent.remove();
    
    res.status(200).json({
      success: true,
      message: 'Donation event deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete donation event error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete donation event'
    });
  }
};
