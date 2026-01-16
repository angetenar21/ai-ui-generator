import express from 'express';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import Logger from './logger.js';

// Load environment variables from .env when running locally
// Try multiple locations: backend/.env, project root .env
const __filename = new URL(import.meta.url).pathname;
const __dirname_temp = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname_temp, '.env') }); // Try backend/.env
dotenv.config({ path: path.join(__dirname_temp, '../.env') }); // Try root .env

Logger.info('Backend server initializing...');

const APP_PORT = Number(process.env.BACKEND_PORT || 4000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const schemaPath = path.join(__dirname, 'docs', 'component-library-schema.json');

if (!fs.existsSync(schemaPath)) {
  throw new Error('Component schema not found. Run `npm run generate-schema` first.');
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const components = schema.components || {};
const categories = schema.categories || {};

// Job Queue System
const jobQueue = [];
const jobStore = new Map();
const JOB_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// Job status enum
const JobStatus = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  TIMEOUT: 'timeout'
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
    if (tsType === 'string' || tsType.includes("'")) {
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
      propSchema.type = 'array';
      // For tuples, we can't validate the exact structure easily, so accept any array
      propSchema.items = {};
    }
    // Check if this references an interface (e.g., Column[], Row[])
    else if (tsType.match(/^(\w+)\[\]$/)) {
      const arrayMatch = tsType.match(/^(\w+)\[\]$/);
      const interfaceName = arrayMatch[1];
      propSchema.type = 'array';

      // If we have the interface definition, use it for items schema
      if (interfaces[interfaceName]) {
        propSchema.items = buildInterfaceSchema(interfaceName, interfaces);
      } else {
        propSchema.items = {};
      }
    } else if (tsType.includes('Array<')) {
      // Handle Array<InterfaceName> syntax
      const genericMatch = tsType.match(/Array<(\w+)>/);
      if (genericMatch) {
        const interfaceName = genericMatch[1];
        propSchema.type = 'array';

        if (interfaces[interfaceName]) {
          propSchema.items = buildInterfaceSchema(interfaceName, interfaces);
        } else {
          propSchema.items = {};
        }
      } else {
        propSchema.type = 'array';
        propSchema.items = {};
      }
    } else if (tsType.includes('[]') || propDef.type === 'array') {
      propSchema.type = 'array';
      propSchema.items = {};
    } else if (tsType.includes('{') || propDef.type === 'object') {
      propSchema.type = 'object';
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
  const componentName = spec.name || spec.type || spec.component;

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
      const childSpec = props.children[i];
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
      description: 'Validates a component specification against the schema. Use this BEFORE returning your final response to ensure it will work correctly.',
      parameters: {
        type: 'object',
        properties: {
          spec: {
            type: 'object',
            description: 'The component specification to validate',
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
      const validation = validateSpec(args.spec);
      Logger.info('Validation result', {
        valid: validation.valid,
        errors: validation.errors,
        componentName: args.spec?.name || args.spec?.type || args.spec?.component,
      });

      // Store the spec if validation succeeds for potential fallback
      if (validation.valid && args.spec) {
        // Mark this spec as the last validated one
        args.spec._lastValidated = true;
      }

      return {
        valid: validation.valid,
        errors: validation.errors,
        componentName: args.spec?.name || args.spec?.type || args.spec?.component,
        message: validation.valid ? 'Validation successful. Now return the complete JSON object you just validated.' : undefined,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

async function callGemini(userMessage, context = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    Logger.error('GEMINI_API_KEY is not set');
    throw new Error('GEMINI_API_KEY is required for the backend to talk to Gemini 2.5 Pro.');
  }

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

  // Add user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  const tools = [{
    functionDeclarations: getToolDeclarations(),
  }];

  Logger.geminiRequest(GEMINI_MODEL, userMessage, context);

  // Function calling loop - balanced for reliability and speed
  // Most requests should complete in 3-5 iterations:
  // 1. get_components (optional for modifications)
  // 2. get_component_schema (batch call)
  // 3. validate (once)
  // 4-5. Fix validation errors if needed
  let maxIterations = 15; // Restored to 15 for reliability (allows enough retries)
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;

    const body = {
      contents,
      tools,
      generationConfig: {
        temperature: 0.05, // Very low for consistent, fast modifications
        maxOutputTokens: 6144, // Restored to 6144 for complex components (balance between speed and completeness)
        topP: 0.9, // Slightly more focused
        topK: 20, // Reduced for faster, more deterministic output
      },
    };

    let response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
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
      Logger.geminiError(GEMINI_MODEL, new Error(errorMessage), data);
      throw new Error(`Gemini API error: ${errorMessage}`);
    }

    const candidate = data?.candidates?.[0];
    if (!candidate) {
      Logger.error('Gemini response missing candidate', { fullResponse: data });
      throw new Error('Gemini response missing candidate');
    }

    // Check for malformed function call
    if (candidate.finishReason === 'MALFORMED_FUNCTION_CALL') {
      Logger.warn('Gemini generated malformed function call', {
        finishReason: candidate.finishReason,
        finishMessage: candidate.finishMessage,
        iterationCount: iterations
      });

      // Send error feedback to Gemini to retry
      contents.push({
        role: 'model',
        parts: [{ text: 'ERROR: Malformed function call detected' }]
      });
      contents.push({
        role: 'user',
        parts: [{
          text: 'Your last function call was malformed. Please ensure all property names and string values are properly quoted in JSON format. For example: {"name": "stack", "templateProps": {"content": "text"}}. Try again with correct JSON syntax.'
        }]
      });
      continue; // Try again in next iteration
    }

    // Add model's response to conversation
    contents.push(candidate.content);

    // Check for function calls
    const parts = candidate.content?.parts || [];
    const functionCalls = parts.filter(part => part.functionCall);

    if (functionCalls.length === 0) {
      // No more function calls - extract final text response
      const textPart = parts.find(part => part.text);
      if (!textPart || !textPart.text.trim()) {
        // Check if we have a validated spec as fallback
        if (lastValidatedSpec) {
          Logger.warn('Empty response after validation, using fallback validated spec', {
            componentName: lastValidatedSpec.name,
            iterationCount: iterations
          });
          // Return the validated spec as JSON
          return JSON.stringify(lastValidatedSpec, null, 2);
        }

        Logger.error('No text in final response and no fallback', {
          parts,
          candidateFinishReason: candidate.finishReason,
          safetyRatings: candidate.safetyRatings,
          iterationCount: iterations,
          fullCandidate: JSON.stringify(candidate, null, 2)
        });
        throw new Error('No text in final Gemini response');
      }

      Logger.geminiResponse(GEMINI_MODEL, response, textPart.text);
      return textPart.text;
    }

    // Execute all function calls and add responses
    const functionResponses = [];
    for (const part of functionCalls) {
      const toolCall = part.functionCall;
      const result = executeToolCall(toolCall);

      // Track last validated spec for fallback
      if (toolCall.name === 'validate_component' && result.valid && toolCall.args?.spec) {
        lastValidatedSpec = toolCall.args.spec;
        Logger.info('Stored validated spec as fallback', { componentName: result.componentName });
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

// Wrapper for callGemini with exponential backoff retry
async function callGeminiWithRetry(userMessage, context = '', maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callGemini(userMessage, context);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isOverloaded = errorMessage.toLowerCase().includes('overloaded') ||
        errorMessage.toLowerCase().includes('resource has been exhausted');

      if (isOverloaded && attempt < maxRetries) {
        const backoff = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        Logger.warn(`Gemini overloaded, retry ${attempt}/${maxRetries} in ${backoff}ms`, {
          error: errorMessage,
          nextRetryIn: backoff
        });
        await sleep(backoff);
        continue;
      }

      // If not overloaded or max retries reached, throw the error
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

  // Try direct parse first
  try {
    parsed = JSON.parse(trimmed);
    Logger.debug('Successfully parsed JSON directly');
  } catch (e) {
    Logger.debug('Direct JSON parse failed, trying pattern matching', {
      error: e.message,
    });
  }

  // Try to extract JSON from markdown code blocks
  if (!parsed) {
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*(\{[\s\S]+?\})\s*```/);
    if (codeBlockMatch) {
      try {
        parsed = JSON.parse(codeBlockMatch[1]);
        Logger.debug('Successfully parsed JSON from code block');
      } catch (e) {
        Logger.debug('Code block JSON parse failed', { error: e.message });
      }
    }
  }

  // Try to find JSON object in text
  if (!parsed) {
    const jsonMatch = trimmed.match(/\{[\s\S]+\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
        Logger.debug('Successfully parsed JSON from pattern match');
      } catch (e) {
        Logger.debug('Pattern match JSON parse failed', { error: e.message });
      }
    }
  }

  if (!parsed) {
    Logger.error('Failed to parse JSON from Gemini output', {
      textLength: trimmed.length,
      fullText: trimmed,
    });
    throw new Error('Failed to parse JSON from Gemini output (see logs/backend.log for full text)');
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
  const { jobId, sessionId, message, threadId, context } = job;
  const startTime = Date.now();

  try {
    // Update status to processing
    jobStore.set(jobId, {
      ...jobStore.get(jobId),
      status: JobStatus.PROCESSING,
      startedAt: new Date().toISOString(),
    });

    Logger.jobProcessing(jobId);

    // Build context string
    const contextString = context ? JSON.stringify(context) : '';

    // Call Gemini with function calling and retry logic
    const modelText = await callGeminiWithRetry(message, contextString);
    const spec = extractJsonObject(modelText);

    // Validate spec
    const validation = validateSpec(spec);
    Logger.validation(spec, validation);

    // Save the response to file (regardless of validation result)
    Logger.saveGeminiResponse(jobId, message, modelText, spec, validation);

    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
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

    const duration = Date.now() - startTime;
    Logger.jobCompleted(jobId, duration);
  } catch (error) {
    const duration = Date.now() - startTime;
    Logger.jobFailed(jobId, error, duration);

    jobStore.set(jobId, {
      ...jobStore.get(jobId),
      status: JobStatus.FAILED,
      completedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
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
        job.status === JobStatus.TIMEOUT)) {
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
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
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
app.post('/validate', (req, res) => {
  const spec = req.body?.spec;
  if (!spec) {
    return res.status(400).json({ error: 'Missing spec payload' });
  }
  const result = validateSpec(spec);
  return res.json(result);
});

// Legacy synchronous endpoint - kept for backward compatibility
app.post('/generate', async (req, res) => {
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
app.post('/api/agent', (req, res) => {
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

  // Delete from store
  jobStore.delete(jobId);

  Logger.info(`Job cancelled/deleted: ${jobId}`);

  return res.json({ message: 'Job cancelled successfully' });
});

// GET /health - Surface backend + queue health metadata
app.get('/health', (_, res) => {
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
