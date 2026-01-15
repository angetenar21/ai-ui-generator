import React from 'react';
import { registry } from './registry';
import type { ComponentSpec } from './types';

/**
 * Universal Component Renderer
 *
 * This replaces the switch-case statement pattern with dynamic
 * component lookup from the registry.
 *
 * Before (switch-case):
 * ```
 * switch (type) {
 *   case 'line-chart': return <LineChart />;
 *   case 'bar-chart': return <BarChart />;
 *   // ... 100+ more cases
 * }
 * ```
 *
 * After (registry lookup):
 * ```
 * const Component = registry.get(type);
 * return <Component />;
 * ```
 *
 * Benefits:
 * - No manual switch cases
 * - Auto-discovers new components
 * - Type-safe with proper error handling
 * - Supports recursive rendering for nested components
 */
export const renderComponent = (spec: ComponentSpec): React.ReactNode => {
  // Safety check: Detect if someone is passing a React element instead of ComponentSpec
  if (spec && typeof spec === 'object' && '$$typeof' in spec) {
    console.error('[Renderer] Received a React element instead of ComponentSpec. Returning as-is.');
    return spec as any;
  }

  // Support both formats: {name, templateProps} and {type, props}
  const componentName = (spec as any).name || (spec as any).type;
  const componentProps = (spec as any).templateProps || (spec as any).props || {};

  // Extract children from props and keep other props separate
  const { children: rawChildren, ...propsWithoutChildren } = componentProps;
  const children = rawChildren || (spec as any).children || [];
  const metadata = (spec as any).metadata;

  // Get component from registry (replaces switch-case!)
  const Component = registry.get(componentName);

  // Handle unknown/unregistered components gracefully
  if (!Component) {
    // Safe string conversion for componentName
    const componentNameStr = typeof componentName === 'symbol'
      ? componentName.toString()
      : String(componentName || 'undefined');

    console.warn(`[Renderer] Unknown component type: "${componentNameStr}"`);
    return (
      <div
        key={metadata?.componentId}
        className="glass-dark border border-red-500/30 rounded-2xl p-6 my-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
            <span className="text-red-400 text-lg">⚠️</span>
          </div>
          <div className="flex-1">
            <p className="text-red-400 font-semibold mb-2">
              Unknown Component: <code className="font-mono text-sm">{componentNameStr}</code>
            </p>
            <p className="text-gray-400 text-sm mb-3">
              This component is not registered in the component library.
            </p>
            <details className="mt-3">
              <summary className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                View Component Spec
              </summary>
              <pre className="text-xs mt-2 text-gray-500 overflow-auto bg-black/20 rounded-lg p-3 border border-gray-700">
                {JSON.stringify({ type: componentNameStr, props: propsWithoutChildren, childrenCount: children?.length }, null, 2)}
              </pre>
            </details>
            <div className="mt-4 text-xs text-gray-500">
              <p>Available components: {registry.getNames().length}</p>
              <p className="text-gray-600">
                Registered categories: {registry.getCategories().join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Recursive renderer for children
  const renderChildren = (child: ComponentSpec) => renderComponent(child);

  // Render children array (only if they are valid ComponentSpecs, not already-rendered React elements)
  const renderedChildren = Array.isArray(children) && children.length > 0
    ? children.map((child, index) => {
        // Skip if already a React element
        if (child && typeof child === 'object' && '$$typeof' in child) {
          return child;
        }
        const key = child?.metadata?.componentId || `child-${index}`;
        return <React.Fragment key={key}>{renderChildren(child)}</React.Fragment>;
      })
    : undefined;

  // Render the component with props (WITHOUT raw children array)
  return (
    <Component
      key={metadata?.componentId}
      {...propsWithoutChildren}
      children={renderedChildren}
      renderChild={renderChildren}
    />
  );
};

/**
 * Batch renderer for multiple component specs
 */
export const renderComponents = (specs: ComponentSpec[]): React.ReactNode[] => {
  return specs.map((spec, index) => {
    const key = spec.metadata?.componentId || `component-${index}`;
    return <React.Fragment key={key}>{renderComponent(spec)}</React.Fragment>;
  });
};

/**
 * Safe renderer with error boundary
 */
export class ComponentRenderer extends React.Component<
  { spec: ComponentSpec },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { spec: ComponentSpec }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ComponentRenderer] Error rendering component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const componentName = (this.props.spec as any).name || (this.props.spec as any).type;
      return (
        <div className="glass-dark border border-red-500/30 rounded-2xl p-6 my-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-red-400 text-lg">💥</span>
            </div>
            <div className="flex-1">
              <p className="text-red-400 font-semibold mb-2">Component Error</p>
              <p className="text-gray-400 text-sm mb-3">
                Failed to render component: {componentName}
              </p>
              <details className="mt-3">
                <summary className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
                  View Error Details
                </summary>
                <pre className="text-xs mt-2 text-red-400 overflow-auto bg-black/20 rounded-lg p-3 border border-gray-700">
                  {this.state.error?.message}
                  {'\n\n'}
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return renderComponent(this.props.spec);
  }
}

/**
 * Hook for rendering components in functional components
 */
export const useComponentRenderer = () => {
  return React.useCallback((spec: ComponentSpec) => renderComponent(spec), []);
};
