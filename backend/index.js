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

app.use(cors({
  origin: process.env.FRONTEND_URL, // Frontend URL
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: true,
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
    sameSite: 'none', // Protects against CSRF attacks & allows cross-origin cookies in production
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration in milliseconds (e.g., 1 day)
    path: '/',
    domain: undefined // Domain as undefined results in the browser automatically handling the cookie based on the server's response origin.
  },
  name: 'sessionId', // Session cookie name
}));

// Enhanced security headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Debug middleware (consider removing in production)
app.use((req, res, next) => {
  console.log('Request origin:', req.headers.origin);
  console.log('Request cookies:', req.cookies);
  console.log('Request session:', req.session);
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
