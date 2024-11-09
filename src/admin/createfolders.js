import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { createFolder } from './api';

const FolderCreator = ({ open, onClose }) => {
  const [folderName, setFolderName] = useState('');
  const [parentFolder, setParentFolder] = useState('');

  const handleCreateFolder = async () => {
    try {
      const data = { parentFolderPath: parentFolder, folderName };
      const response = await createFolder(data);
      console.log('Folder created successfully:', response);
      onClose();
    } catch (error) {
      console.error('Error creating folder:', error.response?.data || error.message);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Folder</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Folder Name"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Parent Folder (Optional)"
          fullWidth
          variant="outlined"
          value={parentFolder}
          onChange={(e) => setParentFolder(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleCreateFolder} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderCreator;
