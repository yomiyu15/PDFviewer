import React from 'react';
import { Box, Typography } from '@mui/material';

const Introduction = () => {
  return (
    <Box
      sx={{
      
        minHeight: '100vh',
        padding:"3rem",
        backgroundColor: '#fff', // Dark overlay for text readability
    
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      
      
        <Typography
          variant="h4"
          sx={{
            color: '#00adef',
            marginBottom: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: '0.05rem', // Adds a modern touch
          }}
        >
         Introduction
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginBottom: '1rem',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Background
        </Typography>
        <Typography sx={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#555' }}>
          Coopbank possesses a diverse range of products within its portfolio. These products are
          dispersed among different banking organs, making it challenging for employees to find them
          all in one place. This catalog streamlines sales efforts while also serving as an informative
          resource for employees.
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginBottom: '1rem',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Objective
        </Typography>
        <Typography sx={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#555' }}>
          The objective of this document is to create an organized product catalog that employees can
          use as a reference for product and service information, enhancing their ability to serve clients
          effectively.
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginBottom: '1rem',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Methodology
        </Typography>
        <Typography sx={{ fontSize: '1rem', color: '#555' }}>
          Secondary data collection methods were employed in preparing this document. Most of the
          information came from procedures related to customer account opening and credit operations.
          The bank's website was also referred to for cross-verification purposes.
        </Typography>
      </Box>
   
  );
};

export default Introduction;
