const fs = require('fs');
const path = require('path');
const { Client } = require('pg'); // Import your database client

const client = new Client({
    // Your database configuration
});

client.connect();

// Upload a file
const upload = (req, res) => {
    const { parentName, subfolderName } = req.body;

    const sanitizedParentName = parentName?.trim();
    const sanitizedSubfolderName = subfolderName?.trim();

    if (!sanitizedParentName || !sanitizedSubfolderName) {
        return res.status(400).send('Both parentName and subfolderName are required');
    }

    const parentDir = path.join(__dirname, 'uploads', sanitizedParentName);
    const subDir = path.join(parentDir, sanitizedSubfolderName);

    if (!fs.existsSync(parentDir)) {
        return res.status(400).send(`Parent folder "${sanitizedParentName}" does not exist`);
    }

    if (!fs.existsSync(subDir)) {
        return res.status(400).send(`Subfolder "${sanitizedSubfolderName}" does not exist inside "${sanitizedParentName}"`);
    }

    const file = req.files?.file; // Ensure you're using a middleware for file uploads

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const uploadPath = path.join(subDir, file.name);

    file.mv(uploadPath, async (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        const query = 'INSERT INTO uploads(original_name, path) VALUES($1, $2) RETURNING id';
        const values = [file.name, uploadPath];

        try {
            const result = await client.query(query, values);
            res.status(201).send(`File uploaded successfully! File ID: ${result.rows[0].id}`);
        } catch (dbError) {
            console.error('Error inserting file info into database', dbError);
            res.status(500).send('Error uploading file');
        }
    });
};

// Retrieve all uploaded files
const getUploads = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM uploads');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving uploads', err);
        res.status(500).send('Error retrieving uploads');
    }
};

// List files in a specific folder
const listFiles = (req, res) => {
    const { folderName } = req.query;

    if (!folderName) {
        return res.status(400).send('Folder name is required');
    }

    const folderPath = path.join(__dirname, 'uploads', folderName);

    const listFilesRecursively = (dir) => {
        let results = [];
        const list = fs.readdirSync(dir);

        list.forEach(file => {
            const filePath = path.join(dir, file);
            const isDirectory = fs.lstatSync(filePath).isDirectory();

            if (isDirectory) {
                results = results.concat(listFilesRecursively(filePath));
            } else {
                results.push({
                    name: file,
                    path: filePath
                });
            }
        });

        return results;
    };

    try {
        const files = listFilesRecursively(folderPath);
        res.json(files);
    } catch (err) {
        console.error('Error listing files', err);
        res.status(500).send('Error retrieving files');
    }
};

// Endpoint to view a PDF file
const viewPDF = (req, res) => {
    const { parentFolder, subFolder, fileName } = req.params;

    const filePath = path.join(__dirname, 'uploads', parentFolder, subFolder, fileName);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
};

// Export the functions
module.exports = {
    upload,
    getUploads,
    listFiles,
    viewPDF,
    // ... other file-related functions
};
