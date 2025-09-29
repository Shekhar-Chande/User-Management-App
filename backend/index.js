const express = require('express');
const cors = require('cors'); // Essential for MERN stack communication
const userRoutes = require('../backend/src/routes/userRoutes');

const app = express();
const PORT = 3000;

// Middleware Setup
app.use(cors()); // Allow requests from React frontend
app.use(express.json()); // Body parser

// Routes
app.use('/users', userRoutes);

// Simple health check route
app.get('/', (req, res) => {
    res.send('MERN Users Module Backend is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});