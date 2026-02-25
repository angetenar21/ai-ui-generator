import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const SYSTEM_PROMPT = fs.readFileSync(
  "backend/prompts/MainPrompt.md",
  "utf8"
);

function getToolDeclarations() {
  return [
    {
      name: 'get_components',
      description: 'Returns all available UI components organized by category. Use this to discover what components are available before building your response.',
      parameters: {
        type: 'OBJECT',
        properties: {
          dummy: {
            type: 'STRING',
            description: 'Optional dummy parameter to satisfy OpenAPI requirements for at least one property',
          }
        },
      },
    },
    {
      name: 'get_component_schema',
      description: 'Returns detailed schema (props, types, descriptions) for specific components. Call this to understand what props each component requires.',
      parameters: {
        type: 'OBJECT',
        properties: {
          componentNames: {
            type: 'STRING',
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
        type: 'OBJECT',
        properties: {
          spec: {
            type: 'OBJECT',
            description: 'The complete component specification JSON object to validate. MUST be a valid JSON object matching the component schema.',
            properties: {
              name: {
                type: 'STRING',
                description: 'The name of the component (e.g., "stack", "panel", "line-chart").',
              },
              templateProps: {
                type: 'OBJECT',
                description: 'The properties to configure the component.',
              }
            },
            required: ['name', 'templateProps'],
          },
        },
        required: ['spec'],
      },
    },
  ];
}

const userMessage = "Create credit sales dashboard.";

const contents = [
  {
    role: "user",
    parts: [{ text: `--- USER REQUEST ---\n${userMessage}\n--- END USER REQUEST ---\n\nBased on the request above, please begin by calling the appropriate tools (e.g., get_components, validate_component) to structure your response, or directly output the final valid JSON.` }]
  }
];

const tools = [{ functionDeclarations: getToolDeclarations() }];

const body = {
  systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  contents,
  tools,
  toolConfig: { functionCallingConfig: { mode: "AUTO" } },
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 8192,
    topP: 0.85,
    topK: 20
  }
};

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function run() {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run().catch(console.error);
