const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Backend API is running!');
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
