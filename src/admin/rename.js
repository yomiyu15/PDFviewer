import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { renameItem } from './api';

const FolderRenamer = ({ open, onClose, itemPath }) => {
  const [newName, setNewName] = useState('');

  const handleRename = async () => {
    try {
      await renameItem({ itemPath, newName });
      onClose(); // Close the dialog after success
    } catch (error) {
      console.error('Error renaming item:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rename Folder/File</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="New Name"
          fullWidth
          variant="outlined"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleRename} color="primary">Rename</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderRenamer;
