import React, { useState, useEffect } from 'react';
import { postUpload, getCarte, deleteCarte, getFileCount } from '@/config/api';

const FileUpload = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileInputCount, setFileInputCount] = useState<number>(0);

  const fetchUploadedFiles = async () => {
    try {
      const count = await getFileCount();
      console.log('File count:', count);
      const filePreviews = [];
      for (let i = 1; i <= count; i++) {
        try {
          const url = await getCarte(i);
          filePreviews.push(url);
        } catch (error) {
          console.error(`Erreur de récupération de la carte ${i}:`, error);
        }
      }
      setPreviews(filePreviews);
      setFileInputCount(filePreviews.length);
    } catch (error) {
      console.error('Error fetching file count:', error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (event.target.files) {
      const file = event.target.files[0];

      // Create FormData and upload file
      const formData = new FormData();
      formData.append('file', file);

      try {
        await postUpload(formData);
        fetchUploadedFiles();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleUploadClick = (index: number) => {
    const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement;
    fileInput?.click();
  };

  const handleDeleteClick = async (index: number) => {
    try {
      await deleteCarte(index + 1); // Assuming the ID is index + 1
      fetchUploadedFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: fileInputCount + 1 }, (_, index) => (
          <div
            key={index}
            className="relative border-2 border-gray-300 rounded-lg overflow-hidden w-40 h-40 flex items-center justify-center cursor-pointer"
            onClick={() => handleUploadClick(index)}
          >
            {previews[index] ? (
              <>
                <img src={previews[index]} alt={`Preview ${index + 1}`} className="object-cover w-full h-full" />
                <button
                  className="absolute top-2 right-2 bg-red-500  rounded-full p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(index);
                  }}
                >
                  &times;
                </button>
              </>
            ) : (
              <div className="text-gray-500 text-4xl">+</div>
            )}
            <input
              type="file"
              accept="image/png"
              id={`file-input-${index}`}
              onChange={(e) => handleFileChange(e, index)}
              className="hidden"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
