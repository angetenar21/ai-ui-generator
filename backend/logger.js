/**
 * Logger utility for backend server
 * Writes logs to both console and file with timestamps
 */

import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'backend.log');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'error.log');
const RESPONSES_DIR = path.join(LOG_DIR, 'responses');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Create responses directory for storing JSON responses
if (!fs.existsSync(RESPONSES_DIR)) {
  fs.mkdirSync(RESPONSES_DIR, { recursive: true });
}

// Initialize log files
function initLogFiles() {
  const timestamp = new Date().toISOString();
  const separator = '\n' + '='.repeat(80) + '\n';
  const header = `${separator}Server started at ${timestamp}${separator}\n`;

  fs.appendFileSync(LOG_FILE, header);
  fs.appendFileSync(ERROR_LOG_FILE, header);
}

initLogFiles();

/**
 * Format log entry with timestamp and level
 */
function formatLogEntry(level, message, data) {
  const timestamp = new Date().toISOString();
  let logEntry = `[${timestamp}] [${level}] ${message}`;

  if (data !== undefined) {
    if (typeof data === 'object') {
      try {
        logEntry += '\n' + JSON.stringify(data, null, 2);
      } catch (e) {
        logEntry += '\n[Unable to stringify data]';
      }
    } else {
      logEntry += '\n' + String(data);
    }
  }

  return logEntry + '\n';
}

/**
 * Write to log file
 */
function writeToFile(filePath, content) {
  try {
    fs.appendFileSync(filePath, content);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

/**
 * Logger class
 */
class Logger {
  /**
   * Log info message
   */
  static info(message, data) {
    const logEntry = formatLogEntry('INFO', message, data);
    console.log(`[INFO] ${message}`, data !== undefined ? data : '');
    writeToFile(LOG_FILE, logEntry);
  }

  /**
   * Log error message
   */
  static error(message, data) {
    const logEntry = formatLogEntry('ERROR', message, data);
    console.error(`[ERROR] ${message}`, data !== undefined ? data : '');
    writeToFile(LOG_FILE, logEntry);
    writeToFile(ERROR_LOG_FILE, logEntry);
  }

  /**
   * Log warning message
   */
  static warn(message, data) {
    const logEntry = formatLogEntry('WARN', message, data);
    console.warn(`[WARN] ${message}`, data !== undefined ? data : '');
    writeToFile(LOG_FILE, logEntry);
  }

  /**
   * Log debug message (only written to file, not console)
   */
  static debug(message, data) {
    const logEntry = formatLogEntry('DEBUG', message, data);
    writeToFile(LOG_FILE, logEntry);
  }

  /**
   * Log API request
   */
  static apiRequest(method, endpoint, body) {
    const message = `API Request: ${method} ${endpoint}`;
    const data = body ? { body } : undefined;
    this.info(message, data);
  }

  /**
   * Log API response
   */
  static apiResponse(method, endpoint, status, body) {
    const message = `API Response: ${method} ${endpoint} - ${status}`;
    const data = body ? { body } : undefined;
    this.info(message, data);
  }

  /**
   * Log Gemini API call
   */
  static geminiRequest(model, prompt, context) {
    const message = `Gemini Request: ${model}`;
    this.info(message, {
      prompt: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
      context: context?.substring(0, 200) + (context && context.length > 200 ? '...' : ''),
      promptLength: prompt.length,
      contextLength: context?.length || 0,
    });

    // Write full prompt to debug log
    this.debug('Gemini Full Prompt', { fullPrompt: prompt, fullContext: context });
  }

  /**
   * Log Gemini API response
   */
  static geminiResponse(model, response, rawText) {
    const message = `Gemini Response: ${model}`;
    this.info(message, {
      status: response.status,
      ok: response.ok,
      textLength: rawText?.length || 0,
      textPreview: rawText?.substring(0, 500) + (rawText && rawText.length > 500 ? '...' : ''),
    });

    // Write full response to debug log
    this.debug('Gemini Full Response', { fullText: rawText });
  }

  /**
   * Log Gemini API error
   */
  static geminiError(model, error, responseData) {
    const message = `Gemini Error: ${model}`;
    this.error(message, {
      error: error.message,
      responseData,
    });
  }

  /**
   * Log job lifecycle
   */
  static jobEnqueued(jobId, sessionId, message) {
    this.info(`Job Enqueued: ${jobId}`, {
      sessionId,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
    });
  }

  static jobProcessing(jobId) {
    this.info(`Job Processing: ${jobId}`);
  }

  static jobCompleted(jobId, duration) {
    this.info(`Job Completed: ${jobId}`, { durationMs: duration });
  }

  static jobFailed(jobId, error, duration) {
    this.error(`Job Failed: ${jobId}`, {
      error: error.message || String(error),
      durationMs: duration,
    });
  }

  /**
   * Log validation results
   */
  static validation(spec, result) {
    const message = `Validation: ${result.valid ? 'PASS' : 'FAIL'}`;
    this.info(message, {
      componentName: spec?.name,
      valid: result.valid,
      errors: result.errors,
    });
  }

  /**
   * Save Gemini response to JSON file
   */
  static saveGeminiResponse(jobId, prompt, rawResponse, parsedJson, validationResult) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${timestamp}_${jobId}.json`;
      const filepath = path.join(RESPONSES_DIR, filename);

      const responseData = {
        jobId,
        timestamp: new Date().toISOString(),
        prompt: prompt.substring(0, 500) + (prompt.length > 500 ? '...' : ''),
        fullPrompt: prompt,
        rawResponse,
        parsedJson,
        validation: validationResult,
      };

      fs.writeFileSync(filepath, JSON.stringify(responseData, null, 2));
      this.info(`Gemini response saved: ${filename}`);
      return filepath;
    } catch (err) {
      this.error('Failed to save Gemini response', { error: err.message });
      return null;
    }
  }

  /**
   * Rotate log files if they get too large (>10MB)
   */
  static rotateLogs() {
    const maxSize = 10 * 1024 * 1024; // 10MB

    [LOG_FILE, ERROR_LOG_FILE].forEach(file => {
      try {
        const stats = fs.statSync(file);
        if (stats.size > maxSize) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const rotatedFile = file.replace('.log', `-${timestamp}.log`);
          fs.renameSync(file, rotatedFile);
          this.info(`Log file rotated: ${path.basename(rotatedFile)}`);
        }
      } catch (err) {
        // File doesn't exist yet, ignore
      }
    });
  }
}

// Rotate logs on startup
Logger.rotateLogs();

export default Logger;
