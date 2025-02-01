import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Listing from "../models/Listing.js"; // This is the business model

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
        const passwordString = String(req.body.password);
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
        // Checking for a session
        if (!req.session.user) {
            return res.status(401).json({
                success: false,
                message: "User session not found"
            });
        }

        // Checking if the session has the role set
        if (req.session.user.role) {
            return res.status(200).json({
                success: true,
                userRole: req.session.user.role
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "User role not found"
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Listing Controllers

// Api logic for formating and saving the listing information to the MongoDB listings collection
export const listingCreation = async (req, res) => {
    console.log("Received listing creation request");
    console.log("Request body:", req.body);
    console.log("Session:", req.session);

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

