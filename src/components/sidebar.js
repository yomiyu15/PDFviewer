import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Typography,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search'; // Import Material-UI's Search icon

// Recursive DirectoryItem component
const DirectoryItem = ({ item, handleFileSelect, depth, searchTerm, toggleFolder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleFolder = () => {
    setIsOpen(!isOpen);
    if (item.type === 'folder') {
      toggleFolder(item.name); // Call the toggleFolder function when a folder is clicked
    }
  };

  // Check if the current item matches the search term
  const matchesSearchTerm = (name) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <>
      {item.type === 'folder' ? (
        <Accordion
          expanded={isOpen}
          onChange={handleToggleFolder}
          disableGutters
          elevation={0}
          sx={{
            '&:before': {
              display: 'none',
            },
            width: '100%',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#fff' }}>
            <Typography style={{ paddingLeft: `${depth * 10}px`, fontSize: '12px', color: '#333' }}>
              {item.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: '#fff' }}>
            <List disablePadding>
              {item.children && item.children
                .filter(child => matchesSearchTerm(child.name)) // Filter children based on search term
                .map((child, index) => (
                  <DirectoryItem
                    key={index}
                    item={child}
                    handleFileSelect={handleFileSelect}
                    depth={depth + 1}
                    searchTerm={searchTerm}
                    toggleFolder={toggleFolder}
                  />
                ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ) : (
        matchesSearchTerm(item.name) && ( // Only display file items that match the search term
          <ListItem
            button
            key={item.name}
            onClick={() => {
              console.log("Selected file item:", item); // Log the entire item

              // Extract the folder and subfolder from the path
              const pathParts = item.path.split('\\'); // Split by the backslash to get parts of the path
              const folder = pathParts[pathParts.length - 3]; // Adjust index based on your folder structure
              const subfolder = pathParts[pathParts.length - 2]; // Adjust index based on your folder structure

              handleFileSelect(folder, subfolder, item.name);
            }}
            sx={{
              paddingLeft: `${(depth + 1) * 10}px`,
              color: '#333',
            }}
          >
            <Typography sx={{ fontSize: '12px' }}>
              {item.name.replace('.pdf', '')}
            </Typography>
          </ListItem>
        )
      )}
    </>
  );
};

// Sidebar component to display the folder structure
const Sidebar = ({ handleFileSelect }) => {
  const [directories, setDirectories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch folder structure from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/folder-structure')  // Adjust the endpoint accordingly
      .then((response) => {
        setDirectories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching folder structure:', error);
      });
  }, []);

  const toggleFolder = (folderName) => {
    // Logic to toggle folder can be implemented here if needed
    console.log("Toggled folder:", folderName);
  };

  return (
    <Paper
      style={{
        position: 'fixed',
        top: 100, // Adjust this value based on your Navbar height
        left: 0,
        height: '100vh', // Adjust height to take Navbar into account
        overflowY: 'auto', // Enable vrtical scrolling
        overflowX: 'hidden', // Disable horizontal scrolling
        width: '300px',
      }}
      elevation={3}
    >
    

      {/* Search Input with Icon Inside */}
      <TextField
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        variant="outlined"
        size="small" // Set size to small
        style={{ margin: '16px', width: '80%', backgroundColor: '#fff' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" /> {/* Search icon inside the input */}
            </InputAdornment>
          ),
        }}
      />

      <List disablePadding>
        {directories.filter(dir => dir.name.toLowerCase().includes(searchTerm.toLowerCase())).map((dir, index) => (
          <DirectoryItem
            key={index}
            item={dir}
            handleFileSelect={handleFileSelect}
            depth={0}
            searchTerm={searchTerm}
            toggleFolder={toggleFolder} // Pass down the toggleFolder function
          />
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;
