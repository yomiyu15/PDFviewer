import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const CreateSubfolder = ({ fetchFolderStructure }) => {
  const [folders, setFolders] = useState([]); // State to store folders from API
  const [parentFolderName, setParentFolderName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [message, setMessage] = useState("");

  // Fetch folder structure from API
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/folders/structure");
        const data = await response.json();
        setFolders(data); // Set the fetched folder structure
      } catch (error) {
        console.error("Error fetching folder structure:", error);
      }
    };

    fetchFolders();
  }, []);

  // Flatten folder structure for selection
  const flattenFolders = (folders, parent = "") => {
    return folders.flatMap(folder => {
      const fullPath = parent ? `${parent}/${folder.name}` : folder.name;
      const children = folder.children ? flattenFolders(folder.children, fullPath) : [];
      return [
        { name: fullPath, type: folder.type },
        ...children
      ];
    });
  };

  const createSubfolder = async () => {
    if (!parentFolderName || !newFolderName) {
      alert("Please select a parent folder and enter a folder name.");
      return;
    }

    // Log the values being sent to the backend for debugging
    console.log("Creating subfolder with:", {
      parentFolderName,
      subfolderName: newFolderName
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/folders/create-subfolder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentFolderName,
            subfolderName: newFolderName // Ensure this matches your backend
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error message from server:", errorMessage); // Log the error message
        setMessage(errorMessage);
        return;
      }

      setMessage("Folder created successfully");
      setParentFolderName(""); // Reset parent folder selection
      setNewFolderName(""); // Reset new folder name
      fetchFolderStructure(); // Refresh folder structure
    } catch (error) {
      console.error("Error creating folder:", error); // Log error if fetch fails
      setMessage("Error creating folder");
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 3, 
        borderRadius: 2, 
        boxShadow: 5, 
        bgcolor: 'background.paper',
        width: '100%', 
        maxWidth: 600, 
        mx: 'auto', 
        border: '1px solid #e0e0e0' 
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }} 
        color="primary"
      >
        Create New Folder
      </Typography>

      {/* Parent Folder Selector */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="parent-folder-label">Parent Folder</InputLabel>
        <Select
          labelId="parent-folder-label"
          value={parentFolderName}
          onChange={(e) => {
            setParentFolderName(e.target.value);
            setNewFolderName(""); // Reset new folder name when parent changes
          }}
        >
          {flattenFolders(folders).map((folder) => (
            <MenuItem key={folder.name} value={folder.name}>
              {folder.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* New Folder Name Input */}
      <TextField
        variant="outlined"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        placeholder="New Folder Name"
        fullWidth
        sx={{ mb: 2 }}
      />
      
      <Button 
        variant="contained" 
        onClick={createSubfolder} 
        endIcon={<AddIcon />}
        sx={{ 
          textTransform: 'none', 
          bgcolor: '#00adef', 
          '&:hover': {
            bgcolor: '#0095d9', 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', 
          },
          width: '100%', 
        }}
      >
        Create Folder
      </Button>
      
      {message && (
        <Typography sx={{ mt: 2, color: 'green', textAlign: 'center' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default CreateSubfolder;
