import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // Import cors
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";
import unAuthRoutes from "./routes/unAuthRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy setting before other middleware
app.set('trust proxy', 1);

// List of allowed origins, meaning more than one origin can be used to make requests (for dev and prod)
const allowedOrigins = [
    'http://localhost:3000',                // Local frontend (dev)
    process.env.FRONTEND_URL,               // Frontend URL from environment variable (prod)
    'https://apprise-marketplace.vercel.app', // Your Vercel frontend
    'https://app.apprisemarketplace.com',
];

app.use(cors({
  origin: [
        'https://apprise-marketplace.vercel.app',  // Existing frontend URL
        'https://app.apprisemarketplace.com',  // Add the new frontend URL
  ],
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie', 'Content-Type'],
  maxAge: 600,
  optionsSuccessStatus: 200
}));

// Middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());

// Session Configuration
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false, // Prevents unnecessary session updates
  saveUninitialized: false, // Only save sessions when they are initialized
  proxy: process.env.NODE_ENV === 'production', // Used in render hosting
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // MongoDB connection URL
    collectionName: 'sessions', // Collection to store session data
    ttl: 24 * 60 * 60, // Session expiration in seconds (e.g., 1 day)
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true, // Prevents JavaScript access to cookies
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Allow cross-origin in production
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration in milliseconds (e.g., 1 day)
    path: '/',
  },
  name: 'connect.sid', // Session cookie name
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Linking the routes within userRoutes
app.use('/api/user-Auth', userRoutes) // Routes for authorised users - once the account has been created
app.use('/api/user-unAuth', unAuthRoutes) // Routes for unauthorised users
