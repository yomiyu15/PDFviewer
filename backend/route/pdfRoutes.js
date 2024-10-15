const express = require('express');
const router = express.Router(); // Initialize the router
const { uploadPdf, getPdf } = require('../controller/pdfcontroller'); // Adjust path if needed

// Route for uploading PDF
router.post('/pdfs', uploadPdf);

// Route for getting a PDF by filename
router.get('/pdfs/:filename', getPdf);

module.exports = router;
