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

app.use(cors({
  origin: process.env.FRONTEND_URL, // Frontend URL
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
  proxy: true, // Used in render hosting
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // MongoDB connection URL
    collectionName: 'sessions', // Collection to store session data
    ttl: 24 * 60 * 60, // Session expiration in seconds (e.g., 1 day)
  }),
  cookie: {
    secure: true, // Use secure cookies in production
    httpOnly: true, // Prevents JavaScript access to cookies
    sameSite: 'None', // Protects against CSRF attacks & allows cross-origin cookies in production
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration in milliseconds (e.g., 1 day)
    path: '/',
    domain: undefined, // Domain as undefined results in the browser automatically handling the cookie based on the server's response origin.
    partitioned: true,
    priority: 'high',
    secrets: [process.env.SECRET_KEY],
  },
  name: 'connect.sid', // Session cookie name
}));

// Enhanced security headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://apprise-marketplace.vercel.app'); // Replace with your frontend domain
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://apprise-marketplace.vercel.app'); // Replace with your frontend domain
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});


// Debug middleware (consider removing in production)
app.use((req, res, next) => {
    console.log('Detailed Session Debug:');
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Is Session New?:', req.session.isNew);
    console.log('Headers:', req.headers);
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
