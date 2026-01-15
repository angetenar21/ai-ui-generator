import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardPaste, RefreshCcw, Play, AlertTriangle } from 'lucide-react';
import ResponsiveComponentWrapper from '../components/ResponsiveComponentWrapper';
import { renderComponent } from '../templates';
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
    setError(null);
    setLastParseAt(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const previewHeader = useMemo(() => {
    if (components.length === 0) {
      return 'Preview';
    }
    if (components.length === 1) {
      return components[0].name || components[0].type || 'Component Preview';
    }
    return `${components.length} Components`;
  }, [components]);

  return (
    <div className="max-w-page mx-auto px-6 pt-8 pb-10 flex flex-col gap-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted mb-2">
          Tester
        </p>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
          JSON Component Tester
        </h1>
        <p className="text-text-secondary max-w-2xl">
          Paste the raw JSON returned by your n8n workflow to preview the rendered components instantly.
          No API calls are made on this page.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <section className="card rounded-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Paste JSON</h2>
              <p className="text-xs text-text-muted">
                Works with both the standard shape and responses wrapped in `parsed`, `response`, or arrays.
              </p>
            </div>
            {lastParseAt && (
              <span className="text-[11px] text-text-muted">
                Last parsed {new Date(lastParseAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <textarea
              className="w-full h-64 p-4 font-mono text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent bg-bg-sub resize-none"
              placeholder='{"name": "stack", "templateProps": { "children": [...] }}'
              value={rawInput}
              onChange={(event) => setRawInput(event.target.value)}
            />

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={parseInput}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white gradient-primary hover:scale-[1.01] active:scale-95 transition-transform"
              >
                <Play className="w-4 h-4" />
                Render
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-text-secondary border border-border-primary bg-white hover:bg-gray-50"
              >
                <RefreshCcw className="w-4 h-4" />
                Clear
              </button>
              <button
                type="button"
                onClick={() =>
                  setRawInput((current) =>
                    current.trim()
                      ? current
                      : JSON.stringify(
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
                          2,
                        ),
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-text-secondary border border-dashed border-border-primary hover:bg-gray-50"
              >
                <ClipboardPaste className="w-4 h-4" />
                Load Example
              </button>
            </div>
          </div>
        </section>

        <section className="card rounded-card p-5 flex flex-col gap-4 min-h-[400px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">{previewHeader}</h2>
            {components.length > 0 && (
              <span className="text-xs text-text-muted">
                Rendering {components.length} component{components.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {components.length === 0 ? (
            <div className="flex-1 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center flex items-center justify-center p-8">
              <div>
                <p className="text-text-secondary mb-2">Nothing to preview yet.</p>
                <p className="text-sm text-text-muted">Paste JSON on the left and click Render to view the result.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="space-y-8">
                {components.map((spec, index) => (
                  <div key={spec.metadata?.componentId ?? `${spec.name ?? spec.type}-${index}`} className="rounded-2xl bg-white/70 p-4 border border-gray-100 shadow-sm">
                    <ResponsiveComponentWrapper>{renderComponent(spec)}</ResponsiveComponentWrapper>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TesterPage;
