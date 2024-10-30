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
import UploadIcon from '@mui/icons-material/Upload';

const UploadFile = ({ fetchFolderStructure }) => {
  const [folders, setFolders] = useState([]); // State to store folders from API
  const [parentFolderName, setParentFolderName] = useState("");
  const [file, setFile] = useState(null);
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

  const handleFileUpload = async () => {
    if (!parentFolderName || !file) {
      alert("Please select a parent folder and upload a file.");
      return;
    }
  
    console.log("Uploading file to:", {
      parentFolderName,
      fileName: file.name
    });
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderPath", parentFolderName); // Correctly append folder path
  
    try {
      const response = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        body: formData, // No content type header
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error message from server:", errorMessage);
        setMessage(errorMessage);
        return;
      }
  
      setMessage("File uploaded successfully");
      setParentFolderName(""); // Reset parent folder selection
      setFile(null); // Reset file input
      fetchFolderStructure(); // Refresh folder structure
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file");
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
        Upload File
      </Typography>

      {/* Parent Folder Selector */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="parent-folder-label">Parent Folder</InputLabel>
        <Select
          labelId="parent-folder-label"
          value={parentFolderName}
          onChange={(e) => {
            setParentFolderName(e.target.value);
            setFile(null); // Reset file input when parent changes
          }}
        >
          {flattenFolders(folders).map((folder) => (
            <MenuItem key={folder.name} value={folder.name}>
              {folder.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Adjust accepted file types as necessary
      />

      <Button
        variant="contained"
        onClick={handleFileUpload}
        endIcon={<UploadIcon />}
        sx={{
          textTransform: 'none',
          bgcolor: '#00adef',
          '&:hover': {
            bgcolor: '#0095d9',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          },
          width: '100%',
          mt: 2
        }}
      >
        Upload File
      </Button>

      {message && (
        <Typography sx={{ mt: 2, color: 'green', textAlign: 'center' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default UploadFile;
