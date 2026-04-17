import express from 'express';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import Logger from './logger.js';
import { getFewShotForMessage, getRelevantComponents } from './fewShotExamples.js';
import { requireAuth } from './middleware/firebaseAuth.js';
import admin, { db } from './config/firebase-admin.js';

// Load environment variables from .env when running locally
// Try multiple locations: backend/.env, project root .env
const __filename = new URL(import.meta.url).pathname;
const __dirname_temp = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname_temp, '.env') }); // Try backend/.env
dotenv.config({ path: path.join(__dirname_temp, '../.env') }); // Try root .env

Logger.info('Backend server initializing...');

const APP_PORT = Number(process.env.BACKEND_PORT || 4000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
// Convert comma-separated string to array, remove empties, and trim spaces
const rawApiKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
const API_KEYS_POOL = rawApiKeys.split(',').map(k => k.trim()).filter(Boolean);

let currentKeyIndex = 0; // State variable to track the current active key in the pool

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const schemaPath = path.join(__dirname, 'docs', 'component-library-schema.json');

if (!fs.existsSync(schemaPath)) {
  throw new Error('Component schema not found. Run `npm run generate-schema` first.');
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const components = schema.components || {};
const categories = schema.categories || {};
const COMPONENT_ALIASES = {
  'gantt-chart': 'gantt',
  ganttchart: 'gantt',
  'map_ui': 'map-ui',
  'map-ui': 'map-ui',
  map: 'map-ui',
  'weather_ui': 'weather-ui',
  'weather-ui': 'weather-ui',
  weather: 'weather-ui',
};

// Job Queue System
const jobQueue = [];
const jobStore = new Map();
const jobAbortControllers = new Map();
const JOB_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// Job status enum
const JobStatus = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  TIMEOUT: 'timeout',
  CANCELLED: 'cancelled'
};

// Initialize AJV for JSON Schema validation with STRICT type checking
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: true,
  strictTypes: true,
  strictTuples: false,
  allowUnionTypes: true
});
addFormats(ajv);

// Helper function to build schema for an interface
function buildInterfaceSchema(interfaceName, interfaces) {
  const interfaceDef = interfaces[interfaceName];
  if (!interfaceDef) return {};

  const properties = {};
  const required = [];

  for (const [propName, propDef] of Object.entries(interfaceDef)) {
    let propSchema = { description: propDef.description || '' };
    const tsType = propDef.type || '';

    // Determine JSON schema type
    if (tsType.includes('boolean') && tsType.includes("'")) {
      // Handle union types like `boolean | 'sm' | 'md' | 'lg' | 'xl'`
      propSchema = { description: propDef.description || '', anyOf: [{ type: 'boolean' }, { type: 'string' }] };
    } else if (tsType === 'string' || tsType.includes("'")) {
      propSchema.type = 'string';
    } else if (tsType === 'number') {
      propSchema.type = 'number';
    } else if (tsType === 'boolean') {
      propSchema.type = 'boolean';
    } else if (tsType.includes('[]') || tsType.includes('Array')) {
      propSchema.type = 'array';
    } else if (tsType.includes('{')) {
      propSchema.type = 'object';
    }

    properties[propName] = propSchema;

    if (!propDef.optional) {
      required.push(propName);
    }
  }

  return {
    type: 'object',
    properties,
    required,
    additionalProperties: true
  };
}

// Build JSON schemas from component definitions
const componentSchemas = {};
for (const [componentName, componentDef] of Object.entries(components)) {
  const properties = {};
  const required = [];
  const interfaces = componentDef.interfaces || {};

  for (const [propName, propDef] of Object.entries(componentDef.props || {})) {
    // Convert TypeScript types to JSON Schema types
    let propSchema = { description: propDef.description };

    // Prioritize tsType over type field for accuracy
    const tsType = propDef.tsType || '';

    // Check for tuple types like [number, number] or [string, number]
    if (tsType.match(/^\s*\[\s*[^\]]+\s*,\s*[^\]]+\s*\]\s*$/)) {
      propSchema.anyOf = [
        { type: 'array', items: {} },
        { type: 'string' }
      ];
    }
    // Check if this references an interface (e.g., Column[], Row[])
    else if (tsType.match(/^(\w+)\[\]$/)) {
      const arrayMatch = tsType.match(/^(\w+)\[\]$/);
      const interfaceName = arrayMatch[1];

      let itemsSchema = {};
      if (interfaces[interfaceName]) {
        itemsSchema = buildInterfaceSchema(interfaceName, interfaces);
      }

      propSchema.anyOf = [
        { type: 'array', items: itemsSchema },
        { type: 'string' }
      ];
    } else if (tsType.includes('Array<')) {
      // Handle Array<InterfaceName> syntax
      const genericMatch = tsType.match(/Array<(\w+)>/);
      if (genericMatch) {
        const interfaceName = genericMatch[1];
        let itemsSchema = {};
        if (interfaces[interfaceName]) {
          itemsSchema = buildInterfaceSchema(interfaceName, interfaces);
        }
        propSchema.anyOf = [
          { type: 'array', items: itemsSchema },
          { type: 'string' }
        ];
      } else {
        propSchema.anyOf = [
          { type: 'array', items: {} },
          { type: 'string' }
        ];
      }
    } else if (tsType.includes('{') || propDef.type === 'object') {
      // Check for object types BEFORE checking for arrays
      // This prevents object types with nested arrays (like { data: string[] })
      // from being incorrectly classified as arrays
      propSchema.type = 'object';
    } else if (tsType.includes('[]') || propDef.type === 'array') {
      propSchema.anyOf = [
        { type: 'array', items: {} },
        { type: 'string' }
      ];
    } else if (tsType.includes('boolean') && tsType.includes("'")) {
      // Handle union types like `boolean | 'sm' | 'md' | 'lg' | 'xl'`
      // Allow both boolean and string values
      propSchema = { description: propDef.description, anyOf: [{ type: 'boolean' }, { type: 'string' }] };
    } else if (tsType.includes("'") && !tsType.includes('Array') && !tsType.includes('[]')) {
      // If tsType contains single quotes (string literal union types like 'text' | 'email'), treat as string
      propSchema.type = 'string';
    } else if (propDef.type === 'number') {
      propSchema.type = 'number';
    } else if (propDef.type === 'boolean') {
      propSchema.type = 'boolean';
    } else if (propDef.type === 'string' && !tsType.includes('Array') && !tsType.includes('[]')) {
      // Only set string type if tsType doesn't indicate array/object
      propSchema.type = 'string';
    } else {
      // For complex types, don't set type (allows any)
      propSchema = { description: propDef.description };
    }

    properties[propName] = propSchema;

    if (propDef.required) {
      required.push(propName);
    }
  }

  componentSchemas[componentName] = {
    type: 'object',
    properties,
    required,
    additionalProperties: true // Allow extra props for flexibility
  };
}

function validateSpec(spec) {
  const errors = [];

  if (!spec || typeof spec !== 'object') {
    return { valid: false, errors: ['Spec must be an object'] };
  }

  // Extract component name - accept both "name", "type", and "component"
  const componentNameRaw = spec.name || spec.type || spec.component;
  const componentName = COMPONENT_ALIASES[componentNameRaw] || componentNameRaw;

  if (typeof componentName !== 'string') {
    errors.push('Component name is required (must have "name", "type", or "component" field)');
    return { valid: false, errors };
  }

  const component = components[componentName];
  if (!component) {
    errors.push(`Unknown component: ${componentName}`);
    return { valid: false, errors };
  }

  // Extract props - accept both "templateProps" and "props"
  const props = spec.templateProps || spec.props || {};

  // Validate using JSON Schema if available
  const schema = componentSchemas[componentName];
  if (schema) {
    const validate = ajv.compile(schema);
    const valid = validate(props);

    if (!valid && validate.errors) {
      for (const error of validate.errors) {
        const path = error.instancePath ? `${error.instancePath.slice(1)}` : 'root';
        errors.push(`${componentName}.${path}: ${error.message}`);
      }
    }
  }

  // Recursively validate children
  if (props.children && Array.isArray(props.children)) {
    for (let i = 0; i < props.children.length; i++) {
      const childSpec = normalizeSpec(props.children[i]);
      props.children[i] = childSpec; // Update in-place to keep healed version
      const childValidation = validateSpec(childSpec);
      if (!childValidation.valid) {
        errors.push(...childValidation.errors.map(err => `children[${i}]: ${err}`));
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Wraps raw/naked JSON data that lacks a component name into a default UI component.
 */
function autoHealSpec(spec) {
  if (!spec || typeof spec !== 'object' || spec === null) return spec;

  // If it already has identifying fields, no need to heal
  const name = spec.name || spec.type || spec.component;
  if (name) return spec;

  // Naked JSON detected. If it has ANY properties, wrap it.
  const keys = Object.keys(spec);
  if (keys.length > 0) {
    Logger.info('[Auto-Heal] Naked JSON detected, wrapping in Callout', { keys: keys.slice(0, 5) });

    // Create a descriptive message based on available fields if possible
    const taskTitle = spec.task || spec.intent || spec.title || 'Project Data';
    const content = `I've analyzed your request and generated the following data structure. Since the AI returned raw JSON without a UI container, I've automatically wrapped it in this preview for you.`;

    return {
      name: 'callout',
      data: spec, // Put original data in root 'data' for scavenging
      templateProps: {
        title: `Raw Data Detected: ${taskTitle}`,
        content: content,
        tone: 'info',
        variant: 'elevated',
        emphasis: 'medium'
      },
      metadata: {
        componentId: 'auto-healed-' + Date.now(),
        generatedAt: new Date().toISOString(),
        autoHealed: true,
        originalKeys: keys
      }
    };
  }

  return spec;
}

function normalizeSpec(spec) {
  if (!spec || typeof spec !== 'object') return spec;

  // Auto-heal if possible
  const healed = autoHealSpec(spec);
  const normalized = { ...healed };
  const name = normalized.name || normalized.type || normalized.component;
  if (name && COMPONENT_ALIASES[name]) {
    normalized.name = COMPONENT_ALIASES[name];
  }

  const resolvedName = normalized.name || normalized.type || normalized.component;

  // Fallback builders for common requested-but-missing components
  if (!components[resolvedName]) {
    // Map UI fallback → image with map styling
    if (resolvedName && resolvedName.toLowerCase().includes('map')) {
      return {
        name: 'image',
        templateProps: {
          alt: 'Map visualization',
          caption: 'Interactive map view placeholder',
          src: 'https://via.placeholder.com/800x600/1F2937/9CA3AF?text=Map+Visualization',
        },
      };
    }

    // Weather UI fallback → panel with quick stats
    if (resolvedName && resolvedName.toLowerCase().includes('weather')) {
      return {
        name: 'panel',
        templateProps: {
          title: 'Weather Overview',
          variant: 'gradient',
          elevation: 'raised',
          emphasis: 'medium',
          children: [
            {
              name: 'stack',
              templateProps: {
                direction: 'vertical',
                spacing: 'medium',
                children: [
                  {
                    name: 'text',
                    templateProps: {
                      content: 'Current conditions: 72°F, Partly Cloudy',
                      variant: 'body'
                    }
                  },
                  {
                    name: 'grid',
                    templateProps: {
                      columns: { xs: 2, sm: 2, md: 4 },
                      gap: 'small',
                      children: [
                        { name: 'summary-card', templateProps: { title: 'Humidity', items: [{ label: 'Value', value: '48%' }], elevation: 'raised', variant: 'accent' } },
                        { name: 'summary-card', templateProps: { title: 'Wind', items: [{ label: 'Speed', value: '9 mph' }], elevation: 'raised', variant: 'info' } },
                        { name: 'summary-card', templateProps: { title: 'Precip', items: [{ label: 'Chance', value: '10%' }], elevation: 'raised', variant: 'success' } },
                        { name: 'summary-card', templateProps: { title: 'Visibility', items: [{ label: 'Range', value: '9 mi' }], elevation: 'raised', variant: 'neutral' } }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      };
    }
  }

  const props = normalized.templateProps || normalized.props;
  if (props && typeof props === 'object') {
    const clonedProps = { ...props };
    if (normalized.templateProps) normalized.templateProps = clonedProps;
    if (normalized.props) normalized.props = clonedProps;
    const p = clonedProps;

    // Normalize select options/items when provided as strings
    if (normalized.name === 'select') {
      if (Array.isArray(p.options)) {
        p.options = p.options.map(opt =>
          typeof opt === 'string' ? { label: opt, value: opt } : opt
        );
      }
      if (Array.isArray(p.items)) {
        p.items = p.items.map(opt =>
          typeof opt === 'string' ? { label: opt, value: opt } : opt
        );
      }
    }

    // Add fallback description for insight-card when missing
    if (normalized.name === 'insight-card' && !p.description) {
      p.description = p.summary || p.title || 'Insight details unavailable';
    }

    // Recursively normalize children
    if (Array.isArray(p.children)) {
      p.children = p.children.map(child => normalizeSpec(child));
    }
  }

  return normalized;
}

function formatToolDefinitions() {
  return [
    {
      name: 'get_components',
      description: 'Returns available component names grouped by category.',
      response: categories,
    },
    {
      name: 'get_component_schema',
      description: 'Returns prop schemas for a specific component.',
      response: components,
    },
  ];
}

function serializeSpec(spec) {
  try {
    return JSON.stringify(spec, null, 2);
  } catch {
    return String(spec);
  }
}

// Load system prompt from MainPrompt.md
const SYSTEM_PROMPT = fs.readFileSync(
  path.join(__dirname, 'prompts', 'MainPrompt.md'),
  'utf-8'
);

// Define tools for Gemini function calling
function getToolDeclarations() {
  return [
    {
      name: 'get_components',
      description: 'Returns all available UI components organized by category. Use this to discover what components are available before building your response.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'get_component_schema',
      description: 'Returns detailed schema (props, types, descriptions) for specific components. Call this to understand what props each component requires.',
      parameters: {
        type: 'object',
        properties: {
          componentNames: {
            type: 'string',
            description: 'Comma-separated list of component names to get schemas for (e.g., "line-chart, summary-card")',
          },
        },
        required: ['componentNames'],
      },
    },
    {
      name: 'validate_component',
      description: 'Validates a component specification against the JSON schema. Use this to ensure your JSON is correct before returning it.',
      parameters: {
        type: 'object',
        properties: {
          spec: {
            type: 'object',
            description: 'The complete component specification JSON object to validate.',
          },
        },
        required: ['spec'],
      },
    },
  ];
}

// ==========================================
// Helper Functions
// ==========================================

// Sleep utility for exponential backoff retry
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// Tool Execution Functions
// ==========================================

// Execute tool calls
function executeToolCall(toolCall) {
  const { name, args } = toolCall;

  Logger.info(`Tool called: ${name}`, args);

  switch (name) {
    case 'get_components':
      return { categories };

    case 'get_component_schema': {
      const names = args.componentNames
        .split(',')
        .map(n => n.trim())
        .filter(Boolean);

      const schemas = {};
      for (const name of names) {
        if (components[name]) {
          schemas[name] = components[name];
        }
      }
      return schemas;
    }

    case 'validate_component': {
      const normalizedSpec = normalizeSpec(args.spec);
      const validation = validateSpec(normalizedSpec);
      Logger.info('Validation result', {
        valid: validation.valid,
        errors: validation.errors,
        componentName: normalizedSpec?.name || normalizedSpec?.type || normalizedSpec?.component,
      });

      // Store the spec if validation succeeds for potential fallback
      if (validation.valid && normalizedSpec) {
        // Mark this spec as the last validated one
        normalizedSpec._lastValidated = true;
      }

      return {
        valid: validation.valid,
        errors: validation.errors,
        componentName: normalizedSpec?.name || normalizedSpec?.type || normalizedSpec?.component,
        message: validation.valid
          ? 'SUCCESS! Validation passed. Now you MUST return the complete JSON object in your next response. Return ONLY the JSON - no markdown code blocks, no explanations, no text. Just the raw JSON object starting with { and ending with }. '
          : `Validation failed with ${validation.errors.length} error(s): ${validation.errors.join('; ')}. Fix ALL errors and call validate_component again.`,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

function buildGeminiRequestConfig() {
  const currentKey = API_KEYS_POOL[currentKeyIndex];
  const hasApiKey = Boolean(currentKey);

  if (!hasApiKey) {
    Logger.error('No Gemini API key provided');
    throw new Error('Gemini API key is required. Set GEMINI_API_KEY (or comma-separated GEMINI_API_KEYS) in .env.');
  }

  const headers = { 'Content-Type': 'application/json' };
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${currentKey}`;

  return { endpoint, headers, hasApiKey, currentKey };
}

// ─── IMPROVEMENT 3: Output Quality Scorer ────────────────────────────────────
/**
 * Analyzes a raw JSON string (Gemini's final text output) for visual quality issues.
 * Returns an array of issue strings. Empty array = quality pass.
 */
function scoreOutputSpec(rawText) {
  const issues = [];

  // Try to extract JSON from the text
  let spec;
  try {
    const match = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/(\{[\s\S]*\})/);
    const jsonStr = match ? match[1] : rawText;
    spec = JSON.parse(jsonStr);
  } catch {
    // Can't parse — skip scoring so we don't block valid outputs
    return [];
  }

  if (!spec || typeof spec !== 'object') return [];

  const rawStr = JSON.stringify(spec);

  // Check 1: Does the output have at least one gradient or accent variant?
  const hasRichVariant = rawStr.includes('"gradient"') || rawStr.includes('"accent"');
  if (!hasRichVariant) {
    // Disabled rigid check as valid UIs (like pure data grids) might not need gradients
    // issues.push('No gradient or accent variant found. The main container must use variant: "gradient" or variant: "accent" — not plain "default".');
  }

  // Check 2: Does the output have at least one elevated surface?
  const hasElevation = rawStr.includes('"floating"') || rawStr.includes('"raised"');
  if (!hasElevation) {
    // Disabled rigid check as some flat designs are valid
    // issues.push('No elevation found. At least one panel or card must use elevation: "floating" or elevation: "raised".');
  }

  // Check 3: Is every panel using variant "default" (all-same = boring)?
  const variantDefaultCount = (rawStr.match(/"default"/g) || []).length;
  const variantTotalCount = (rawStr.match(/"variant"/g) || []).length;
  if (variantTotalCount > 2 && variantDefaultCount === variantTotalCount) {
    // Reduced severity: we rely on strong LLM prompting instead of strict rejection algorithms
    // issues.push('All containers are using variant: "default". Vary the styling — use gradient, accent, or elevated variants for visual hierarchy.');
  }

  return issues;
}

async function callGemini(userMessage, context = '', signal) {
  const config = buildGeminiRequestConfig();

  let { endpoint, headers } = config;

  // Track the last validated spec as a fallback
  let lastValidatedSpec = null;

  // Build conversation history
  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }],
    },
    {
      role: 'model',
      parts: [{ text: 'I understand. I will use the tools to discover components, get their schemas, build the JSON response, and validate it before returning.' }],
    },
  ];

  // Add context if provided
  if (context) {
    contents.push({
      role: 'user',
      parts: [{ text: `Context: ${context}` }],
    });
  }

  // ── IMPROVEMENT 1: Dynamic Few-Shot Injection ────────────────────────────
  // Inject a golden example before the user message so Gemini has a concrete
  // pattern to follow, not just abstract rules.
  const fewShotPrompt = await getFewShotForMessage(userMessage, config);
  if (fewShotPrompt) {
    contents.push({
      role: 'user',
      parts: [{ text: fewShotPrompt }],
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Understood. I have studied this golden example and will apply the same quality: gradient hero, varied variants, proper elevation hierarchy, and visual contrast. I will NOT copy the example literally but follow its design standard.' }],
    });
    Logger.info('[FewShot] Injected golden example for intent', { intent: userMessage.substring(0, 60) });
  }

  // ── IMPROVEMENT 2: Component-Scoped Retrieval ────────────────────────────
  // Pre-load relevant component schemas based on detected intent so Gemini
  // has focused context without wasting token budget on irrelevant components.
  const relevantComponentNames = getRelevantComponents(userMessage);
  if (relevantComponentNames && relevantComponentNames.length > 0) {
    const scopedSchemas = {};
    for (const name of relevantComponentNames) {
      if (components[name]) scopedSchemas[name] = components[name];
    }
    if (Object.keys(scopedSchemas).length > 0) {
      contents.push({
        role: 'user',
        parts: [{ text: `## PRE-LOADED COMPONENT SCHEMAS\n\nI have pre-loaded the schemas for the components most likely needed for this request:\n\n${JSON.stringify(scopedSchemas, null, 2)}\n\nYou may call get_component_schema for any additional components you need.` }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Thank you. I have the component schemas. I will use these along with any additional schemas I need.' }],
      });
      Logger.info('[ScopedRetrieval] Pre-loaded schemas', { components: relevantComponentNames });
    }
  }

  // Add user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  const tools = [{
    functionDeclarations: getToolDeclarations(),
  }];

  // Configure tool calling mode to ensure proper function calling
  const toolConfig = {
    functionCallingConfig: {
      mode: 'AUTO', // Let model decide when to use functions
    },
  };

  Logger.geminiRequest(GEMINI_MODEL, userMessage, context);

  // Function calling loop - balanced for reliability and speed
  // Most requests should complete in 3-5 iterations:
  // 1. get_components (optional for modifications)
  // 2. get_component_schema (batch call)
  // 3. validate (once)
  // 4-5. Fix validation errors if needed
  // Complex layouts with sidebars, toggles, and multiple sections may need more iterations
  let maxIterations = 16; // Increased for complex layouts with sidebars and nested components
  let iterations = 0;
  let delay = 1000;
  let emptyResponseRetries = 0;
  const MAX_EMPTY_RESPONSE_RETRIES = 2;

  Logger.info(`Starting Gemini tool-calling loop (maxIterations: ${maxIterations})`);

  while (iterations < maxIterations) {
    iterations++;

    const body = {
      contents,
      tools,
      toolConfig,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 16384,
        topP: 0.85,
        topK: 20,
        // gemini-2.5-* models spend output budget on hidden "thinking" tokens by default,
        // which can return `parts: []` with finishReason=MAX_TOKENS. Disable thinking so the
        // full budget goes to actual output / tool calls.
        thinkingConfig: { thinkingBudget: 0 },
      },
    };

    let response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal,
      });
    } catch (err) {
      Logger.error('Network error while calling Gemini', { error: err?.message ?? err });
      throw new Error('Network error while calling Gemini');
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text().catch(() => '<unreadable body>');
      Logger.error('Failed to parse JSON response from Gemini', {
        status: response.status,
        bodyText: text,
      });
      throw new Error(`Invalid JSON response from Gemini (status ${response.status})`);
    }

    if (!response.ok) {
      const errorMessage = data?.error?.message || `HTTP ${response.status}`;
      const errorObj = data?.error || {};
      Logger.geminiError(GEMINI_MODEL, new Error(errorMessage), data);

      // Handle key exhaustion/rotation
      if (
        errorObj.code === 429 &&
        errorObj.status === 'RESOURCE_EXHAUSTED' &&
        API_KEYS_POOL.length > 1 &&
        config.hasApiKey
      ) {
        if (!config.keyRotationsThisRequest) config.keyRotationsThisRequest = 0;

        if (config.keyRotationsThisRequest < API_KEYS_POOL.length) {
          // Depletion happens across keys when pooling, quickly swap to next!
          currentKeyIndex = (currentKeyIndex + 1) % API_KEYS_POOL.length;
          Logger.warn(`API Key depleted/rate limited! Rotating to key index ${currentKeyIndex}/${API_KEYS_POOL.length - 1} and retrying...`);

          // Re-build config so the endpoint picks up the new currentKeyIndex
          const oldRotations = config.keyRotationsThisRequest;
          const nextConfig = buildGeminiRequestConfig();
          nextConfig.keyRotationsThisRequest = oldRotations + 1;
          endpoint = nextConfig.endpoint;
          headers = nextConfig.headers;
          Object.assign(config, nextConfig);

          // Reset delay so we don't punish UX for back-end rotation
          delay = 1000;
          continue;
        } else {
          Logger.error('All API keys in the pool are depleted!');
        }
      }

      // Check for API key issues
      if (response.status === 400 && errorMessage.includes('API key')) {
        throw new Error(`Gemini API key error: ${errorMessage}. Please check your GEMINI_API_KEY in .env file.`);
      }

      // Check for quota/rate limit issues
      if (response.status === 429) {
        throw new Error(`Gemini API rate limit exceeded. Please try again later.`);
      }

      throw new Error(`Gemini API error: ${errorMessage}`);
    }

    const candidate = data?.candidates?.[0];
    if (!candidate) {
      Logger.error('Gemini response missing candidate', { fullResponse: data });

      // Check if content was blocked by safety filters
      if (data?.promptFeedback?.blockReason) {
        throw new Error(`Content blocked by safety filters: ${data.promptFeedback.blockReason}. Please rephrase your request.`);
      }

      throw new Error('Gemini response missing candidate');
    }

    // Check for blocked content
    if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
      Logger.warn('Content blocked by Gemini safety filters', {
        finishReason: candidate.finishReason,
        safetyRatings: candidate.safetyRatings
      });
      throw new Error(`Content blocked: ${candidate.finishReason}. Please rephrase your request to avoid triggering safety filters.`);
    }

    // Check for malformed function call
    if (candidate.finishReason === 'MALFORMED_FUNCTION_CALL') {
      Logger.warn('Gemini generated malformed function call', {
        finishReason: candidate.finishReason,
        finishMessage: candidate.finishMessage,
        iterationCount: iterations
      });

      // Check if it's trying to use Python syntax
      const isPythonSyntax = candidate.finishMessage && (
        candidate.finishMessage.includes('print(') ||
        candidate.finishMessage.includes('default_api.') ||
        candidate.finishMessage.includes('spec =') ||
        candidate.finishMessage.includes('def ') ||
        candidate.finishMessage.includes('import ')
      );

      // Send specific error feedback to Gemini to retry with correct format
      contents.push({
        role: 'model',
        parts: [{ text: 'MALFORMED_FUNCTION_CALL' }]
      });
      contents.push({
        role: 'user',
        parts: [{
          text: isPythonSyntax
            ? `CRITICAL ERROR: You are using Python code syntax which is COMPLETELY WRONG.

THIS IS NOT A PYTHON ENVIRONMENT. You must use the native Gemini function calling interface.

❌ WRONG SYNTAX (Python):
❌ print(default_api.validate_component(spec = {...}))
❌ spec = {"name": "stack", ...}
❌ result = default_api.get_component_schema(...)
❌ Any Python code: import, def, print, etc.

✅ CORRECT SYNTAX (Gemini function calling):
Request functions by name in the function call section. Do NOT write code.

The system will automatically execute the tool and return the result.

RESUME YOUR RESPONSE using the correct function calling format. Do NOT repeat this error.`
            : `ERROR: Malformed function call detected at iteration ${iterations}.

The function declaration is not properly formatted. Ensure:
- All JSON is properly formatted with double quotes
- No trailing commas
- Proper nesting of objects and arrays
- No Python syntax (print, def, import, etc.)
- Use only the native function calling interface

RESTART and use the correct format for function calls.`
        }]
      });
      continue; // Try again in next iteration
    }

    // Check for function calls
    const parts = candidate.content?.parts || [];
    const functionCalls = parts.filter(part => part.functionCall);

    const isCompletelyEmptyText = parts.length === 1 && parts[0].text && !parts[0].text.trim();

    if (parts.length === 0 || isCompletelyEmptyText) {
      emptyResponseRetries++;
      Logger.warn('Gemini returned an empty response. Prompting for retry.', {
        iterationCount: iterations,
        isCompletelyEmptyText,
        emptyResponseRetries,
        finishReason: candidate.finishReason,
        finishMessage: candidate.finishMessage,
        usageMetadata: data?.usageMetadata,
      });

      // If thinking/output exhausted the token budget, retrying won't help — abort fast.
      if (candidate.finishReason === 'MAX_TOKENS') {
        if (lastValidatedSpec) return JSON.stringify(lastValidatedSpec, null, 2);
        throw new Error(
          `Gemini hit MAX_TOKENS with no usable output. ` +
          `Thinking tokens: ${data?.usageMetadata?.thoughtsTokenCount ?? 'n/a'}, ` +
          `candidates tokens: ${data?.usageMetadata?.candidatesTokenCount ?? 'n/a'}. ` +
          `Either increase maxOutputTokens or lower thinkingBudget.`
        );
      }

      if (emptyResponseRetries > MAX_EMPTY_RESPONSE_RETRIES) {
        if (lastValidatedSpec) {
          Logger.warn('Too many empty responses, returning last validated spec', {
            emptyResponseRetries,
          });
          return JSON.stringify(lastValidatedSpec, null, 2);
        }
        throw new Error(`Gemini returned empty responses ${emptyResponseRetries} times in a row. Aborting to avoid burning API quota.`);
      }

      // CRITICAL: Do NOT push candidate.content to contents if it's completely empty.
      // Doing so breaks Gemini's chat history constraints and locks it in an empty-response loop.
      contents.push({
        role: 'user',
        parts: [{
          text: 'Your last response was completely empty. You MUST either call a function (validate_component, get_components, get_component_schema) or return the final JSON component.'
        }]
      });
      continue;
    }

    // Add model's valid response to conversation
    contents.push(candidate.content);

    if (functionCalls.length === 0) {
      // No more function calls - extract final text response
      const textPart = parts.find(part => part.text);

      if (!textPart || !textPart.text.trim()) {
        Logger.error('Gemini Candidate has NO function calls and NO text parts', {
          candidateContent: JSON.stringify(candidate.content, null, 2),
          allParts: JSON.stringify(parts, null, 2)
        });

        // Check if we have a validated spec as fallback
        if (lastValidatedSpec) {
          Logger.warn('Empty response after validation, using fallback validated spec', {
            componentName: lastValidatedSpec.name,
            iterationCount: iterations
          });
          // Return the validated spec as JSON
          return JSON.stringify(lastValidatedSpec, null, 2);
        }

        // Prompt Gemini one more time to return the JSON if we reached here unexpectedly
        Logger.warn('Empty text response unexpectedly reached, prompting Gemini to return JSON', {
          iterationCount: iterations
        });

        contents.push({
          role: 'user',
          parts: [{
            text: 'You must now return the complete JSON object. Do not use any function calls. Return only the JSON object you validated earlier, nothing else.'
          }]
        });
        continue; // Try again
      }

      // Check if the response is conversational (no JSON artifact)
      if (!textPart.text.includes('{') && lastValidatedSpec) {
        Logger.warn('Gemini returned conversational text instead of JSON. Falling back to lastValidatedSpec.', {
          text: textPart.text,
          iterationCount: iterations
        });
        return JSON.stringify(lastValidatedSpec, null, 2);
      }

      Logger.geminiResponse(GEMINI_MODEL, response, textPart.text);

      // ── IMPROVEMENT 3: Output Scoring / Auto-Feedback ──────────────────────
      // Before returning, check if the output meets visual quality standards.
      // If not, give Gemini one correction chance.
      const qualityIssues = scoreOutputSpec(textPart.text);
      if (qualityIssues.length > 0 && iterations < maxIterations) {
        Logger.warn('[OutputScore] Quality issues detected, requesting correction', { issues: qualityIssues });
        contents.push(candidate.content);
        contents.push({
          role: 'user',
          parts: [{
            text: `QUALITY CHECK FAILED. The output has visual hierarchy problems:\n\n${qualityIssues.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nFix ALL of these issues and return the corrected JSON. Remember:\n- Use variant: "gradient" or variant: "accent" on the main container (NOT variant: "default")
- Add elevation: "floating" or elevation: "raised" to panels\n- Ensure the submit/primary button is fullWidth: true for forms\n- Use spacing: "large" on the root stack`
          }]
        });
        continue; // Let Gemini fix it in one more iteration
      }

      return textPart.text;
    }

    // Execute all function calls and add responses
    const functionResponses = [];
    for (const part of functionCalls) {
      const toolCall = part.functionCall;
      const result = executeToolCall(toolCall);

      // Track last validated spec for fallback
      if (toolCall.name === 'validate_component' && result.valid && toolCall.args?.spec) {
        lastValidatedSpec = normalizeSpec(toolCall.args.spec);
        Logger.info('Stored validated spec as fallback', { componentName: lastValidatedSpec?.name || result.componentName });
      }

      functionResponses.push({
        functionResponse: {
          name: toolCall.name,
          response: { result },
        },
      });
    }

    // Add function responses to conversation
    contents.push({
      role: 'user',
      parts: functionResponses,
    });
  }

  Logger.error('Max iterations reached', {
    maxIterations,
    conversationLength: contents.length,
    lastFewMessages: contents.slice(-3).map(c => ({
      role: c.role,
      partTypes: c.parts?.map(p => Object.keys(p)[0])
    }))
  });
  throw new Error(`Max iterations (${maxIterations}) reached in function calling loop`);
}

/**
 * Attempts to repair a truncated JSON string by closing open braces and brackets.
 * Uses a simple stack-based approach and handles being inside a string.
 */
function repairTruncatedJson(str) {
  if (!str || typeof str !== 'string') return str;

  let stack = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char === '{' ? '}' : ']');
      } else if (char === '}' || char === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === char) {
          stack.pop();
        }
      }
    }
  }

  let repaired = str;

  // If we ended mid-string, close the string first
  if (inString) {
    repaired += '"';
  }

  // Close all open structures in reverse order
  if (stack.length > 0) {
    const closing = stack.reverse().join('');
    Logger.info(`[JSON-Repair] Attempting to close ${stack.length} open structures: ${closing}`);
    repaired += closing;
  }

  return repaired;
}

// Wrapper for callGemini with exponential backoff retry
async function callGeminiWithRetry(userMessage, context = '', maxRetries = 3, signal) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callGemini(userMessage, context, signal);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (signal?.aborted) {
        throw error;
      }
      const isRetryable =
        errorMessage.toLowerCase().includes('overloaded') ||
        errorMessage.toLowerCase().includes('resource has been exhausted') ||
        errorMessage.toLowerCase().includes('rate limit') ||
        errorMessage.toLowerCase().includes('temporarily unavailable');

      if (isRetryable && attempt < maxRetries) {
        const backoff = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        Logger.warn(`Gemini API temporary issue, retry ${attempt}/${maxRetries} in ${backoff}ms`, {
          error: errorMessage,
          nextRetryIn: backoff
        });
        await sleep(backoff);
        continue;
      }

      // If not retryable or max retries reached, throw the error
      throw error;
    }
  }
}

function extractJsonObject(text) {
  const trimmed = text.trim();

  Logger.debug('Attempting to extract JSON from Gemini output', {
    textLength: trimmed.length,
    textPreview: trimmed.substring(0, 500),
  });

  let parsed = null;

  // Strip any leading function-call wrappers such as
  // "validate_component(spec = {...})" or "print(default_api.validate_component(...))"
  // so we can attempt a clean JSON parse first.
  function stripFunctionWrapper(str) {
    const s = String(str);
    const firstBrace = s.indexOf('{');
    const lastBrace = s.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return s.substring(firstBrace, lastBrace + 1);
    }
    return s;
  }

  // Sanitize common non-JSON artifacts to improve parse robustness
  function fixJsonString(str) {
    let s = String(str);
    // Remove Markdown code fences
    s = s.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, (m, inner) => inner);
    s = s.replace(/```(?:json)?\s*|```/g, '');
    // Replace Python-style booleans and None
    s = s.replace(/\bTrue\b/g, 'true');
    s = s.replace(/\bFalse\b/g, 'false');
    s = s.replace(/\bNone\b/g, 'null');
    // Remove trailing commas before closing braces/brackets
    s = s.replace(/,\s*(?=[}\]])/g, '');
    return s.trim();
  }

  const preprocessed = stripFunctionWrapper(trimmed);

  // Try direct parse first
  try {
    parsed = JSON.parse(preprocessed);
    Logger.debug('Successfully parsed JSON directly');
  } catch (e) {
    Logger.debug('Direct JSON parse failed, trying pattern matching', {
      error: e.message,
    });
    // Try sanitizing and parsing again
    try {
      const sanitized = fixJsonString(preprocessed);
      parsed = JSON.parse(sanitized);
      Logger.debug('Successfully parsed JSON after sanitizing input (direct)');
    } catch (e2) {
      Logger.debug('Sanitized direct JSON parse failed', { error: e2.message });
    }
  }

  // Try to extract JSON from markdown code blocks (greedy match for nested objects)
  if (!parsed) {
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      const jsonContent = codeBlockMatch[1].trim();
      try {
        parsed = JSON.parse(jsonContent);
        Logger.debug('Successfully parsed JSON from code block');
      } catch (e) {
        Logger.debug('Code block JSON parse failed', { error: e.message });
        // Try sanitizing and parsing again
        try {
          const sanitized = fixJsonString(jsonContent);
          parsed = JSON.parse(sanitized);
          Logger.debug('Successfully parsed JSON from sanitized code block');
        } catch (e2) {
          Logger.debug('Sanitized code block JSON parse failed', { error: e2.message });
        }
      }
    }
  }

  // Try to find JSON object in text - find matching braces using a stack
  if (!parsed) {
    const firstBrace = trimmed.indexOf('{');
    if (firstBrace !== -1) {
      let depth = 0;
      let inString = false;
      let escapeNext = false;
      let endBrace = -1;

      for (let i = firstBrace; i < trimmed.length; i++) {
        const char = trimmed[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === '\\') {
          escapeNext = true;
          continue;
        }

        if (char === '"') {
          inString = !inString;
          continue;
        }

        if (inString) continue;

        if (char === '{') {
          depth++;
        } else if (char === '}') {
          depth--;
          if (depth === 0) {
            endBrace = i;
            break;
          }
        }
      }

      if (endBrace !== -1) {
        const jsonContent = trimmed.substring(firstBrace, endBrace + 1);
        try {
          parsed = JSON.parse(jsonContent);
          Logger.debug('Successfully parsed JSON from balanced brace extraction');
        } catch (e) {
          Logger.debug('Balanced brace extraction JSON parse failed', {
            error: e.message,
            extractedLength: jsonContent.length
          });
          // Try sanitizing and parsing again
          try {
            const sanitized = fixJsonString(jsonContent);
            parsed = JSON.parse(sanitized);
            Logger.debug('Successfully parsed JSON from sanitized balanced brace extraction');
          } catch (e2) {
            Logger.debug('Sanitized balanced brace JSON parse failed', { error: e2.message });
          }
        }
      }
    }
  }

  // Fallback: try to find the last complete JSON object
  if (!parsed) {
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonContent = trimmed.substring(firstBrace, lastBrace + 1);
      try {
        parsed = JSON.parse(jsonContent);
        Logger.debug('Successfully parsed JSON from simple brace extraction (fallback)');
      } catch (e) {
        Logger.debug('Simple brace extraction JSON parse failed', { error: e.message });
        // Try sanitizing and parsing again
        try {
          const sanitized = fixJsonString(jsonContent);
          parsed = JSON.parse(sanitized);
          Logger.debug('Successfully parsed JSON from sanitized simple brace extraction');
        } catch (e2) {
          Logger.debug('Sanitized simple brace JSON parse failed', { error: e2.message });
        }
      }
    }
  }

  // LAST RESORT: Try to repair truncated JSON
  if (!parsed && (trimmed.includes('{') || trimmed.includes('['))) {
    try {
      Logger.debug('Attempting to repair potentially truncated JSON');
      const repaired = repairTruncatedJson(fixJsonString(preprocessed));
      parsed = JSON.parse(repaired);
      Logger.info('Successfully parsed JSON after performing truncation repair');
    } catch (e) {
      Logger.debug('JSON repair failed', { error: e.message });
    }
  }

  if (!parsed) {
    Logger.error('Failed to parse JSON from Gemini output', {
      textLength: trimmed.length,
      fullText: trimmed,
      startsWithBrace: trimmed.startsWith('{'),
      endsWithBrace: trimmed.endsWith('}'),
    });

    // Provide helpful error message based on what we detected
    let errorMsg = 'Failed to parse JSON from Gemini output';
    if (!trimmed.includes('{')) {
      errorMsg += ' - Response contains no JSON object. Gemini may have returned only text or refused the request.';
    } else if (!trimmed.includes('}')) {
      errorMsg += ' - Response appears to have incomplete JSON (missing closing brace).';
    } else {
      errorMsg += ' - Response contains malformed JSON. See logs/backend.log for full text.';
    }

    throw new Error(errorMsg);
  }

  // Unwrap if wrapped in "components" array
  if (parsed.components && Array.isArray(parsed.components) && parsed.components.length > 0) {
    Logger.debug('Unwrapping component from "components" array');
    parsed = parsed.components[0];
  }

  return parsed;
}

// No longer needed - using MainPrompt.md and function calling

// Worker process for handling queued jobs
let isWorkerRunning = false;

async function processJob(job) {
  const { jobId, sessionId, userId, message, threadId, context } = job;
  const startTime = Date.now();
  const MAX_JOB_DURATION = 5 * 60 * 1000; // 5 minutes timeout

  try {
    const existing = jobStore.get(jobId);
    if (!existing) {
      return;
    }
    if (existing.status === JobStatus.CANCELLED) {
      return;
    }

    // Update status to processing
    jobStore.set(jobId, {
      ...existing,
      status: JobStatus.PROCESSING,
      startedAt: new Date().toISOString(),
    });

    Logger.jobProcessing(jobId);

    const controller = new AbortController();
    jobAbortControllers.set(jobId, controller);

    // Build context string
    const contextString = context ? JSON.stringify(context) : '';

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Job timed out after ${MAX_JOB_DURATION / 1000} seconds`));
      }, MAX_JOB_DURATION);
    });

    // Race between job completion and timeout
    let modelText;
    let spec;
    let validation;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;
    let currentPrompt = message;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;

      modelText = await Promise.race([
        callGeminiWithRetry(currentPrompt, contextString, 3, controller.signal),
        timeoutPromise
      ]);

      if (controller.signal.aborted) {
        throw new Error('Job cancelled');
      }

      spec = normalizeSpec(extractJsonObject(modelText));

      // Validate spec
      validation = validateSpec(spec);
      Logger.validation(spec, validation);

      // Save the response to file (regardless of validation result)
      Logger.saveGeminiResponse(`${jobId}-attempt-${attempts}`, currentPrompt, modelText, spec, validation);

      if (validation.valid) {
        break;
      }

      Logger.warn(`Self-healing attempt ${attempts} for job ${jobId} due to validation errors`, {
        errors: validation.errors
      });

      // Prepare correction prompt for next attempt
      currentPrompt = `SYSTEM: The JSON you previously generated failed schema validation with the following errors. 
Please fix them and return ONLY the corrected, full component JSON. 

ERRORS:
${validation.errors.map(err => `- ${err}`).join('\n')}

REQUIRED FIX: Ensure all properties match the component library schema perfectly.
ORIGINAL USER REQUEST: ${message}`;
    }

    if (!validation.valid) {
      throw new Error(`Validation failed after ${MAX_ATTEMPTS} attempts: ${validation.errors.join(', ')}`);
    }

    // Update job with result
    jobStore.set(jobId, {
      ...jobStore.get(jobId),
      status: JobStatus.COMPLETED,
      completedAt: new Date().toISOString(),
      result: {
        spec,
        validation,
        raw: modelText,
        toolDefinitions: formatToolDefinitions(),
        serializedSpec: serializeSpec(spec),
        sessionId,
        threadId,
      },
    });

    if (db && userId) {
      try {
        await db.collection('components').add({
          jobId,
          userId,
          prompt: message,
          code: serializeSpec(spec),
          spec: JSON.stringify(spec),
          threadId: threadId || jobId,
          status: 'completed',
          timestamp: Date.now(),
          isPublic: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        Logger.info(`Saved generation ${jobId} to Firestore for user ${userId}`);
      } catch (dbErr) {
        Logger.error(`Failed to save generation to Firestore: ${dbErr.message}`);
      }
    }

    const duration = Date.now() - startTime;
    Logger.jobCompleted(jobId, duration);
  } catch (error) {
    const duration = Date.now() - startTime;
    Logger.jobFailed(jobId, error, duration);

    jobStore.set(jobId, {
      ...jobStore.get(jobId),
      status: error instanceof Error && error.message === 'Job cancelled' ? JobStatus.CANCELLED : JobStatus.FAILED,
      completedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  } finally {
    jobAbortControllers.delete(jobId);
  }
}

async function worker() {
  if (isWorkerRunning) return;

  isWorkerRunning = true;
  Logger.info('Worker process started');

  while (true) {
    if (jobQueue.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Optimized to 50ms for faster job pickup
      continue;
    }

    const job = jobQueue.shift();
    if (!job) continue;

    await processJob(job);
  }
}

// Job cleanup - remove old completed/failed jobs
function cleanupOldJobs() {
  const now = Date.now();
  let cleaned = 0;

  for (const [jobId, job] of jobStore.entries()) {
    const createdAt = new Date(job.createdAt).getTime();
    const age = now - createdAt;

    if (age > JOB_TIMEOUT_MS &&
      (job.status === JobStatus.COMPLETED ||
        job.status === JobStatus.FAILED ||
        job.status === JobStatus.TIMEOUT ||
        job.status === JobStatus.CANCELLED)) {
      jobStore.delete(jobId);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    Logger.info(`Cleanup: Removed ${cleaned} old jobs`);
  }
}

function buildQueueStats() {
  const stats = {
    queueLength: jobQueue.length,
    totalJobs: jobStore.size,
    jobs: {
      queued: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      timeout: 0,
      cancelled: 0,
    },
  };

  for (const job of jobStore.values()) {
    if (typeof stats.jobs[job.status] === 'number') {
      stats.jobs[job.status]++;
    }
  }

  return stats;
}

function buildHealthPayload() {
  const queue = buildQueueStats();
  const pendingJobs = queue.jobs.queued + queue.jobs.processing;

  return {
    status: isWorkerRunning ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    worker: {
      running: isWorkerRunning,
      pendingJobs,
      queueLength: queue.queueLength,
    },
    queue,
    environment: {
      port: APP_PORT,
      model: GEMINI_MODEL,
      jobTimeoutMs: JOB_TIMEOUT_MS,
    },
    schema: {
      hasSchema: Object.keys(components).length > 0,
      components: Object.keys(components).length,
      categories: Object.keys(categories).length,
    },
  };
}

const app = express();
app.use(express.json({ limit: '1mb' }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Legacy endpoint - kept for backward compatibility
app.get('/tools', (_, res) => {
  res.json(formatToolDefinitions());
});

// Legacy endpoint - kept for backward compatibility
app.post('/validate', requireAuth, (req, res) => {
  const spec = req.body?.spec;
  if (!spec) {
    return res.status(400).json({ error: 'Missing spec payload' });
  }
  const result = validateSpec(spec);
  return res.json(result);
});

// Legacy synchronous endpoint - kept for backward compatibility
app.post('/generate', requireAuth, async (req, res) => {
  const { prompt, context = '' } = req.body ?? {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt string is required' });
  }

  try {
    const modelText = await callGeminiWithRetry(prompt, context);
    const spec = extractJsonObject(modelText);
    const validation = validateSpec(spec);
    if (!validation.valid) {
      return res.status(422).json({ validation, raw: modelText });
    }

    return res.json({
      spec,
      validation,
      raw: modelText,
      toolDefinitions: formatToolDefinitions(),
      serializedSpec: serializeSpec(spec),
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
});

// NEW ASYNC API ENDPOINTS

// POST /api/agent - Enqueue a new job
app.post('/api/agent', requireAuth, (req, res) => {
  const { sessionId, message, threadId, context } = req.body ?? {};

  // Validate required fields
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  // Create job
  const jobId = randomUUID();
  const job = {
    jobId,
    sessionId,
    userId: req.user.uid,
    message,
    threadId: threadId || null,
    context: context || null,
    status: JobStatus.QUEUED,
    createdAt: new Date().toISOString(),
  };

  // Store and queue job
  jobStore.set(jobId, job);
  jobQueue.push(job);

  Logger.jobEnqueued(jobId, sessionId, message);
  Logger.debug(`Queue length: ${jobQueue.length}`);

  // Return 202 Accepted with jobId
  return res.status(202).json({
    jobId,
    status: JobStatus.QUEUED,
    message: 'Job queued successfully',
  });
});

// GET /api/agent/:jobId - Get job status and result
app.get('/api/agent/:jobId', (req, res) => {
  const { jobId } = req.params;

  const job = jobStore.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Build response based on status
  const response = {
    jobId: job.jobId,
    status: job.status,
    createdAt: job.createdAt,
  };

  if (job.status === JobStatus.PROCESSING) {
    response.startedAt = job.startedAt;
  }

  if (job.status === JobStatus.COMPLETED) {
    response.completedAt = job.completedAt;
    response.result = job.result;

    // Debug logging to verify spec is an object
    Logger.debug('Returning job result', {
      jobId,
      specType: typeof job.result.spec,
      specIsObject: typeof job.result.spec === 'object',
      specHasName: job.result.spec?.name || job.result.spec?.type,
    });
  }

  if (job.status === JobStatus.FAILED || job.status === JobStatus.TIMEOUT) {
    response.completedAt = job.completedAt;
    response.error = job.error;
  }

  return res.json(response);
});

// DELETE /api/agent/:jobId - Cancel/delete a job
app.delete('/api/agent/:jobId', (req, res) => {
  const { jobId } = req.params;

  const job = jobStore.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Remove from queue if still queued
  const queueIndex = jobQueue.findIndex(j => j.jobId === jobId);
  if (queueIndex !== -1) {
    jobQueue.splice(queueIndex, 1);
  }

  // Mark as cancelled and abort in-flight processing if needed
  jobStore.set(jobId, {
    ...job,
    status: JobStatus.CANCELLED,
    completedAt: new Date().toISOString(),
    error: 'Job cancelled',
  });

  const controller = jobAbortControllers.get(jobId);
  if (controller) {
    controller.abort();
    jobAbortControllers.delete(jobId);
  }

  Logger.info(`Job cancelled/deleted: ${jobId}`);

  return res.json({ message: 'Job cancelled successfully' });
});

// GET /api/health - Surface backend + queue health metadata
app.get('/api/health', (_, res) => {
  try {
    return res.json(buildHealthPayload());
  } catch (error) {
    Logger.error('Failed to build health payload', { error: error.message });
    return res.status(500).json({
      status: 'error',
      message: 'Unable to compute health payload',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/queue/status - Get queue statistics
app.get('/api/queue/status', (_, res) => {
  return res.json(buildQueueStats());
});

// For local development and VM production, start server with app.listen()
// For Vercel serverless, export the app (check VERCEL env var specifically)
if (!process.env.VERCEL) {
  app.listen(APP_PORT, () => {
    Logger.info(`Backend server running on http://localhost:${APP_PORT}`);
    Logger.info('API Endpoints:', {
      endpoints: [
        'POST /api/agent - Enqueue new job',
        'GET /api/agent/:jobId - Get job status',
        'GET /api/queue/status - Queue statistics',
      ]
    });

    console.log(`Backend server running on http://localhost:${APP_PORT}`);
    console.log(`API Endpoints:`);
    console.log(`  POST /api/agent - Enqueue new job`);
    console.log(`  GET  /api/agent/:jobId - Get job status`);
    console.log(`  GET  /api/queue/status - Queue statistics`);
    console.log(`\nLogs are being written to: logs/backend.log`);

    // Start worker process
    worker().catch(err => {
      Logger.error('Worker fatal error', { error: err.message, stack: err.stack });
      process.exit(1);
    });

    // Start cleanup interval
    setInterval(cleanupOldJobs, CLEANUP_INTERVAL_MS);
  });
} else {
  // Serverless mode (Vercel only)
  // WARNING: Background workers don't work in serverless!
  Logger.warn('Running in serverless mode - background worker and intervals are not supported');
  Logger.info('Background job processing will NOT work. Consider migrating to Vercel Cron or external queue.');
}

// Export for Vercel serverless
export default app;
