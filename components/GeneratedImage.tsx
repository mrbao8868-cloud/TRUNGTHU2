import React from 'react';

interface GeneratedImageProps {
  imageUrl: string | null;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="w-full max-w-xl mx-auto mt-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-4">Tác phẩm của bạn!</h2>
        <div className="relative group p-1 bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 rounded-xl shadow-2xl shadow-yellow-500/20">
            <img src={imageUrl} alt="Generated Mid-Autumn" className="rounded-lg" />
        </div>
        <a
            href={imageUrl}
            download="anh-trung-thu-ai.png"
            className="mt-6 inline-flex items-center px-6 py-2 border border-transparent text-base font-semibold rounded-full shadow-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Tải ảnh xuống
        </a>
    </div>
  );
};

export default GeneratedImage;