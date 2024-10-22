const express = require('express');
const router = express.Router();
const FileController = require('../controllers/FileController');

// Route to upload a file
router.post('/upload', FileController.upload);

// Route to retrieve all uploaded files
router.get('/uploads', FileController.getUploads);

// Route to list files in a specific folder
router.get('/list-files', FileController.listFiles);

// Route to view a PDF file
router.get('/view-pdf/:parentFolder/:subFolder/:fileName', FileController.viewPDF);

module.exports = router;
