import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Document, Page } from 'react-pdf';

const PdfViewer = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filePath = params.get('filePath');  // Get the file path from the URL

  const [pdfFile, setPdfFile] = React.useState(null);

  React.useEffect(() => {
    if (filePath) {
      // Fetch the PDF from the server
      fetch(`http://localhost:5000/api/files/view?filePath=${encodeURIComponent(filePath)}`)
        .then(response => response.blob())
        .then(blob => setPdfFile(URL.createObjectURL(blob)))
        .catch(error => console.error('Error loading PDF:', error));
    }
  }, [filePath]);

  return (
    <div>
      {pdfFile ? (
        <Document file={pdfFile}>
          <Page pageNumber={1} />
        </Document>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfViewer;
