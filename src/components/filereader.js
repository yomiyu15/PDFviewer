import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the worker path to the correct version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const FileReader = ({ filePath }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setPageNumber(1);
    setError('');
  }, [filePath]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onLoadError = (error) => {
    console.error('Error while loading PDF:', error);
    setError('Failed to load PDF. Please check the file.');
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const styles = {
    viewer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: '#f4f4f4',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    errorMessage: {
      color: 'red',
    },
    pageInfo: {
      margin: '10px 0',
    },
    controls: {
      display: 'flex',
      gap: '10px',
    },
    navButton: {
      padding: '10px 15px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#00adef',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    fullscreenButton: {
      padding: '10px 15px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#00adef',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    fullScreen: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '9999',
      background: 'white',
    },
  };

  return (
    <div style={{ ...styles.viewer, ...(isFullScreen ? styles.fullScreen : {}) }}>
      <h1 style={styles.title}>PDF Viewer</h1>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <Document
        file={filePath}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onLoadError}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p style={styles.pageInfo}>
        Page {pageNumber} of {numPages}
      </p>
      <div style={styles.controls}>
        <button style={styles.navButton} onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button style={styles.navButton} onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>
          Next
        </button>
        <button style={styles.fullscreenButton} onClick={toggleFullScreen}>
          {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
};

export default FileReader;
