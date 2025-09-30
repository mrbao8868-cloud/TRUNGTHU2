import React, { useState, useMemo } from 'react';
import ImageUploader from './components/ImageUploader';
import CategorySelector from './components/CategorySelector';
import GeneratedImage from './components/GeneratedImage';
import Loader from './components/Loader';
import { CATEGORIES } from './constants';
import { generateMidAutumnImage } from './services/geminiService';

const HeaderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] inline-block align-middle">
        <path d="M14 20s-2 2-2 3-2-3-2-3H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.71 1.2a2 2 0 0 0 1.69.9H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4Z"></path>
        <path d="M12 20v-4"></path>
        <path d="M6 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"></path>
    </svg>
);


const App: React.FC = () => {
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImageFile(file);
    setGeneratedImageUrl(null);
    setError(null);
    setSelectedCategoryId(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateClick = async () => {
    if (!uploadedImageFile || !selectedCategoryId) {
      setError("Vui lòng tải ảnh lên và chọn một chủ đề.");
      return;
    }

    const selectedCategory = CATEGORIES.find(c => c.id === selectedCategoryId);

    if (!selectedCategory) {
      setError("Chủ đề không hợp lệ.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const finalPrompt = selectedCategory.prompt;
      const resultUrl = await generateMidAutumnImage(uploadedImageFile, finalPrompt);
      setGeneratedImageUrl(resultUrl);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const isGenerateButtonDisabled = useMemo(() => {
      return !uploadedImageFile || !selectedCategoryId || isLoading;
  }, [uploadedImageFile, selectedCategoryId, isLoading]);

  return (
    <div className="min-h-screen text-white font-sans p-4 relative z-10">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-400 mb-2 drop-shadow-[0_2px_5px_rgba(251,191,36,0.3)]">
              <HeaderIcon /> Trình Tạo Ảnh Trung Thu AI
            </h1>
            <p className="text-base text-gray-300 max-w-2xl mx-auto">Biến bức ảnh chân dung của bạn thành một khoảnh khắc Trung thu diệu kỳ chỉ với vài cú nhấp chuột!</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ----- Left Column: Controls ----- */}
          <div className="space-y-4 flex flex-col">
            <div className="p-4 rounded-2xl glassmorphism glow-shadow">
              <h2 className="text-xl font-bold text-center text-yellow-300 mb-4">1. Tải ảnh của bạn lên</h2>
              <ImageUploader onImageUpload={handleImageUpload} previewUrl={uploadedImagePreview} />
              <div className="mt-4 max-w-lg mx-auto bg-gray-900/50 border border-yellow-600/30 rounded-lg p-3 text-center">
                <h4 className="font-semibold text-yellow-300 mb-1 flex items-center justify-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Mẹo để có ảnh đẹp nhất
                </h4>
                <p className="text-gray-400 text-xs">
                  AI sẽ cố gắng hết sức để giữ lại các đường nét trên khuôn mặt của bạn. Để có kết quả tốt nhất, hãy dùng ảnh <strong>chân dung rõ nét, chính diện, đủ sáng</strong>.
                </p>
              </div>
            </div>

            {uploadedImagePreview && (
              <div className="p-4 rounded-2xl glassmorphism glow-shadow">
                  <CategorySelector 
                  categories={CATEGORIES}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  />
              </div>
            )}
            
            {uploadedImagePreview && selectedCategoryId && (
              <div className="text-center pt-2">
                <button
                  onClick={handleGenerateClick}
                  disabled={isGenerateButtonDisabled}
                  className="px-8 py-3 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none animate-pulse-strong"
                >
                  {isLoading ? 'Đang xử lý...' : 'Tạo ảnh ngay!'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                    Lưu ý: Dịch vụ AI có giới hạn lượt tạo ảnh miễn phí mỗi ngày.
                </p>
              </div>
            )}
          </div>

          {/* ----- Right Column: Output ----- */}
          <div className="flex flex-col items-center justify-start">
             {error && <p className="w-full text-center text-red-400 bg-red-900/50 p-3 rounded-lg mb-4">{error}</p>}
            
             <div className="w-full h-full flex items-center justify-center">
              {isLoading ? (
                <Loader />
              ) : generatedImageUrl ? (
                <GeneratedImage imageUrl={generatedImageUrl} />
              ) : (
                <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center glassmorphism glow-shadow rounded-2xl p-4 text-gray-500 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-400">Tác phẩm của bạn sẽ hiện ở đây</h3>
                    <p className="text-sm">Hoàn thành các bước bên trái để bắt đầu sáng tạo.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-12 pt-8 border-t border-gray-700/50 text-gray-500 text-xs space-y-1">
            <p>Phát triển bởi Thầy Giới - Chuyên gia chuyển đổi số <span className="animate-blink font-bold text-yellow-300">0972300864</span></p>
            <p>Được tạo bởi AI. Chúc bạn một mùa Trung thu vui vẻ và ấm áp!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;