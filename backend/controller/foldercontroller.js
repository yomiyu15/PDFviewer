const fs = require('fs');
const path = require('path');

// Create a folder
const createFolder = (req, res) => {
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
};

// Create a subfolder
const createSubfolder = (req, res) => {
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
};

// Get folder structure
const getFolderStructure = (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');

    const buildFolderStructure = (dirPath) => {
        const files = fs.readdirSync(dirPath);
        const folderStructure = [];

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const isDirectory = fs.lstatSync(filePath).isDirectory();

            if (isDirectory) {
                folderStructure.push({
                    name: file,
                    type: 'folder',
                    children: buildFolderStructure(filePath)
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
        const folderStructure = buildFolderStructure(directoryPath);
        res.json(folderStructure);
    } catch (err) {
        console.error('Error reading folder structure', err);
        res.status(500).send('Error retrieving folder structure');
    }
};

// Edit a folder
const editFolder = (req, res) => {
    const { currentFolderName, newFolderName } = req.body;

    if (!currentFolderName || !newFolderName) {
        return res.status(400).send('Both current folder name and new folder name are required');
    }

    const currentFolderPath = path.join(__dirname, 'uploads', currentFolderName);
    const newFolderPath = path.join(__dirname, 'uploads', newFolderName);

    if (!fs.existsSync(currentFolderPath)) {
        return res.status(404).send('Folder does not exist');
    }

    fs.rename(currentFolderPath, newFolderPath, (err) => {
        if (err) {
            console.error('Error renaming folder', err);
            return res.status(500).send('Error renaming folder');
        }
        console.log(`Renamed folder from ${currentFolderPath} to ${newFolderPath}`);
        res.send('Folder renamed successfully');
    });
};

// Delete a folder
const deleteFolder = (req, res) => {
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).send('Folder name is required');
    }

    const folderPath = path.join(__dirname, 'uploads', folderName);

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

// Export the functions
module.exports = {
    createFolder,
    createSubfolder,
    getFolderStructure,
    editFolder,
    deleteFolder,
};
