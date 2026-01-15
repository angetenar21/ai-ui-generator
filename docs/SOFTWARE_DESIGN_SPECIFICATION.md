# Software Design Specification (SDS)
## AI UI Generator

**Version:** 1.0.0
**Date:** November 22, 2025
**Document Status:** Final

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Architectural Design](#3-architectural-design)
4. [Backend Design](#4-backend-design)
5. [Frontend Design](#5-frontend-design)
6. [Component Template System](#6-component-template-system)
7. [Data Models](#7-data-models)
8. [API Design](#8-api-design)
9. [State Management](#9-state-management)
10. [Error Handling Strategy](#10-error-handling-strategy)
11. [Performance Considerations](#11-performance-considerations)
12. [Security Design](#12-security-design)
13. [Deployment Architecture](#13-deployment-architecture)

---

## 1. Introduction

### 1.1 Purpose
This Software Design Specification describes the architecture, design decisions, and implementation details of the AI UI Generator - a web application that uses Google Gemini AI to generate interactive user interfaces in real-time.

### 1.2 Scope
The system consists of:
- Express.js backend API with async job queue system
- React frontend with 112 component templates across 9 categories
- Google Gemini AI integration for component generation
- JSON Schema validation system
- Component registry and rendering engine

### 1.3 Design Goals
- **Scalability**: Handle multiple concurrent generation requests
- **Reliability**: Robust error handling and validation
- **Maintainability**: Clean architecture with separation of concerns
- **Extensibility**: Easy addition of new components
- **Performance**: Non-blocking async operations
- **Type Safety**: TypeScript throughout the codebase

---

## 2. System Overview

### 2.1 High-Level Architecture

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

### 2.2 Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- React Router v6 (routing)

**Backend:**
- Express.js (Node.js 18+)
- AJV (JSON Schema validation)
- Google Gemini 2.5 Pro API
- Custom logging system

---

## 3. Architectural Design

### 3.1 Design Patterns

#### 3.1.1 Singleton Pattern
**Component Registry** uses singleton to ensure single source of truth for all components.

```typescript
class ComponentRegistry {
  private static instance: ComponentRegistry;

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }
}
```

#### 3.1.2 Registry Pattern
Components self-register via metadata exports, eliminating switch-case statements.

```typescript
export const metadata = {
  name: 'line-chart',
  category: 'charts',
  component: LineChart,
  description: 'Line chart visualization'
};
```

#### 3.1.3 Factory Pattern
**renderComponent()** dynamically creates components based on spec:

```typescript
const Component = registry.get(spec.name);
return <Component {...props} />;
```

#### 3.1.4 Observer Pattern
**Polling mechanism** for job status updates with callbacks.

```typescript
ApiService.sendMessage(message, threadId, context, {
  onStatusUpdate: (status) => setJobStatus(status)
});
```

#### 3.1.5 Service Layer Pattern
Business logic separated into dedicated services:
- ApiService (API communication)
- StorageService (persistence)
- SessionManager (session tracking)

### 3.2 Separation of Concerns

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│         (React Components)              │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│           Service Layer                 │
│    (ApiService, StorageService)         │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│          State Layer                    │
│        (Zustand Store)                  │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│         Template Layer                  │
│    (Component Registry & Renderer)      │
└─────────────────────────────────────────┘
```

---

## 4. Backend Design

### 4.1 Async Job Queue Architecture

**Design Rationale:**
- Prevents frontend timeout on long-running AI requests
- Enables non-blocking API responses
- Allows queue monitoring and management

**Implementation:**

```javascript
// Job lifecycle
const JobStatus = {
  QUEUED: 'queued',        // Job submitted, waiting
  PROCESSING: 'processing', // AI generating
  COMPLETED: 'completed',   // Success
  FAILED: 'failed',         // Error occurred
  TIMEOUT: 'timeout'        // Exceeded time limit
};

// In-memory stores
const jobQueue = [];           // FIFO queue
const jobStore = new Map();    // jobId -> job details
```

### 4.2 Worker Process

**Single-threaded worker** processes jobs sequentially:

```javascript
async function worker() {
  while (true) {
    if (jobQueue.length === 0) {
      await sleep(500); // Poll every 500ms
      continue;
    }

    const job = jobQueue.shift();
    await processJob(job);
  }
}
```

**Benefits:**
- Simple concurrency model
- No race conditions
- Predictable resource usage

### 4.3 Gemini Function Calling Loop

**Iterative validation pattern:**

```javascript
let maxIterations = 20;
while (iterations < maxIterations) {
  // 1. Call Gemini
  const response = await callGemini(contents, tools);

  // 2. Check for function calls
  if (hasFunctionCalls) {
    const results = executeToolCall(functionCall);
    contents.push(results);
    continue; // Next iteration
  }

  // 3. No function calls = final response
  return extractJsonObject(response);
}
```

**Tool Functions:**
1. `get_components()` - Returns available components by category
2. `get_component_schema(names)` - Returns detailed prop schemas
3. `validate_component(spec)` - Validates against JSON Schema

### 4.4 Validation System

**Two-level validation:**

1. **Schema Validation** (AJV):
   ```javascript
   const ajv = new Ajv({
     allErrors: true,
     strict: true,
     strictTypes: true
   });

   const schema = componentSchemas[componentName];
   const validate = ajv.compile(schema);
   const valid = validate(props);
   ```

2. **Recursive Child Validation**:
   ```javascript
   if (props.children && Array.isArray(props.children)) {
     for (const child of props.children) {
       const childValidation = validateSpec(child);
       if (!childValidation.valid) {
         errors.push(...childValidation.errors);
       }
     }
   }
   ```

### 4.5 Malformed Call Recovery

**Error handling for invalid JSON:**

```javascript
if (candidate.finishReason === 'MALFORMED_FUNCTION_CALL') {
  contents.push({
    role: 'user',
    parts: [{
      text: 'Your last function call was malformed. Please ensure proper JSON syntax.'
    }]
  });
  continue; // Retry
}
```

### 4.6 Logging System

**Multi-level logging:**

```javascript
Logger.info(message, data)   // General info
Logger.error(message, data)  // Errors
Logger.warn(message, data)   // Warnings
Logger.debug(message, data)  // Detailed debug (file only)
```

**Specialized loggers:**
- `Logger.geminiRequest()` - Gemini API calls
- `Logger.geminiResponse()` - Gemini responses
- `Logger.jobEnqueued()` - Job lifecycle
- `Logger.validation()` - Validation results
- `Logger.saveGeminiResponse()` - Persist responses to file

**Log rotation:**
- Automatic rotation at 10MB
- Timestamped archive files
- Separate error log file

---

## 5. Frontend Design

### 5.1 Component Architecture

```
src/
├── pages/           # Route-level components
├── components/      # Shared UI components
├── templates/       # Dynamic component library
├── services/        # Business logic
├── store/           # Global state
├── hooks/           # Custom React hooks
└── types/           # TypeScript definitions
```

### 5.2 Page Components

**ChatPage:**
- Message history management
- Job enqueuing and polling
- Component rendering
- Thread-based conversations

**GalleryPage:**
- Template browsing
- Category filtering
- Template search
- Navigation to chat with prompt

**InspectorPage:**
- Component spec viewer
- JSON editor
- Copy to clipboard
- Multiple view modes

**HistoryPage:**
- Thread management
- History search
- Thread deletion
- Navigation to chat

**TesterPage:**
- Component testing interface
- Props exploration
- Validation testing

### 5.3 Routing Structure

```typescript
<Routes>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<ChatPage />} />
    <Route path="gallery" element={<GalleryPage />} />
    <Route path="inspector" element={<InspectorPage />} />
    <Route path="history" element={<HistoryPage />} />
    <Route path="tester" element={<TesterPage />} />
  </Route>
</Routes>
```

---

## 6. Component Template System

### 6.1 Auto-Registration System

**Vite glob imports** for automatic discovery:

```typescript
const modules = import.meta.glob('./**/*.{tsx,ts}', {
  eager: true
});

for (const [path, module] of Object.entries(modules)) {
  if (module.metadata) {
    registry.register(module.metadata);
  }
}
```

### 6.2 Component Registry

**Centralized component storage:**

```typescript
interface ComponentMetadata {
  name: string;
  category: ComponentCategory;
  component: ComponentType<any>;
  description?: string;
  propTypes?: Record<string, any>;
  tags?: string[];
}

class ComponentRegistry {
  private components: Map<string, ComponentMetadata>;

  register(metadata: ComponentMetadata): void
  get(name: string): ComponentType<any> | undefined
  getByCategory(category: ComponentCategory): ComponentMetadata[]
  getCategories(): ComponentCategory[]
}
```

### 6.3 Universal Renderer

**Dynamic component rendering:**

```typescript
export const renderComponent = (spec: ComponentSpec): ReactNode => {
  const componentName = spec.name || spec.type;
  const Component = registry.get(componentName);

  if (!Component) {
    return <ErrorComponent name={componentName} />;
  }

  const renderedChildren = spec.children?.map(renderComponent);

  return <Component {...spec.props} children={renderedChildren} />;
};
```

### 6.4 Component Categories

**9 categories, 112 components:**

1. **charts** (27) - Data visualization
2. **inputs** (20) - Form controls
3. **data-display** (15) - Tables, lists, calendars
4. **layout** (15) - Structural components
5. **feedback** (9) - Alerts, modals, notifications
6. **advanced** (6) - Complex components
7. **media** (5) - Images, videos, galleries
8. **navigation** (4) - Buttons, menus, tabs
9. **surfaces** (11) - Cards, panels, containers

---

## 7. Data Models

### 7.1 Component Specification

```typescript
interface ComponentSpec {
  type: string;                    // Component name
  props: Record<string, unknown>;  // Component properties
  metadata: {
    componentId: string;
    generatedAt: string;
    description?: string;
  };
  children?: ComponentSpec[];      // Nested components
}
```

### 7.2 Job Request/Response

```typescript
// Request
interface JobRequest {
  sessionId: string;
  message: string;
  threadId?: string;
  context?: {
    previousComponents?: ComponentSpec[];
    userPreferences?: Record<string, unknown>;
  };
}

// Enqueue Response (202 Accepted)
interface JobEnqueueResponse {
  jobId: string;
  status: 'queued';
  message: string;
}

// Status Response
interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  result?: JobResult;
  error?: string;
}

// Job Result
interface JobResult {
  spec: ComponentSpec;
  validation: ValidationResult;
  raw: string;
  toolDefinitions: ToolDefinition[];
  serializedSpec: string;
  sessionId: string;
  threadId?: string;
}
```

### 7.3 Generation History

```typescript
interface GenerationHistory {
  id: string;
  prompt: string;
  response: ComponentSpec;
  timestamp: number;
  threadId: string;
  sessionId: string;
}
```

### 7.4 Component Schema

```typescript
interface ComponentSchema {
  name: string;
  category: string;
  description?: string;
  props: {
    [propName: string]: {
      type: string;           // TypeScript type
      tsType?: string;        // Full TS type expression
      description: string;
      required: boolean;
      optional: boolean;
    };
  };
  interfaces?: {
    [interfaceName: string]: {
      [propName: string]: PropDefinition;
    };
  };
}
```

---

## 8. API Design

### 8.1 RESTful Endpoints

**Job Management:**
```
POST   /api/agent              # Enqueue job → 202 + jobId
GET    /api/agent/:jobId       # Poll status → JobStatusResponse
DELETE /api/agent/:jobId       # Cancel job → 200
```

**Queue Monitoring:**
```
GET    /api/queue/status       # Queue statistics
GET    /health                 # Backend health check
```

**Legacy (Backward Compatible):**
```
GET    /tools                  # Tool definitions
POST   /validate               # Validate spec
POST   /generate               # Synchronous generation (deprecated)
```

### 8.2 Polling Configuration

```typescript
interface PollingConfig {
  pollInterval?: number;      // Default: 1500ms
  maxDuration?: number;       // Default: 300000ms (5 min)
  onStatusUpdate?: (status: JobStatus) => void;
  onProgress?: (progress: number) => void;
}
```

### 8.3 Error Responses

```typescript
interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
}
```

**HTTP Status Codes:**
- 200: Success
- 202: Accepted (job enqueued)
- 400: Bad Request (validation error)
- 404: Not Found (job not found)
- 422: Unprocessable Entity (validation failed)
- 500: Internal Server Error

---

## 9. State Management

### 9.1 Zustand Store

**Global application state:**

```typescript
interface AppState {
  // Session
  currentSessionId: string;
  currentThreadId: string | null;

  // UI State
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';

  // Component State
  inspectedComponent: ComponentSpec | null;
  generatedComponents: ComponentSpec[];

  // Chat State
  shouldStartNewChat: boolean;

  // Actions
  setInspectedComponent(component: ComponentSpec | null): void;
  setTheme(theme): void;
  setSidebarOpen(open: boolean): void;
  setCurrentThreadId(id: string | null): void;
  addGeneratedComponent(component: ComponentSpec): void;
  clearGeneratedComponents(): void;
  triggerNewChat(): void;
}
```

### 9.2 Local Storage

**Persistent storage:**

```typescript
// Keys
const STORAGE_KEYS = {
  GENERATION_HISTORY: 'ai-ui-generator-history',
  USER_PREFERENCES: 'ai-ui-generator-preferences',
  THEME: 'theme'
};

// Methods
StorageService.saveToHistory(item: GenerationHistory)
StorageService.getHistory(): GenerationHistory[]
StorageService.getHistoryByThread(threadId: string): GenerationHistory[]
StorageService.deleteHistoryItem(id: string)
StorageService.clearHistory()
```

### 9.3 Session Storage

**Session-scoped data:**

```typescript
SessionManager.getSessionId(): string      // Get or create UUID
SessionManager.clearSession(): void
SessionManager.hasActiveSession(): boolean
```

---

## 10. Error Handling Strategy

### 10.1 Backend Error Handling

**Tiered error handling:**

1. **Network Errors:**
   ```javascript
   try {
     response = await fetch(GEMINI_API_URL, options);
   } catch (err) {
     Logger.error('Network error', err);
     throw new Error('Network error while calling Gemini');
   }
   ```

2. **API Errors:**
   ```javascript
   if (!response.ok) {
     const errorData = await response.json();
     Logger.geminiError(model, new Error(errorData.error.message));
     throw new Error(`Gemini API error: ${errorData.error.message}`);
   }
   ```

3. **Validation Errors:**
   ```javascript
   const validation = validateSpec(spec);
   if (!validation.valid) {
     Logger.validation(spec, validation);
     throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
   }
   ```

4. **Job Timeouts:**
   ```javascript
   if (Date.now() - startTime > JOB_TIMEOUT_MS) {
     jobStore.set(jobId, {
       ...job,
       status: JobStatus.TIMEOUT,
       error: 'Job exceeded maximum processing time'
     });
   }
   ```

### 10.2 Frontend Error Handling

**Service layer error handling:**

```typescript
try {
  const response = await ApiService.sendMessage(message);
  return response;
} catch (error) {
  console.error('Error:', error);

  // Return error component as fallback
  return {
    type: 'alert',
    props: {
      type: 'error',
      title: 'Generation Error',
      message: error.message
    },
    metadata: { ... }
  };
}
```

**Component error boundaries:**

```typescript
class ComponentRenderer extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('Component render error', error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }
    return renderComponent(this.props.spec);
  }
}
```

---

## 11. Performance Considerations

### 11.1 Backend Performance

**Optimizations:**

1. **Async Job Queue:**
   - Non-blocking API responses (202 Accepted)
   - Frontend doesn't wait for AI generation
   - Prevents timeout issues

2. **In-Memory Storage:**
   - Fast job lookup (Map data structure)
   - O(1) access time for job status

3. **Periodic Cleanup:**
   - Removes old jobs every 10 minutes
   - Prevents memory leaks

4. **Schema Caching:**
   - Schemas loaded once at startup
   - Compiled AJV validators reused

5. **Worker Pooling:**
   - Single worker prevents resource contention
   - Sequential processing ensures predictable load

### 11.2 Frontend Performance

**Optimizations:**

1. **Code Splitting:**
   - React.lazy for route-based splitting
   - Vite automatic chunking

2. **Component Registry:**
   - O(1) component lookup
   - No switch-case overhead

3. **Memoization:**
   - useCallback for renderComponent
   - Prevents unnecessary re-renders

4. **Polling Optimization:**
   - Configurable intervals (default 1.5s)
   - Stops after completion/failure

5. **Virtual Rendering:**
   - Large lists use windowing
   - DataGrid has built-in pagination

### 11.3 Network Performance

**API Optimizations:**

1. **Polling Backoff:**
   - Could implement exponential backoff
   - Current: Fixed 1.5s interval

2. **Request Compression:**
   - Express compression middleware (not currently enabled)

3. **Response Caching:**
   - Job results cached in jobStore
   - Reduces redundant API calls

---

## 12. Security Design

### 12.1 Current Security Measures

**Environment Variables:**
- API keys stored in `.env` files
- Not committed to version control
- Server-side only (never exposed to client)

**CORS Configuration:**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Development only
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

**Input Validation:**
- Required field validation
- Type checking
- Schema validation for component specs

### 12.2 Security Recommendations (Production)

**⚠️ IMPORTANT: Not production-ready without:**

1. **Authentication & Authorization:**
   - User authentication (JWT, OAuth)
   - API key rotation
   - Rate limiting per user

2. **CORS Restrictions:**
   - Whitelist specific origins
   - Remove wildcard (`*`) in production

3. **Input Sanitization:**
   - Validate all user inputs
   - Prevent XSS attacks
   - SQL injection prevention (if database added)

4. **Rate Limiting:**
   ```javascript
   const rateLimit = require('express-rate-limit');
   app.use(rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   }));
   ```

5. **HTTPS Enforcement:**
   - Force HTTPS in production
   - Secure cookies
   - HSTS headers

6. **API Key Protection:**
   - Never expose GEMINI_API_KEY to frontend
   - Use environment-specific keys
   - Implement key rotation

7. **Content Security Policy:**
   ```javascript
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'"]
       }
     }
   }));
   ```

---

## 13. Deployment Architecture

### 13.1 Development Environment

```
┌──────────────────────────────────────┐
│    Developer Machine                 │
│  ┌────────────────────────────────┐ │
│  │  Frontend (Vite Dev Server)    │ │
│  │  http://localhost:5173         │ │
│  └────────────┬───────────────────┘ │
│               │                      │
│  ┌────────────┴───────────────────┐ │
│  │  Backend (Node.js)             │ │
│  │  http://localhost:4000         │ │
│  └────────────┬───────────────────┘ │
│               │                      │
└───────────────┼──────────────────────┘
                │
                ▼
        ┌───────────────┐
        │  Gemini API   │
        └───────────────┘
```

### 13.2 Production Deployment Options

#### Option 1: Vercel (Recommended)

**Backend Deployment:**
```bash
cd backend
vercel
```

**Frontend Deployment:**
```bash
npm run build
vercel --prod
```

**Environment Variables (Vercel Dashboard):**
- `GEMINI_API_KEY`
- `GEMINI_MODEL=gemini-2.5-pro`

#### Option 2: Railway

**Single Deployment:**
```bash
railway up
```

**Procfile:**
```
web: npm run dev
```

#### Option 3: Heroku

**Deployment:**
```bash
heroku create ai-ui-generator
git push heroku main
heroku config:set GEMINI_API_KEY=your-key
```

### 13.3 Production Architecture

```
┌──────────────────────────────────────────────────┐
│             CDN (Cloudflare/Vercel)              │
│                                                   │
│  ┌────────────────────────────────────────────┐ │
│  │  Static Assets (dist/)                     │ │
│  │  - HTML, CSS, JS bundles                   │ │
│  │  - Images, fonts                           │ │
│  └────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│          Load Balancer (Vercel/Railway)          │
└────────────────────┬─────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  Backend     │          │  Backend     │
│  Instance 1  │          │  Instance 2  │
└──────┬───────┘          └──────┬───────┘
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   Gemini API        │
         │  (Google Cloud)     │
         └─────────────────────┘
```

### 13.4 Monitoring & Logging

**Backend Logs:**
- File-based logging: `logs/backend.log`
- Error log: `logs/error.log`
- Gemini responses: `logs/responses/`

**Log Rotation:**
- Automatic at 10MB
- Timestamped archives

**Recommended Production Monitoring:**
- Vercel Analytics
- Sentry for error tracking
- LogRocket for session replay
- Uptime monitoring (UptimeRobot)

---

## Appendix A: Technology Versions

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Backend runtime |
| React | 18.3.1 | Frontend framework |
| TypeScript | 5.9.3 | Type safety |
| Express | 4.19.1 | Backend server |
| Vite | 7.1.7 | Build tool |
| Zustand | 4.5.5 | State management |
| AJV | 8.17.1 | Schema validation |
| Tailwind CSS | 4.1.16 | Styling |
| React Router | 7.9.5 | Routing |
| Gemini | 2.5 Pro | AI model |

---

## Appendix B: File Structure

```
ai-ui-generator/
├── backend/
│   ├── server.js                    # Express server (945 lines)
│   ├── logger.js                    # Logging utility (261 lines)
│   ├── package.json                 # Backend dependencies
│   ├── vercel.json                  # Vercel config
│   ├── docs/
│   │   └── component-library-schema.json  # 112 component schemas
│   ├── prompts/
│   │   └── MainPrompt.md           # Gemini system prompt
│   └── logs/
│       ├── backend.log             # General logs
│       ├── error.log               # Error logs
│       └── responses/              # Gemini responses
├── src/
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # React entry point
│   ├── components/                 # Shared UI components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── ResponsiveComponentWrapper.tsx
│   ├── pages/
│   │   ├── ChatPage.tsx            # Main generation interface
│   │   ├── GalleryPage.tsx         # Template gallery
│   │   ├── InspectorPage.tsx       # Component inspector
│   │   ├── HistoryPage.tsx         # Generation history
│   │   └── TesterPage.tsx          # Component tester
│   ├── services/
│   │   ├── apiService.ts           # API client (412 lines)
│   │   ├── storageService.ts       # LocalStorage wrapper
│   │   └── sessionManager.ts       # Session management
│   ├── store/
│   │   └── appStore.ts             # Zustand store
│   ├── templates/
│   │   ├── core/
│   │   │   ├── registry.ts         # Component registry
│   │   │   ├── renderer.tsx        # Universal renderer
│   │   │   ├── types.ts            # Type definitions
│   │   │   └── utils.ts            # Registry utilities
│   │   ├── charts/                 # 26 chart components
│   │   ├── inputs/                 # 20 input components
│   │   ├── data-display/           # 15 data components
│   │   ├── layout/                 # 15 layout components
│   │   ├── feedback/               # 9 feedback components
│   │   ├── advanced/               # 7 advanced components
│   │   ├── media/                  # 5 media components
│   │   ├── navigation/             # 4 navigation components
│   │   ├── surfaces/               # 11 surface components
│   │   └── index.tsx               # Auto-registration
│   ├── types/
│   │   └── api.types.ts            # API type definitions
│   ├── hooks/
│   │   ├── useTheme.ts             # Theme management
│   │   └── index.ts
│   ├── data/
│   │   └── templateGallery.ts      # Template definitions
│   └── utils/
├── docs/                            # Documentation
├── scripts/                         # Utility scripts
│   ├── extract-schemas.js          # Schema generator
│   ├── run-component-tests.js      # Component tests
│   └── run-test-prompts.js         # Prompt tests
├── package.json                     # Project dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── .env.example                     # Environment template
└── README.md                        # Project documentation
```

---

## Appendix C: Key Algorithms

### C.1 Component Validation Algorithm

```
function validateSpec(spec):
  errors = []

  // 1. Extract component name
  componentName = spec.name || spec.type || spec.component
  if !componentName:
    return { valid: false, errors: ['Component name required'] }

  // 2. Check component exists
  component = components[componentName]
  if !component:
    return { valid: false, errors: ['Unknown component: ' + componentName] }

  // 3. Extract props
  props = spec.templateProps || spec.props || {}

  // 4. Validate against JSON Schema
  schema = componentSchemas[componentName]
  if schema:
    ajvValidator = ajv.compile(schema)
    valid = ajvValidator(props)
    if !valid:
      errors.push(ajvValidator.errors)

  // 5. Recursively validate children
  if props.children && isArray(props.children):
    for each child in props.children:
      childValidation = validateSpec(child)
      if !childValidation.valid:
        errors.push('children: ' + childValidation.errors)

  return {
    valid: errors.length === 0,
    errors: errors
  }
```

### C.2 Job Polling Algorithm

```
function pollJobStatus(jobId, config):
  startTime = now()
  pollInterval = config.pollInterval || 1500
  maxDuration = config.maxDuration || 300000

  while true:
    // Check timeout
    if now() - startTime > maxDuration:
      throw Error('Job timed out')

    // Fetch status
    response = GET /api/agent/:jobId
    status = response.json()

    // Call status callback
    if config.onStatusUpdate:
      config.onStatusUpdate(status.status)

    // Handle completion
    if status.status === 'completed':
      return status.result

    // Handle failure
    if status.status in ['failed', 'timeout']:
      throw Error(status.error)

    // Wait before next poll
    sleep(pollInterval)
```

### C.3 Component Rendering Algorithm

```
function renderComponent(spec):
  // 1. Extract component identifier
  componentName = spec.name || spec.type

  // 2. Lookup component in registry
  Component = registry.get(componentName)

  // 3. Handle unknown component
  if !Component:
    return <ErrorComponent name={componentName} />

  // 4. Extract props and children
  props = spec.templateProps || spec.props || {}
  children = spec.children || props.children || []

  // 5. Recursively render children
  renderedChildren = children.map(child => renderComponent(child))

  // 6. Render component
  return <Component {...props} children={renderedChildren} />
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-22 | Claude Code | Initial SDS document |

---

**End of Document**
