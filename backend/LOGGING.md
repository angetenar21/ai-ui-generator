# Backend Logging System

## Overview

The backend includes comprehensive logging to help debug issues with the Gemini API integration and job processing.

## Log Files

All logs are stored in the `logs/` directory at the project root:

- **`logs/backend.log`** - All logs (INFO, WARN, ERROR, DEBUG)
- **`logs/error.log`** - Error logs only

## Log Rotation

- Log files are automatically rotated when they exceed **10MB**
- Rotated files are timestamped: `backend-2025-01-11T10-30-00.log`
- Old rotated logs should be cleaned up manually

## What Gets Logged

### Job Lifecycle
- Job enqueued with sessionId and message preview
- Job processing started
- Job completed with duration
- Job failed with error and duration

### Gemini API Calls
- **Request**: Model, prompt preview (200 chars), context preview, full lengths
- **Response**: Status, response length, text preview (500 chars)
- **Full Data**: Complete prompt and response in DEBUG logs
- **Errors**: Full error details and response data

### JSON Parsing
- Extraction attempts and success/failure
- Full text output when parsing fails
- Which parsing strategy succeeded (direct, code block, pattern match)

### Validation
- Component name and validation result
- All validation errors

### Queue Operations
- Queue length after enqueue
- Cleanup operations (old jobs removed)

## Viewing Logs

### Tail the main log file:
```bash
tail -f logs/backend.log
```

### View only errors:
```bash
tail -f logs/error.log
```

### Search for a specific job:
```bash
grep "fd1b3c86-c00f-422a-85f8-ed88a00d2f1c" logs/backend.log
```

### View Gemini responses:
```bash
grep -A 10 "Gemini Full Response" logs/backend.log
```

### View failed jobs:
```bash
grep "Job Failed" logs/backend.log
```

## Common Issues & Debugging

### Issue: "Failed to parse JSON from Gemini output"

**What to check:**
1. Look at the full Gemini response in the log:
   ```bash
   grep -A 20 "Gemini Full Response" logs/backend.log | tail -30
   ```

2. Check if Gemini is returning markdown or plain text instead of JSON

3. Look at the prompt that was sent:
   ```bash
   grep -A 10 "Gemini Full Prompt" logs/backend.log | tail -20
   ```

**Common causes:**
- Prompt doesn't explicitly request JSON output
- Model is returning explanation text before/after JSON
- Model is wrapping JSON in markdown code blocks (handled automatically)

### Issue: "Gemini API error: status 404"

**What to check:**
1. Verify the model name is correct:
   ```bash
   grep "GEMINI_MODEL" .env
   ```

2. Check if the model exists and is accessible:
   - `gemini-2.5-pro` (if available)
   - `gemini-1.5-pro` (stable alternative)
   - `gemini-pro` (older version)

3. View the full error response:
   ```bash
   grep "Gemini API returned non-OK status" logs/backend.log
   ```

### Issue: "Gemini response missing text payload"

**What to check:**
1. Check the response structure in logs:
   ```bash
   grep -A 30 "Gemini response missing text payload" logs/backend.log
   ```

2. Verify the API response format matches expectations

3. Check for rate limiting or quota errors

## Log Levels

- **INFO**: Normal operations, API requests, job lifecycle
- **WARN**: Unusual situations that aren't errors
- **ERROR**: Failures that prevent job completion
- **DEBUG**: Detailed information (full prompts/responses) - only in files, not console

## Performance Monitoring

Track job durations:
```bash
grep "Job Completed" logs/backend.log | grep -o "durationMs: [0-9]*"
```

Average response time:
```bash
grep "durationMs" logs/backend.log | grep -o "[0-9]*" | awk '{sum+=$1; count++} END {print sum/count " ms"}'
```

## Cleaning Up Logs

Remove old log files:
```bash
rm logs/backend-*.log
rm logs/error-*.log
```

Clear current logs (be careful!):
```bash
> logs/backend.log
> logs/error.log
```

## Log Format

Each log entry includes:
```
[ISO_TIMESTAMP] [LEVEL] message
{optional JSON data}
```

Example:
```
[2025-01-11T10:30:15.123Z] [INFO] Job Enqueued: fd1b3c86-c00f-422a-85f8-ed88a00d2f1c
{
  "sessionId": "abc123",
  "message": "Create a sales dashboard"
}
```

## Integration with Monitoring Tools

The log format is compatible with:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **DataDog**
- **CloudWatch** (for AWS deployments)

Simply point your log aggregator to the `logs/` directory.
