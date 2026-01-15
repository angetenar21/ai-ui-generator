import React, { useState, useEffect } from 'react';
import { Copy, Check, Eye, Maximize2, Minimize2, Columns2, Code2, Monitor } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import StorageService from '../services/storageService';
import { renderComponent } from '../templates';
import type { ComponentSpec } from '../templates/core/types';

type ViewMode = 'split' | 'code' | 'preview';

const InspectorPage: React.FC = () => {
  const { generatedComponents } = useAppStore();
  const [allComponents, setAllComponents] = useState<
    Array<{ component: ComponentSpec; prompt: string; timestamp: number }>
  >([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentSpec | null>(null);
  const [copied, setCopied] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load components from both current session and history
  useEffect(() => {
    const history = StorageService.getHistory();
    const historyComponents = history.map((item) => ({
      component: item.response,
      prompt: item.prompt,
      timestamp: item.timestamp,
    }));

    const sessionComponents = generatedComponents.map((comp) => ({
      component: comp,
      prompt: 'Current session',
      timestamp: Date.now(),
    }));

    const combined = [...sessionComponents, ...historyComponents].sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    setAllComponents(combined);

    if (combined.length > 0 && !selectedComponent) {
      setSelectedComponent(combined[0].component);
    }
  }, [generatedComponents, selectedComponent]);

  const handleCopy = () => {
    if (!selectedComponent) return;
    navigator.clipboard.writeText(JSON.stringify(selectedComponent, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modeButtonClasses = (mode: ViewMode) =>
    [
      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium btn-press transition-all',
      viewMode === mode
        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-card rounded-lg'
        : 'card-sub text-text-secondary hover:bg-bg-card rounded-pill',
    ].join(' ');

  return (
    <div className="max-w-page mx-auto px-6 pt-8 pb-10 flex flex-col min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted mb-2">
          Inspector
        </p>
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-1">
              Component Inspector
            </h2>
            <p className="text-text-secondary text-sm md:text-base">
              View, edit, and preview generated component specifications.
            </p>
          </div>
        </div>
      </div>

      {allComponents.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="card rounded-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-white">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-text-primary mb-2">
              No components yet
            </h3>
            <p className="text-text-secondary">
              Generate some UI components in the Chat to inspect them here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-hidden rounded-card">
          {/* Component list (hidden in fullscreen) */}
          {!isFullscreen && (
            <aside className="w-72 flex-shrink-0 overflow-y-auto pr-1">
              <h3 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                Generated Components ({allComponents.length})
              </h3>

              <div className="space-y-2 pb-4">
                {allComponents.map((item, index) => {
                  const isActive = selectedComponent === item.component;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedComponent(item.component)}
                      className={[
                        'w-full text-left px-3 py-2.5 rounded-xl text-xs md:text-sm btn-press transition-all',
                        'flex flex-col gap-0.5',
                        isActive
                          ? 'bg-bg-card border border-accent-from/40 text-text-primary shadow-card'
                          : 'card-sub text-text-secondary hover:bg-bg-card',
                      ].join(' ')}
                    >
                      <span className="font-medium truncate">
                        {item.component.name || item.component.type}
                      </span>
                      <span className="text-[11px] text-text-muted truncate">
                        {item.prompt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          {/* Inspector panel */}
          <section className="flex-1 flex flex-col overflow-hidden">
            {selectedComponent && (
              <>
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-display font-semibold text-text-primary truncate">
                      {selectedComponent.name || selectedComponent.type} Component
                    </h3>
                    <p className="text-xs md:text-sm text-text-secondary mt-1 truncate">
                      {selectedComponent.metadata?.description || 'No description available.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* View mode toggle */}
                    <div className="flex items-center gap-1 bg-bg-sub rounded-pill px-1 py-1">
                      <button
                        type="button"
                        onClick={() => setViewMode('split')}
                        className={modeButtonClasses('split')}
                      >
                        <Columns2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Split</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('code')}
                        className={modeButtonClasses('code')}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Code</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('preview')}
                        className={modeButtonClasses('preview')}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                    </div>

                    {/* Fullscreen toggle */}
                    <button
                      type="button"
                      onClick={() => setIsFullscreen((prev) => !prev)}
                      className="px-3 py-2 rounded-btn text-xs md:text-sm font-medium btn-press card-sub flex items-center gap-1.5"
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2 className="w-4 h-4 text-text-muted" />
                          <span className="hidden sm:inline">Exit full screen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-4 h-4 text-text-muted" />
                          <span className="hidden sm:inline">Full screen</span>
                        </>
                      )}
                    </button>

                    {/* Copy JSON */}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3 py-2 rounded-btn text-xs md:text-sm font-medium btn-press hover-lift transition-all card-sub flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-success-default" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-text-muted" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content area */}
                <div
                  className="flex-1 flex gap-4 overflow-hidden"
                  style={{ minHeight: '360px' }}
                >
                  {/* JSON view */}
                  {(viewMode === 'split' || viewMode === 'code') && (
                    <div
                      className={[
                        'card-sub rounded-card p-4 overflow-auto border border-border-subtle',
                        viewMode === 'split' ? 'basis-1/2' : 'flex-1',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                          JSON spec
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {selectedComponent.type}
                        </span>
                      </div>
                      <pre className="text-xs md:text-sm text-text-secondary font-mono leading-relaxed whitespace-pre">
                        {JSON.stringify(selectedComponent, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Preview */}
                  {(viewMode === 'split' || viewMode === 'preview') && (
                    <div
                      className={[
                        'card rounded-card p-4 md:p-6 overflow-auto bg-bg-card',
                        viewMode === 'split' ? 'basis-1/2' : 'flex-1',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                          Live preview
                        </span>
                      </div>
                      <div className="bg-white rounded-card shadow-card p-4 md:p-6 min-h-[260px]">
                        {renderComponent(selectedComponent)}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default InspectorPage;
