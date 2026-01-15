# AI UI Generator

A modern web application that leverages Google Gemini AI to generate interactive user interfaces in real-time. Features an Express.js backend with async job queue system and a React frontend with 112 component templates across 9 categories.

---

## 📑 Documentation Quick Links

**For New Users:**
- 🚀 [Setup Guide](./SETUP.md) - Get started in 10 minutes
- 📖 [Components Reference](./docs/COMPONENTS_AND_RENDERING.md) - Browse 112 available components

**For Developers:**
- 🏗️ [Software Design Spec](./docs/SOFTWARE_DESIGN_SPECIFICATION.md) - Architecture & design patterns
- 🐛 [Pending Tasks & Defects](./docs/PENDING_TASKS.md) - Known issues from QA testing
- 🔄 [Crayon Migration Plan](./docs/QA_ANALYSIS_AND_MIGRATION_PLAN.md) - Component library upgrade strategy
- 🔌 [Backend API Docs](./backend/README.md) - API endpoints & async job queue

**For Contributors:**
- 📋 [Contributing Guide](#contributing) - Development workflow
- 🤖 [AI Agent Config](./docs/UIAgent.md) - Prompt engineering

---

## 🚀 Quick Start

**New here?** Follow our step-by-step setup guide:

👉 **[SETUP.md - Complete Setup Guide](./SETUP.md)**

The setup guide walks you through:
1. Cloning from GitHub
2. Installing dependencies
3. Setting up your Gemini API key
4. Running the application
5. Testing your first generation

**Setup time:** ~10 minutes

### Requirements

- Node.js 18+
- Google Gemini API key ([Get one free](https://makersuite.google.com/app/apikey))

That's it! No Docker, no complex setup.

## Features

- **Real-time UI Generation**: Chat interface for describing and generating UI components
- **AI-Powered**: Powered by Google Gemini 2.5 Pro with function calling
- **Template Gallery**: Pre-built templates for common UI patterns (forms, dashboards, charts, etc.)
- **Component Inspector**: View and inspect generated component JSON specifications
- **Generation History**: Track and revisit previously generated components
- **Async Job Queue**: Non-blocking backend with polling for long-running generations
- **112 Components**: Comprehensive library across 9 categories (charts, inputs, layouts, feedback, etc.)
- **Type-Safe Validation**: JSON Schema validation with AJV
- **Intelligent Retry**: AI self-corrects validation errors automatically

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Server**: Express.js with async job queue
- **AI Model**: Google Gemini 2.5 Pro
- **Validation**: AJV (JSON Schema validator)
- **Logging**: Console-based (Vercel-compatible)
- **Deployment**: Ready for Vercel, Heroku, Railway

## Project Structure

```
├── src/                         # Frontend React application
│   ├── components/             # UI components
│   ├── pages/                  # Main pages (Chat, Gallery, Inspector, History)
│   ├── templates/              # 112 component templates (9 categories)
│   ├── services/               # API service, session manager, storage
│   ├── store/                  # Zustand state management
│   └── types/                  # TypeScript type definitions
├── backend/                    # Express.js backend
│   ├── server.js              # Main server with job queue
│   ├── logger.js              # Logging utility
│   ├── docs/                  # Component schemas
│   └── prompts/               # AI system prompts
├── docs/                       # Documentation
├── scripts/                    # Utility scripts (schema generation, tests)
└── .env                       # Environment variables
```

## Getting Started

**👉 [Follow the Complete Setup Guide](./SETUP.md)**

The setup guide provides step-by-step instructions with commands you can copy-paste.

**Quick overview:**
```bash
# 1. Clone the repository
git clone https://github.com/devrelify/gen-ui.git
cd gen-ui

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 4. Generate component schemas
npm run generate-schema

# 5. Start the application
npm run dev

# 6. Open http://localhost:5173
```

For detailed instructions, troubleshooting, and explanations, see **[SETUP.md](./SETUP.md)**

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
│  │   Chat   │  │ Gallery  │  │ Inspector │  │ History  │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────┘  │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                        │                                      │
│                   AppStore (Zustand)                         │
│                   ApiService                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ POST /api/agent
                         │ GET /api/agent/:jobId
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                        │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Job Queue   │───▶│    Worker    │───▶│   Storage    │  │
│  │   System     │    │   Process    │    │  (In-Memory) │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                             │                                │
│                             ▼                                │
│                   ┌──────────────────┐                       │
│                   │  Gemini 2.5 Pro  │                       │
│                   │  Function Calls: │                       │
│                   │  - get_components│                       │
│                   │  - get_schema    │                       │
│                   │  - validate      │                       │
│                   └──────────────────┘                       │
│                             │                                │
│                             ▼                                │
│                   ┌──────────────────┐                       │
│                   │  AJV Validator   │                       │
│                   │  JSON Schema     │                       │
│                   └──────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input**: User types a prompt in the chat interface
2. **Job Creation**: Frontend calls `POST /api/agent`, receives jobId immediately
3. **Async Processing**: Backend worker processes job in background
   - Gemini uses function calling to discover components
   - Gemini generates component specification
   - Gemini validates using `validate_component` tool
   - If validation fails, Gemini retries (up to 20 iterations)
4. **Polling**: Frontend polls `GET /api/agent/:jobId` for status
5. **Completion**: When job completes, frontend receives validated spec
6. **Rendering**: Frontend dynamically renders component using React templates
7. **Storage**: Component is saved to history in localStorage

### Backend Features

- **Async Job Queue**: Non-blocking API with background processing
- **Function Calling**: Gemini uses tools to validate specifications
- **Intelligent Retry**: AI self-corrects validation errors automatically
- **Schema Validation**: Strict type checking with AJV
- **Tuple Support**: Handles TypeScript tuple types
- **Interface Expansion**: Validates nested object structures
- **Malformed Call Recovery**: Handles and recovers from JSON syntax errors

## Backend API

The backend provides a job queue system for asynchronous UI generation using Google Gemini.

### API Endpoints

**POST /api/agent** - Submit a new generation job
```json
{
  "message": "Create a login form",
  "sessionId": "optional-session-id"
}
```

Returns:
```json
{
  "jobId": "uuid-here",
  "status": "queued"
}
```

**GET /api/agent/:jobId** - Get job status and result
```json
{
  "jobId": "uuid-here",
  "status": "completed",
  "spec": { /* component specification */ },
  "createdAt": "2025-11-13T...",
  "completedAt": "2025-11-13T..."
}
```

**GET /api/queue/status** - Get queue statistics
```json
{
  "queueLength": 3,
  "totalJobs": 15,
  "jobs": {
    "queued": 3,
    "processing": 1,
    "completed": 10,
    "failed": 1,
    "timeout": 0
  }
}
```

**GET /health** - Backend health check
```json
{
  "status": "ok",
  "timestamp": "2025-11-13T...",
  "uptimeSeconds": 3600,
  "worker": {
    "running": true,
    "pendingJobs": 2,
    "queueLength": 2
  },
  "queue": { /* queue stats */ },
  "environment": {
    "port": 4000,
    "model": "gemini-2.5-pro",
    "jobTimeoutMs": 300000
  },
  "schema": {
    "hasSchema": true,
    "components": 112,
    "categories": 9
  }
}
```

### How It Works

1. User submits a prompt via the chat interface
2. Backend creates a job and returns jobId immediately
3. Job is processed asynchronously using Gemini API
4. Gemini uses function calling to:
   - Discover available components
   - Get component schemas
   - Validate generated specifications
5. Frontend polls for job completion
6. Validated specification is returned and rendered

For more details, see [backend/README.md](./backend/README.md)

## Available Component Types

The system supports a wide range of component types organized into categories:

### Core Components
- **Text**: Simple text/markdown content display
- **Card**: Container with title, subtitle, and children components
- **Button**: Interactive buttons with various styles and actions
- **Button Group**: Multiple action buttons with different variants
- **Layout**: Grid, flex, or stack containers for organizing components

### Forms & Inputs
- **Form**: Dynamic forms with validation and various field types
- **Input**: Text inputs, textareas, number fields
- **Select**: Dropdown menus and autocomplete
- **Checkbox/Radio**: Selection controls
- **Date Picker**: Date and time selection
- **File Upload**: File input handling

### Data Display
- **Table**: Sortable and searchable tabular data with pagination
- **List**: Ordered and unordered lists
- **Badge**: Status indicators and labels
- **Tag**: Categorization and filtering
- **Timeline**: Event sequences

### Charts & Visualization
- **Bar Chart**: Horizontal and vertical bar charts
- **Line Chart**: Trend lines and multi-series data
- **Pie Chart**: Circular data representation
- **Area Chart**: Filled line charts
- **Radar Chart**: Multi-dimensional data
- **Treemap**: Hierarchical data visualization
- **Composed Chart**: Multiple chart types combined
- **And more**: Sankey, Funnel, Scatter, Box Plot, etc.

### Advanced Components
- **Dashboard**: Complete dashboard layouts
- **Markdown**: Rich text rendering
- **Code Block**: Syntax-highlighted code display
- **Map**: Interactive maps
- **Chat**: Chat interface components
- **QR Code**: QR code generation
- **Barcode**: Barcode display
- **Signature**: Digital signature capture
- **Widget**: Reusable widget containers

### Media
- **Image**: Image display with lazy loading
- **Avatar**: User profile pictures
- **Video**: Video player
- **Audio**: Audio player

### Navigation
- **Tabs**: Tabbed interfaces
- **Breadcrumb**: Navigation trails
- **Menu**: Navigation menus
- **Pagination**: Page navigation

### Feedback
- **Alert**: Notification messages
- **Progress**: Progress bars and indicators
- **Skeleton**: Loading placeholders
- **Spinner**: Loading animations

For detailed component specifications, see [Component Types Documentation](./docs/COMPONENTS_AND_RENDERING.md)

## Usage Examples

### Chat Page
1. Navigate to the Chat page
2. Type a prompt like "Create a login form"
3. The AI will generate and render the component in real-time
4. Components are automatically saved to history

### Template Gallery
1. Navigate to the Gallery page
2. Browse templates by category
3. Click any template to auto-fill the chat with its prompt
4. The app will navigate to Chat and send the prompt

### Component Inspector
1. Generate some components in Chat
2. Navigate to Inspector
3. View the JSON specification of each component
4. Copy JSON to clipboard or view live preview

### History
1. Navigate to History
2. View all previously generated components
3. Search by prompt text
4. Delete individual items or clear all history

## Features Deep Dive

### Session Management
- Each browser session gets a unique session ID
- Session IDs are maintained in sessionStorage
- Sent with every request to n8n for context tracking

### Storage
- Generation history stored in localStorage
- Persists across browser sessions
- Maximum 100 items (oldest removed automatically)

### Responsive Design
- Mobile-friendly sidebar with overlay
- Responsive grid layouts
- Touch-optimized interactions

### Dark Mode
- Automatic dark mode support via Tailwind CSS
- Respects system preferences

## Key Features Deep Dive

### Session Management
- Each browser session gets a unique session ID
- Session IDs are maintained in sessionStorage
- Sent with every request to n8n for context tracking
- Memory buffer maintains up to 50 conversation turns

### Storage
- Generation history stored in localStorage
- Persists across browser sessions
- Maximum 100 items (oldest removed automatically)
- Export/import capabilities

### Responsive Design
- Mobile-friendly sidebar with overlay
- Responsive grid layouts
- Touch-optimized interactions
- Dark mode support via Tailwind CSS

### AI Agent System
- **Main Agent**: Generates initial UI components from prompts
- **Review Agent**: Validates and refines generated components
- **Memory System**: Maintains conversation context per session
- **Iteration Support**: Multi-pass refinement based on feedback

## Troubleshooting

For detailed troubleshooting, see **[SETUP.md](./SETUP.md#troubleshooting)**

### Quick Checks

**Backend Not Connected:**
```bash
# Check if backend is running
lsof -i :4000

# Check backend logs in terminal
# Look for "[INFO] Backend server running on http://localhost:4000"

# Test health endpoint
curl http://localhost:4000/health
```

**GEMINI_API_KEY Not Found:**
```bash
# Verify .env file exists
cat .env | grep GEMINI_API_KEY

# Restart backend after updating .env
npm run dev:backend
```

**Component Not Rendering:**
1. Open Inspector page to view the JSON
2. Check browser console for errors (F12 → Console)
3. Verify backend is connected (green dot in header)
4. Check terminal logs for validation errors

## Development

### Project Structure
See the detailed structure at the top of this README.

### Adding New Component Types

1. Create a new template component in `src/templates/`
2. Add the component to `src/templates/index.tsx`
3. Update the `renderComponent` function
4. Update agent prompts to include the new component type
5. Test with n8n workflow

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- components.test.ts
```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Build output will be in dist/
```

### Environment Variables

Create a `.env` file:

```env
# n8n Webhook URL
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/generate

# Optional: Custom port for dev server
VITE_PORT=5173
```

### Modifying n8n Integration

Edit `src/services/n8nService.ts` to customize:
- Request/response handling
- Error handling
- Timeout configuration
- Additional context

## Documentation

Comprehensive documentation is available in the `docs/` directory:

### 📋 Core Documentation
- **[SETUP.md](./SETUP.md)** - Complete setup guide (start here!)
- **[PRD.md](./docs/PRD.md)** - Product Requirements Document
- **[DESIGN.md](./docs/DESIGN.md)** - System design and architecture
- **[SOFTWARE_DESIGN_SPECIFICATION.md](./docs/SOFTWARE_DESIGN_SPECIFICATION.md)** - Detailed technical architecture, design patterns, and implementation

### 🔧 Developer Resources
- **[COMPONENTS_AND_RENDERING.md](./docs/COMPONENTS_AND_RENDERING.md)** - Component type specifications (112 components)
- **[PENDING_TASKS.md](./docs/PENDING_TASKS.md)** - Active defects and improvement tasks based on QA testing
- **[QA_ANALYSIS_AND_MIGRATION_PLAN.md](./docs/QA_ANALYSIS_AND_MIGRATION_PLAN.md)** - QA test results analysis and Crayon UI migration strategy
- **[Backend README](./backend/README.md)** - Backend API documentation

### 🤖 AI Agent Configuration
- **[UIAgent.md](./docs/UIAgent.md)** - AI agent configuration
- **[MainPrompt.md](./backend/prompts/MainPrompt.md)** - Gemini system prompt
- **[CLICKSTACK_DATA_REFERENCE.md](./docs/CLICKSTACK_DATA_REFERENCE.md)** - MCP integration reference

### 📚 Legacy Guides
- **[SETUP-PHASE1.md](./SETUP-PHASE1.md)** - Basic setup with Google Gemini
- **[SETUP-PHASE2.md](./SETUP-PHASE2.md)** - Advanced setup with OpenAI and MCP

## Contributing

This is currently a personal project. Contributions are welcome but please open an issue first to discuss proposed changes.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm test`
5. Build: `npm run build`
6. Commit: `git commit -am 'Add new feature'`
7. Push: `git push origin feature/my-feature`
8. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Credits & Acknowledgments

**Built with:**
- [React](https://react.dev/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State Management
- [React Router](https://reactrouter.com/) - Routing
- [Lucide Icons](https://lucide.dev/) - Icons
- [Recharts](https://recharts.org/) - Charts
- [n8n](https://n8n.io/) - Workflow Automation
- [Google Gemini](https://ai.google.dev/) - AI Model (Phase 1)
- [OpenAI](https://openai.com/) - AI Model (Phase 2)
- [Model Context Protocol](https://modelcontextprotocol.io/) - Tool Integration (Phase 2)

**Special Thanks:**
- The n8n community for excellent workflow automation tools
- The React and TypeScript communities
- Contributors to open-source AI tooling

---

## Support & Contact

For questions, issues, or feedback:

1. Check the [Setup Guides](./SETUP-PHASE1.md)
2. Review the [Documentation](./docs/)
3. Open an issue on GitHub
4. Check n8n execution logs for backend issues

---

## ⚠️ Important Notes

### Production Readiness

This is a development/testing project designed for local use. It is **not production-ready** and should not be deployed to public environments without:
- Proper authentication and authorization
- Rate limiting and security measures
- API key protection
- CORS and security headers
- Error handling and monitoring
- Production-grade hosting configuration

**See [PENDING_TASKS.md](./docs/PENDING_TASKS.md) for required production readiness tasks.**

### Known Issues

Based on comprehensive QA testing (151 test cases, 3 testers):
- **Overall Pass Rate:** ~85%
- **7 Critical Defects:** Modal, notification, tooltip, popover, menu, carousel, rating components
- **Theme Issues:** 9 components have visibility problems in light theme
- **Chart Issues:** Some chart types render incorrectly (histogram→bar, line→area)

**Full QA analysis and component migration plan:** [QA_ANALYSIS_AND_MIGRATION_PLAN.md](./docs/QA_ANALYSIS_AND_MIGRATION_PLAN.md)

For production deployment, address critical defects and implement proper security measures. See documentation for detailed improvement roadmap.
