import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, Eye, Maximize2, Minimize2, Columns2, Code2, Monitor, Search, Trash2, X, Braces } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import StorageService from '../services/storageService';
import { ComponentRenderer } from '../templates';
import type { ComponentSpec } from '../templates/core/types';

type ViewMode = 'split' | 'code' | 'preview';
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
      `<span class="text-blue-600">${slash}${name}</span>`)
    // prop names (word before =)
    .replace(/(\s)([a-zA-Z][\w]*)(?==)/g, (_, sp, k) =>
      `${sp}<span class="text-violet-600">${k}</span>`)
    // string values in quotes
    .replace(/"([^"]*)"/g, `<span class="text-emerald-600">"$1"</span>`)
    // self-close />
    .replace(/(\/&gt;)/g, '<span class="text-blue-400">$1</span>')
    // standalone booleans / numbers inside {}
    .replace(/\{(true|false|\d[\d.]*)?\}/g, (m) =>
      `<span class="text-orange-500">${m}</span>`);

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
      let cls = 'text-orange-600'; // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'text-violet-600 font-medium' : 'text-emerald-700';
      } else if (/true|false/.test(match)) {
        cls = 'text-blue-600';
      } else if (/null/.test(match)) {
        cls = 'text-red-500';
      } else if (/[{}[\]]/.test(match)) {
        cls = 'text-gray-500';
      } else if (match === ':' || match === ',') {
        cls = 'text-gray-400';
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

    const combined = [...sessionComponents, ...historyComponents].sort(
      (a, b) => b.timestamp - a.timestamp,
    );

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
      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium btn-press transition-all',
      viewMode === mode
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-card rounded-lg'
        : 'card-sub text-text-secondary hover:bg-bg-card rounded-pill',
    ].join(' ');

  const jsonString = selectedComponent ? JSON.stringify(selectedComponent, null, 2) : '';

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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Eye className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
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
            <aside className="w-72 flex-shrink-0 flex flex-col gap-3 overflow-hidden">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search components…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-border-primary bg-bg-sub text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                {filteredComponents.length} / {allComponents.length} components
              </h3>

              <div className="space-y-2 overflow-y-auto pb-4 pr-1">
                {filteredComponents.length === 0 ? (
                  <p className="text-xs text-text-muted italic py-4 text-center">No results for "{search}"</p>
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
                          'w-full text-left px-3 py-2.5 rounded-xl text-xs md:text-sm btn-press transition-all',
                          'flex flex-col gap-0.5',
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                            : 'card-sub text-text-secondary hover:bg-bg-card',
                        ].join(' ')}
                      >
                        <span className="font-medium truncate">{label}</span>
                        <span className={`text-[11px] truncate ${isActive ? 'text-white/70' : 'text-text-muted'}`}>
                          {typeName}
                          {isFromPrompt ? ` · ${item.prompt.slice(0, 32)}${item.prompt.length > 32 ? '…' : ''}` : ''}
                        </span>
                      </button>
                    );
                  })
                )}
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
                      {getComponentLabel(selectedComponent)}
                    </h3>
                    <p className="text-xs md:text-sm text-text-secondary mt-1 truncate">
                      {selectedComponent.metadata?.description
                        || `${selectedComponent.name || selectedComponent.type} spec`}
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

                    {/* Delete (only if from history) */}
                    {selectedHistoryId && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        title="Remove from history"
                        className="px-3 py-2 rounded-btn text-xs md:text-sm font-medium btn-press transition-all flex items-center gap-1.5 text-red-500 hover:bg-red-50 border border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Content area */}
                <div
                  className="flex-1 flex gap-4 overflow-hidden"
                  style={{ minHeight: '360px' }}
                >
                  {/* Code / JSON pane */}
                  {(viewMode === 'split' || viewMode === 'code') && (() => {
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
                          className={[
                            'rounded-card overflow-auto border border-border-subtle bg-bg-sub flex flex-col',
                            viewMode === 'split' ? 'basis-1/2' : 'flex-1',
                          ].join(' ')}
                        >
                          {/* Toolbar */}
                          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-bg-card border-b border-border-subtle">
                            {/* Tab toggle: JSX / JSON */}
                            <div className="flex items-center gap-1 bg-bg-sub rounded-lg px-0.5 py-0.5">
                              <button
                                onClick={() => setCodeTab('jsx')}
                                className={[
                                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all',
                                  codeTab === 'jsx'
                                    ? 'bg-white text-cyan-600 shadow-sm border border-border-subtle'
                                    : 'text-text-muted hover:text-text-secondary',
                                ].join(' ')}
                              >
                                <Code2 className="w-3 h-3" />
                                JSX
                              </button>
                              <button
                                onClick={() => setCodeTab('json')}
                                className={[
                                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all',
                                  codeTab === 'json'
                                    ? 'bg-white text-cyan-600 shadow-sm border border-border-subtle'
                                    : 'text-text-muted hover:text-text-secondary',
                                ].join(' ')}
                              >
                                <Braces className="w-3 h-3" />
                                JSON
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-text-muted font-mono">{lineCount} lines</span>
                              <button
                                onClick={copyContent}
                                className="text-[11px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
                              >
                                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>
                          {/* Code body */}
                          <pre className="p-4 overflow-x-auto flex-1">
                            {codeTab === 'jsx'
                              ? <JsxHighlight code={jsxCode} />
                              : <JsonHighlight json={jsonString} />}
                          </pre>
                        </div>
                      </CodePaneErrorBoundary>
                    );
                  })()}

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
                        <ComponentRenderer spec={selectedComponent} />
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
