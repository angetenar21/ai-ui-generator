import React from 'react';
import { registry } from './registry';
import type { ComponentSpec } from './types';
import { DataProvider, useData, resolveVariables } from './DataContext';

/**
 * Deep-resolves all string values in a props object using DataContext data.
 * Walks arrays and nested objects recursively.
 */
function resolveProps(props: Record<string, any>, data: Record<string, any>): Record<string, any> {
  if (!props || typeof props !== 'object') return props;

  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    if (typeof val === 'string' && val.includes('{')) {
      resolved[key] = resolveVariables(val, data);
    } else if (Array.isArray(val)) {
      resolved[key] = val.map(item =>
        item && typeof item === 'object' ? resolveProps(item, data) : item
      );
    } else if (val && typeof val === 'object' && !React.isValidElement(val)) {
      resolved[key] = resolveProps(val, data);
    } else {
      resolved[key] = val;
    }
  }
  return resolved;
}

/**
 * Wrapper that subscribes to DataContext and resolves props reactively.
 * This is what makes all components respond to Select/input changes.
 */
const ReactiveComponent: React.FC<{
  Component: React.ComponentType<any>;
  staticProps: Record<string, any>;
  renderedChildren: React.ReactNode;
  renderChild: (child: ComponentSpec) => React.ReactNode;
  componentKey?: string;
}> = ({ Component, staticProps, renderedChildren, renderChild, componentKey }) => {
  const { data } = useData();
  const resolvedProps = resolveProps(staticProps, data);

  return (
    <Component
      key={componentKey}
      {...resolvedProps}
      children={renderedChildren}
      renderChild={renderChild}
    />
  );
};

/**
 * Universal Component Renderer
 *
 * Dynamically looks up components from the registry and renders them.
 * All string props are resolved against DataContext, making every component
 * reactive to state changes from Select, TextField, etc.
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
  const metadata = (spec as any).metadata;

  // Extract children from props, keep other props separate
  const { children: rawChildren, ...propsWithoutChildren } = componentProps;
  const children = rawChildren || (spec as any).children || [];

  // Get component from registry
  const Component = registry.get(componentName);

  // Handle unknown/unregistered components gracefully
  if (!Component) {
    const componentNameStr = typeof componentName === 'symbol'
      ? componentName.toString()
      : String(componentName || 'undefined');

    console.warn(`[Renderer] Unknown component type: "${componentNameStr}"`);
    return (
      <div
        key={metadata?.componentId}
        className="card border border-red-300 dark:border-red-700 rounded-2xl p-6 my-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
          </div>
          <div className="flex-1">
            <p className="text-red-700 dark:text-red-400 font-semibold mb-2">
              Unknown Component: <code className="font-mono text-sm">{componentNameStr}</code>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              This component is not registered in the component library.
            </p>
            <details className="mt-3">
              <summary className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                View Component Spec
              </summary>
              <pre className="text-xs mt-2 text-gray-700 dark:text-gray-500 overflow-auto bg-gray-100 dark:bg-black/20 rounded-lg p-3 border border-gray-300 dark:border-gray-700">
                {JSON.stringify({ type: componentNameStr, props: propsWithoutChildren, childrenCount: children?.length }, null, 2)}
              </pre>
            </details>
            <div className="mt-4 text-xs text-gray-600 dark:text-gray-500">
              <p>Available components: {registry.getNames().length}</p>
              <p className="text-gray-700 dark:text-gray-600">
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

  // Render children array
  const renderedChildren = Array.isArray(children) && children.length > 0
    ? children.map((child, index) => {
      if (child && typeof child === 'object' && '$$typeof' in child) {
        return child;
      }
      const key = child?.metadata?.componentId || `child-${index}`;
      return <React.Fragment key={key}>{renderChildren(child)}</React.Fragment>;
    })
    : undefined;

  // Wrap in ReactiveComponent so props are re-resolved whenever DataContext changes
  const reactiveComponent = (
    <ReactiveComponent
      Component={Component}
      staticProps={propsWithoutChildren}
      renderedChildren={renderedChildren}
      renderChild={renderChildren}
      componentKey={metadata?.componentId}
    />
  );

  // If the component has a 'data' property, wrap it in a DataProvider
  if ((spec as any).data) {
    console.log('[Renderer] Wrapping component in DataProvider:', componentName, 'Keys:', Object.keys((spec as any).data));
    return (
      <DataProvider initialData={(spec as any).data}>
        {reactiveComponent}
      </DataProvider>
    );
  }

  return reactiveComponent;
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
        <div className="card border border-red-300 dark:border-red-700 rounded-2xl p-6 my-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 text-lg">💥</span>
            </div>
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-400 font-semibold mb-2">Component Error</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Failed to render component: {componentName}
              </p>
              <details className="mt-3">
                <summary className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                  View Error Details
                </summary>
                <pre className="text-xs mt-2 text-red-700 dark:text-red-400 overflow-auto bg-red-50 dark:bg-black/20 rounded-lg p-3 border border-red-300 dark:border-red-700">
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
