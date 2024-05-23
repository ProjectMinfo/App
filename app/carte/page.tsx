import React, { useState } from 'react';
import { Document, Page } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import FlipPage from 'react-flip-page';
import pdfFile from './path/to/your/menu.pdf'; // Remplacez par le chemin réel de votre fichier PDF

const Carte = () => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div key={i} className="pdf-page">
          <Page pageNumber={i} />
        </div>
      );
    }
    return pages;
  };

  return (
    <div className="flipbook-container">
      <h2>Menu</h2>
      <div className="flipbook">
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages && (
            <FlipPage orientation="horizontal" showSwipeHint>
              {renderPages()}
            </FlipPage>
          )}
        </Document>
      </div>
    </div>
  );
};

export default Carte;
