import mongoose from "mongoose";

// Define a schema for a Business Account
const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    profilePicture: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "premium", "enterprise"],
      default: "free",
    },
  },
  {
    timestamps: true,
    collection: "businesses",
  }
);

// Create the model
const Business = mongoose.model("Business", businessSchema);
export default Business;
