import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import {
  templateGallery,
  categories,
  searchTemplates,
  getTemplatesByCategory,
} from '../data/templateGallery';
import type { TemplateItem } from '../templates/core/types';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = React.useMemo(() => {
    if (searchQuery) {
      return searchTemplates(searchQuery);
    }
    if (selectedCategory === 'all') {
      return templateGallery;
    }
    return getTemplatesByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  const handleTemplateClick = (template: TemplateItem) => {
    navigate('/', { state: { initialPrompt: template.prompt } });
  };

  return (
    <div className="max-w-page mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 md:pt-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-primary mb-2">
          Template Gallery
        </h2>
        <p className="text-text-secondary text-sm sm:text-base md:text-lg">
          Browse pre-built templates to quickly generate UI components.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 relative group">
        <div className="absolute inset-0 bg-transparent rounded-[1.5rem] blur-xl group-focus-within:bg-orange-500/5 dark:group-focus-within:bg-orange-900/20 transition-colors pointer-events-none" />
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[1.5rem] border border-stone-200/60 dark:border-gray-800 focus-within:ring-2 focus-within:ring-orange-500/30 focus-within:border-orange-500/50 shadow-sm flex items-center px-4 py-3 gap-3 transition-all">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-stone-800 dark:text-gray-200 placeholder-stone-400"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchQuery('');
              }}
              className={[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-1.5',
                isActive
                  ? 'bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-900/50 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.1)] ring-1 ring-orange-500/10 text-stone-900 dark:text-white'
                  : 'bg-white/40 dark:bg-gray-800/40 border-stone-200/40 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-stone-200/80 dark:hover:border-gray-700/80 hover:shadow-sm text-stone-600 dark:text-gray-400',
              ].join(' ')}
            >
              <span>{category.label}</span>
              <span className={`text-[11px] ${isActive ? 'text-stone-500 dark:text-gray-400' : 'text-stone-400 dark:text-gray-500'}`}>({category.count})</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateClick(template)}
            className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-[1.5rem] p-6 border border-stone-200/50 dark:border-gray-800 hover:border-orange-300/60 dark:hover:border-orange-800/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden flex flex-col h-full"
          >
            {/* Decorative background gradient on hover */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex items-start justify-between mb-3 relative z-10">
              <h3 className="text-base font-semibold text-stone-900 dark:text-white group-hover:text-orange-500 transition-colors pr-2 break-words">
                {template.title}
              </h3>

              <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-orange-100/50 dark:border-gray-700 shadow-inner transition-all group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-pink-600">
                <Sparkles className="w-3.5 h-3.5 text-orange-500 dark:text-gray-300 group-hover:text-white transition-colors drop-shadow-none group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
            </div>

            <p className="text-sm text-stone-500 dark:text-gray-400 mb-5 leading-relaxed relative z-10 flex-1">
              {template.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-stone-50 dark:bg-gray-900/50 text-stone-500 dark:text-gray-400 border border-stone-200/50 dark:border-gray-700 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-3 mt-auto border-t border-stone-100 dark:border-gray-800 relative z-10">
              <p className="text-[11px] text-stone-400 dark:text-gray-500 italic line-clamp-2 leading-relaxed">
                "{template.prompt}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="mt-12 card-sub rounded-card text-center py-16">
          <p className="text-text-secondary text-lg">
            No templates found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
