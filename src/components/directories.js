import React, { useState } from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import Sidebar from './sidebar'; // Sidebar component for folders and files
import FileReader from './filereader'; // FileReader component to view PDFs
import Introduction from './introdction'; // Placeholder component
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon for mobile screens

const DirectoryNavigator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // State for controlling sidebar visibility

  // Handle file selection from Sidebar
  const handleFileSelect = (folder, subfolder, file) => {
    if (!folder || !subfolder || !file) {
      console.error("Invalid parameters:", { folder, subfolder, file });
      return;
    }
    
    const pdfUrl = `http://localhost:5000/pdf-viewer?folder=${encodeURIComponent(folder)}&subfolder=${encodeURIComponent(subfolder)}&file=${encodeURIComponent(file)}`;
    console.log('Loading PDF from path:', pdfUrl);
    
    setSelectedFile(pdfUrl); // Set the selected file URL
  };

  // Toggle drawer visibility for mobile devices
  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Box display="flex" height="100vh" sx={{ overflow: 'hidden' }}>
      <IconButton
        edge="start"
        onClick={toggleDrawer}
        sx={{ 
          display: { xs: 'block', md: 'none' },
          margin: 1,
          position: 'absolute',
          zIndex: 1300,
        }}
      >
        <MenuIcon />
      </IconButton>

      <Box
        component="nav"
        sx={{
          width: { xs: '100%', md: '300px' },
          flexShrink: 0,
        }}
      >
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: '250px' },
          }}
        >
          <Sidebar handleFileSelect={handleFileSelect} />
        </Drawer>

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: '300px',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            borderRight: '1px solid #ddd',
          }}
        >
          <Sidebar handleFileSelect={handleFileSelect} />
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, md: drawerOpen ? '300px' : '0' }, // Adjust margin based on drawer state
          padding: '10px',
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        {selectedFile ? (
          <FileReader filePath={selectedFile} />
        ) : (
          <Introduction />
        )}
      </Box>
    </Box>
  );
};

export default DirectoryNavigator;
