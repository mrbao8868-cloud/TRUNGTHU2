import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  aspectRatios: AspectRatio[];
  selectedAspectRatioId: string;
  onSelectAspectRatio: (id: string) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ aspectRatios, selectedAspectRatioId, onSelectAspectRatio }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-yellow-300 mb-6">3. Chọn tỷ lệ khung hình</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {aspectRatios.map((ratio) => {
          const isSelected = ratio.id === selectedAspectRatioId;
          return (
            <button
              key={ratio.id}
              onClick={() => onSelectAspectRatio(ratio.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 w-32 h-28 ${
                isSelected 
                ? 'bg-yellow-500 border-yellow-300 text-gray-900 animate-glow' 
                : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-white'
              }`}
            >
              <div className="mb-2">{ratio.icon}</div>
              <span className="text-sm font-semibold text-center">{ratio.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AspectRatioSelector;