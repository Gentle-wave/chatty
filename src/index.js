const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const chatSocket = require('./sockets/chatSocket');
const AppError = require('./utils/AppError');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const { connectDB } = require('./config/index');
const errorHandler = require('./utils/error.handler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors({ origin: '*' })); // Enable CORS with * origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/user', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Chat Application API' });
});

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Socket.io Configuration
chatSocket(io);

// Global Error Handling
app.use(errorHandler);

// Handle Unhandled Promise Rejections and Exceptions
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    throw err;
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Optionally handle shutdown here
});

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
