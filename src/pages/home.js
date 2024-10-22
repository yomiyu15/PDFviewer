import { Link } from 'react-router-dom'; // Using Link for navigation
import img1 from '../assets/images/file.png'; // Adjust the path to your image
import { Box, Button, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

// Define keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

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
        animation: `${fadeIn} 0.8s ease-in-out`, // Fade-in animation for the whole box
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
          position: 'relative',
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
              padding: { xs: '0 1rem', sm: '0' },
              animation: `${fadeIn} 1s ease-in-out`,
            }}
          >
            <Typography variant="h3" fontWeight="bold" sx={{ color: '#333' }}>
              Explore Our Product Catalog
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '500px', marginBottom: '1.5rem', color: '#555' }}>
              Discover an array of innovative banking solutions crafted with care. Our dynamic documentation template, built with React.js, ensures a seamless and responsive experience tailored to meet your project needs.
            </Typography>

            {/* Buttons */}
            <Box>
              <Link to="/directories">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#000',
                    color: 'white',
                    textTransform: 'none',
                    ':hover': {
                      backgroundColor: '#0089c7',
                    },
                    marginRight: '1rem',
                    paddingX: '1.5rem',
                   
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </Box>

            <Typography
              variant="subtitle1"
              color="#ee7b28"
              sx={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                fontWeight:'bold'
              }}
            >
              Your gateway to banking products and insightful catalog information
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
              zIndex: 10,
              animation: `${fadeIn} 1.2s ease-in-out`,
            }}
          >
            <img
              src={img1}
              alt="Bank Logo"
              style={{
                width: '500px',
                height: '400px',
                objectFit: 'contain',
                maxWidth: '400px',
                maxHeight: '400px',
                borderRadius: '10px', // Adding rounded corners to the image
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
