import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, TextField, Button, Typography, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FolderManager = () => {
  // State for Create Folder
  const [newFolderName, setNewFolderName] = useState('');
  const [parentFolderPath, setParentFolderPath] = useState('');

  // State for Upload File
  const [file, setFile] = useState(null);
  const [folderPath, setFolderPath] = useState('');

  // State for Folder Structure
  const [folderStructure, setFolderStructure] = useState([]);

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
      alert(response.data.message);
      setNewFolderName('');
      fetchFolderStructure(); // Refresh folder structure after creating
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
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
      const response = await axios.post('http://localhost:5000/api/folders/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      fetchFolderStructure(); // Refresh folder structure after file upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  // Rename Item Function
  const renameItem = async (path) => {
    const newName = prompt('Enter new name for the item:');
    if (!newName) {
      alert('Please enter a new name');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/folders/rename-item', {
        itemPath: path,
        newName
      });
      alert(response.data.message);
      fetchFolderStructure(); // Refresh folder structure after renaming
    } catch (error) {
      console.error('Error renaming item:', error);
      alert('Failed to rename item');
    }
  };

  // Delete Item Function
  const deleteItem = async (path) => {
    if (!path) {
      alert('Please provide the item path');
      return;
    }

    try {
      const response = await axios.delete('http://localhost:5000/api/folders/delete-item', {
        data: { itemPath: path }
      });
      alert(response.data.message);
      fetchFolderStructure(); // Refresh folder structure after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const renderFolderStructure = (folders) => {
    return folders.map((folder, index) => (
      <div key={index} style={{ marginLeft: folder.type === 'folder' ? '20px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FolderIcon style={{ color: 'gold', marginRight: '8px' }} />
          <Typography>{folder.name}</Typography>

          {/* Edit and Delete Icons */}
          <IconButton
            onClick={() => renameItem(folder.path)} // Trigger rename item
            style={{ marginLeft: 'auto', padding: '4px' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => deleteItem(folder.path)} // Trigger delete item
            style={{ marginLeft: '4px', padding: '4px' }}
          >
            <DeleteIcon fontSize="small" />
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
    <Grid container spacing={2}>
      {/* Left Side - Folder Structure */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h5" sx={{ fontSize: '14px' }}>Folder Structure</Typography>
          <div>{renderFolderStructure(folderStructure)}</div>
        </Paper>
      </Grid>

      {/* Right Side - Actions (Create Folder, Upload File) */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '36px' }}>
          <Typography variant="h5" sx={{ fontSize: '14px' }}>Folder Management</Typography>

          {/* Create Folder */}
          <TextField
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontSize: '12px' }}
          />
          <TextField
            label="Parent Folder Path"
            value={parentFolderPath}
            onChange={(e) => setParentFolderPath(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontSize: '12px' }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: '#00adef', fontSize: '12px' }}
            onClick={createFolder}
            fullWidth
          >
            Create Folder
          </Button>

          {/* Upload File */}
          <TextField
            label="Folder Path"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontSize: '12px' }}
          />
          <input type="file" onChange={handleFileChange} />
          <Button
            variant="contained"
            sx={{ backgroundColor: '#00adef', fontSize: '12px' }}
            onClick={uploadFile}
            fullWidth
          >
            Upload File
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FolderManager;
