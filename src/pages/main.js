import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  useMediaQuery,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { styled, useTheme } from '@mui/material/styles';

// Custom styles for the drawer
const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
  },
}));

// Responsive PDF viewer container
const PDFContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: '8px',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
  height: 'calc(100vh - 120px)', // Adjust for navbar and footer height
  overflow: 'auto', // Allow scrolling if content overflows
}));

const Main = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch folder structure from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/folder-structure')
      .then(response => setFolderStructure(response.data))
      .catch(error => console.error('Error fetching folder structure:', error));
  }, []);

  // Load PDF function
  const handlePDFLoad = (folder, subfolder, file) => {
    const url = `http://localhost:5000/pdf-viewer?folder=${encodeURIComponent(folder)}&subfolder=${encodeURIComponent(subfolder)}&file=${encodeURIComponent(file)}`;
    setPdfUrl(url);
    if (isMobile) setMobileOpen(false); // Close drawer on mobile
  };

  // Drawer toggle function
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Render folder structure
  const renderFolderStructure = (folders, parentFolder = '') => (
    <List>
      {folders.map((item) => (
        <React.Fragment key={item.name}>
          {item.type === 'folder' ? (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                <Typography>{item.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderFolderStructure(item.children, `${parentFolder}/${item.name}`)}
              </AccordionDetails>
            </Accordion>
          ) : (
            <ListItem
              button
              onClick={() => {
                const pathParts = parentFolder.split('/');
                const folder = pathParts.length > 1 ? pathParts[1] : pathParts[0];
                const subfolder = pathParts.length > 2 ? pathParts.slice(2).join('/') : '';
                handlePDFLoad(folder, subfolder, item.name);
              }}
              sx={{ paddingLeft: 4 }}
            >
              <ListItemText primary={item.name} />
            </ListItem>
          )}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Drawer for folder structure */}
      <DrawerStyled
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ margin: '8px' }}
          edge="start"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ padding: 2 }}>
          Folder Structure
        </Typography>
        {renderFolderStructure(folderStructure)}
      </DrawerStyled>

      {/* Main content area for PDF viewer */}
      <PDFContainer>
        {pdfUrl ? (
          <Viewer fileUrl={pdfUrl} />
        ) : (
          <Typography variant="h5" align="center">
            Select a PDF to view
          </Typography>
        )}
      </PDFContainer>
    </Box>
  );
};

export default Main;
