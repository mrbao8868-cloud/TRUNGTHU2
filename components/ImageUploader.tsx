import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="w-full max-w-xl mx-auto bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:border-yellow-400 hover:bg-gray-800/80 hover:shadow-2xl hover:shadow-yellow-500/10"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="mx-auto max-h-72 rounded-lg object-contain" />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 py-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-bold text-xl text-gray-300">Nhấn để tải ảnh lên</p>
          <p className="text-sm text-gray-500 mt-1">Hỗ trợ PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;