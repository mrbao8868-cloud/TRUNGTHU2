import React from 'react';
import { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <div className="w-full mx-auto">
      <h2 className="text-xl font-bold text-center text-yellow-300 mb-4">2. Chọn chủ đề</h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-3">
        {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-300 aspect-square transform hover:-translate-y-1 ${
                isSelected 
                ? 'bg-yellow-500 border-yellow-300 text-gray-900 animate-glow' 
                : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-white'
              }`}
            >
              <div className="mb-1">{category.icon}</div>
              <span className="text-xs font-semibold text-center leading-tight">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;