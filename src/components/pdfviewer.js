import React from 'react';
import { useLocation } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { Box, Typography } from '@mui/material';

const PdfViewer = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fileName = queryParams.get('file');  // Get the file name from the query parameter

  const pdfUrl = `http://localhost:5000/api/files/view-pdf?fileName=${encodeURIComponent(fileName)}`;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Viewing: {fileName}
      </Typography>
      <Document file={pdfUrl}>
        <Page pageNumber={1} width={600} height={300} />
      </Document>
    </Box>
  );
};

export default PdfViewer;
