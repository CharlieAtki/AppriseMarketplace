import mongoose from "mongoose";

// Define a schema for a User (Customer & Businesses)
const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Invalid email format']
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['customer', 'business' ,'admin'], // Supports both customers and businesses
        default: 'customer'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    // Customer-Specific Fields
    favoriteDestinations: [{ type: String }],
    pastBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    upcomingBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],


    // Business-specific fields (Only applies to users with role: "business")
    businessName: {
        type: String,
        required: function () { return this.role === 'business'; } // Required only for businesses
    },
    contactNumber: {
        type: String,
        required: function () { return this.role === 'business'; } // Required only for businesses
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String },
    },
    subscriptionPlan: {
        type: String,
        enum: ["free", "premium", "enterprise"],
        default: "free",
        required: function () { return this.role === 'business'; }, // Required for businesses
    }
},
    {
        timestamps: true,
        collection: 'users'
    }
);

// Create the model
const User = mongoose.model('User', userSchema);
export default User // Exporting the schema
