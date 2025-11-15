import express from 'express';
import CustomerBooking from '../models/CustomerBooking.js';

const router = express.Router();

// Generate unique booking reference
const generateBookingReference = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CB-${timestamp}-${random}`;
};

// POST /api/customer-booking/create
router.post('/create', async (req, res) => {
  try {
    const {
      origin,
      destination,
      shipment,
      packageImages,
      shippingMode,
      serviceType,
      calculatedPrice,
      actualWeight,
      volumetricWeight,
      chargeableWeight,
      originServiceable,
      destinationServiceable,
      originAddressInfo,
      destinationAddressInfo,
      onlineCustomerId
    } = req.body;

    // Validate required fields
    if (!origin || !destination || !shipment) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide origin, destination, and shipment details'
      });
    }

    // Validate origin required fields
    if (!origin.name || !origin.mobileNumber || !origin.pincode || !origin.city || !origin.district || !origin.state) {
      return res.status(400).json({
        success: false,
        error: 'Invalid origin data',
        message: 'Please provide all required origin details'
      });
    }

    // Validate destination required fields
    if (!destination.name || !destination.mobileNumber || !destination.pincode || !destination.city || !destination.district || !destination.state) {
      return res.status(400).json({
        success: false,
        error: 'Invalid destination data',
        message: 'Please provide all required destination details'
      });
    }

    // Validate shipment required fields
    if (!shipment.natureOfConsignment || !shipment.insurance || !shipment.riskCoverage || !shipment.packagesCount) {
      return res.status(400).json({
        success: false,
        error: 'Invalid shipment data',
        message: 'Please provide all required shipment details'
      });
    }

    // Generate unique booking reference
    let bookingReference = generateBookingReference();
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure booking reference is unique
    while (!isUnique && attempts < maxAttempts) {
      const existing = await CustomerBooking.findOne({ bookingReference });
      if (!existing) {
        isUnique = true;
      } else {
        bookingReference = generateBookingReference();
        attempts++;
      }
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate unique booking reference',
        message: 'Please try again'
      });
    }

    // Create booking payload
    const bookingData = {
      origin: {
        name: origin.name || '',
        mobileNumber: origin.mobileNumber || '',
        email: origin.email || '',
        companyName: origin.companyName || '',
        flatBuilding: origin.flatBuilding || '',
        locality: origin.locality || '',
        landmark: origin.landmark || '',
        pincode: origin.pincode || '',
        area: origin.area || '',
        city: origin.city || '',
        district: origin.district || '',
        state: origin.state || '',
        gstNumber: origin.gstNumber || '',
        alternateNumbers: origin.alternateNumbers || [],
        addressType: origin.addressType || 'HOME',
        birthday: origin.birthday || '',
        anniversary: origin.anniversary || '',
        website: origin.website || '',
        otherAlternateNumber: origin.otherAlternateNumber || ''
      },
      destination: {
        name: destination.name || '',
        mobileNumber: destination.mobileNumber || '',
        email: destination.email || '',
        companyName: destination.companyName || '',
        flatBuilding: destination.flatBuilding || '',
        locality: destination.locality || '',
        landmark: destination.landmark || '',
        pincode: destination.pincode || '',
        area: destination.area || '',
        city: destination.city || '',
        district: destination.district || '',
        state: destination.state || '',
        gstNumber: destination.gstNumber || '',
        alternateNumbers: destination.alternateNumbers || [],
        addressType: destination.addressType || 'HOME',
        birthday: destination.birthday || '',
        anniversary: destination.anniversary || '',
        website: destination.website || '',
        otherAlternateNumber: destination.otherAlternateNumber || ''
      },
      shipment: {
        natureOfConsignment: shipment.natureOfConsignment || '',
        insurance: shipment.insurance || '',
        riskCoverage: shipment.riskCoverage || '',
        packagesCount: shipment.packagesCount || '',
        materials: shipment.materials || '',
        others: shipment.others || '',
        description: shipment.description || '',
        weight: shipment.weight || '',
        length: shipment.length || '',
        width: shipment.width || '',
        height: shipment.height || '',
        insuranceCompanyName: shipment.insuranceCompanyName || '',
        insurancePolicyNumber: shipment.insurancePolicyNumber || '',
        insurancePolicyDate: shipment.insurancePolicyDate || '',
        insuranceValidUpto: shipment.insuranceValidUpto || '',
        insurancePremiumAmount: shipment.insurancePremiumAmount || '',
        insuranceDocumentName: shipment.insuranceDocumentName || '',
        insuranceDocument: shipment.insuranceDocument || '' // S3 URL
      },
      packageImages: packageImages || [], // Array of S3 URLs
      shippingMode: shippingMode || '',
      serviceType: serviceType || '',
      calculatedPrice: calculatedPrice || null,
      actualWeight: actualWeight || null,
      volumetricWeight: volumetricWeight || null,
      chargeableWeight: chargeableWeight || null,
      originServiceable: originServiceable !== undefined ? originServiceable : null,
      destinationServiceable: destinationServiceable !== undefined ? destinationServiceable : null,
      originAddressInfo: originAddressInfo || '',
      destinationAddressInfo: destinationAddressInfo || '',
      bookingReference: bookingReference,
      status: 'pending',
      onlineCustomerId: onlineCustomerId || null
    };

    // Create booking
    const booking = new CustomerBooking(bookingData);
    await booking.save();

    console.log('✅ Customer booking created successfully:', booking._id, bookingReference);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: booking._id,
        bookingReference: booking.bookingReference,
        status: booking.status,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error creating customer booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: error.message || 'An error occurred while creating the booking'
    });
  }
});

// GET /api/customer-booking/search-by-phone
router.get('/search-by-phone', async (req, res) => {
  try {
    const { phoneNumber, type } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number required',
        message: 'Please provide a phone number'
      });
    }

    if (!type || (type !== 'origin' && type !== 'destination')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid type',
        message: 'Type must be either "origin" or "destination"'
      });
    }

    // Clean phone number (remove non-digits)
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

    if (cleanPhoneNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number',
        message: 'Phone number must be 10 digits'
      });
    }

    // Find all bookings with this phone number
    const query = type === 'origin' 
      ? { 'origin.mobileNumber': cleanPhoneNumber }
      : { 'destination.mobileNumber': cleanPhoneNumber };

    const bookings = await CustomerBooking.find(query)
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent too many results

    if (bookings.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No records found for this phone number'
      });
    }

    // Extract unique records based on key fields
    // We'll consider records unique if they have different combinations of:
    // name, pincode, city, district, state, locality, flatBuilding
    const uniqueRecords = [];
    const seenKeys = new Set();

    bookings.forEach(booking => {
      const data = type === 'origin' ? booking.origin : booking.destination;
      
      // Create a unique key based on address fields
      const uniqueKey = [
        data.name || '',
        data.pincode || '',
        data.city || '',
        data.district || '',
        data.state || '',
        data.locality || '',
        data.flatBuilding || ''
      ].join('|').toLowerCase();

      if (!seenKeys.has(uniqueKey)) {
        seenKeys.add(uniqueKey);
        uniqueRecords.push({
          name: data.name || '',
          mobileNumber: data.mobileNumber || '',
          email: data.email || '',
          companyName: data.companyName || '',
          flatBuilding: data.flatBuilding || '',
          locality: data.locality || '',
          landmark: data.landmark || '',
          pincode: data.pincode || '',
          area: data.area || '',
          city: data.city || '',
          district: data.district || '',
          state: data.state || '',
          gstNumber: data.gstNumber || '',
          alternateNumbers: data.alternateNumbers || [],
          addressType: data.addressType || 'Home',
          birthday: data.birthday || '',
          anniversary: data.anniversary || '',
          website: data.website || '',
          otherAlternateNumber: data.otherAlternateNumber || ''
        });
      }
    });

    res.json({
      success: true,
      data: uniqueRecords,
      count: uniqueRecords.length
    });

  } catch (error) {
    console.error('Error searching by phone number:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search by phone number',
      message: error.message || 'An error occurred while searching'
    });
  }
});

// GET /api/customer-booking/:bookingReference
router.get('/:bookingReference', async (req, res) => {
  try {
    const { bookingReference } = req.params;

    const booking = await CustomerBooking.findOne({ bookingReference });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        message: 'No booking found with the provided reference'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching customer booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking',
      message: error.message || 'An error occurred while fetching the booking'
    });
  }
});

// GET /api/customer-booking
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, skip = 0, onlineCustomerId } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }
    // Filter by onlineCustomerId if provided (for logged-in users)
    if (onlineCustomerId) {
      query.onlineCustomerId = onlineCustomerId;
    }

    const bookings = await CustomerBooking.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await CustomerBooking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
      message: error.message || 'An error occurred while fetching bookings'
    });
  }
});

// PATCH /api/customer-booking/:bookingReference/status
router.patch('/:bookingReference/status', async (req, res) => {
  try {
    const { bookingReference } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status required',
        message: 'Please provide a status'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await CustomerBooking.findOne({ bookingReference });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        message: 'No booking found with the provided reference'
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        bookingReference: booking.bookingReference,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status',
      message: error.message || 'An error occurred while updating the booking status'
    });
  }
});

// PATCH /api/customer-booking/:bookingId/payment
router.patch('/:bookingId/payment', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const booking = await CustomerBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        message: 'No booking found with the provided ID'
      });
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }
    if (razorpayOrderId) {
      booking.razorpayOrderId = razorpayOrderId;
    }
    if (razorpayPaymentId) {
      booking.razorpayPaymentId = razorpayPaymentId;
    }
    if (razorpaySignature) {
      booking.razorpaySignature = razorpaySignature;
    }
    if (paymentStatus === 'paid') {
      booking.paidAt = new Date();
      // Also update booking status to confirmed when payment is successful
      if (booking.status === 'pending') {
        booking.status = 'confirmed';
      }
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Payment information updated successfully',
      data: {
        bookingId: booking._id,
        bookingReference: booking.bookingReference,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Error updating payment information:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment information',
      message: error.message || 'An error occurred while updating payment information'
    });
  }
});

export default router;

