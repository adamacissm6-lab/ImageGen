
import React from 'react';

interface UploaderProps {
  onUpload: (base64: string) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:border-indigo-500 transition-colors cursor-pointer group">
      <label className="flex flex-col items-center justify-center w-full cursor-pointer">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-12 h-12 mb-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="mb-2 text-lg font-semibold text-gray-700">Click to upload image</p>
          <p className="text-sm text-gray-500">PNG, JPG, or WEBP (MAX. 5MB)</p>
        </div>
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default Uploader;
