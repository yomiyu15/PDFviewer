const express = require('express');
const router = express.Router();
const FolderController1 = require('../controller/foldermanagement');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Destination for file uploads

router.post('/folders', FolderController1.createFolder);
router.get('/folders/:parentId', FolderController1.getFolders);
router.delete('/folders/:id', FolderController1.deleteFolder);
router.post('/folders/:folderId/upload', upload.single('file'), FolderController1.uploadFile);
router.get('/folders/:folderId/files', FolderController1.getFiles);
router.get('/folders/:id', FolderController1.getFoldersByParentId); // Adjust endpoint as needed

module.exports = router;
