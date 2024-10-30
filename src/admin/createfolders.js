import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'; // Optional: for an icon on the button

const CreateFolder = ({ fetchFolderStructure }) => {
  const [newFolderName, setNewFolderName] = useState("");

  const createFolder = async () => {
    if (!newFolderName) {
      alert("Please enter a folder name.");
      return;
    }
    await fetch("http://localhost:5000/api/folders/create-folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderName: newFolderName }),
    });
    setNewFolderName("");
    fetchFolderStructure();
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
        width: '100%', // Make full width
        maxWidth: 600, // Optional: set a maximum width
        mx: 'auto', 
        border: '1px solid #e0e0e0' // Light border for a polished look
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }} 
        color="primary"
      >
        Create New Folder
      </Typography>
      <TextField
        variant="outlined"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        placeholder="Enter folder name"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button 
        variant="contained" 
        onClick={createFolder} 
        endIcon={<AddIcon />}
        sx={{ 
          textTransform: 'none', // Prevent text from being capitalized
          bgcolor: '#00adef', // Custom color
          '&:hover': {
            bgcolor: '#0095d9', // Darker shade on hover
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Add a shadow on hover
          },
          width: '100%', // Full width for the button
        }}
      >
        Create folder
      </Button>
    </Box>
  );
};

export default CreateFolder;
