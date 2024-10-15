import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Typography, Container, Card, CardContent } from '@mui/material';

// Set the worker path to the correct version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;



const FileReader = ({ filePath }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState('');
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
    useEffect(() => {
      setPageNumber(1);
      setError('');
    }, [filePath]);
  
    useEffect(() => {
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
    };
  
    const onLoadError = (error) => {
      setError('Failed to load PDF.');
    };
  
    const pdfScale = Math.min(windowSize.width / 800, windowSize.height / 1000);
  
    return (
      <Container>
        <Card>
          <CardContent>
            {error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onLoadError}>
                  <Page pageNumber={pageNumber} scale={pdfScale} />
                </Document>
                <Box display="flex" justifyContent="space-between" marginTop="16px">
                  <Button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
                    Previous
                  </Button>
                  <Typography>
                    Page {pageNumber} of {numPages}
                  </Typography>
                  <Button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>
                    Next
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    );
  };
  
  export default FileReader;