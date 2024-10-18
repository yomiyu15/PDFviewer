import React from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const PDFViewer = ({ pdfUrl }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Document file={pdfUrl} onLoadError={console.error}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PDFViewer;
