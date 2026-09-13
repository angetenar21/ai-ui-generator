# AI UI Generator - Backend API

Express.js backend API that uses Google Gemini to generate validated UI component specifications.

## Features

1. **Async Job Queue Architecture** - Non-blocking API with instant jobId responses
2. **Gemini 2.5 Pro Integration** - AI-powered component generation with function calling
3. **JSON Schema Validation** - Strict validation using AJV with 112 component schemas
4. **Intelligent Retry** - Gemini self-corrects validation errors (up to 20 iterations)
5. **Vercel Ready** - Self-contained deployment with all dependencies included

## Architecture

```
Frontend → POST /api/agent → Job Queue → Worker Process → Gemini API
             ↓ 202 jobId                        ↓
             ← GET /api/agent/:jobId ←──────────┘
```

This architecture prevents timeouts on long requests and keeps the API responsive.

---

## File Structure

```
backend/
├── server.js                           # Main Express server
├── logger.js                           # Logging utility
├── package.json                        # Dependencies
├── vercel.json                         # Vercel deployment config
├── .env.example                        # Environment template
├── README.md                           # This file
├── docs/
│   └── component-library-schema.json   # Component schemas (112 components)
├── prompts/
│   └── MainPrompt.md                   # System prompt for Gemini
└── logs/
    └── backend.log                     # Application logs
```

**Note**: The backend is self-contained with all required files. You can deploy the `backend/` directory independently to Vercel or any Node.js hosting platform.

---

## Requirements

- **Node.js 18+**: Required for native `fetch` support
- **Gemini API Key**: Get one at [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Environment Variables**: `GEMINI_API_KEY` (required), `BACKEND_PORT` (optional, defaults to 4000)

---

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start server
npm start
```

Server will run on `http://localhost:4000`:

```
[INFO] Backend server running on http://localhost:4000
API Endpoints:
  POST /api/agent - Enqueue new job
  GET  /api/agent/:jobId - Get job status
  GET  /api/queue/status - Queue statistics
```

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from the backend directory:
```bash
cd backend
vercel
```

3. Set environment variables in Vercel dashboard:
```
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-2.5-pro
```

4. Your API will be available at `https://your-project.vercel.app`

---

## API Reference

All responses are JSON. Errors follow `{ error: string }`.

### NEW ASYNC API ENDPOINTS

#### `POST /api/agent` - Enqueue a new job

Request body:
```json
{
  "sessionId": "unique-session-id",
  "message": "Create a sales dashboard with charts",
  "threadId": "optional-thread-id",
  "context": {
    "previousComponents": [...],
    "userPreferences": {}
  }
}
```

Response (202 Accepted):
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "message": "Job queued successfully"
}
```

#### `GET /api/agent/:jobId` - Get job status

Response when queued:
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "createdAt": "2025-01-11T10:30:00.000Z"
}
```

Response when processing:
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "createdAt": "2025-01-11T10:30:00.000Z",
  "startedAt": "2025-01-11T10:30:02.000Z"
}
```

Response when completed:
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "createdAt": "2025-01-11T10:30:00.000Z",
  "startedAt": "2025-01-11T10:30:02.000Z",
  "completedAt": "2025-01-11T10:30:15.000Z",
  "result": {
    "spec": { "name": "dashboard", "templateProps": {...} },
    "validation": { "valid": true, "errors": [] },
    "raw": "...",
    "toolDefinitions": [...],
    "serializedSpec": "...",
    "sessionId": "...",
    "threadId": "..."
  }
}
```

Response when failed:
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "failed",
  "createdAt": "2025-01-11T10:30:00.000Z",
  "completedAt": "2025-01-11T10:30:05.000Z",
  "error": "Gemini API error: Rate limit exceeded"
}
```

#### `DELETE /api/agent/:jobId` - Cancel a job

Response:
```json
{
  "message": "Job cancelled successfully"
}
```

#### `GET /api/queue/status` - Get queue statistics

Response:
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

#### `GET /health` - Backend health check

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-13T05:47:00.000Z",
  "uptimeSeconds": 3600,
  "worker": {
    "running": true,
    "pendingJobs": 2,
    "queueLength": 2
  },
  "queue": {
    "queueLength": 2,
    "totalJobs": 15,
    "jobs": {
      "queued": 2,
      "processing": 0,
      "completed": 12,
      "failed": 1,
      "timeout": 0
    }
  },
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

**Status values:**
- `ok`: Worker running, system operational
- `degraded`: Worker stopped or issues detected
- `error`: Unable to compute health status

### LEGACY ENDPOINTS (Backward Compatible)

#### `GET /tools` - Get tool definitions

Returns component catalog and schema information.

#### `POST /validate` - Validate a component spec

Validates against the component schema.

#### `POST /generate` - Synchronous generation (legacy)

⚠️ **Warning**: This endpoint blocks until completion (may timeout on slow networks).
Use `/api/agent` for production.

---

## Validation System

The backend uses **AJV** (Another JSON Schema Validator) with strict type checking:

### Schema Generation
- Component schemas are extracted from TypeScript interfaces in `src/templates/`
- Includes all 112 components with their prop types, descriptions, and nested interfaces
- Schema is loaded at server startup from `docs/component-library-schema.json`

### Validation Features
1. **Strict Type Checking**: Ensures props match expected types (string, number, boolean, object, array)
2. **Tuple Support**: Handles TypeScript tuple types like `[number, number]`
3. **Interface Expansion**: Validates nested interfaces (e.g., `Column[]`, `Row[]` in data-grid)
4. **Required Props**: Enforces all required properties are present
5. **Detailed Errors**: Returns clear error messages with property paths

### Gemini Function Calling Flow

1. Gemini calls `get_components()` to discover available components
2. Gemini calls `get_component_schema(name)` to get schema for specific component
3. Gemini generates component specification
4. Gemini calls `validate_component(spec)` to validate
5. If validation fails, Gemini sees errors and retries (up to 20 iterations)
6. When valid, job completes and spec is returned

### Malformed Call Recovery

If Gemini generates invalid JSON (e.g., missing quotes), the server:
- Detects `MALFORMED_FUNCTION_CALL` finish reason
- Sends error feedback to Gemini with JSON formatting guidance
- Allows Gemini to retry with correct syntax

---

## Testing

The backend has been extensively tested with automated test suites:

### Test Results
- **Overall Success Rate**: 100% (137/137 tests passing)
- **Dashboard Tests**: 15/15 passing
- **Component Tests**: 119/119 passing
- **Multi-Component Tests**: 3/3 passing

### Running Tests

From project root:
```bash
# Run all component tests
node scripts/run-component-tests.js

# Run dashboard tests
node scripts/run-test-prompts.js

# Run multi-component tests
node scripts/test-multicomponent.js
```

### Test Reports
- `logs/FINAL-TEST-REPORT.md` - Comprehensive test analysis
- `logs/component-test-results.json` - Component test results
- `logs/test-results.json` - Dashboard test results
- `logs/multicomponent-test-results.json` - Multi-component test results

---

## Performance

- **Simple components**: 5-10 seconds
- **Complex dashboards**: 30-40 seconds
- **Multi-component layouts**: 60-120 seconds
- **Max iterations**: 20 (configurable in server.js:378)
- **Job timeout**: 5 minutes
- **Cleanup interval**: 10 minutes (removes old jobs)

---

## Troubleshooting

### "Component schema not found"
The schema file is missing. This is included in the backend directory, but if you regenerate it:
```bash
# From project root
npm run generate-schema
cp docs/component-library-schema.json backend/docs/
```

### "GEMINI_API_KEY not found"
Set your API key in `.env`:
```bash
GEMINI_API_KEY=your-key-here
```

### Jobs timing out
- Check Gemini API rate limits
- Simplify complex prompts (break into smaller requests)
- Check `logs/backend.log` for specific errors

### Validation errors persisting
- Check component schema structure
- Verify interfaces are properly extracted
- Review validation error messages in logs
- Gemini should self-correct within 20 iterations

---

## License

MIT
