import React, { useState, useEffect } from 'react';

const FileUploadEvent = ({ onFileUpload, imageURL }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (imageURL) {
      setPreview(imageURL);
    }
  }, [imageURL]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Renommer le fichier avec un timestamp
      const timestamp = Date.now();
      const renamedFile = new File([file], `${timestamp}-${file.name}`, { type: file.type });

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Pass the file to the parent component
      onFileUpload(renamedFile);

      // Reset the file input
      event.target.value = null;
    }
  };

  const handleDeleteClick = () => {
    setPreview(null);
    onFileUpload(null); // Pass null to the parent component to indicate deletion
  };

  return (
    <div className="file-upload-container">
      <div className="relative border-2 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              onClick={handleDeleteClick}
            >
              &times;
            </button>
          </>
        ) : (
          <label htmlFor="file-input" className="text-gray-500 text-4xl">
            +
          </label>
        )}
        <input
          type="file"
          accept="image/png"
          id="file-input"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUploadEvent;
