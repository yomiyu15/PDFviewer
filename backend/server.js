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
  TextField,
  Box,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Introduction from '../components/introdction';

const App = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [pdfScale, setPdfScale] = useState(1.5);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedSubfolder, setSelectedSubfolder] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch folder structure from API
  useEffect(() => {
    fetch('http://localhost:5000/folder-structure')
      .then((res) => res.json())
      .then((data) => setFolderStructure(data))
      .catch((err) => console.error('Error fetching folder structure:', err));
  }, []);

  // Search files based on the search term
  useEffect(() => {
    const searchFiles = async () => {
      if (searchTerm) {
        try {
          const response = await fetch(`http://localhost:5000/search?fileName=${searchTerm}`);
          const results = await response.json();
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching files:', error);
        }
      } else {
        setSearchResults([]); // Clear search results if search term is empty
      }
    };

    searchFiles();
  }, [searchTerm]);

  // Handle PDF file selection
  const handleFileClick = (path) => {
    const parts = path.split('\\');
    const folderName = parts[1];
    const subfolderName = parts.length > 3 ? parts[2] : '';
    const fileName = parts[parts.length - 1];
    const pdfUrl = `http://localhost:5000/pdf-viewer?folder=${folderName}&subfolder=${subfolderName}&file=${fileName}`;

    setSelectedPdf(pdfUrl);
    setSelectedFolder(folderName); // Set selected folder
    setSelectedSubfolder(subfolderName); // Set selected subfolder
    setSelectedFile(fileName); // Set selected file
    setDrawerOpen(false); // Close drawer after selecting PDF
  };

  // Responsive design: Update mobile/desktop state on resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 900;
      setIsMobile(isMobileView);
      setPdfScale(isMobileView ? 1 : 1.5);
      if (!isMobileView) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load all pages when the PDF document is loaded
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Render folder structure or search results
  const renderFolderStructure = (folders) => {
    return folders.map((item) => {
      if (item.type === 'folder') {
        return (
          <Accordion
            key={item.name}
            sx={{
              boxShadow: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
              <span>
                <FolderIcon sx={{ verticalAlign: 'middle', marginRight: 1, color: '#FFD54F' }} />
                {item.name}
              </span>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingLeft: 0 }}>
              {renderFolderStructure(item.children)}
            </AccordionDetails>
          </Accordion>
        );
      } else if (item.type === 'file') {
        return (
          <ListItem
            button
            key={item.name}
            onClick={() => handleFileClick(item.path)}
            sx={{
              paddingLeft: '20px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <DescriptionIcon sx={{ marginRight: 1 }} />
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
          width: 240,
          '& .MuiDrawer-paper': {
            width: 240,
            zIndex: 1300,
            height: '100vh',
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <IconButton sx={{ color: '#00adef' }}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{
              marginTop: 5,
              marginBottom: 2,
              borderRadius: 3,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00adef',
                },
                '&:hover fieldset': {
                  borderColor: '#007bb5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#005f87',
                },
              },
              '& .MuiInputBase-input': {
                padding: '10px 12px',
              },
            }}
          />
        </Box>

        <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
          <List>{renderFolderStructure(searchResults.length > 0 ? searchResults : folderStructure)}</List>
        </Box>
      </Drawer>

      {/* Persistent Sidebar for desktop */}
      <List sx={{ width: 300, display: { xs: 'none', md: 'block' }, paddingTop: 5, overflowY: 'auto', height: '100vh' }}>
        <TextField
          sx={{
            marginBottom: 2,
            borderRadius: '30px',
          }}
          variant="outlined"
          size="small"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ marginRight: 1, color: "#00adef" }} />
            ),
          }}
        />
        {renderFolderStructure(searchResults.length > 0 ? searchResults : folderStructure)}
      </List>

      {/* Main content area for displaying PDFs */}
      <div style={{ flexGrow: 1, padding: 16, overflow: 'auto' }}>
        {selectedPdf ? (
          <>
            {/* Display selected folder, subfolder, and file name */}
            <Typography variant="body1" sx={{ marginBottom: 1, color: "#333" }}>
              {`${selectedFolder}/${selectedSubfolder}/${selectedFile}`}
            </Typography>
            <Document file={selectedPdf} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={pdfScale} />
              ))}
            </Document>
          </>
        ) : (
          <Introduction />
        )}
      </div>

      {/* Hamburger Menu for mobile */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setDrawerOpen(true)}
          sx={{
            marginLeft: 'auto',
            marginTop: 2,
            display: { sm: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </div>
  );
};

export default App;
