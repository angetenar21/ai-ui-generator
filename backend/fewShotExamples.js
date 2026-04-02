/**
 * fewShotExamples.js
 * 
 * Dynamic Few-Shot Injection for UI Generation Quality.
 * 
 * Provides golden prompt→output examples for each UI category, and
 * an intent classifier that selects the best example to inject into
 * the Gemini call before the user's message.
 */

// ─── INTENT KEYWORD MAP ────────────────────────────────────────────────────────
const INTENT_KEYWORDS = {
  form: ['form', 'input', 'contact', 'signup', 'sign up', 'register', 'registration', 'login', 'log in', 'feedback', 'survey', 'questionnaire', 'submit'],
  dashboard: ['dashboard', 'overview', 'analytics', 'metrics', 'kpi', 'stats', 'statistics', 'admin', 'monitor', 'report'],
  chart: ['chart', 'graph', 'line chart', 'bar chart', 'pie chart', 'area chart', 'histogram', 'trend', 'visualization', 'plot'],
  table: ['table', 'data table', 'grid', 'list', 'records', 'rows', 'columns', 'spreadsheet', 'inventory', 'catalogue'],
  modal: ['modal', 'dialog', 'popup', 'confirmation', 'alert dialog', 'drawer', 'overlay'],
  landing: ['landing', 'hero', 'homepage', 'marketing', 'product page', 'feature', 'pricing', 'cta', 'call to action'],
};

// ─── COMPONENT SCOPE MAP ──────────────────────────────────────────────────────
// Used by component-scoped retrieval to pre-load relevant schemas
export const INTENT_COMPONENTS = {
  form: ['text-field', 'textarea', 'button', 'panel', 'select', 'checkbox', 'switch', 'stack', 'grid', 'callout'],
  dashboard: ['panel', 'stat-card', 'summary-card', 'bar-chart', 'line-chart', 'data-table', 'grid', 'stack', 'badge'],
  chart: ['line-chart', 'bar-chart', 'area-chart', 'pie-chart', 'time-series-chart', 'panel', 'grid', 'stat-card'],
  table: ['data-table', 'panel', 'grid', 'badge', 'chip', 'stat-card', 'select', 'stack'],
  modal: ['modal', 'button', 'text', 'stack', 'callout', 'badge'],
  landing: ['panel', 'grid', 'stack', 'text', 'button', 'image', 'summary-card', 'badge'],
};

// ─── GOLDEN EXAMPLES ──────────────────────────────────────────────────────────

const FEW_SHOT_EXAMPLES = {

  // ── FORM ─────────────────────────────────────────────────────────────────────
  form: {
    userPrompt: 'Create a contact form with name, email, subject, and message fields.',
    idealOutput: `{
  "name": "stack",
  "templateProps": {
    "direction": "vertical",
    "spacing": "large",
    "children": [
      {
        "name": "panel",
        "templateProps": {
          "title": "Contact Us",
          "variant": "gradient",
          "elevation": "floating",
          "emphasis": "high",
          "children": [
            {
              "name": "stack",
              "templateProps": {
                "direction": "vertical",
                "spacing": "medium",
                "children": [
                  {
                    "name": "text",
                    "templateProps": {
                      "variant": "body",
                      "content": "We'd love to hear from you. Fill in the form and we'll get back within 24 hours.",
                      "align": "center"
                    }
                  },
                  {
                    "name": "grid",
                    "templateProps": {
                      "columns": { "xs": 1, "sm": 2 },
                      "gap": "medium",
                      "children": [
                        {
                          "name": "text-field",
                          "templateProps": {
                            "label": "Full Name",
                            "placeholder": "Enter your full name",
                            "required": true
                          }
                        },
                        {
                          "name": "text-field",
                          "templateProps": {
                            "label": "Email Address",
                            "placeholder": "you@example.com",
                            "type": "email",
                            "required": true
                          }
                        }
                      ]
                    }
                  },
                  {
                    "name": "text-field",
                    "templateProps": {
                      "label": "Subject",
                      "placeholder": "What is this about?",
                      "required": true
                    }
                  },
                  {
                    "name": "textarea",
                    "templateProps": {
                      "label": "Message",
                      "placeholder": "Enter your message here...",
                      "rows": 5,
                      "required": true
                    }
                  },
                  {
                    "name": "button",
                    "templateProps": {
                      "label": "Send Message",
                      "variant": "primary",
                      "size": "large",
                      "fullWidth": true
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}`,
  },

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  dashboard: {
    userPrompt: 'Create a sales analytics dashboard with KPI cards, a revenue chart, and a data table.',
    idealOutput: `{
  "name": "stack",
  "templateProps": {
    "spacing": "large",
    "children": [
      {
        "name": "panel",
        "templateProps": {
          "title": "Sales Analytics",
          "variant": "gradient",
          "elevation": "floating",
          "emphasis": "high",
          "children": [
            {
              "name": "text",
              "templateProps": {
                "variant": "body",
                "content": "Real-time overview of your sales performance.",
                "align": "center"
              }
            }
          ]
        }
      },
      {
        "name": "grid",
        "templateProps": {
          "columns": { "xs": 1, "sm": 2, "md": 4 },
          "gap": "medium",
          "children": [
            { "name": "stat-card", "templateProps": { "label": "Total Revenue", "value": "$128,450", "trend": "+12%", "variant": "accent", "elevation": "floating" } },
            { "name": "stat-card", "templateProps": { "label": "Active Orders", "value": "1,284", "trend": "+5%", "variant": "elevated", "elevation": "raised" } },
            { "name": "stat-card", "templateProps": { "label": "Avg. Order", "value": "$99.80", "trend": "-2%", "variant": "elevated", "elevation": "raised" } },
            { "name": "stat-card", "templateProps": { "label": "Conversion", "value": "3.4%", "trend": "+0.6%", "variant": "elevated", "elevation": "raised" } }
          ]
        }
      },
      {
        "name": "panel",
        "templateProps": {
          "title": "Revenue Trend",
          "variant": "elevated",
          "elevation": "raised",
          "emphasis": "medium",
          "headerVariant": "minimal",
          "children": [
            {
              "name": "bar-chart",
              "templateProps": {
                "palette": "vibrant",
                "height": 320,
                "xAxis": { "data": ["Jan","Feb","Mar","Apr","May","Jun"] },
                "series": [{ "name": "Revenue", "data": [42000, 55000, 48000, 71000, 92000, 128450] }]
              }
            }
          ]
        }
      },
      {
        "name": "data-table",
        "templateProps": {
          "title": "Recent Orders",
          "searchable": true,
          "sortable": true,
          "columns": ["Order ID", "Customer", "Amount", "Status"],
          "rows": [
            ["#1042", "Alice Johnson", "$340", { "type": "badge", "label": "Completed", "color": "green" }],
            ["#1041", "Bob Smith", "$125", { "type": "badge", "label": "Pending", "color": "yellow" }],
            ["#1040", "Carol White", "$890", { "type": "badge", "label": "Completed", "color": "green" }]
          ]
        }
      }
    ]
  }
}`,
  },

  // ── CHART ────────────────────────────────────────────────────────────────────
  chart: {
    userPrompt: 'Create a line chart showing monthly website traffic over the year.',
    idealOutput: `{
  "name": "panel",
  "templateProps": {
    "title": "Monthly Website Traffic",
    "variant": "elevated",
    "elevation": "raised",
    "emphasis": "medium",
    "headerVariant": "minimal",
    "children": [
      {
        "name": "line-chart",
        "templateProps": {
          "palette": "gradient",
          "height": 380,
          "xAxis": { "data": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
          "series": [
            { "name": "Visitors", "data": [12400, 15800, 14200, 19600, 22300, 28100, 31500, 29800, 25400, 27900, 33200, 38700] }
          ]
        }
      }
    ]
  }
}`,
  },

  // ── TABLE ────────────────────────────────────────────────────────────────────
  table: {
    userPrompt: 'Create a user management table with columns for name, email, role, and status.',
    idealOutput: `{
  "name": "stack",
  "templateProps": {
    "spacing": "large",
    "children": [
      {
        "name": "grid",
        "templateProps": {
          "columns": { "xs": 1, "sm": 3 },
          "gap": "medium",
          "children": [
            { "name": "stat-card", "templateProps": { "label": "Total Users", "value": "2,481", "variant": "accent", "elevation": "floating" } },
            { "name": "stat-card", "templateProps": { "label": "Active", "value": "2,104", "variant": "elevated", "elevation": "raised" } },
            { "name": "stat-card", "templateProps": { "label": "Admins", "value": "12", "variant": "elevated", "elevation": "raised" } }
          ]
        }
      },
      {
        "name": "data-table",
        "templateProps": {
          "title": "User Management",
          "searchable": true,
          "sortable": true,
          "columns": ["Name", "Email", "Role", "Status"],
          "rows": [
            ["Alice Johnson", "alice@example.com", "Admin", { "type": "badge", "label": "Active", "color": "green" }],
            ["Bob Smith", "bob@example.com", "Editor", { "type": "badge", "label": "Active", "color": "green" }],
            ["Carol White", "carol@example.com", "Viewer", { "type": "badge", "label": "Inactive", "color": "gray" }]
          ]
        }
      }
    ]
  }
}`,
  },

  // ── MODAL ────────────────────────────────────────────────────────────────────
  modal: {
    userPrompt: 'Create a confirmation dialog for deleting an item.',
    idealOutput: `{
  "name": "modal",
  "templateProps": {
    "title": "Delete Item",
    "variant": "elevated",
    "open": true,
    "children": [
      {
        "name": "stack",
        "templateProps": {
          "spacing": "medium",
          "children": [
            {
              "name": "callout",
              "templateProps": {
                "title": "This action is irreversible",
                "content": "Are you sure you want to delete this item? This cannot be undone.",
                "tone": "error",
                "variant": "elevated",
                "emphasis": "medium"
              }
            },
            {
              "name": "grid",
              "templateProps": {
                "columns": { "xs": 2 },
                "gap": "medium",
                "children": [
                  { "name": "button", "templateProps": { "label": "Cancel", "variant": "secondary", "size": "medium" } },
                  { "name": "button", "templateProps": { "label": "Delete", "variant": "danger", "size": "medium" } }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}`,
  },

  // ── LANDING PAGE ─────────────────────────────────────────────────────────────
  landing: {
    userPrompt: 'Create a hero section for a SaaS product landing page.',
    idealOutput: `{
  "name": "stack",
  "templateProps": {
    "spacing": "large",
    "children": [
      {
        "name": "panel",
        "templateProps": {
          "variant": "gradient",
          "elevation": "floating",
          "emphasis": "high",
          "children": [
            {
              "name": "stack",
              "templateProps": {
                "spacing": "medium",
                "direction": "vertical",
                "children": [
                  { "name": "text", "templateProps": { "variant": "heading-1", "content": "Build Better Products, Faster", "align": "center" } },
                  { "name": "text", "templateProps": { "variant": "body", "content": "The AI-powered platform that turns your ideas into production-ready UI in seconds.", "align": "center" } },
                  {
                    "name": "grid",
                    "templateProps": {
                      "columns": { "xs": 1, "sm": 2 },
                      "gap": "medium",
                      "children": [
                        { "name": "button", "templateProps": { "label": "Get Started Free", "variant": "primary", "size": "large" } },
                        { "name": "button", "templateProps": { "label": "View Demo", "variant": "secondary", "size": "large" } }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {
        "name": "grid",
        "templateProps": {
          "columns": { "xs": 1, "sm": 2, "md": 4 },
          "gap": "medium",
          "children": [
            { "name": "summary-card", "templateProps": { "title": "10x Faster", "description": "Generate complete UIs from natural language descriptions", "variant": "elevated", "elevation": "raised" } },
            { "name": "summary-card", "templateProps": { "title": "Production Ready", "description": "All outputs follow design system rules and accessibility standards", "variant": "accent", "elevation": "raised" } },
            { "name": "summary-card", "templateProps": { "title": "No Code", "description": "No coding required — just describe what you want in plain English", "variant": "elevated", "elevation": "raised" } },
            { "name": "summary-card", "templateProps": { "title": "Team-Friendly", "description": "Collaborate with your team using version control and sharing", "variant": "gradient", "elevation": "floating" } }
          ]
        }
      }
    ]
  }
}`,
  },
};

// ─── PUBLIC API ────────────────────────────────────────────────────────────────

/**
 * Detects what category of UI the user is asking for.
 * Returns the first matching intent key, or null.
 */
export function detectIntent(userMessage) {
  if (!userMessage || typeof userMessage !== 'string') return null;
  const lower = userMessage.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return intent;
    }
  }
  return null;
}

/**
 * Builds the few-shot injection string for a given user message.
 * Returns null if no matching intent is found.
 */
export function getFewShotForMessage(userMessage) {
  const intent = detectIntent(userMessage);
  if (!intent) return null;

  const example = FEW_SHOT_EXAMPLES[intent];
  if (!example) return null;

  return `## GOLDEN EXAMPLE — ${intent.toUpperCase()} UI

Here is a real example of an IDEAL output for a request like this. 
STUDY this output carefully — it shows you the correct design pattern, variant choices, elevation, spacing and hierarchy.

REQUEST: "${example.userPrompt}"

IDEAL OUTPUT:
\`\`\`json
${example.idealOutput}
\`\`\`

Apply the SAME design quality and structure (gradient hero, varied variants, elevation hierarchy) to the user's actual request.
Do NOT copy this example literally — use it as a quality template.`;
}

/**
 * Returns the list of component names most likely needed for this request.
 * Used for component-scoped retrieval.
 */
export function getRelevantComponents(userMessage) {
  const intent = detectIntent(userMessage);
  if (!intent) return null;
  return INTENT_COMPONENTS[intent] || null;
}
