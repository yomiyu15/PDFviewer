import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Logoimage from '../assets/images/bb.png'; // Adjust the path to your logo image

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Logo Section */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={Logoimage} alt="Logo" style={{ width: '80px', height: '80px', marginRight: '10px', borderRadius: '50%' }} />
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', fontSize: '1.5rem' }}>
            Product Catalog
          </Typography>
        </Link>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1, justifyContent: 'flex-end' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#007bbf',
                color: '#ffffff',
                textTransform: 'none', // Make text lowercase
                '&:hover': {
                  backgroundColor: '#005f8d',
                },
                transition: 'background-color 0.3s', // Smooth transition for button
              }}
            >
              Login
            </Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
