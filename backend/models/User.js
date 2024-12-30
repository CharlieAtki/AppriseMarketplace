import mongoose from "mongoose";

// Define a schema for a User
const userSchema = new mongoose.Schema({
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
        enum: ['user', 'admin'],
        default: 'user'
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
    favoriteDestinations: [
        {
            type: String
        }
    ],
    pastBookings: [
        {
            bookingId: {
                type: String
            },
            destination: {
                type: String,
            },
            date: {
                type: Date
            },
            status: {
                type: String,
            }
        }
    ],
    upcomingBookings: {
        type: Array,
    },
    preferences: {
        seatPreference: {
            type: String,
            enum: ['window', 'aisle', 'middle']
        },
        mealPreference: {
            type: String,
            enum: ['vegetarian', 'non-vegetarian', 'vegan', 'kosher', 'halal']
        },
        language: {
            type: String
        }
    }
},
    {
        timestamps: true,
        collection: 'users'
    }
);

// Create the model
const User = mongoose.model('User', userSchema);
export default User
