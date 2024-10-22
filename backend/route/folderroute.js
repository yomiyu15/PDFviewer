const express = require('express');
const router = express.Router();
const {
    createFolder,
    createSubfolder,
    getFolderStructure,
    editFolder,
    deleteFolder,
} = require('../controllers/FolderController');

// Routes for folder operations
router.post('/create-folder', createFolder);
router.post('/create-subfolder', createSubfolder);
router.get('/folder-structure', getFolderStructure);
router.post('/edit-folder', editFolder);
router.delete('/delete-folder', deleteFolder);

module.exports = router;
