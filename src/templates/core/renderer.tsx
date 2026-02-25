import React from 'react';
import { registry } from './registry';
import type { ComponentSpec } from './types';
import { DataProvider, useData, resolveVariables } from './DataContext';
import { resolveProps, extractAllDataScopes } from './renderUtils';

/**
 * Wrapper that subscribes to DataContext and resolves props reactively.
 */
const ReactiveComponent: React.FC<{
  Component: React.ComponentType<any>;
  staticProps: Record<string, any>;
  renderedChildren: React.ReactNode;
  renderChild: (child: ComponentSpec, childLocalData?: Record<string, any>) => React.ReactNode;
  componentKey?: string;
  localData?: Record<string, any>;
}> = ({ Component, staticProps, renderedChildren, renderChild, componentKey, localData }) => {
  const { data: globalData } = useData();
  const mergedData = localData ? { ...globalData, ...localData } : globalData;
  const resolvedProps = resolveProps(staticProps, mergedData);

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
 * Transparent generator node for mapping arrays to components
 */
const ListMapperNode: React.FC<{ spec: ComponentSpec, localData?: Record<string, any> }> = ({ spec, localData }) => {
  const { data: globalData } = useData();
  const mergedData = localData ? { ...globalData, ...localData } : globalData;
  const componentProps = (spec as any).templateProps || (spec as any).props || {};

  const mapDataPath = componentProps.mapData;
  const itemTemplate = componentProps.itemTemplate;

  // Use resolveVariables to securely pluck the array out of global/local data
  let resolvedArray = resolveVariables(`{${mapDataPath}}`, mergedData);

  // Safely fallback
  if (!Array.isArray(resolvedArray)) {
    if (resolvedArray && typeof resolvedArray === 'object' && resolvedArray !== `{${mapDataPath}}`) {
      // It might be a single object, safely wrap it
      resolvedArray = [resolvedArray];
    } else {
      resolvedArray = [];
    }
  }

  return (
    <>
      {resolvedArray.map((item: any, index: number) => {
        const childLocalData = { ...localData, item, index };
        return <RenderNode key={index} spec={itemTemplate} localData={childLocalData} />;
      })}
    </>
  );
};

/**
 * Universal Component Renderer Node
 */
export const RenderNode: React.FC<{ spec: ComponentSpec, localData?: Record<string, any> }> = ({ spec, localData }) => {
  if (!spec) return null;

  // Safety check: Detect if someone is passing a React element instead of ComponentSpec
  if (spec && typeof spec === 'object' && '$$typeof' in spec) {
    return spec as any;
  }

  const componentProps = (spec as any).templateProps || (spec as any).props || {};

  // Intercept Array Mapping Operations
  if (componentProps.mapData && componentProps.itemTemplate) {
    return <ListMapperNode spec={spec} localData={localData} />;
  }

  // Support both formats: {name, templateProps} and {type, props}
  const componentName = (spec as any).name || (spec as any).type;
  const metadata = (spec as any).metadata;

  // Extract children from props
  const { children: rawChildren, ...propsWithoutChildren } = componentProps;
  const children = rawChildren || (spec as any).children || [];

  // Get component from registry
  const Component = registry.get(componentName);

  if (!Component) {
    const componentNameStr = String(componentName || 'undefined');
    return (
      <div key={metadata?.componentId} className="p-4 border border-red-200 bg-red-50 rounded-xl my-2">
        <p className="text-red-600 font-bold">Unknown Component: {componentNameStr}</p>
      </div>
    );
  }

  // Recursive renderer for children
  const renderedChildren = Array.isArray(children) && children.length > 0
    ? children.map((child, index) => {
      if (child && typeof child === 'object' && '$$typeof' in child) return child;
      const key = child?.metadata?.componentId || `child-${index}`;
      return <RenderNode key={key} spec={child} localData={localData} />;
    })
    : undefined;

  return (
    <ReactiveComponent
      Component={Component}
      staticProps={propsWithoutChildren}
      renderedChildren={renderedChildren}
      renderChild={(child, childLocalData) => (
        <RenderNode spec={child} localData={{ ...localData, ...childLocalData }} />
      )}
      componentKey={metadata?.componentId}
      localData={localData}
    />
  );
};

/**
 * Batch renderer for multiple component specs
 */
export const RenderNodes: React.FC<{ specs: ComponentSpec[], localData?: Record<string, any> }> = ({ specs, localData }) => {
  if (!specs || !Array.isArray(specs)) return null;
  return (
    <>
      {specs.map((spec, index) => (
        <RenderNode key={spec.metadata?.componentId || `node-${index}`} spec={spec} localData={localData} />
      ))}
    </>
  );
};

/**
 * Safe root renderer with error boundary and DataProvider
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

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border-2 border-dashed border-red-300 rounded-3xl bg-red-50 text-red-900">
          <h3 className="text-xl font-bold mb-2">Rendering Error</h3>
          <p className="mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium"
          >
            Retry
          </button>
        </div>
      );
    }

    const globalData = extractAllDataScopes(this.props.spec);

    return (
      <DataProvider initialData={globalData}>
        <RenderNode spec={this.props.spec} />
      </DataProvider>
    );
  }
}

/**
 * Hook for rendering components in functional components
 * Returns a function that returns a JSX Element (properly capitalized)
 */
export const useComponentRenderer = () => {
  return React.useCallback((spec: ComponentSpec) => <RenderNode spec={spec} />, []);
};

// --- Legacy Aliases for Backward Compatibility ---
export const renderComponent = (spec: ComponentSpec) => <RenderNode spec={spec} />;
export const renderComponents = (specs: ComponentSpec[]) => <RenderNodes specs={specs} />;

