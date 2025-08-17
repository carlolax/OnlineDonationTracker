const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const DonationEvent = require('../models/DonationEvent');
const Donation = require('../models/Donation');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { amount, donationEventId, donorId, isAnonymous, successUrl, cancelUrl } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }
    
    if (!donationEventId) {
      return res.status(400).json({ message: 'Donation event ID is required' });
    }

    const donationEvent = await DonationEvent.findById(donationEventId);
    if (!donationEvent) {
      return res.status(404).json({ message: 'Donation event not found' });
    }

    const metadata = {
      donationEventId,
      isAnonymous: isAnonymous.toString()
    };
    
    if (donorId) {
      metadata.donorId = donorId;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Donation to ${donationEvent.title}`,
              description: `Supporting ${donationEvent.title}`,
              images: donationEvent.imageUrl ? [donationEvent.imageUrl] : [],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata,
      mode: 'payment',
      success_url: successUrl ? `${successUrl}?session_id={CHECKOUT_SESSION_ID}` : `${req.headers.origin}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/donate/${donationEventId}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
};

exports.handleWebhookEvent = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      console.log('Payment successful for session:', session.id);
      console.log('Metadata:', session.metadata);
      // Example: await updateDonationAmount(session.metadata.donationEventId, session.amount_total / 100);
    } catch (error) {
      console.error('Error processing successful payment:', error);
    }
  }

  res.send({ received: true });
};

async function updateDonationAmount(donationEventId, amount) {
  try {
    const donationEvent = await DonationEvent.findById(donationEventId);
    if (!donationEvent) {
      throw new Error('Donation event not found');
    }
    
    donationEvent.raisedAmount += amount;
    
    if (donationEvent.raisedAmount >= donationEvent.amount && donationEvent.status === 'active') {
      donationEvent.status = 'completed';
      console.log(`Donation event ${donationEventId} marked as completed`);
    }
    
    await donationEvent.save();
    
    return donationEvent;
  } catch (error) {
    console.error('Error updating donation amount:', error);
    throw error;
  }
}

exports.verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        message: 'Payment not completed', 
        status: session.payment_status 
      });
    }
    
    const existingDonation = await Donation.findOne({ paymentId: session.id });
    if (existingDonation) {
      const donationEvent = await DonationEvent.findById(existingDonation.donationEvent);
      
      return res.json({
        success: true,
        donation: {
          ...existingDonation.toObject(),
          donationEvent: donationEvent ? donationEvent.toObject() : null
        }
      });
    }
    
    const { donationEventId, isAnonymous, donorId } = session.metadata;
    
    const newDonation = new Donation({
      amount: session.amount_total / 100,
      donationEvent: donationEventId,
      donor: donorId || null,
      isAnonymous: isAnonymous === 'true',
      paymentId: session.id,
      paymentStatus: 'succeeded'
    });
    
    await newDonation.save();
    
    const donationEvent = await updateDonationAmount(donationEventId, session.amount_total / 100);
    
    res.json({
      success: true,
      donation: {
        ...newDonation.toObject(),
        donationEvent: donationEvent.toObject()
      }
    });
    
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ message: 'Error verifying payment session', error: error.message });
  }
};
