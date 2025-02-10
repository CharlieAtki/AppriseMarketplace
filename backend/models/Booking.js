import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the customer making the booking
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the business owner
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing", // References the listing being booked
        required: true
    },
    destinationName: {
        type: String,
        required: true
    },
    arrivalDate: {
        type: Date,
        required: true,
    },
    leavingDate: {
        type: Date,
        required: true,
    },
    numGuests: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "GBP"
    },
    bookingStatus: {
        type: String,
        enum: ["pending", "confirmed", "canceled", "completed"],
        default: "pending",
    },
    paymentDetails: {
        transactionId: { type: String },
        paymentMethod: { type: String, enum: ["creditCard", "paypal"] },
        paidAmount: { type: Number }
    },
},
    {
        timestamps: true,
        collection: 'bookings'
    }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;