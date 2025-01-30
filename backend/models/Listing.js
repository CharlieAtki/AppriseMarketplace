import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the business user
        required: true
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String, required: true }],
    location: {
        country: { type: String, required: true },
        city: { type: String },
        coordinates: { lat: Number, lng: Number }
    },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    images: [{ type: String }], // Array of image URLs
    services_offered: [{ type: String }], // ["Snorkeling", "City Tour", etc.]
    max_guests: { type: Number, required: true },
    availability: [{
        date: { type: Date, required: true },
        slots: { type: Number, required: true }
    }]
}, { timestamps: true, collection: 'listings' });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
