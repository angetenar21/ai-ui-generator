/**
 * Format Detector & Parser Router
 *
 * Detects whether an AI-generated response is in JSON format or OpenUI Lang
 * syntax, and routes it to the appropriate parser.
 *
 * Detection heuristic:
 *   - JSON: First non-whitespace char is `{` or `[`
 *   - OpenUI Lang: Contains `=` assignments like `root = Card(...)`
 *   - Markdown-wrapped JSON: Starts with ```json
 */

import type { ComponentSpec } from '../templates/core/types';
import type { ElementNode, ParseResult } from '../lib/openui-lang/parser/types';
import { createParser } from '../lib/openui-lang/parser/parser';

// ─── Format Detection ───────────────────────────────────────────────────

export type DetectedFormat = 'json' | 'openui-lang' | 'unknown';

/**
 * Detect the format of a raw AI response string.
 */
export function detectFormat(text: string): DetectedFormat {
  const trimmed = text.trim();

  // Empty or too short
  if (!trimmed || trimmed.length < 2) return 'unknown';

  // Strip markdown code fences first
  const stripped = trimmed
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```$/m, '')
    .trim();

  // JSON: starts with { or [
  const firstChar = stripped[0];
  if (firstChar === '{' || firstChar === '[') {
    return 'json';
  }

  // OpenUI Lang: has assignment pattern like `identifier = Component(...)`
  // Look for `word = PascalCase(` pattern
  if (/^[a-z_]\w*\s*=\s*[A-Z]/m.test(stripped)) {
    return 'openui-lang';
  }

  // Could also be OpenUI Lang with $state declarations
  if (/^\$\w+\s*=\s*/m.test(stripped)) {
    return 'openui-lang';
  }

  return 'unknown';
}

// ─── JSON Parser ────────────────────────────────────────────────────────

/**
 * Try to extract and parse JSON from a raw response string.
 * Handles markdown code fences and loose JSON.
 */
export function parseJsonResponse(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();

  // Strip markdown code fences
  const jsonStr = trimmed
    .replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, (_, inner) => inner)
    .replace(/```(?:json)?\s*|```/g, '')
    .trim();

  // Try direct parse
  try {
    return JSON.parse(jsonStr);
  } catch {
    // Fall through
  }

  // Try extracting first complete JSON object
  const firstBrace = jsonStr.indexOf('{');
  const lastBrace = jsonStr.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(jsonStr.substring(firstBrace, lastBrace + 1));
    } catch {
      // Fall through
    }
  }

  return null;
}

// ─── OpenUI Lang → ComponentSpec Adapter ────────────────────────────────

/**
 * Convert an OpenUI Lang ElementNode tree into a ComponentSpec tree.
 *
 * ElementNode has:
 *   { type: "element", typeName: string, props: Record, partial: boolean }
 *
 * ComponentSpec has:
 *   { name: string, templateProps: Record, children?: ComponentSpec[] }
 */
export function elementNodeToSpec(node: ElementNode): ComponentSpec {
  const spec: ComponentSpec = {
    name: node.typeName,
    templateProps: { ...node.props },
    metadata: {
      componentId: node.statementId || `${node.typeName}-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      description: `Generated ${node.typeName} via OpenUI Lang`,
    },
  };

  // Recursively convert children
  const children = node.props.children;
  if (Array.isArray(children)) {
    const childSpecs: ComponentSpec[] = [];
    for (const child of children) {
      if (isElementNode(child)) {
        childSpecs.push(elementNodeToSpec(child));
      }
    }
    if (childSpecs.length > 0) {
      spec.children = childSpecs;
      // Remove children from templateProps since they're in spec.children
      const tp = { ...spec.templateProps };
      delete tp.children;
      spec.templateProps = tp;
    }
  }

  return spec;
}

/**
 * Type guard for ElementNode-like objects.
 */
function isElementNode(value: unknown): value is ElementNode {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  return (
    obj.type === 'element' &&
    typeof obj.typeName === 'string' &&
    typeof obj.props === 'object' &&
    obj.props !== null
  );
}

/**
 * Parse OpenUI Lang text and convert to ComponentSpec.
 * Returns null if parsing fails.
 */
export function parseOpenUILang(text: string): ComponentSpec | null {
  try {
    const parser = createParser({});
    const result: ParseResult = parser.parse(text);

    if (!result.root) {
      console.warn('[FormatDetector] OpenUI Lang parsed but no root element');
      return null;
    }

    return elementNodeToSpec(result.root);
  } catch (error) {
    console.error('[FormatDetector] OpenUI Lang parse error:', error);
    return null;
  }
}

// ─── Unified Parse Function ─────────────────────────────────────────────

export interface ParsedResponse {
  format: DetectedFormat;
  spec: ComponentSpec | null;
  raw: string;
  errors?: string[];
}

/**
 * Parse a raw AI response, auto-detecting the format.
 *
 * This is the main entry point for parsing streamed responses.
 * It tries JSON first (most common), falls back to OpenUI Lang,
 * and returns an error spec if both fail.
 */
export function parseResponse(text: string): ParsedResponse {
  const format = detectFormat(text);

  switch (format) {
    case 'json': {
      const parsed = parseJsonResponse(text);
      if (parsed) {
        return {
          format: 'json',
          spec: normalizeRawToSpec(parsed),
          raw: text,
        };
      }
      // JSON detected but parse failed — try OpenUI Lang as fallback
      const langSpec = parseOpenUILang(text);
      if (langSpec) {
        return { format: 'openui-lang', spec: langSpec, raw: text };
      }
      return {
        format: 'json',
        spec: null,
        raw: text,
        errors: ['Detected JSON format but failed to parse'],
      };
    }

    case 'openui-lang': {
      const spec = parseOpenUILang(text);
      if (spec) {
        return { format: 'openui-lang', spec, raw: text };
      }
      // OpenUI Lang detected but parse failed — try JSON as fallback
      const jsonParsed = parseJsonResponse(text);
      if (jsonParsed) {
        return {
          format: 'json',
          spec: normalizeRawToSpec(jsonParsed),
          raw: text,
        };
      }
      return {
        format: 'openui-lang',
        spec: null,
        raw: text,
        errors: ['Detected OpenUI Lang format but failed to parse'],
      };
    }

    default: {
      // Unknown format — try JSON first, then OpenUI Lang
      const jsonParsed = parseJsonResponse(text);
      if (jsonParsed) {
        return { format: 'json', spec: normalizeRawToSpec(jsonParsed), raw: text };
      }
      const langSpec = parseOpenUILang(text);
      if (langSpec) {
        return { format: 'openui-lang', spec: langSpec, raw: text };
      }
      return {
        format: 'unknown',
        spec: null,
        raw: text,
        errors: ['Could not parse response as JSON or OpenUI Lang'],
      };
    }
  }
}

// ─── Helper ─────────────────────────────────────────────────────────────

/**
 * Normalize a raw parsed JSON object into a ComponentSpec.
 * Uses a structurally deterministic `path` to ensure stable component keys across final parse.
 */
function normalizeRawToSpec(data: Record<string, unknown>, path: string = 'root'): ComponentSpec {
  const name = (data.name || data.type) as string | undefined;
  const props = {
    ...(data.props as Record<string, unknown> || {}),
    ...(data.templateProps as Record<string, unknown> || {}),
  };

  const childrenNodes = Array.isArray(data.children)
    ? data.children.filter((c): c is Record<string, unknown> => c != null && typeof c === 'object')
    : undefined;

  return {
    name: name,
    type: name,
    templateProps: props,
    props: props,
    metadata: (data.metadata as ComponentSpec['metadata']) || {
      componentId: `spec-${path}`,
      generatedAt: new Date().toISOString(),
    },
    children: childrenNodes
      ? childrenNodes.map((c, index) => normalizeRawToSpec(c, `${path}.child[${index}]`))
      : undefined,
  };
}
