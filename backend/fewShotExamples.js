/**
 * fewShotExamples.js
 * 
 * Dynamic Few-Shot Injection for UI Generation Quality.
 * Now supercharged with Vector Embeddings (Rich Man's RAG)!
 */

import fs from 'fs';
import path from 'path';
import Logger from './logger.js';

// ─── INTENT KEYWORD MAP (For Schema Scoping) ──────────────────────────────────
const INTENT_KEYWORDS = {
  form: ['form', 'input', 'contact', 'signup', 'sign up', 'register', 'registration', 'login', 'log in', 'feedback', 'survey', 'questionnaire', 'submit'],
  dashboard: ['dashboard', 'overview', 'analytics', 'metrics', 'kpi', 'stats', 'statistics', 'admin', 'monitor', 'report'],
  chart: ['chart', 'graph', 'line chart', 'bar chart', 'pie chart', 'area chart', 'histogram', 'trend', 'visualization', 'plot'],
  table: ['table', 'data table', 'grid', 'list', 'records', 'rows', 'columns', 'spreadsheet', 'inventory', 'catalogue'],
  modal: ['modal', 'dialog', 'popup', 'confirmation', 'alert dialog', 'drawer', 'overlay'],
  team: ['team', 'member', 'people', 'our team', 'about us', 'staff', 'employee', 'profile card', 'bio', 'person card'],
  landing: ['landing', 'hero', 'homepage', 'marketing', 'product page', 'feature', 'pricing', 'cta', 'call to action'],
  music: ['music', 'player', 'audio', 'song', 'spotify', 'track', 'playlist', 'album', 'now playing'],
  kanban: ['kanban', 'board', 'jira', 'trello', 'drag', 'column'],
  chat: ['chat', 'message', 'conversation', 'social', 'feed', 'wizard']
};

export const INTENT_COMPONENTS = {
  form: ['text-field', 'textarea', 'button', 'panel', 'select', 'checkbox', 'switch', 'stack', 'grid', 'callout'],
  dashboard: ['panel', 'summary-card', 'bar-chart', 'line-chart', 'data-table', 'grid', 'stack', 'badge'],
  chart: ['line-chart', 'bar-chart', 'area-chart', 'pie-chart', 'time-series-chart', 'panel', 'grid', 'summary-card'],
  table: ['data-table', 'panel', 'grid', 'badge', 'chip', 'summary-card', 'select', 'stack'],
  modal: ['modal', 'button', 'text', 'stack', 'callout', 'badge'],
  team: ['summary-card', 'grid', 'stack', 'avatar', 'text', 'badge', 'panel'],
  landing: ['panel', 'grid', 'stack', 'text', 'button', 'image', 'summary-card', 'badge'],
  music: ['panel', 'image', 'text', 'slider', 'button', 'flexbox', 'stack'],
  kanban: ['kanban', 'panel', 'stack', 'badge', 'button', 'flexbox', 'avatar'],
  chat: ['panel', 'avatar', 'text', 'text-field', 'button', 'stack', 'flexbox']
};

export function detectIntent(userMessage) {
  if (!userMessage || typeof userMessage !== 'string') return null;
  const lower = userMessage.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return intent;
  }
  return null;
}

export function getRelevantComponents(userMessage) {
  const intent = detectIntent(userMessage);
  return intent ? INTENT_COMPONENTS[intent] : null;
}


// ─── THE RAG ENGINE (Vector Similarity Search) ───────────────────────────────

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const GOLDEN_DIR = path.join(__dirname, 'golden_dataset');

// In-Memory Vector Database
let vectorDb = null;

// Cosine Similarity Math
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return (normA === 0 || normB === 0) ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Fetch embeddings directly from Gemini REST API
async function fetchEmbedding(text, config) {
  if (!config) return null;
  const { useVertex, currentKey, hasAccessToken, hasApiKey, headers } = config;
  
  let url = '';
  if (useVertex) {
     const PROJECT_ID = process.env.GEMINI_PROJECT_ID;
     const LOCATION = process.env.GEMINI_LOCATION || 'us-central1';
     url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/text-embedding-004:predict`;
  } else {
     url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent`;
     if (!hasAccessToken && hasApiKey) url += `?key=${currentKey}`;
  }

  const payload = useVertex ? { instances: [{ content: text }] } : { model: 'models/text-embedding-004', content: { parts: [{ text }] } };

  try {
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!response.ok) return null;
    const data = await response.json();
    return useVertex ? data.predictions[0].embeddings.values : data.embedding.values;
  } catch (err) {
    Logger.error('[RAG] External Embedding API Call failed', err);
    return null;
  }
}

// Ensure the Vector DB is loaded and embeddings are computed for the JSONs
async function initVectorDb(config) {
  if (vectorDb !== null) return vectorDb; // Singleton Pattern
  vectorDb = [];
  
  if (!fs.existsSync(GOLDEN_DIR)) return vectorDb;
  
  const files = fs.readdirSync(GOLDEN_DIR).filter(f => f.endsWith('.json'));
  Logger.info(`[RAG Engine] Found ${files.length} JSON blueprints. Generating vector embeddings...`);
  
  for (const file of files) {
    const rawContent = fs.readFileSync(path.join(GOLDEN_DIR, file), 'utf-8');
    const cleanName = file.replace('.json', '').replace('_', ' ');
    // Pack the prompt so the embedding model understands context
    const description = `This is a perfect UI layout for a ${cleanName}. It contains ${rawContent.substring(0, 300)}`;
    
    // Attempt real vector embedding
    const embedding = await fetchEmbedding(description, config);
    vectorDb.push({ filename: file, content: rawContent, embedding, cleanName });
  }
  
  const successCount = vectorDb.filter(v => v.embedding).length;
  Logger.info(`[RAG Engine] Successfully armed ${successCount} blueprints into the Vector Space!`);
  return vectorDb;
}

/**
 * Retrieves the single best Golden Example from the dataset by matching
 * the user's prompt mathematically against the available blueprints.
 */
export async function getFewShotForMessage(userMessage, config) {
  const db = await initVectorDb(config);
  if (db.length === 0) return null;

  // Track the absolute best match
  let bestMatch = null;
  let highestScore = -1;

  // 1. Get the embedding "Vector" of the User's Prompt
  const userEmbedding = await fetchEmbedding(userMessage, config);

  if (userEmbedding) {
    // 2. TRUE RAG (Cosine Similarity Search)
    for (const doc of db) {
      if (!doc.embedding) continue;
      const score = cosineSimilarity(userEmbedding, doc.embedding);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = doc;
      }
    }
    Logger.info(`[RAG Engine] Identified nearest vector: ${bestMatch?.filename} (Match Quality: ${Math.round(highestScore * 100)}%)`);
  } else {
    // FALLBACK: If embedding fails, do basic keyword/filename matching
    const lowerMessage = userMessage.toLowerCase();
    for (const doc of db) {
      let score = 0;
      const terms = doc.cleanName.split(' ');
      terms.forEach(t => { if (lowerMessage.includes(t)) score += 10; });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = doc;
      }
    }
    Logger.info(`[RAG Engine] Fallback keyword search hit: ${bestMatch?.filename || 'None'}`);
  }

  // Absolute fallback: if no file matches conceptually, inject the dashboard because it's a deep structure
  if (!bestMatch) bestMatch = db.find(d => d.filename.includes('analytics')) || db[0];

  return `## GOLDEN REPOSITORY BLUEPRINT — ${bestMatch.filename.toUpperCase()}

I searched the production Vector Database and retrieved this exact high-quality JSON as a structural layout blueprint that is mathematically similar to reality.
STUDY this output carefully — it demonstrates perfect component composition, variant selections, spacing, and styling hierarchy.

IDEAL STRUCTURE FOR REFERENCE:
\`\`\`json
${bestMatch.content}
\`\`\`

Apply the SAME architectural layout mechanics, elevation, padding, and data density to your final JSON. Do NOT copy this example contextually. Just mathematically map its UI tree structure.`;
}
