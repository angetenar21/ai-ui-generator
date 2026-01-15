# Backend Integration Complete ✅

## What Was Implemented

The n8n webhook has been successfully replaced with an async Express.js backend featuring a job queue system.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                  │
│  ┌──────────────┐     ┌─────────────┐     ┌──────────────────┐ │
│  │  ChatPage    │────▶│ apiService  │────▶│  HTTP Client     │ │
│  │  (UI Layer)  │     │  (polling)  │     │ (fetch API)      │ │
│  └──────────────┘     └─────────────┘     └──────────────────┘ │
└──────────────────────────────────│──────────────────────────────┘
                                   │
                                   │ POST /api/agent
                                   │ GET /api/agent/:jobId
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                          │
│  ┌──────────────┐     ┌─────────────┐     ┌──────────────────┐ │
│  │  API Routes  │────▶│  Job Queue  │────▶│  Worker Process  │ │
│  │  (REST API)  │     │  (in-memory)│     │  (async loop)    │ │
│  └──────────────┘     └─────────────┘     └──────────────────┘ │
│                                                    │             │
│                                                    │             │
│                                                    ▼             │
│                              ┌──────────────────────────────┐   │
│                              │   Gemini 2.5 Pro API         │   │
│                              │   (Component Generation)     │   │
│                              └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Async Job Queue
- **Non-blocking API**: Instant 202 responses with jobId
- **Polling-based**: Frontend polls for job status every 1.5 seconds
- **Timeout protection**: Max 5 minutes per job
- **Auto-cleanup**: Old jobs removed after 10 minutes

### 2. Job Status Tracking
- `queued` - Job waiting in queue
- `processing` - Worker is processing the job
- `completed` - Job finished successfully with result
- `failed` - Job failed with error message
- `timeout` - Job exceeded max processing time

### 3. Enhanced UI Feedback
- Real-time status updates in TypingIndicator
- Progress states: "Request queued" → "Processing" → "Completed"
- Error handling with detailed messages

## Files Changed

### Backend
- ✅ `backend/server.js` - Added job queue system with worker process
- ✅ `backend/README.md` - Updated documentation

### Frontend
- ✅ `src/services/apiService.ts` - New async API service (replaces n8nService)
- ✅ `src/pages/ChatPage.tsx` - Updated to use apiService with status callbacks
- ✅ `src/components/TypingIndicator.tsx` - Enhanced with job status display
- ✅ `src/types/api.types.ts` - New TypeScript type definitions

### Configuration
- ✅ `package.json` - Added concurrently, updated dev script
- ✅ `.env` - Updated with new API configuration
- ✅ `.env.example` - Updated template

## How to Use

### 1. Setup Environment

Edit `.env` and add your Gemini API key:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### 2. Run Development Server

```bash
# Run both backend + frontend together
npm run dev

# Or run separately:
npm run dev:backend   # Backend only on port 4000
npm run dev:frontend  # Frontend only on port 5173
```

### 3. Test the Integration

1. Open http://localhost:5173 in your browser
2. Enter a prompt like "Create a sales dashboard"
3. Watch the status indicator show: Queued → Processing → Completed
4. See the generated component appear

### 4. Monitor Queue (Optional)

```bash
# Check queue status
curl http://localhost:4000/api/queue/status
```

## API Endpoints

### Primary Endpoints (Async)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agent` | Enqueue new job, get jobId |
| GET | `/api/agent/:jobId` | Poll job status and result |
| DELETE | `/api/agent/:jobId` | Cancel/delete a job |
| GET | `/api/queue/status` | Get queue statistics |

### Legacy Endpoints (Backward Compatible)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tools` | Get tool definitions |
| POST | `/validate` | Validate component spec |
| POST | `/generate` | Synchronous generation (blocks) |

## Migration Notes

### From n8nService to apiService

**Old Code (n8nService):**
```typescript
const response = await N8nService.sendMessage(prompt, threadId, context);
```

**New Code (apiService):**
```typescript
const response = await ApiService.sendMessage(
  prompt,
  threadId,
  context,
  {
    onStatusUpdate: (status) => setJobStatus(status),
  }
);
```

### Environment Variables

**Old:**
```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/generate
```

**New:**
```env
VITE_API_BASE_URL=http://localhost:4000
BACKEND_PORT=4000
GEMINI_API_KEY=your_api_key_here
```

## Logging & Debugging

All backend operations are logged to files for debugging:

- **`logs/backend.log`** - All logs (INFO, WARN, ERROR, DEBUG)
- **`logs/error.log`** - Error logs only

### View logs in real-time:
```bash
tail -f logs/backend.log
```

### Search for errors:
```bash
grep "ERROR" logs/backend.log
```

### View a specific job:
```bash
grep "job-id-here" logs/backend.log
```

See **`backend/LOGGING.md`** for comprehensive logging documentation.

## Troubleshooting

### Backend won't start

1. Check if Gemini API key is set:
   ```bash
   grep GEMINI_API_KEY .env
   ```

2. Verify schema file exists:
   ```bash
   npm run generate-schema
   ```

3. Check port availability:
   ```bash
   lsof -i :4000
   ```

### "Failed to parse JSON from Gemini output"

1. Check the full Gemini response in logs:
   ```bash
   grep -A 20 "Gemini Full Response" logs/backend.log | tail -30
   ```

2. Verify the prompt is requesting JSON format

3. Check if model is returning markdown or explanatory text

### "Gemini API error: status 404"

The model name might be incorrect. Try these alternatives in `.env`:
```bash
GEMINI_MODEL=gemini-1.5-pro  # or gemini-pro
```

### Frontend shows "Job not found" error

- The job might have been cleaned up (>10 minutes old)
- Restart the backend to clear the job store
- Reduce `JOB_TIMEOUT_MS` in `backend/server.js` if needed

### Jobs timing out

- Check Gemini API rate limits
- Increase `DEFAULT_MAX_DURATION` in `src/services/apiService.ts`
- Monitor queue with: `curl http://localhost:4000/api/queue/status`
- Check logs for detailed error information

## Performance Notes

- **Job cleanup**: Old jobs auto-delete after 10 minutes
- **Polling interval**: 1.5 seconds (configurable)
- **Max job duration**: 5 minutes (configurable)
- **Queue storage**: In-memory (use Redis for production)

## Next Steps / Future Enhancements

1. **Redis Queue** - Replace in-memory queue with Redis/BullMQ for production
2. **Server-Sent Events** - Add SSE endpoint for real-time updates (no polling)
3. **Progress Tracking** - Add percentage-based progress to worker
4. **Job Persistence** - Persist jobs to database for restart recovery
5. **Rate Limiting** - Add per-session rate limiting
6. **Metrics** - Add Prometheus/Grafana monitoring
7. **WebSocket Support** - Alternative to polling for low-latency updates

## Production Deployment

For production, consider:

1. **Use Redis for queue persistence**
   ```bash
   npm install bull redis
   ```

2. **Add proper error tracking** (Sentry, Datadog)

3. **Configure CORS properly** (restrict origins)

4. **Add authentication/authorization**

5. **Use environment-based config** (staging, production)

6. **Set up health check endpoints**

7. **Add request logging and monitoring**

## Tech Stack Summary

- **Backend**: Express.js 4.19
- **Frontend**: React 18 + Vite 7
- **AI**: Google Gemini 2.5 Pro
- **State**: Zustand 4.5
- **Types**: TypeScript 5.9
- **Dev Tools**: Concurrently 9.1

---

**Integration completed**: 2025-01-11
**Status**: ✅ Ready for testing
**Migration**: n8n webhook → Express async queue
