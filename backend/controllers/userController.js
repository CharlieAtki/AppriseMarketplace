import User from "../models/User.js";
import bcrypt from "bcrypt";

// Num of times the hashing algorithm is applied
const saltRounds = 10;

export const userCreation = async (req, res) => {
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

export const userLogin = async (req, res) => {
    const passwordString = String(req.body.password); // the input password from the frontend

    try {
        const searchedUser = await User.findOne({email: req.body.email}) // searching for a user with the input credentials
        if (searchedUser) {
            const match = await bcrypt.compare(passwordString, searchedUser.hashedPassword);
            if (match) {
                req.session.user = {
                    id: searchedUser._id,
                    email: req.body.email,
                    isAuthenticated: true, // identifying that the user has logged in
                    role: searchedUser.role,
                    isVerified: searchedUser.isVerified // signifying whether the email has been verified
                };

                return res.status(200).send({
                    success: true,
                    message: "Login successful"
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Invalid Credentials"
                })
            }
        } else {
            return res.status(401).send({
                success: false,
                message: "Invalid Credentials"
            })
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
}