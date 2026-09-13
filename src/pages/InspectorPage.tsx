import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, Eye, Maximize2, Minimize2, Columns2, Code2, Monitor, Search, Trash2, X, Braces, Wand2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import StorageService from '../services/storageService';
import { ComponentRenderer } from '../templates';
import type { ComponentSpec } from '../templates/core/types';
import ErrorBoundary from '../components/ErrorBoundary';

type ViewMode = 'code' | 'preview';
type CodeTab = 'jsx' | 'json';

// ─── Code Pane Error Boundary ──────────────────────────────────────────────

class CodePaneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message ?? 'Unknown error' };
  }

  componentDidUpdate(prevProps: { children: React.ReactNode }) {
    // Reset when content changes so switching tabs / components clears the error
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, message: '' });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
          <p className="text-sm font-semibold text-red-600">Failed to render code view</p>
          <p className="text-xs text-text-muted font-mono">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="px-3 py-1.5 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const toPascalCase = (s: string) =>
  s.replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase());

/** Convert a ComponentSpec tree into readable JSX code string */
const specToJSX = (spec: ComponentSpec, indent = 0): string => {
  // Guard against null/non-object specs (e.g. string children from AI)
  if (!spec || typeof spec !== 'object') return `${'  '.repeat(indent)}{/* ${String(spec)} */}`;

  try {
    const pad = '  '.repeat(indent);
    const inner = '  '.repeat(indent + 1);
    const compName = toPascalCase((spec as any).name || (spec as any).type || 'Component');
    const props = (spec as any).templateProps || (spec as any).props || {};
    const { children: propsChildren, ...restProps } = typeof props === 'object' ? props : {};
    const rawChildren: any[] = Array.isArray(propsChildren)
      ? propsChildren
      : Array.isArray((spec as any).children)
        ? (spec as any).children
        : [];

    const propLines = Object.entries(restProps)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => {
        try {
          if (typeof v === 'string') return `${inner}${k}="${v}"`;
          if (typeof v === 'boolean') return v ? `${inner}${k}` : `${inner}${k}={false}`;
          return `${inner}${k}={${JSON.stringify(v)}}`;
        } catch {
          return `${inner}${k}={/* unserializable */}`;
        }
      });

    const openTag = propLines.length
      ? `${pad}<${compName}\n${propLines.join('\n')}\n${pad}`
      : `${pad}<${compName}`;

    if (!rawChildren.length) {
      return `${openTag} />`;
    }

    const childrenJSX = rawChildren
      .map((child: any) => specToJSX(child, indent + 1))
      .join('\n');

    return `${openTag}>\n${childrenJSX}\n${pad}</${compName}>`;
  } catch {
    return `${'  '.repeat(indent)}{/* render error */}`;
  }
};

/** Syntax-highlight JSX (basic tokeniser) */
const JsxHighlight: React.FC<{ code: string }> = ({ code }) => {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const highlighted = escaped
    // tags
    .replace(/(&lt;\/?)([A-Za-z][\w.]*)/g, (_, slash, name) =>
      `<span class="jsx-tag">${slash}${name}</span>`)
    // prop names (word before =)
    .replace(/(\s)([a-zA-Z][\w]*)(?==)/g, (_, sp, k) =>
      `${sp}<span class="jsx-attr">${k}</span>`)
    // string values in quotes
    .replace(/"([^"]*)"/g, `<span class="jsx-string">"$1"</span>`)
    // self-close />
    .replace(/(\/&gt;)/g, '<span class="jsx-bracket">$1</span>')
    // standalone booleans / numbers inside {}
    .replace(/\{(true|false|\d[\d.]*)?\}/g, (m) =>
      `<span class="jsx-literal">${m}</span>`);

  return (
    <code
      className="text-xs md:text-sm font-mono leading-relaxed whitespace-pre"
      // Set the inner HTML directly to correctly parse entities
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
};

/** Syntax-highlight JSON */
const JsonHighlight: React.FC<{ json: string }> = ({ json }) => {
  const highlighted = json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],:])/g,
    (match) => {
      let cls = 'json-number'; // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-string';
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      } else if (/[{}[\]]/.test(match)) {
        cls = 'json-bracket';
      } else if (match === ':' || match === ',') {
        cls = 'json-punctuation';
      }
      return `<span class="${cls}">${match}</span>`;
    },
  );
  return (
    <code
      className="text-xs md:text-sm font-mono leading-relaxed whitespace-pre"
      // Set the inner HTML directly to correctly parse entities
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
};

/** Derive a human-readable label for a component item */
const getComponentLabel = (component: ComponentSpec): string => {
  const tp = (component as any).templateProps || (component as any).props;
  if (tp?.title && typeof tp.title === 'string') return tp.title;
  return component.name || component.type || 'Component';
};

const InspectorPage: React.FC = () => {
  const { generatedComponents } = useAppStore();
  const [allComponents, setAllComponents] = useState<
    Array<{ component: ComponentSpec; prompt: string; timestamp: number; historyId?: string }>
  >([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentSpec | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [codeTab, setCodeTab] = useState<CodeTab>('jsx');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load components from both current session and history
  useEffect(() => {
    const history = StorageService.getHistory();
    const historyComponents = history
      .filter((item) => {
        if (item.status) return item.status === 'completed';
        // Fallback for legacy items without status
        const compId = item.response?.metadata?.componentId || '';
        return !compId.startsWith('error-') && !compId.startsWith('stopped-');
      })
      .map((item) => ({
        component: item.response,
        prompt: item.prompt,
        timestamp: item.timestamp,
        historyId: item.id,
      }));

    const sessionComponents = generatedComponents.map((comp) => ({
      component: comp,
      prompt: 'Current session',
      timestamp: Date.now(),
    }));

    const uniqueIds = new Set();
    const combined = [...sessionComponents, ...historyComponents]
      .filter((item) => {
        const id = item.component?.metadata?.componentId;
        if (!id) return true;
        if (uniqueIds.has(id)) return false;
        uniqueIds.add(id);
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    setAllComponents(combined);

    if (combined.length > 0 && !selectedComponent) {
      setSelectedComponent(combined[0].component);
      setSelectedHistoryId((combined[0] as any).historyId);
    }
  }, [generatedComponents, selectedComponent]);

  const handleCopy = () => {
    if (!selectedComponent) return;
    navigator.clipboard.writeText(JSON.stringify(selectedComponent, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (!selectedHistoryId) return;
    StorageService.deleteHistoryItem(selectedHistoryId);
    // Remove from local list
    const next = allComponents.filter((c) => c.historyId !== selectedHistoryId);
    setAllComponents(next);
    setSelectedComponent(next[0]?.component ?? null);
    setSelectedHistoryId(next[0]?.historyId);
  };

  const filteredComponents = useMemo(() => {
    if (!search.trim()) return allComponents;
    const q = search.toLowerCase();
    return allComponents.filter((item) => {
      const label = getComponentLabel(item.component).toLowerCase();
      const name = (item.component.name || item.component.type || '').toLowerCase();
      const prompt = item.prompt.toLowerCase();
      return label.includes(q) || name.includes(q) || prompt.includes(q);
    });
  }, [allComponents, search]);

  const modeButtonClasses = (mode: ViewMode) =>
    [
      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all rounded-lg',
      viewMode === mode
        ? 'bg-white dark:bg-gray-800 text-stone-800 dark:text-gray-100 shadow-sm border border-stone-200/50 dark:border-gray-700'
        : 'text-stone-500 hover:text-stone-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5',
    ].join(' ');

  const jsonString = selectedComponent ? JSON.stringify(selectedComponent, null, 2) : '';

  return (
    <div className="h-full w-full max-w-page mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 md:pt-8 pb-10 flex flex-col bg-transparent relative z-10">
      {/* Header */}
      <div className="mb-6 pl-2">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-stone-900 dark:text-white mb-2 tracking-tight">
            Component Inspector
          </h2>
          <p className="text-stone-500 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl">
            View, edit, and preview generated component specifications. Check real-time outputs from the chat generation engine.
          </p>
        </div>
      </div>

      {allComponents.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-stone-200/50 dark:border-gray-700/50 shadow-sm animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-50 dark:bg-gray-900/50 flex items-center justify-center border border-orange-100/50 dark:border-gray-700 shadow-inner">
              <Eye className="w-8 h-8 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-stone-900 dark:text-white mb-2">
              No components yet
            </h3>
            <p className="text-stone-500 dark:text-gray-400">
              Generate some UI components in the Chat to inspect them here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-6 overflow-hidden min-h-0 animate-fade-in-up">
          {/* Component list (hidden in fullscreen) */}
          {!isFullscreen && (
            <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 flex flex-col gap-3 md:gap-4 overflow-hidden md:max-h-full max-h-[35vh]">
              {/* Search bar */}
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-transparent rounded-2xl blur-xl group-focus-within:bg-orange-500/5 dark:group-focus-within:bg-orange-900/20 transition-colors" />
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 dark:border-gray-800 focus-within:ring-2 focus-within:ring-orange-500/30 focus-within:border-orange-500/50 transition-all flex items-center shadow-sm">
                  <Search className="w-4 h-4 ml-4 flex-shrink-0 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search components…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-0 px-3 py-3 text-sm outline-none text-stone-800 dark:text-gray-200 placeholder-stone-400"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="p-2 mr-2 text-stone-400 hover:text-stone-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between px-1 flex-shrink-0">
                <h3 className="text-[11px] font-semibold text-stone-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                  History
                </h3>
                <span className="text-[11px] font-medium text-stone-500 bg-white/80 dark:bg-gray-800 border border-stone-200/50 dark:border-gray-700 px-2 py-0.5 rounded-full shadow-sm">
                   {filteredComponents.length}
                </span>
              </div>

              <div className="flex-1 flex flex-col md:flex-col gap-2 overflow-y-auto md:overflow-y-auto pr-1 scrollbar-thin scroll-smooth pb-4">
                {filteredComponents.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-8 text-center bg-stone-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-stone-200 dark:border-gray-700">No results found.</p>
                ) : (
                  filteredComponents.map((item, index) => {
                    const isActive = selectedComponent === item.component;
                    const label = getComponentLabel(item.component);
                    const typeName = item.component.name || item.component.type || '?';
                    const isFromPrompt = item.prompt && item.prompt !== 'Current session';

                    return (
                      <button
                        key={item.historyId ?? index}
                        onClick={() => {
                          setSelectedComponent(item.component);
                          setSelectedHistoryId(item.historyId);
                        }}
                        className={[
                          'w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-200 group relative',
                          'flex flex-col gap-1 border flex-shrink-0',
                          isActive
                            ? 'bg-orange-500/10 dark:bg-orange-900/20 border-orange-500/30 dark:border-orange-800/50'
                            : 'bg-transparent border-transparent hover:bg-stone-500/10 dark:hover:bg-gray-700/50',
                        ].join(' ')}
                      >
                        <span className={`font-semibold truncate text-sm transition-colors ${isActive ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-gray-300 group-hover:text-stone-900 dark:group-hover:text-white'}`}>
                          {label}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] truncate">
                           <span className={`font-mono px-1.5 py-0.5 rounded shadow-sm border ${isActive ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30' : 'bg-stone-50 text-stone-500 border-stone-200/50 dark:bg-gray-900/50 dark:text-gray-400 dark:border-gray-700'}`}>{typeName}</span>
                           <span className={`truncate ${isActive ? 'text-stone-500 dark:text-gray-400' : 'text-stone-400 dark:text-gray-500'}`}>
                             {isFromPrompt ? item.prompt : 'Current section'}
                           </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>
          )}

          {/* Inspector panel */}
          <section className="flex-1 flex flex-col overflow-hidden min-w-0 shadow-sm relative">
            {selectedComponent && (
              <div className="h-full flex flex-col relative z-20">
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 pt-1 gap-2 sm:gap-3 border-b border-stone-200/60 dark:border-gray-800/60 flex-shrink-0">
                  <div className="min-w-0 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100/50 dark:border-orange-800/30 flex items-center justify-center shadow-inner flex-shrink-0">
                      <Code2 className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-display font-semibold text-stone-900 dark:text-white truncate">
                        {getComponentLabel(selectedComponent)}
                      </h3>
                      <p className="text-[11px] md:text-xs text-stone-500 dark:text-gray-400 mt-0.5 truncate">
                        {selectedComponent.metadata?.description
                          || `${selectedComponent.name || selectedComponent.type} component`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 flex-wrap">
                    {/* View mode toggle */}
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-stone-100/50 dark:bg-gray-900/50 rounded-xl p-0.5 sm:p-1 border border-stone-200/50 dark:border-gray-700 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setViewMode('code')}
                        className={modeButtonClasses('code')}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">JSON</span>
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

                    <div className="w-px h-6 bg-stone-200 dark:bg-gray-700 mx-1" />

                    {/* Fullscreen toggle */}
                    <button
                      type="button"
                      onClick={() => setIsFullscreen((prev) => !prev)}
                      className="p-2 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors tooltip-trigger border border-transparent shadow-sm"
                      title={isFullscreen ? "Exit full screen" : "Full screen"}
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    {/* Copy JSON */}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-2 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors tooltip-trigger border border-transparent shadow-sm"
                      title="Copy JSON"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Delete (only if from history) */}
                    {selectedHistoryId && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors tooltip-trigger border border-transparent hover:border-red-100 dark:hover:border-red-900/50 shadow-sm"
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content area */}
                <div className="flex-1 flex gap-4 overflow-hidden min-h-[200px] sm:min-h-[360px] pl-1 pb-1 pr-1">
                  {/* Code / JSON pane */}
                  {(viewMode === 'code') && (() => {
                    const jsxCode = specToJSX(selectedComponent);
                    const displayCode = codeTab === 'jsx' ? jsxCode : jsonString;
                    const lineCount = displayCode.split('\n').length;
                    const copyContent = () => {
                      navigator.clipboard.writeText(displayCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    };
                    return (
                      <CodePaneErrorBoundary>
                        <div
                          className="flex flex-col relative min-w-0 overflow-hidden flex-1"
                        >
                          {/* Toolbar */}
                          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-stone-50/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-stone-200/80 dark:border-gray-700/80">
                            {/* Tab toggle: JSX / JSON */}
                            <div className="flex items-center gap-1 bg-stone-200/50 dark:bg-gray-900/80 rounded-lg p-0.5 border border-stone-300/30 dark:border-gray-700/50 shadow-inner">
                              <button
                                onClick={() => setCodeTab('jsx')}
                                className={[
                                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all',
                                  codeTab === 'jsx'
                                    ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm border border-transparent'
                                    : 'text-stone-500 dark:text-gray-400 hover:text-stone-700 dark:hover:text-gray-200 hover:bg-stone-100/50 dark:hover:bg-gray-800/50',
                                ].join(' ')}
                              >
                                <Code2 className="w-3.5 h-3.5 opacity-70" />
                                JSX
                              </button>
                              <button
                                onClick={() => setCodeTab('json')}
                                className={[
                                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all',
                                  codeTab === 'json'
                                    ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm border border-transparent'
                                    : 'text-stone-500 dark:text-gray-400 hover:text-stone-700 dark:hover:text-gray-200 hover:bg-stone-100/50 dark:hover:bg-gray-800/50',
                                ].join(' ')}
                              >
                                <Braces className="w-3.5 h-3.5 opacity-70" />
                                JSON
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[11px] text-stone-400 dark:text-gray-500 font-mono font-medium">{lineCount} lines</span>
                            </div>
                          </div>
                          {/* Code body */}
                          <pre className="p-5 overflow-auto flex-1 scrollbar-thin overflow-x-auto">
                            {codeTab === 'jsx'
                              ? <JsxHighlight code={jsxCode} />
                              : <JsonHighlight json={jsonString} />}
                          </pre>
                        </div>
                      </CodePaneErrorBoundary>
                    );
                  })()}

                  {/* Preview */}
                  {(viewMode === 'preview') && (
                    <div
                      className="flex flex-col relative min-w-0 overflow-hidden flex-1"
                    >
                      {/* Decorative header inner */}
                      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-stone-50/80 to-transparent dark:from-gray-800/50 pointer-events-none z-10" />
                      
                      <div className="flex items-center justify-between px-5 pt-4 pb-2 relative z-20">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-gray-500 flex items-center gap-2">
                          <Monitor className="w-3.5 h-3.5" /> Live Preview
                        </span>
                      </div>
                      <div className="flex-1 overflow-auto p-5 scrollbar-thin relative z-20">
                        <ErrorBoundary fallbackTitle="Preview Render Error">
                          <ComponentRenderer spec={selectedComponent} />
                        </ErrorBoundary>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default InspectorPage;
