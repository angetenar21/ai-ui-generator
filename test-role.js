import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const body = {
  contents: [
    { role: "user", parts: [{ text: "What is 2+2?" }] },
    { role: "model", parts: [{ functionCall: { name: "add", args: { a: 2, b: 2 } } }] },
    { role: "function", parts: [{ functionResponse: { name: "add", response: { result: 4 } } }] }
  ],
  tools: [{
    functionDeclarations: [{
      name: "add",
      parameters: { type: "OBJECT", properties: { a: { type: "NUMBER" }, b: { type: "NUMBER" } } }
    }]
  }]
};

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function run() {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
