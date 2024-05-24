'use client';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Fix pour les importations Webpack 
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Utilisez un chemin relatif pour le fichier PDF
const pdfUrl = "./TD_BDD_1.pdf";

const Carte = () => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log(`Document loaded with ${numPages} pages.`);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Failed to load PDF document:', error);
  };  

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Menu</h1>
      <div className="pdf-container">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
        >
          {numPages && Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default Carte;
