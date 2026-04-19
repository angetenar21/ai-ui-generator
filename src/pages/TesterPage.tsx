import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardPaste, RefreshCcw, Play, AlertTriangle, Activity } from 'lucide-react';
import ResponsiveComponentWrapper from '../components/ResponsiveComponentWrapper';
import { ComponentRenderer } from '../templates';
import type { ComponentSpec } from '../templates/core/types';

const STORAGE_KEY = 'tester:last-json';

const isComponentSpec = (value: unknown): value is ComponentSpec => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as ComponentSpec;
  const hasModernShape =
    typeof candidate.name === 'string' && candidate.templateProps && typeof candidate.templateProps === 'object';
  const hasLegacyShape =
    typeof candidate.type === 'string' && candidate.props && typeof candidate.props === 'object';

  return Boolean(hasModernShape || hasLegacyShape);
};

const candidateKeys = ['parsed', 'response', 'result', 'component', 'components', 'data', 'payload'];

const extractComponentSpecs = (value: unknown, depth = 0): ComponentSpec[] => {
  if (depth > 5 || value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractComponentSpecs(item, depth + 1));
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return extractComponentSpecs(parsed, depth + 1);
    } catch {
      return [];
    }
  }

  if (typeof value === 'object') {
    if (isComponentSpec(value)) {
      return [value];
    }

    let collected: ComponentSpec[] = [];
    candidateKeys.forEach((key) => {
      if (key in (value as Record<string, unknown>)) {
        collected = collected.concat(
          extractComponentSpecs((value as Record<string, unknown>)[key], depth + 1),
        );
      }
    });
    return collected;
  }

  return [];
};

const TesterPage: React.FC = () => {
  const [rawInput, setRawInput] = useState('');
  const [components, setComponents] = useState<ComponentSpec[]>([]);
  // Stable render keys assigned at parse-time so React always mounts a fresh
  // ComponentRenderer (and its error boundary) whenever specs are re-parsed.
  const [renderKeys, setRenderKeys] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastParseAt, setLastParseAt] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedInput = localStorage.getItem(STORAGE_KEY);
    if (storedInput) {
      setRawInput(storedInput);
      try {
        const storedValue = JSON.parse(storedInput);
        const specs = extractComponentSpecs(storedValue);
        if (specs.length > 0) {
          setComponents(specs);
          setRenderKeys(specs.map((_, i) => `stored-${Date.now()}-${i}`));
        }
      } catch {
        // ignore stored parse failures
      }
    }
  }, []);

  const parseInput = useCallback(() => {
    setError(null);
    setLastParseAt(null);

    if (!rawInput.trim()) {
      setComponents([]);
      setError('Please paste a JSON payload to test.');
      return;
    }

    try {
      const parsed = JSON.parse(rawInput);
      const specs = extractComponentSpecs(parsed);

      if (specs.length === 0) {
        setComponents([]);
        setError('No component specs found. Make sure the JSON includes { "name", "templateProps" } entries.');
        return;
      }

      setComponents(specs);
      // Generate fresh unique keys so React discards any stale error boundaries
      setRenderKeys(specs.map((_, i) => `parse-${Date.now()}-${i}`));
      setLastParseAt(Date.now());

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, rawInput);
      }
    } catch (parseError) {
      setComponents([]);
      setError(parseError instanceof Error ? parseError.message : 'Invalid JSON payload.');
    }
  }, [rawInput]);

  const handleClear = () => {
    setRawInput('');
    setComponents([]);
    setRenderKeys([]);
    setError(null);
    setLastParseAt(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const previewHeader = useMemo(() => {
    if (components.length === 0) {
      return 'Live Preview';
    }
    if (components.length === 1) {
      return components[0].name || components[0].type || 'Component Preview';
    }
    return `${components.length} Components`;
  }, [components]);

  const handleLoadExample = () => {
    const exampleStr = JSON.stringify(
      {
        parsed: {
          name: 'text',
          templateProps: {
            content: 'Paste your JSON here!',
            variant: 'markdown',
          },
        },
      },
      null,
      2
    );
    setRawInput(exampleStr);
    setError(null);
    
    // Automatically parse the example for a better UX
    setTimeout(() => {
      try {
        const parsed = JSON.parse(exampleStr);
        const specs = extractComponentSpecs(parsed);
        if (specs.length > 0) {
          setComponents(specs);
          setLastParseAt(Date.now());
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, exampleStr);
          }
        }
      } catch {
        // Safe fallback
      }
    }, 50);
  };

  return (
    <div className="h-full w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-8 pb-10 flex flex-col gap-6 bg-transparent relative z-10 overflow-y-auto scrollbar-thin">
      <header className="pl-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-stone-900 dark:text-white mb-2 tracking-tight">
          JSON Component Tester
        </h1>
        <p className="text-stone-500 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl">
          Paste the raw JSON returned by your generic payload to preview the rendered components instantly.
          No background API calls are made on this isolated pane.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] animate-fade-in-up flex-1">
        {/* Editor Wrapper */}
        <section className="flex flex-col gap-2 relative min-h-[500px]">
          <div className="bg-white/40 dark:bg-gray-900/40 rounded-[2rem] p-6 h-full border border-stone-200/50 dark:border-gray-800/50 shadow-sm flex flex-col gap-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Payload Editor</h2>
                <p className="text-xs text-stone-500 dark:text-gray-400 mt-0.5 max-w-[280px]">
                  Extracts standard spec entries from deep `parsed` or `response` payloads automatically.
                </p>
              </div>
              {lastParseAt && (
                <span className="text-[11px] font-mono text-stone-400 text-right bg-stone-50 dark:bg-gray-900/50 px-2 py-1 rounded-lg">
                  {new Date(lastParseAt).toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="relative flex-1 group">
                {/* Decorative border glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-b from-orange-500/20 to-pink-500/20 rounded-[1.5rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <textarea
                  className="w-full h-full min-h-[300px] p-5 font-mono text-sm leading-relaxed rounded-[1.5rem] border border-stone-200 dark:border-gray-700 bg-stone-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-900 text-stone-800 dark:text-gray-200 focus:outline-none focus:border-transparent resize-none shadow-inner transition-colors scrollbar-thin relative z-10"
                  placeholder='{"name": "stack", "templateProps": { "children": [...] }}'
                  value={rawInput}
                  onChange={(event) => setRawInput(event.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl p-3 shadow-inner animate-slide-up">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-80" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={parseInput}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 transition-all hover:scale-[1.02] active:scale-95 shadow-md group"
                >
                  <Play className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] fill-current" />
                  Render Canvas
                </button>
                <div className="w-px h-8 bg-stone-200 dark:bg-gray-700 self-center mx-1" />
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-stone-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-stone-200 dark:border-gray-700 hover:bg-stone-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <RefreshCcw className="w-4 h-4 text-stone-400" />
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleLoadExample}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-stone-600 dark:text-gray-300 bg-stone-50 dark:bg-gray-900 border border-dashed border-stone-300 dark:border-gray-600 hover:bg-stone-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ClipboardPaste className="w-4 h-4 text-stone-400" />
                  Example
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Wrapper */}
        <section className="flex flex-col gap-2 min-h-[500px] relative">
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2rem] p-6 h-full border border-stone-200/50 dark:border-gray-800/50 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" /> {previewHeader}
              </h2>
              {components.length > 0 && (
                <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400 dark:text-gray-500 bg-stone-50 dark:bg-gray-800 px-3 py-1 rounded-full border border-stone-100 dark:border-gray-700">
                  {components.length} Rendered
                </span>
              )}
            </div>

            {components.length === 0 ? (
              <div className="flex-1 rounded-[1.5rem] border border-dashed border-stone-200 dark:border-gray-700 bg-stone-50/50 dark:bg-gray-800/30 text-center flex items-center justify-center p-8">
                <div className="max-w-xs">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center border border-stone-200 dark:border-gray-700 shadow-sm opacity-60">
                    <AlertTriangle className="w-6 h-6 text-stone-400" />
                  </div>
                  <p className="text-stone-600 dark:text-gray-300 font-medium mb-1">Nothing to preview yet</p>
                  <p className="text-xs text-stone-400 dark:text-gray-500 leading-relaxed">Paste JSON on the left panel and click Render Canvas to view the UI artifacts immediately.</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                <div className="space-y-6 pb-4">
                  {components.map((spec, index) => (
                    <div key={renderKeys[index] ?? `${spec.name ?? spec.type}-${index}`} className="rounded-[1.5rem] bg-white dark:bg-gray-900 p-6 border border-stone-200/60 dark:border-gray-800 shadow-sm relative group overflow-hidden">
                       <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-stone-50/80 to-transparent dark:from-gray-800/50 pointer-events-none z-0" />
                       <ResponsiveComponentWrapper alignLeft={true}><div className="relative z-10"><ComponentRenderer spec={spec} /></div></ResponsiveComponentWrapper>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TesterPage;
