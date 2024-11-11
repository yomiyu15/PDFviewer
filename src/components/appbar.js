import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Sitemark from './logo1';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

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
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredFiles, setFilteredFiles] = React.useState([]);
  
  const files = ['file1.pdf', 'file2.pdf', 'file3.pdf']; // Sample file list
  
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    if (query) {
      const results = files.filter(file =>
        file.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFiles(results);
    } else {
      setFilteredFiles([]);
    }
  }, 300); // Debounced search to avoid too many updates

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
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
              <Button variant="text" color="info" size="small">
                Digital Products
              </Button>
              <Button variant="text" color="info" size="small">
                Services
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                FAQ
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {/* Search Box */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search files"
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ width: 200 }}
            />
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>Product Catalog</MenuItem>
                <MenuItem>Our Products</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Services</MenuItem>
                <MenuItem>FAQ</MenuItem>

                <Divider sx={{ my: 3 }} />

                <MenuItem>
                  {/* You can add a search input here for mobile view */}
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
