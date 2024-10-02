import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the worker path to the correct version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const Header = () => {
  const styles = {
    header: {
      width: '100%',
      backgroundColor: '#00adef',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      fontSize: '25px',
      fontWeight: 'bold',
    },
  };

  return <header style={styles.header}> PDF Viewer</header>;
};

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
      width: '100%',
      maxWidth: '800px', // Optional max width
      margin: '0 auto', // Centering
      height: isFullScreen ? '100vh' : 'auto', // Full height in fullscreen
      overflow: 'auto', // Allow scrolling if needed
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
      flexWrap: 'wrap', // Allow wrapping for smaller screens
      justifyContent: 'center', // Center the buttons
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
      flex: '1 1 auto', // Allow buttons to grow/shrink
      maxWidth: '120px', // Limit max width of buttons
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
    pdfPage: {
      width: '100%', // Make PDF page responsive
      height: 'auto', // Maintain aspect ratio
    },
  };

  return (
    <div>
      <Header />
      <div style={{ ...styles.viewer, ...(isFullScreen ? styles.fullScreen : {}) }}>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <Document
          file={filePath}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onLoadError}
        >
          <Page pageNumber={pageNumber} style={styles.pdfPage} />
        </Document>
        <p style={styles.pageInfo}>
          Page {pageNumber} of {numPages}
        </p>
        <div style={styles.controls}>
          <button
            style={styles.navButton}
            onClick={() => setPageNumber(pageNumber - 1)}
            disabled={pageNumber <= 1}
          >
            Previous
          </button>
          <button
            style={styles.navButton}
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={pageNumber >= numPages}
          >
            Next
          </button>
          <button style={styles.fullscreenButton} onClick={toggleFullScreen}>
            {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileReader;
