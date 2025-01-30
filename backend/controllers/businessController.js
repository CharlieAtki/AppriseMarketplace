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

export const listingCreation = async (req, res) => {
    // Check if req.body is undefined or null
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is empty or not parsed properly.' });
    }

    // Now destructure the fields
    const {
        name,
        description,
        highlights,
        location,
        price,
        currency,
        images,
        services_offered,
        max_guests,
        availability
    } = req.body;

    // Validate that required fields are present
    if (!name || !description || !location || !price || !max_guests || !availability) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newListing = new Listing({
            business_id: req.session.user.id, // The logged-in user (business) creating the listing
            name,
            description,
            highlights,
            location,
            price,
            currency,
            images,
            services_offered,
            max_guests,
            availability
        });

        // Save the listing to the database
        const savedListing = await newListing.save();

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