import bcrypt from "bcryptjs";
import OpenAI from "openai";
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
            { email: req.session.user.email }, // Find user by email
            {
                role: "business", // Update role
                businessName: "BusinessName",
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
                $match: { businessId: businessId } // Filtering the booking documents to only include the ones with the currently logged-in user's listings
            },
            {
                $project: { // Defines what information should be extracted from the documents that satisfy the conditions specified
                    dayOfWeekNumber: { $dayOfWeek: "$createdAt" }, // Extracts day of the week as a number (1 = Sunday, 2 = Monday, etc.)
                    hour: { $hour: "$createdAt" }, // Extracts the hour of the booking
                    totalPrice: 1 // Keeps totalPrice for aggregation in the next stage
                }
            },
            {
                $group: {
                    _id: {
                        // Convert numeric day of the week into a human-readable name
                        dayOfWeek: {
                            $switch: { // Evaluates the conditions / cases in order and returns the first match
                                branches: [ // An array of different cases to be evaluated
                                    { case: { $eq: ["$dayOfWeekNumber", 1] }, then: "Sunday" },
                                    { case: { $eq: ["$dayOfWeekNumber", 2] }, then: "Monday" },
                                    { case: { $eq: ["$dayOfWeekNumber", 3] }, then: "Tuesday" },
                                    { case: { $eq: ["$dayOfWeekNumber", 4] }, then: "Wednesday" },
                                    { case: { $eq: ["$dayOfWeekNumber", 5] }, then: "Thursday" },
                                    { case: { $eq: ["$dayOfWeekNumber", 6] }, then: "Friday" },
                                    { case: { $eq: ["$dayOfWeekNumber", 7] }, then: "Saturday" }
                                ],
                                default: "Unknown" // Fallback in case of unexpected values
                            }
                        },
                        hour: "$hour" // Group by hour as well
                    },
                    totalRevenue: { $sum: "$totalPrice" }, // Calculate total revenue for each day/hour group
                    averagePrice: { $avg: "$totalPrice" }, // Calculate average booking price
                    totalBookings: { $sum: 1 } // Count total number of bookings
                }
            },
            {
                $sort: { "_id": 1 } // Sorts results by day name and hour in ascending order
            }
        ]);

        // Checking for unexpected behaviour. Eg, if no information is passed back, dont attempt to load the graph
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found",
            });
        }

        // Passing thr aggregate information back to the frontend in the from of an array
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

export const listingRecommendation = async (req, res) => {
    try {
        // Extracting the API key from the env file
        const openai = new OpenAI({
            apiKey: `${process.env.OPENAI}`,
        });

        // Extract data from request body
        const { prompt, currentFilters, availableListings } = req.body;

        // Initialize query object
        let query = {};

        // Apply available listings filter if provided
        if (availableListings && Array.isArray(availableListings) && availableListings.length > 0) {
            query = { _id: { $in: availableListings } };
        }

        // Apply dynamic filtering based on provided user preferences
        if (currentFilters) {
            // Price filter (only if provided)
            if (currentFilters.price && (currentFilters.price.min || currentFilters.price.max)) {
                query.price = {};
                if (currentFilters.price.min) query.price.$gte = Number(currentFilters.price.min);
                if (currentFilters.price.max) query.price.$lte = Number(currentFilters.price.max);
            }

            // Currency filter (only if provided)
            if (currentFilters.currency) {
                query.currency = currentFilters.currency;
            }

            // Max guests filter (accommodating flexible number of guests)
            if (currentFilters.maxGuests) {
                query.max_guests = { $gte: Number(currentFilters.maxGuests) };
            }

            // Country filter (only if provided)
            if (currentFilters.countries && currentFilters.countries.length > 0) {
                query["location.country"] = { $in: currentFilters.countries };
            }

            // City filter (only if provided)
            if (currentFilters.cities && currentFilters.cities.length > 0) {
                query["location.city"] = { $in: currentFilters.cities };
            }

            // Highlights filter (for sightseeing or specific activities)
            if (currentFilters.highlights && currentFilters.highlights.length > 0) {
                query.highlights = { $in: currentFilters.highlights };
            }

            // Services offered filter (if specific services are mentioned)
            if (currentFilters.servicesOffered && currentFilters.servicesOffered.length > 0) {
                query.services_offered = { $in: currentFilters.servicesOffered };
            }

            // If no specific filters, allow for more flexibility (for flexible budget, etc.)
            if (!currentFilters.price && !currentFilters.maxGuests && !currentFilters.countries && !currentFilters.cities) {
                // Allow listings to be considered without a strict filter
            }
        }

        // Fetch filtered listings
        const filteredListings = await Listing.find(query);

        if (!filteredListings || filteredListings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No matching listings found"
            });
        }

        // Format listings for the AI model
        const formattedListings = filteredListings.map(listing => ({
            id: listing._id.toString(),
            name: listing.name,
            description: listing.description,
            price: listing.price,
            currency: listing.currency || "GBP", // Default to GBP if currency is missing
            location: {
                country: listing.location?.country,
                city: listing.location?.city
            },
            highlights: listing.highlights || [],
            max_guests: listing.max_guests,
            services_offered: listing.services_offered || []
        }));

        // Create system prompt for the AI
        const systemPrompt = `
            You are a travel recommendation system. Based on the user's preferences and the available listings,
            recommend the top 3-5 most suitable listings. Return ONLY a JSON object with a single key "recommendations" 
            containing an array of the recommended listing IDs in the following format: 
            {"recommendations": ["id1", "id2", "id3"]}.
            Do not include any explanations or additional text in your response, just the JSON object.
            
            Available listings:
            ${JSON.stringify(formattedListings, null, 2)}
        `;

        // User prompt from frontend
        const userPrompt = `Based on my preferences: ${prompt}, which listings would you recommend?`;

        // Get AI recommendations
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500
        });

        // Parse the AI response
        let recommendedListingIds = [];
        try {
            const responseContent = response.choices[0].message.content;
            console.log("Raw AI response:", responseContent);
            const parsedResponse = JSON.parse(responseContent);

            if (parsedResponse && parsedResponse.recommendations && Array.isArray(parsedResponse.recommendations)) {
                recommendedListingIds = parsedResponse.recommendations;
            }
        } catch (error) {
            console.error("Error parsing AI response:", error);
        }

        // Validate recommendations to ensure they are in the filtered listings
        const validRecommendations = recommendedListingIds.filter(id => {
            const isValid = filteredListings.some(listing => listing._id.toString() === id);
            if (!isValid) {
                console.log(`ID ${id} not found in filtered listings`);
            }
            return isValid;
        });

        return res.status(200).json({
            success: true,
            message: "Recommendations generated successfully",
            recommendations: validRecommendations
        });

    } catch (error) {
        console.error("Recommendation error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
};