import mongoose from "mongoose";

const locationRateSchema = new mongoose.Schema({
  assam: { type: Number, default: 0, min: [0, "Price cannot be negative"] },
  neBySurface: { type: Number, default: 0, min: [0, "Price cannot be negative"] },
  neByAirAgtImp: { type: Number, default: 0, min: [0, "Price cannot be negative"] },
  restOfIndia: { type: Number, default: 0, min: [0, "Price cannot be negative"] }
}, { _id: false });

const doxPricingSchema = new mongoose.Schema({
  "01gm-250gm": { type: locationRateSchema, default: () => ({}) },
  "251gm-500gm": { type: locationRateSchema, default: () => ({}) },
  add500gm: { type: locationRateSchema, default: () => ({}) }
}, { _id: false });

const priorityPricingSchema = new mongoose.Schema({
  "01gm-500gm": { type: locationRateSchema, default: () => ({}) },
  add500gm: { type: locationRateSchema, default: () => ({}) }
}, { _id: false });

const reverseDeliverySchema = new mongoose.Schema({
  normal: { type: Number, default: 0, min: [0, "Price cannot be negative"] },
  priority: { type: Number, default: 0, min: [0, "Price cannot be negative"] }
}, { _id: false });

const reverseTransportSchema = new mongoose.Schema({
  byRoad: { type: reverseDeliverySchema, default: () => ({}) },
  byTrain: { type: reverseDeliverySchema, default: () => ({}) },
  byFlight: { type: reverseDeliverySchema, default: () => ({}) }
}, { _id: false });

const reversePricingSchema = new mongoose.Schema({
  toAssam: { type: reverseTransportSchema, default: () => ({}) },
  toNorthEast: { type: reverseTransportSchema, default: () => ({}) }
}, { _id: false });

const customerPricingSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    default: "default"
  },
  doxPricing: {
    type: doxPricingSchema,
    default: () => ({})
  },
  nonDoxSurfacePricing: {
    type: locationRateSchema,
    default: () => ({})
  },
  nonDoxAirPricing: {
    type: locationRateSchema,
    default: () => ({})
  },
  priorityPricing: {
    type: priorityPricingSchema,
    default: () => ({})
  },
  reversePricing: {
    type: reversePricingSchema,
    default: () => ({})
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, "Notes cannot be longer than 1000 characters"]
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  },
  lastUpdatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: "customerpricing"
});

customerPricingSchema.index({ slug: 1 }, { unique: true });
customerPricingSchema.index({ updatedAt: -1 });

customerPricingSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

customerPricingSchema.pre("save", function(next) {
  if (this.isModified()) {
    this.lastUpdatedAt = new Date();
  }
  next();
});

customerPricingSchema.statics.getSingleton = async function() {
  let pricing = await this.findOne({ slug: "default" })
    .populate("lastUpdatedBy", "name email")
    .lean();

  if (!pricing) {
    pricing = await this.create({ slug: "default" });
    pricing = await this.findOne({ slug: "default" })
      .populate("lastUpdatedBy", "name email")
      .lean();
  }

  return pricing;
};

export default mongoose.model("CustomerPricing", customerPricingSchema);

