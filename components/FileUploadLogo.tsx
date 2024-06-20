import React, { useState, useEffect } from 'react';
import { postUploadLogo } from '@/config/api';

const FileUploadLogo = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const fetchUploadedFile = async () => {
    try {
      setPreview("https://minfoapi.fly.dev/settings/logo");
    } catch (error) {
      console.error('Error fetching uploaded file:', error);
    }
  };

  useEffect(() => {
    fetchUploadedFile();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];

      // Renommer le fichier avec un timestamp
      const timestamp = Date.now();
      const renamedFile = new File([file], `${timestamp}-${file.name}`, { type: file.type });

      // Create FormData and upload file
      const formData = new FormData();
      formData.append('image', renamedFile);

      try {
        await postUploadLogo(formData);
        fetchUploadedFile();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleDeleteClick = async () => {
    try {
      // await deleteCarte(1); // Assuming the ID is always 1
      setPreview(null);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
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

export default FileUploadLogo;
