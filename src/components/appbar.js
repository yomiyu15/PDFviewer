import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Sitemark from './logo1';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';
import axios from 'axios';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Debounced search handler
  const handleSearch = debounce(async (query) => {
    setSearchQuery(query);
    if (query) {
      try {
        console.log('Search Query:', query); // Log the search query
        const response = await axios.get(`http://localhost:5000/api/files/list?search=${encodeURIComponent(query)}`);
        console.log('Search Response:', response.data.files); // Log the response data
        setFilteredFiles(response.data.files); // Assuming response has a 'files' array
      } catch (error) {
        console.error('Error fetching search results:', error);
        setFilteredFiles([]);
      }
    } else {
      setFilteredFiles([]);
    }
  }, 300); // 300ms debounce delay

  const handleSearchClick = () => {
    handleSearch(searchQuery); // Trigger search when button is clicked
  };

  return (
    <AppBar position="fixed" enableColorOnDark sx={{ boxShadow: 0, bgcolor: 'transparent', mt: 'calc(var(--template-frame-height, 0px) + 28px)' }}>
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Sitemark />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small">
                Product Catalog
              </Button>
              <Button variant="text" color="info" size="small">
                Our Products
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {/* Search Box */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search files"
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
              sx={{ width: 200 }}
            />
            {/* Search Button */}
            <Button variant="contained" onClick={handleSearchClick}>
              Search
            </Button>
            <ColorModeIconDropdown />
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
