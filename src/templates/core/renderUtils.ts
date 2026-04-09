import React from 'react';
import { resolveVariables } from './DataContext';

/**
 * Deep-resolves all string values in a props object using DataContext data.
 */
export function resolveProps(props: Record<string, any>, data: Record<string, any>): Record<string, any> {
  if (!props || typeof props !== 'object') return props;

  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    if (typeof val === 'string' && val.includes('{')) {
      resolved[key] = resolveVariables(val, data);
    } else if (Array.isArray(val)) {
      resolved[key] = val.map(item =>
        item && typeof item === 'object' && !Array.isArray(item) ? resolveProps(item, data) : item
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
 * Recursively scavenges explicit .data blocks and unrecognized Object/Array props 
 * (AI hallucinations) from the entire component tree to hoist them into global memory.
 */
export function extractAllDataScopes(node: any, visited = new WeakSet()): Record<string, any> {
  const mergedData: Record<string, any> = {};

  if (!node || typeof node !== 'object' || node === null) return mergedData;
  if ('$$typeof' in node) return mergedData; // Skip React elements

  // Cycle guard — prevents stack overflows on circular structures
  if (visited.has(node)) return mergedData;
  visited.add(node);

  // 1. Array handling: merge results from all items
  if (Array.isArray(node)) {
    for (const item of node) {
      Object.assign(mergedData, extractAllDataScopes(item, visited));
    }
    return mergedData;
  }

  // 2. Object handling: check for "data" blocks and scan for hallucinations
  const excludedKeys = [
    'name', 'type', 'component', 'templateProps', 'props', 'children',
    'className', 'variant', 'elevation', 'emphasis', 'palette',
    'items', 'options', 'content', 'icon', 'color', 'metadata',
    'componentId', 'instruction', 'ui_component', 'data_source',
    'on_select_action', 'generatedAt', 'description', 'label',
    'placeholder', 'defaultValue', 'value', 'onChange', 'onClick'
  ];

  // First pass: Direct keys of the current node
  for (const [key, value] of Object.entries(node)) {
    // Priority 1: Explicit "data" blocks
    if (key === 'data' && value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(mergedData, value);
    }
    // Priority 2: Unrecognized objects/arrays that look like data (hallucinations)
    else if (!excludedKeys.includes(key) && value && typeof value === 'object' && !('$$typeof' in value)) {
      const isComponent = ('name' in value || 'type' in value || 'templateProps' in value || 'props' in value);

      if (!isComponent) {
        if (!Array.isArray(value)) {
          mergedData[key] = value;
        } else if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && !('name' in value[0]) && !('type' in value[0])) {
          mergedData[key] = value;
        }
      }
    }
  }

  // Second pass: Deep recursion into everything (except excluded top-level structure if possible, but deep nodes need it)
  // We recurse into all objects to find nested data blocks.
  for (const [, value] of Object.entries(node)) {
    if (value && typeof value === 'object' && !('$$typeof' in value)) {
      // Small optimization: don't recurse into things we've already hoisted as flat values, 
      // unless they are structural containers like children/templateProps.
      Object.assign(mergedData, extractAllDataScopes(value, visited));
    }
  }

  return mergedData;
}
