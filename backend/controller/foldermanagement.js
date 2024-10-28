const { client } = require('../db'); // Import the PostgreSQL client

// Create a new folder
exports.createFolder = async (req, res) => {
    const { name, parent_id } = req.body; // Change 'parent' to 'parent_id'
    try {
        const result = await client.query(
            'INSERT INTO folders (name, parent_id) VALUES ($1, $2) RETURNING *',
            [name, parent_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get folders by parent ID
exports.getFolders = async (req, res) => {
    const { parentId } = req.params; // Ensure this is being pulled correctly
    try {
        const result = await client.query(
            'SELECT * FROM folders WHERE parent_id = $1',
            [parentId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFoldersByParentId = async (req, res) => {
    const parentId = req.params.id === '0' ? null : parseInt(req.params.id);
    console.log('Fetching folders for parentId:', parentId);

    try {
        let query;
        let values = [];

        if (parentId === null) {
            query = 'SELECT * FROM folders WHERE parent_id IS NULL'; // Fetch root folders
        } else {
            query = 'SELECT * FROM folders WHERE parent_id = $1'; // Fetch child folders
            values = [parentId];
        }

        const { rows } = await client.query(query, values);
        res.status(200).json(rows); // Send the fetched rows as response
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteFolder = async (req, res) => {
    const id = req.params.id; // Correctly extract id from req.params
    try {
        await client.query('DELETE FROM folders WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadFile = async (req, res) => {
    const folderId = req.params.folderId; // Correctly extract folderId from req.params
    const file = req.file; // Assuming file is uploaded using multer
    try {
        await client.query(
            'UPDATE folders SET files = array_append(files, $1) WHERE id = $2',
            [file.filename, folderId]
        );
        res.status(201).json({ message: 'File uploaded successfully', file: file.filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFiles = async (req, res) => {
    const folderId = req.params.folderId; // Correctly extract folderId from req.params
    try {
        const result = await client.query(
            'SELECT files FROM folders WHERE id = $1',
            [folderId]
        );
        res.json(result.rows[0]?.files || []); // Use optional chaining to avoid errors if rows[0] is undefined
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
