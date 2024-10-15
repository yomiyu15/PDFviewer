const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

const app = express();

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

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection configuration
const client = new Client({
    user: 'postgres',      // Replace with your PostgreSQL username
    host: 'localhost',     // PostgreSQL server host
    database: 'Product2',  // Replace with your existing database name
    password: 'yoomii0929', // Replace with your password
    port: 5432,            // PostgreSQL server port
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Database connection error', err));

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (token) {
        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// User registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING id';
    const values = [username, hashedPassword];

    try {
        const result = await client.query(query, values);
        res.status(201).send(`User registered successfully! User ID: ${result.rows[0].id}`);
    } catch (dbError) {
        console.error('Error registering user', dbError);
        res.status(500).send('Error registering user');
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const query = 'SELECT * FROM users WHERE username = $1';
    try {
        const result = await client.query(query, [username]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (dbError) {
        console.error('Error logging in', dbError);
        res.status(500).send('Error logging in');
    }
});

// Endpoint to create a new folder
app.post('/create-folder', authenticateJWT, (req, res) => {
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).send('Folder name is required');
    }

    const folderPath = path.join(__dirname, 'uploads', folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Created folder: ${folderPath}`);
        return res.status(201).send('Folder created successfully');
    } else {
        console.log(`Folder already exists: ${folderPath}`);
        return res.status(400).send('Folder already exists');
    }
});

// Endpoint to create a new subfolder
app.post('/create-subfolder', authenticateJWT, (req, res) => {
    const { parentFolderName, subfolderName } = req.body;

    if (!parentFolderName || !subfolderName) {
        return res.status(400).send('Both parent folder name and subfolder name are required');
    }

    const parentFolderPath = path.join(__dirname, 'uploads', parentFolderName);
    const subfolderPath = path.join(parentFolderPath, subfolderName);

    if (!fs.existsSync(parentFolderPath)) {
        return res.status(404).send('Parent folder does not exist');
    }

    if (!fs.existsSync(subfolderPath)) {
        fs.mkdirSync(subfolderPath);
        console.log(`Created subfolder: ${subfolderPath}`);
        return res.status(201).send('Subfolder created successfully');
    } else {
        console.log(`Subfolder already exists: ${subfolderPath}`);
        return res.status(400).send('Subfolder already exists');
    }
});

// Endpoint for file upload
app.post('/upload', authenticateJWT, (req, res) => {
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

    const file = req.files?.file;

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
});

// Endpoint to retrieve all uploaded files
app.get('/uploads', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM uploads');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving uploads', err);
        res.status(500).send('Error retrieving uploads');
    }
});

// Endpoint to get folder structure
app.get('/folder-structure', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');

    const getFolderStructure = (dirPath) => {
        const files = fs.readdirSync(dirPath);
        const folderStructure = [];

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const isDirectory = fs.lstatSync(filePath).isDirectory();

            if (isDirectory) {
                folderStructure.push({
                    name: file,
                    type: 'folder',
                    children: getFolderStructure(filePath)
                });
            } else {
                const publicPath = `/uploads/${path.relative(__dirname, filePath)}`;
                folderStructure.push({
                    name: file,
                    type: 'file',
                    path: publicPath
                });
            }
        });

        return folderStructure;
    };

    try {
        const folderStructure = getFolderStructure(directoryPath);
        res.json(folderStructure);
    } catch (err) {
        console.error('Error reading folder structure', err);
        res.status(500).send('Error retrieving folder structure');
    }
});

// Endpoint to serve PDF files directly
app.get('/pdf/:parentFolder/:subFolder/:fileName', (req, res) => {
    const { parentFolder, subFolder, fileName } = req.params;

    const filePath = path.join(__dirname, 'uploads', parentFolder, subFolder, fileName);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Endpoint to edit (rename) a folder
app.post('/edit-folder', authenticateJWT, (req, res) => {
    const { currentFolderName, newFolderName } = req.body;

    if (!currentFolderName || !newFolderName) {
        return res.status(400).send('Both current folder name and new folder name are required');
    }

    const currentFolderPath = path.join(__dirname, 'uploads', currentFolderName);
    const newFolderPath = path.join(__dirname, 'uploads', newFolderName);

    if (!fs.existsSync(currentFolderPath)) {
        return res.status(404).send('Current folder does not exist');
    }

    if (fs.existsSync(newFolderPath)) {
        return res.status(400).send('New folder name already exists');
    }

    fs.renameSync(currentFolderPath, newFolderPath);
    console.log(`Renamed folder from "${currentFolderName}" to "${newFolderName}"`);
    res.send('Folder renamed successfully');
});

// Endpoint to delete a folder
app.delete('/delete-folder', authenticateJWT, (req, res) => {
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).send('Folder name is required');
    }

    const folderPath = path.join(__dirname, 'uploads', folderName);

    if (!fs.existsSync(folderPath)) {
        return res.status(404).send('Folder does not exist');
    }

    fs.rmdirSync(folderPath, { recursive: true });
    console.log(`Deleted folder: ${folderPath}`);
    res.send('Folder deleted successfully');
});

// Endpoint to delete a file
app.delete('/delete-file', authenticateJWT, (req, res) => {
    const { filePath } = req.body;

    if (!filePath) {
        return res.status(400).send('File path is required');
    }

    const fullPath = path.join(__dirname, filePath);

    if (!fs.existsSync(fullPath)) {
        return res.status(404).send('File does not exist');
    }

    fs.unlinkSync(fullPath);
    console.log(`Deleted file: ${fullPath}`);
    res.send('File deleted successfully');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
