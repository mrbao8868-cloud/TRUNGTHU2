import React, { useState, useMemo } from 'react';
import ImageUploader from './components/ImageUploader';
import CategorySelector from './components/CategorySelector';
import AspectRatioSelector from './components/AspectRatioSelector';
import GeneratedImage from './components/GeneratedImage';
import Loader from './components/Loader';
import { CATEGORIES, ASPECT_RATIOS } from './constants';
import { generateMidAutumnImage } from './services/geminiService';

const App: React.FC = () => {
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAspectRatioId, setSelectedAspectRatioId] = useState<string>('1:1');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImageFile(file);
    setGeneratedImageUrl(null);
    setError(null);
    setSelectedCategoryId(null);
    setSelectedAspectRatioId('1:1');
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateClick = async () => {
    if (!uploadedImageFile || !selectedCategoryId || !selectedAspectRatioId) {
      setError("Vui lòng tải ảnh lên, chọn chủ đề và tỷ lệ khung hình.");
      return;
    }

    const selectedCategory = CATEGORIES.find(c => c.id === selectedCategoryId);
    const selectedAspectRatio = ASPECT_RATIOS.find(r => r.id === selectedAspectRatioId);

    if (!selectedCategory || !selectedAspectRatio) {
      setError("Chủ đề hoặc tỷ lệ không hợp lệ.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const finalPrompt = `${selectedCategory.prompt} ${selectedAspectRatio.promptSuffix}`;
      const resultUrl = await generateMidAutumnImage(uploadedImageFile, finalPrompt);
      setGeneratedImageUrl(resultUrl);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const isGenerateButtonDisabled = useMemo(() => {
      return !uploadedImageFile || !selectedCategoryId || !selectedAspectRatioId || isLoading;
  }, [uploadedImageFile, selectedCategoryId, selectedAspectRatioId, isLoading]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-400 mb-3 drop-shadow-[0_2px_5px_rgba(251,191,36,0.3)]">
            Trình Tạo Ảnh Trung Thu AI
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Biến bức ảnh chân dung của bạn thành một khoảnh khắc Trung thu diệu kỳ chỉ với vài cú nhấp chuột!</p>
        </header>

        <main className="space-y-12">
          <div className="p-4 sm:p-8 rounded-2xl bg-gray-800/30">
            <h2 className="text-2xl font-bold text-center text-yellow-300 mb-6">1. Tải ảnh của bạn lên</h2>
            <ImageUploader onImageUpload={handleImageUpload} previewUrl={uploadedImagePreview} />
            <div className="mt-6 max-w-lg mx-auto bg-gray-900/50 border border-yellow-600/30 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-yellow-300 mb-2 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  Mẹo để có ảnh đẹp nhất
              </h4>
              <p className="text-gray-400 text-sm">
                AI sẽ cố gắng hết sức để giữ lại các đường nét trên khuôn mặt của bạn. Để có kết quả tốt nhất, hãy dùng ảnh <strong>chân dung rõ nét, chính diện, đủ sáng</strong>.
              </p>
            </div>
          </div>

          {uploadedImagePreview && (
             <div className="p-4 sm:p-8 rounded-2xl bg-gray-800/30">
                <CategorySelector 
                categories={CATEGORIES}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                />
            </div>
          )}
          
          {uploadedImagePreview && selectedCategoryId && (
             <div className="p-4 sm:p-8 rounded-2xl bg-gray-800/30">
                <AspectRatioSelector
                aspectRatios={ASPECT_RATIOS}
                selectedAspectRatioId={selectedAspectRatioId}
                onSelectAspectRatio={setSelectedAspectRatioId}
                />
            </div>
          )}

          {uploadedImagePreview && selectedCategoryId && (
            <div className="text-center pt-4">
              <button
                onClick={handleGenerateClick}
                disabled={isGenerateButtonDisabled}
                className="px-10 py-4 text-xl font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none animate-pulse-strong"
              >
                {isLoading ? 'Đang xử lý...' : 'Tạo ảnh ngay!'}
              </button>
            </div>
          )}


          {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
          
          <div className="flex justify-center">
            {isLoading && <Loader />}
          </div>

          <GeneratedImage imageUrl={generatedImageUrl} />

        </main>
        
        <footer className="text-center mt-20 text-gray-500 text-sm space-y-2">
            <p>Phát triển bởi Thầy Giới - Chuyên gia chuyển đổi số 0972300864</p>
            <p>Được tạo bởi AI. Chúc bạn một mùa Trung thu vui vẻ và ấm áp!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;