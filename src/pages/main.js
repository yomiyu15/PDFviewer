import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder'; // Folder icon
import DescriptionIcon from '@mui/icons-material/Description'; // PDF icon
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Introduction from '../components/introdction'; // Import the Introduction component

const App = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch folder structure from API
  useEffect(() => {
    fetch('http://localhost:5000/folder-structure')
      .then((res) => res.json())
      .then((data) => setFolderStructure(data))
      .catch((err) => console.error('Error fetching folder structure:', err));
  }, []);

  // Handle PDF file selection
  const handleFileClick = (path) => {
    const parts = path.split('\\');
    const folderName = parts[1];
    const subfolderName = parts.length > 3 ? parts[2] : '';
    const fileName = parts[parts.length - 1];
    const pdfUrl = `http://localhost:5000/pdf-viewer?folder=${folderName}&subfolder=${subfolderName}&file=${fileName}`;
    setSelectedPdf(pdfUrl);
    setDrawerOpen(false); // Close drawer after selecting PDF
  };

  // Render folder structure recursively with indentation
  const renderFolderStructure = (folders, depth = 0) => {
    return folders.map((item) => {
      const paddingLeft = depth * 20; // Increase padding based on depth
      if (item.type === 'folder') {
        return (
          <Accordion key={item.name} sx={{ boxShadow: 'none', padding: 0, margin: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
              <span style={{ paddingLeft: paddingLeft }}>
                <FolderIcon sx={{ verticalAlign: 'middle', marginRight: 1,color : '#FFD54F' }} /> {/* Folder icon */}
                {item.name}
              </span>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingLeft: 0 }}>
              {renderFolderStructure(item.children, depth + 1)} {/* Increase depth for children */}
            </AccordionDetails>
          </Accordion>
        );
      } else if (item.type === 'file') {
        return (
          <ListItem
            button
            key={item.name}
            onClick={() => handleFileClick(item.path)}
            sx={{ paddingLeft: `${paddingLeft + 20}px`, paddingTop: '2px', paddingBottom: '2px' }} // Indent file items too
          >
            <DescriptionIcon sx={{ marginRight: 1 }} /> {/* PDF icon */}
            <ListItemText primary={item.name} />
          </ListItem>
        );
      }
      return null;
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Drawer for mobile sidebar */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240, // Set a width for the Drawer
          '& .MuiDrawer-paper': {
            width: 240,
            zIndex: 1300, // Ensure Drawer appears above other elements
          },
        }}
      >
        <List>{renderFolderStructure(folderStructure)}</List>
      </Drawer>

      {/* Persistent Sidebar for desktop */}
      <List sx={{ width: 300, display: { xs: 'none', md: 'block' }, paddingTop: 2 }}>
        {renderFolderStructure(folderStructure)}
      </List>

      {/* Main content area for displaying PDFs */}
      <div style={{ flexGrow: 1, padding: 16, overflow: 'auto' }}>
        {selectedPdf ? (
          <Document file={selectedPdf}>
            <Page pageNumber={1} scale={1.5} />
          </Document>
        ) : (
          <Introduction /> // Display the Introduction component here
        )}
      </div>

      {/* Hamburger Menu for mobile */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => setDrawerOpen(true)}
        sx={{ display: { md: 'none' }, position: 'fixed', top: 10, left: 10, zIndex: 2000 }} // Ensure it's above other elements
      >
        <MenuIcon />
      </IconButton>
    </div>
  );
};

export default App;
