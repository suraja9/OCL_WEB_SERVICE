import mongoose from "mongoose";

const customerBookingSchema = new mongoose.Schema({
  // Origin/Sender Details
  origin: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      default: ''
    },
    companyName: {
      type: String,
      trim: true,
      default: ''
    },
    flatBuilding: {
      type: String,
      trim: true,
      default: ''
    },
    locality: {
      type: String,
      required: true,
      trim: true
    },
    landmark: {
      type: String,
      trim: true,
      default: ''
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true,
      default: ''
    },
    alternateNumbers: [{
      type: String,
      trim: true
    }],
    addressType: {
      type: String,
      enum: ['HOME', 'OFFICE', 'OTHERS', 'Home', 'Office'], // Accept both uppercase and capitalized for backward compatibility
      default: 'HOME'
    },
    birthday: {
      type: String,
      trim: true,
      default: ''
    },
    anniversary: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    otherAlternateNumber: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Destination/Receiver Details
  destination: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      default: ''
    },
    companyName: {
      type: String,
      trim: true,
      default: ''
    },
    flatBuilding: {
      type: String,
      trim: true,
      default: ''
    },
    locality: {
      type: String,
      required: true,
      trim: true
    },
    landmark: {
      type: String,
      trim: true,
      default: ''
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true,
      default: ''
    },
    alternateNumbers: [{
      type: String,
      trim: true
    }],
    addressType: {
      type: String,
      enum: ['HOME', 'OFFICE', 'OTHERS', 'Home', 'Office'], // Accept both uppercase and capitalized for backward compatibility
      default: 'HOME'
    },
    birthday: {
      type: String,
      trim: true,
      default: ''
    },
    anniversary: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    otherAlternateNumber: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Shipment Details
  shipment: {
    natureOfConsignment: {
      type: String,
      required: true,
      trim: true
    },
    insurance: {
      type: String,
      required: true,
      trim: true
    },
    riskCoverage: {
      type: String,
      required: true,
      trim: true
    },
    packagesCount: {
      type: String,
      required: true,
      trim: true
    },
    materials: {
      type: String,
      trim: true,
      default: ''
    },
    others: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    weight: {
      type: String,
      trim: true,
      default: ''
    },
    length: {
      type: String,
      trim: true,
      default: ''
    },
    width: {
      type: String,
      trim: true,
      default: ''
    },
    height: {
      type: String,
      trim: true,
      default: ''
    },
    // Insurance details (if insurance is selected)
    insuranceCompanyName: {
      type: String,
      trim: true,
      default: ''
    },
    insurancePolicyNumber: {
      type: String,
      trim: true,
      default: ''
    },
    insurancePolicyDate: {
      type: String,
      trim: true,
      default: ''
    },
    insuranceValidUpto: {
      type: String,
      trim: true,
      default: ''
    },
    insurancePremiumAmount: {
      type: String,
      trim: true,
      default: ''
    },
    insuranceDocumentName: {
      type: String,
      trim: true,
      default: ''
    },
    insuranceDocument: {
      type: String, // S3 URL
      trim: true,
      default: ''
    }
  },

  // Package Images (S3 URLs)
  packageImages: [{
    type: String, // S3 URL
    trim: true
  }],

  // Shipping Mode & Service Type
  shippingMode: {
    type: String,
    enum: ['byAir', 'byTrain', 'byRoad', ''],
    default: ''
  },
  serviceType: {
    type: String,
    enum: ['standard', 'priority', ''],
    default: ''
  },

  // Pricing Information
  calculatedPrice: {
    type: Number,
    default: null
  },
  actualWeight: {
    type: Number,
    default: null
  },
  volumetricWeight: {
    type: Number,
    default: null
  },
  chargeableWeight: {
    type: Number,
    default: null
  },

  // Serviceability Information
  originServiceable: {
    type: Boolean,
    default: null
  },
  destinationServiceable: {
    type: Boolean,
    default: null
  },
  originAddressInfo: {
    type: String,
    trim: true,
    default: ''
  },
  destinationAddressInfo: {
    type: String,
    trim: true,
    default: ''
  },

  // Booking Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'pay_later', ''],
    default: ''
  },
  razorpayOrderId: {
    type: String,
    trim: true,
    default: ''
  },
  razorpayPaymentId: {
    type: String,
    trim: true,
    default: ''
  },
  razorpaySignature: {
    type: String,
    trim: true,
    default: ''
  },
  paidAt: {
    type: Date,
    default: null
  },

  // Booking Reference Number
  bookingReference: {
    type: String,
    unique: true,
    sparse: true
  },

  // Online Customer Reference (if logged in)
  onlineCustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnlineCustomer',
    default: null
  }
}, {
  timestamps: true,
  collection: 'customerbookings'
});

// Indexes for better query performance
customerBookingSchema.index({ 'origin.mobileNumber': 1 });
customerBookingSchema.index({ 'destination.mobileNumber': 1 });
customerBookingSchema.index({ status: 1 });
customerBookingSchema.index({ bookingReference: 1 });
customerBookingSchema.index({ createdAt: -1 });
customerBookingSchema.index({ onlineCustomerId: 1 });

// Static method to find by booking reference
customerBookingSchema.statics.findByReference = function(reference) {
  return this.findOne({ bookingReference: reference });
};

// Static method to find by status
customerBookingSchema.statics.findByStatus = function(status) {
  return this.find({ status: status }).sort({ createdAt: -1 });
};

// Instance method to update status
customerBookingSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

export default mongoose.model("CustomerBooking", customerBookingSchema);

