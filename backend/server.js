// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const client = require('./db'); // Importing the db connection
const authenticateJWT = require('./middleware/auth'); // Importing the authentication middleware

// Importing route files
const fileRoute = require('./route/fileroutes');
const folderRoute = require('./route/folderroute');
const authRoute = require('./route/authroute');
const foldermanagement = require('./route/foldermanagement');

const app = express();

// Debugging log to check if JWT_SECRET is loaded
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    preflightContinue: true,
}));

app.options('*', cors());

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); // Enable file upload handling

// Upload file route
// Upload file route
app.post('/api/files/upload-file', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    // The name of the input field (i.e., "file") is used to retrieve the uploaded file
    const uploadedFile = req.files.file;

    // Determine the current path to save the uploaded file
    const currentPath = req.body.currentPath; // Expecting current path from request body

    // Validate that currentPath is provided
    if (!currentPath) {
        return res.status(400).json({ message: 'Current path is required.' });
    }

    // Create full upload path
    const uploadPath = path.join(__dirname, currentPath, uploadedFile.name);

    // Move the file to the desired location
    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ message: 'Failed to upload file.', error: err.message });
        }

        res.status(201).json({ message: 'File uploaded successfully', file: uploadedFile.name });
    });
});


// Using the routes
app.use('/api/files', fileRoute);      // Route for file operations
app.use('/api/folders', folderRoute);  // Route for folder operations
app.use('/api/auth', authRoute);       // Route for authentication
app.use('/api/directories', foldermanagement);      // Other API routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
