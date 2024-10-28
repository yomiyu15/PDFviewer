// controllers/FolderController.js
const fs = require('fs');
const path = require('path');

// Define the uploads directory
const UPLOADS_DIR = path.join(__dirname, '../uploads');

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

exports.createSubfolder = (req, res) => {
    const { parentFolderName, subfolderName } = req.body;

    if (!parentFolderName || !subfolderName) {
        return res.status(400).send('Both parent folder name and subfolder name are required');
    }

    const parentFolderPath = path.join(UPLOADS_DIR, parentFolderName);
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
};

exports.editFolder = (req, res) => {
    const { folderId, newFolderName } = req.body;

    if (!folderId || !newFolderName) {
        return res.status(400).send('Folder ID and new folder name are required');
    }

    // Find the folder by ID
    const folder = folders.find(f => f.id === folderId);

    if (!folder) {
        return res.status(404).send('Folder not found');
    }

    // Update the folder name
    folder.name = newFolderName;

    // Optionally rename the folder on the filesystem (if needed)
    const currentFolderPath = path.join(UPLOADS_DIR, folder.name);
    const newFolderPath = path.join(UPLOADS_DIR, newFolderName);

    fs.rename(currentFolderPath, newFolderPath, (err) => {
        if (err) {
            console.error('Error renaming folder', err);
            return res.status(500).send('Error renaming folder');
        }
        console.log(`Renamed folder ${currentFolderPath} to ${newFolderPath}`);
        res.send('Folder renamed successfully');
    });
};




exports.editSubfolder = (req, res) => {
    const { subfolderId, newSubfolderName } = req.body;

    if (!subfolderId || !newSubfolderName) {
        return res.status(400).send('Subfolder ID and new subfolder name are required');
    }

    // Find the subfolder by ID
    const subfolder = subfolders.find(sf => sf.id === subfolderId); // Assume subfolders is defined

    if (!subfolder) {
        return res.status(404).send('Subfolder not found');
    }

    // Update the subfolder name
    subfolder.name = newSubfolderName;

    // Optionally rename the subfolder on the filesystem (if needed)
    const parentFolderPath = path.join(UPLOADS_DIR, subfolder.parentId); // Find the parent path
    const currentSubfolderPath = path.join(parentFolderPath, subfolder.name);
    const newSubfolderPath = path.join(parentFolderPath, newSubfolderName);

    fs.rename(currentSubfolderPath, newSubfolderPath, (err) => {
        if (err) {
            console.error('Error renaming subfolder', err);
            return res.status(500).send('Error renaming subfolder');
        }
        console.log(`Renamed subfolder ${currentSubfolderPath} to ${newSubfolderPath}`);
        res.send('Subfolder renamed successfully');
    });
};

exports.deleteFolder = (req, res) => {
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).send('Folder name is required');
    }

    const folderPath = path.join(UPLOADS_DIR, folderName);

    if (!fs.existsSync(folderPath)) {
        return res.status(404).send('Folder does not exist');
    }

    fs.rmdir(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error deleting folder', err);
            return res.status(500).send('Error deleting folder');
        }
        console.log(`Deleted folder: ${folderPath}`);
        res.send('Folder deleted successfully');
    });
};

exports.deleteSubfolder = (req, res) => {
    const { parentFolderName, subfolderName } = req.body;

    if (!parentFolderName || !subfolderName) {
        return res.status(400).send('Parent folder name and subfolder name are required');
    }

    const subfolderPath = path.join(UPLOADS_DIR, parentFolderName, subfolderName);

    if (!fs.existsSync(subfolderPath)) {
        return res.status(404).send('Subfolder does not exist');
    }

    fs.rmdir(subfolderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error deleting subfolder', err);
            return res.status(500).send('Error deleting subfolder');
        }
        console.log(`Deleted subfolder: ${subfolderPath}`);
        res.send('Subfolder deleted successfully');
    });
};

exports.getFolderStructure = (req, res) => {
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

    const directoryPath = UPLOADS_DIR;
    try {
        const folderStructure = getFolderStructure(directoryPath);
        res.json(folderStructure);
    } catch (err) {
        console.error('Error reading folder structure', err);
        res.status(500).send('Error retrieving folder structure');
    }
};

// The existing getFolderStructure function can remain unchanged