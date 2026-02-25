import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const SYSTEM_PROMPT = fs.readFileSync(
  "backend/prompts/MainPrompt.md",
  "utf8"
);

const userMessage = `Create credit sales & outstanding dashboard for this week. Show daily credit given, collection received, net outstanding change for top 55 credit customers this week.,"This Week Credit Management Dashboard (Feb 2-8 2026)","{}","[{\"type\":\"line_chart\",\"title\":\"Daily Credit Given vs Collected This Week\"},{\"type\":\"table\",\"title\":\"55 Credit Customers Activity This Week\",\"columns\":[\"Customer\",\"Credit Given ₹\",\"Collected ₹\",\"Net Change ₹\"]}]","{\"this_week_credit\":[{\"customer\":\"C014\",\"given\":3200,\"collected\":1800,\"net_change\":1400},{\"customer\":\"C006\",\"given\":2800,\"collected\":2400,\"net_change\":400},{\"customer\":\"C030\",\"given\":4100,\"collected\":3100,\"net_change\":1000},... (52 more realistic credit entries: given ₹800–₹5200, collected 50–100% of given) ...],\"total_rows\":55}"`;

const contents = [
  {
    role: "user",
    parts: [{ text: SYSTEM_PROMPT }]
  },
  {
    role: "model",
    parts: [{ text: "I understand. I will use the tools to discover components, get their schemas, build the JSON response, and validate it before returning." }]
  },
  {
    role: "user",
    parts: [{
      text: `--- USER REQUEST ---\n${userMessage}\n--- END USER REQUEST ---\n\nBased on the request above, please begin by calling the appropriate tools (e.g., get_components, validate_component) to structure your response, or directly output the final valid JSON.`
    }]
  }
];

// Tools array for get_components, get_component_schema, validate_component
const tools = [
  {
    functionDeclarations: [
      {
        name: "get_components",
        description: "Get a list of all available UI components.",
        parameters: { type: "OBJECT", properties: {} }
      }
    ]
  }
];

const body = {
  contents,
  tools,
  toolConfig: { functionCallingConfig: { mode: "AUTO" } },
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 16384,
    topP: 0.85,
    topK: 20
  }
};

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function run() {
  console.log("Calling Gemini API...");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  console.log("Response Status:", res.status);
  console.log(JSON.stringify(data, null, 2));
}

run().catch(console.error);
