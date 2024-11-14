import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, TextField, Button, Typography, IconButton, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle , Stack} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import UploadFileIcon from '@mui/icons-material/UploadFile';


const FolderManager = () => {
  // State for Create Folder
  const [newFolderName, setNewFolderName] = useState('');
  const [parentFolderPath, setParentFolderPath] = useState('');

  // State for Upload File
  const [file, setFile] = useState(null);
  const [folderPath, setFolderPath] = useState('');

  // State for Folder Structure
  const [folderStructure, setFolderStructure] = useState([]);

  // State for Snackbar (Success messages)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  // State for Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItemPath, setCurrentItemPath] = useState('');
  const [currentItemName, setCurrentItemName] = useState('');

  // State for Delete Confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch Folder Structure Function
  const fetchFolderStructure = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/folders/folder-structure');
      setFolderStructure(response.data);
    } catch (error) {
      console.error('Error fetching folder structure:', error);
      alert('Failed to fetch folder structure');
    }
  };

  useEffect(() => {
    // Fetch the folder structure when the component mounts
    fetchFolderStructure();
  }, []);

  // Display Success Snackbar
  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  // Create Folder Function
 const createFolder = async () => {
  if (!newFolderName) {
    alert('Please enter a folder name');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/folders/create-folder', {
      parentFolderPath,
      folderName: newFolderName
    });
    showSnackbar('Folder created successfully', 'green');
    setNewFolderName('');
    setParentFolderPath('');
    fetchFolderStructure(); // Refresh folder structure after creating
  } catch (error) {
    console.error('Error creating folder:', error);
    
    // Check for specific error responses
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message;

      if (errorMessage.includes("Parent folder doesn't exist")) {
        showSnackbar("Parent folder doesn't exist", 'red');
      } else if (errorMessage.includes('Folder with this name already exists')) {
        showSnackbar('Folder with this name already exists', 'red');
      } else {
        showSnackbar('Failed to create folder', 'red');
      }
    } else {
      showSnackbar('Failed to create folder', 'red');
    }
  }
};


  // Handle File Upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderPath', folderPath);

    try {
      const response = await axios.post('http://localhost:5000/api/files/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSnackbar('File uploaded successfully', 'green');
      fetchFolderStructure(); // Refresh folder structure after file upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  // Rename Item Function (open edit dialog)
  const openEditDialog = (path, name) => {
    setCurrentItemPath(path);
    setCurrentItemName(name);
    setIsEditDialogOpen(true);
  };

  // Submit Rename Item Function
  const renameItem = async () => {
    if (!currentItemName) {
      alert('Please enter a new name');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/folders/rename-item', {
        itemPath: currentItemPath,
        newName: currentItemName
      });
      showSnackbar('Item renamed successfully', 'green');
      setIsEditDialogOpen(false);
      fetchFolderStructure(); // Refresh folder structure after renaming
    } catch (error) {
      console.error('Error renaming item:', error);
      alert('Failed to rename item');
    }
  };

  // Delete Item Function (open delete confirmation dialog)
  const openDeleteDialog = (path) => {
    setCurrentItemPath(path);
    setIsDeleteDialogOpen(true);
  };

  // Confirm Deletion
  const confirmDeleteItem = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/api/folders/delete-item', {
        data: { itemPath: currentItemPath }
      });
      showSnackbar('Item deleted successfully', 'red');
      setIsDeleteDialogOpen(false);
      fetchFolderStructure(); // Refresh folder structure after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  // Render Folder Structure
  const renderFolderStructure = (folders) => {
    return folders.map((folder, index) => (
      <div key={index} style={{ marginLeft: folder.type === 'folder' ? '20px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FolderIcon style={{ color: 'gold', marginRight: '8px' }} />
          <Typography>{folder.name}</Typography>

          {/* Edit and Delete Icons */}
          <IconButton
            onClick={() => openEditDialog(folder.path, folder.name)} // Trigger edit dialog
            style={{ marginLeft: 'auto', padding: '4px' }}
          >
            <EditIcon fontSize="small" style={{ color: '#0073e6' }} />
          </IconButton>
          <IconButton
            onClick={() => openDeleteDialog(folder.path)} // Trigger delete confirmation dialog
            style={{ marginLeft: '4px', padding: '4px' }}
          >
            <DeleteIcon fontSize="small" style={{ color: 'red' }} />
          </IconButton>
        </div>

        {folder.type === 'folder' && folder.children && folder.children.length > 0 && (
          <div style={{ marginLeft: '20px' }}>
            {renderFolderStructure(folder.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Grid container spacing={2} style={{ marginTop: '20px' }}> {/* Added marginTop */}
      {/* Left Side - Folder Structure */}
      <Grid item xs={12} md={8}>
    
        
          <Typography variant="h5" sx={{ fontSize: '14px' }}>Folder Structure</Typography>
          <div>{renderFolderStructure(folderStructure)}</div>
     
      </Grid>

      {/* Right Side - Actions (Create Folder, Upload File) */}
      <Grid item xs={12} md={4}>
      <Paper elevation={3} style={{ padding: '36px', borderRadius: '10px', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h5" sx={{ fontSize: '18px', marginBottom: '16px' }}>
          <FolderOpenIcon sx={{ color: '#00adef', marginRight: '8px' }} />
          Folder Management
        </Typography>
        <Typography variant="h6" sx={{ fontSize: '14px', marginBottom: '8px' }}>
          
         Create Folder </Typography>

        {/* Create Folder Section */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: '16px' }}>
          <TextField
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontSize: '10px' }}
          />
          <IconButton onClick={createFolder} color="primary" aria-label="create folder">
            <CreateNewFolderIcon />
          </IconButton>
        </Stack>

        <TextField
          label="Parent Folder Path"
          value={parentFolderPath}
          onChange={(e) => setParentFolderPath(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ fontSize: '10px' }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#00adef', fontSize: '12px', marginBottom: '16px' }}
          onClick={createFolder}
          fullWidth
          startIcon={<CreateNewFolderIcon />}
        >
          Create Folder
        </Button>

        {/* Upload File Section */}
        <Typography variant="h6" sx={{ fontSize: '14px', marginBottom: '8px' }}>
          
          Upload File
        </Typography>
        <TextField
          label="Folder Path"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ fontSize: '12px' }}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
          <label htmlFor="file-upload">
            <Button component="span" variant="outlined" sx={{ fontSize: '12px' }}>
              Choose File
            </Button>
          </label>

          {/* Display the chosen file name */}
          {file && (
            <Typography sx={{ fontSize: '12px', color: '#00adef', marginLeft: '8px' }}>
              {file.name}
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{ backgroundColor: '#00adef', fontSize: '12px' }}
            onClick={uploadFile}
            startIcon={<UploadFileIcon />}
          >
           
          </Button>
        </Stack>
      </Paper>
    </Grid>
      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        style={{
          backgroundColor: snackbarColor === 'green' ? 'green' : 'red',
        }}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="New Name"
            value={currentItemName}
            onChange={(e) => setCurrentItemName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={renameItem} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteItem} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default FolderManager;
