import React from 'react';
import { Link } from 'react-router-dom'; // Using Link for navigation
import img1 from '../assets/images/file.png'; // Adjust the path to your image
import { Box, Button, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '550px', sm: '800px' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'text.primary',
        
      }}
    >
      {/* Background overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: 0,
          width: '700px',
          height: '700px',
          backgroundColor: '#00adef',
          opacity: 0.4,
          borderRadius: '1.5rem', // Adjust for rounded corners
          transform: 'rotate(45deg)',
          zIndex: -1,
        }}
      />

      {/* Hero section */}
      <Box
        sx={{
          paddingBottom: { xs: '2rem', sm: '0' },
          paddingX: { xs: '1rem', sm: '2rem' },
          maxWidth: '100%',
          position: 'relative', // Allows zIndex to take effect
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
          {/* Text content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1rem',
              textAlign: { xs: 'left', sm: 'left' },
              order: { xs: 2, sm: 1 },
              zIndex: 10,
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              Product Catalog
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
              This feature-packed documentation template, built with React.js, offers a
              sleek and responsive design, perfect for all your project documentation
              needs.
            </Typography>

            {/* Buttons */}
            <Box>
  <Link to="/directories">
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#000', // Background color set to black
        color: 'white',
        textTransform: 'none', // Prevents text from being capitalized
        ':hover': {
          backgroundColor: '#0089c7', // Retaining hover color
        },
        marginRight: '1rem',
        paddingX: '1.5rem',
      }}
    >
      Get started {/* Text set to capital "G" and lowercase rest */}
    </Button>
  </Link>
  
  {/* Uncomment if you want to keep the Read more button */}
  {/* 
  <Link to="/blog">
    <Button variant="outlined" sx={{ paddingX: '1.5rem', marginLeft: '1rem' }}>
      Read more
    </Button>
  </Link> 
  */}
</Box>


            <Typography
              variant="subtitle1"
              color="#ee7b28"
              sx={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Banking products and product catalog information
            </Typography>
          </Box>

          {/* Image content */}
          <Box
            sx={{
              order: { xs: 1, sm: 2 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: { xs: '2rem', sm: '0' },
            }}
          >
            <img
              src={img1}
              alt="Bank Logo"
              style={{
                width: '700px',
                height: '500px',
                objectFit: 'contain',
                maxWidth: '450px',
                maxHeight: '450px',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
