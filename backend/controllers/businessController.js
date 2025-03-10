import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// Num of times the hashing algorithm is applied
const saltRounds = 10

export const businessCreation = async (req, res) => {
    try {
        const existingEmailCheck = await User.findOne({email: req.body.email});
        if (existingEmailCheck) {
            return res.status(404).send({
                success: false,
                message: "Email already exists",
                field: "email"
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Creating the user account (the object in the MongoDb database)
        const user = new User({
            email: req.body.email,
            hashedPassword: hashedPassword
        });

        const result = await user.save(); // saving the client document into the user collection
        return res.status(201).send(result); // sending the document information to the frontend / where the request was made

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

export const businessLogin = async (req, res) => {
    const passwordString = String(req.body.password); // the input password from the frontend

    try {
        const searchedBusiness = await User.findOne({email: req.body.email}) // searching for a user with the input credentials
        if (searchedBusiness) {
            const match = await bcrypt.compare(passwordString, searchedBusiness.hashedPassword);
            // Checking to see if the hashed password and user role matches
            if (match && searchedBusiness.role === "business") {
                // Set session
                req.session.user = {
                    id: searchedBusiness._id,
                    email: req.body.email,
                    isAuthenticated: true, // identifying that the user has logged in
                    role: searchedBusiness.role,
                    isVerified: searchedBusiness.isVerified // signifying whether the email has been verified
                };

                await new Promise((resolve, reject) => {
                    req.session.save((error) => {
                        if (error) reject(error);
                        resolve();
                    });
                });

                // Setting Headers for Safari
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);

                return res.status(200).json({
                    success: true,
                    message: "Login successful"
                });
            }
        }

        return res.status(401).json({
            success: false,
            message: "Invalid Credentials"
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const businessLogout = async (req, res) => {
    try {
        // checks is the session exists
        if (!req.session) {
            return res.status(401).send({
                success: false,
                message: "No session present"
            });
        }

        // Convert callback-based session.destroy() to Promise
        await new Promise((resolve, reject) => { // Creates a new promise
            // Calling session.destroy() which expects a callback
            req.session.destroy(error => {
                // If errors exist, reject the Promise with error
                // If no error, resolve the Promise with no value
                error ? reject(error) : resolve()
            });
        });

        // Clear cookie with matching settings
        res.clearCookie('connect.sid', {
            path: '/',
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            domain: undefined
        });

        // Send successful response
        return res.status(200).send({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

// API to change the user role into "business"
export const becomeABusiness = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.body.email }, // Find user by email
            {
                role: "business", // Update role
                businessName: req.body.businessName,
            },
            { new: true } // Return updated document
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: updatedUser // Returning the updated user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Role check - sends the result back to the frontend as only the backend can access the session
export const roleCheck = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.email) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No session user found",
            });
        }

        // Find the user without modifying their role
        const user = await User.findOne({ email: req.session.user.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User role retrieved successfully",
            user: { role: user.role } // Only return role without modifying it
        });

    } catch (error) {
        console.error("Error in roleCheck:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Server error: " + error.message
            });
        }
    }
};

// Listing Controllers

// Api logic for formating and saving the listing information to the MongoDB listings collection
export const listingCreation = async (req, res) => {
    // Checking for session - User must be loggedIn to create a listing
    if (!req.session.user || !req.session.user.id) {
        console.log("No valid session found");
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No valid session'
        });
    }

    // Creating the listing object
    try {
        const newListing = new Listing({
            ...req.body, // { ...req.body }: This spreads all the properties from req.body into the new object. That means every field sent in the request is included in the new listing unless explicitly overridden.
            business_id: req.session.user.id,
            // processes the highlights data for storing
            // Splits the string by commas (split(',')), turning it into an array.
            // Trims whitespace from each element (map(h => h.trim())).
            // The same process is applied to the services_offered data
            highlights: typeof req.body.highlights === 'string'
                ? req.body.highlights.split(',').map(h => h.trim())
                : req.body.highlights,
            services_offered: typeof req.body.services_offered === 'string'
                ? req.body.services_offered.split(',').map(s => s.trim())
                : req.body.services_offered
        });

        console.log("Attempting to save listing:", newListing);
        const savedListing = await newListing.save(); // saving the listing to the collection
        console.log("Listing saved successfully:", savedListing);

        // Send a response to the frontend for user feedback etc
        res.status(201).json({
            success: true,
            message: "Created listing successfully",
            listing: savedListing
        });
    } catch (error) {
        console.error("Error creating listing:", error);
        return res.status(500).json({
            success: false,
            message: error.message || 'An unexpected error occurred'
        });
    }
};

export const fetchListings = async (req, res) => {
    try {
        const destinations = await Listing.find({}); // Fetch all listings

        if (!destinations || destinations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Destinations not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Destinations found",
                payload: destinations // Sending results in `payload`
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Booking logic:

export const bookingCreation = async (req, res) => {
    try {
        const { listingId, destinationName, arrivalDate, leavingDate, numGuests, totalPrice } = req.body;
        const customerId = req.session.user?.id;

        // Validate session
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "User must be logged in",
            });
        }

        // Validate required fields
        if (!listingId || !destinationName || !arrivalDate || !leavingDate || !numGuests || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                required: ["listingId", "destinationName", "arrivalDate", "leavingDate", "numGuests", "totalPrice"]
            });
        }

        // Convert dates to proper Date objects
        const checkIn = new Date(arrivalDate);
        const checkOut = new Date(leavingDate);

        // Find listing and validate
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        // Validate maximum guests
        if (numGuests > listing.max_guests) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${listing.max_guests} guests allowed`,
            });
        }

        // Check for existing bookings within the selected date range
        const overlappingBookings = await Booking.find({
            listingId,
            $or: [
                { arrivalDate: { $lte: checkOut }, leavingDate: { $gte: checkIn } }
            ],
            bookingStatus: { $ne: "canceled" }
        });

        if (overlappingBookings.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Selected dates are unavailable. Please choose a different date range.",
            });
        }

        // Create booking
        const booking = new Booking({
            customerId,
            businessId: listing.business_id,
            listingId,
            destinationName,
            arrivalDate: checkIn,
            leavingDate: checkOut,
            numGuests,
            totalPrice,
            currency: listing.currency
        });

        const savedBooking = await booking.save();

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: savedBooking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
};

export const bookingDateAvailabilityCheck = async (req, res) => {
    try {
        const { listingId } = req.query;

        if (!listingId) {
            return res.status(400).json({
                success: false,
                message: "Listing ID is required",
            });
        }

        // Query the database for all booked date ranges
        const bookedDateRanges = await Booking.find({ listingId, bookingStatus: { $ne: "canceled" } })
            .select("arrivalDate leavingDate -_id");

        let bookedDatesArray = [];

        bookedDateRanges.forEach(booking => {
            let currentDate = new Date(booking.arrivalDate);
            const endDate = new Date(booking.leavingDate);

            while (currentDate <= endDate) {
                bookedDatesArray.push(currentDate.toISOString().split("T")[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        return res.status(200).json({
            success: true,
            message: "Fetched booked dates successfully",
            bookedDates: bookedDatesArray,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
};

export const fetchBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            customerId: req.session.user.id
        });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Booking found successfully",
                payload: bookings
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const fetchAggregatedBookingData = async (req, res) => {
    try {
        // Ensure businessId is an ObjectId by converting the string to an ObjectId
        const businessId = new mongoose.Types.ObjectId(req.session.user.id);

        const bookings = await Booking.aggregate([
            {
                $match: { businessId: businessId } // filtering the booking documents to only include the ones with the currently logged-in users listings
            },
            {
                $group: { // groups the documents by the year and week of the createdAt field
                    _id: {
                        year: { $year: "$createdAt" }, // operator extracts the year from the createdAt field
                        week: { $week: "$createdAt" } // Operator extracts the week from the createdAt field
                    },
                    // Operators calculate the metrics below
                    totalRevenue: { $sum: "$totalPrice" },
                    averagePrice: { $avg: "$totalPrice" },
                    totalBookings: { $sum: 1 } // Counts the number of bookings within each group. Increments for each one
                }
            },
            { $sort: { "_id": 1 } } // Sorts the results by the _id field (defined above) in accenting order (1 for ascending -1 for descending)
        ]);

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking found successfully",
            payload: bookings
        });

    } catch (error) {
        console.error("Aggregation Error:", error); // Log error to debug
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
};