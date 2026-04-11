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
    <div className="max-w-page mx-auto px-6 pt-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-display font-bold text-text-primary mb-2">
          Template Gallery
        </h2>
        <p className="text-text-secondary text-lg">
          Browse pre-built templates to quickly generate UI components.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="card-sub flex items-center gap-3 px-4 py-3 rounded-card">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-text-primary placeholder:text-text-muted"
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
                'px-4 py-1.5 rounded-pill text-sm font-medium btn-press transition-all',
                'flex items-center gap-1',
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-card'
                  : 'bg-white text border border-border-subtle text-gray-700 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white hover:bg-bg-sub',
              ].join(' ')}
            >
              <span>{category.label}</span>
              <span className="text-text-muted text-xs">({category.count})</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateClick(template)}
            className="card hover-lift cursor-pointer transition-shadow duration-200 p-6 rounded-card group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-text-primary group-hover:text-text-primary">
                {template.title}
              </h3>

              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-bg-sub text-accent-solid">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              {template.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-[11px] rounded-pill bg-bg-sub text-text-muted border border-border-subtle"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-3 mt-1 border-t border-border-subtle">
              <p className="text-xs text-text-muted italic line-clamp-2">
                “{template.prompt}”
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
