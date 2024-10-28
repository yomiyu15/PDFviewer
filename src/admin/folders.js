// src/components/FolderManagement.js
import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FolderManagement = () => {
  const [folders, setFolders] = useState([]);
  const [parentFolderId, setParentFolderId] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [fileUpload, setFileUpload] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, [parentFolderId]);

  
  const fetchFolders = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/directories/folders/${parentFolderId || 1}`);
        console.log(response.data); // Log the fetched data
        setFolders(response.data); // Update state with fetched folders
    } catch (error) {
        console.error('Error fetching folders:', error); // Log any errors
    }
};


// Create folder with proper parent handling
// src/components/FolderManagement.js

const handleCreateFolder = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/directories/folders', {
            name: folderName,
            parent_id: parentFolderId || null // Ensure this is set correctly
        });
        // Fetch folders after creation
        await fetchFolders();
        setFolderName(''); // Clear the input field after creation
        setOpenDialog(false); // Close the dialog
        setSnackbarMessage('Folder created successfully!');
        setOpenSnackbar(true);
    } catch (error) {
        console.error(error); // Handle error
    }
};




  

  const handleDeleteFolder = async (id) => {
    await axios.delete(`http://localhost:5000/api/directories/folders/${id}`);
    setSnackbarMessage('Folder deleted successfully!');
    setOpenSnackbar(true);
    fetchFolders();
  };

  const handleUploadFile = async (folderId) => {
    const formData = new FormData();
    formData.append('file', fileUpload);
    await axios.post(`http://localhost:5000/api/directories/folders/${folderId}/upload`, formData);
    setSnackbarMessage('File uploaded successfully!');
    setOpenSnackbar(true);
    setFileUpload(null);
    fetchFolders();
  };

  const handleFileChange = (event) => {
    setFileUpload(event.target.files[0]);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleFolderClick = (id) => {
    setParentFolderId(id);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Folder Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} startIcon={<AddIcon />}>
        Create Folder
      </Button>
      <List>
        {folders.map((folder) => (
          <div key={folder.id}>
            <ListItem button onClick={() => handleFolderClick(folder.id)}>
              <ListItemText primary={folder.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFolder(folder.id)}>
                  <DeleteIcon />
                </IconButton>
                <input
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  id={`upload-button-${folder.id}`}
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor={`upload-button-${folder.id}`}>
                  <IconButton
                    component="span"
                    edge="end"
                    aria-label="upload"
                    onClick={() => handleUploadFile(folder.id)}
                  >
                    <UploadFileIcon />
                  </IconButton>
                </label>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FolderManagement;
