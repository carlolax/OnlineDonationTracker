const mongoose = require('mongoose');

const donationEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a donation title'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a donation amount'],
    min: [0, 'Amount cannot be negative']
  },
  details: {
    type: String,
    required: [true, 'Please provide donation details']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  raisedAmount: {
    type: Number,
    default: 0,
    min: [0, 'Raised amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const DonationEvent = mongoose.model('DonationEvent', donationEventSchema);

module.exports = DonationEvent;
