const fs = require('fs');
const path = require('path');
const client = require('../db/db');

// Define your base uploads directory
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Controller to create a new folder
exports.createFolder = (req, res) => {
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).send('Folder name is required');
    }

    const folderPath = path.join(UPLOADS_DIR, folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Created folder: ${folderPath}`);
        return res.status(201).send('Folder created successfully');
    } else {
        console.log(`Folder already exists: ${folderPath}`);
        return res.status(400).send('Folder already exists');
    }
};

// Other controller functions (createSubfolder, upload, getUploads, etc.)
// You can copy the other endpoint logic here and export the functions similarly
