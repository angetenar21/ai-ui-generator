/**
 * API Type Definitions for AI UI Generator Backend
 *
 * These types define the contract between the frontend and Express backend
 * for the async job queue system.
 */

import type { ComponentSpec } from '../templates/core/types';

/**
 * Job status states
 */
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'timeout';

/**
 * Request payload for enqueuing a new job
 * POST /api/agent
 */
export interface JobRequest {
  /** Unique session identifier from SessionManager */
  sessionId: string;
  /** User message/prompt for component generation */
  message: string;
  /** Optional thread ID for conversation tracking */
  threadId?: string | null;
  /** Optional context (previous components, user preferences, etc.) */
  context?: {
    previousComponents?: ComponentSpec[];
    userPreferences?: Record<string, unknown>;
    [key: string]: unknown;
  } | null;
}

/**
 * Response when enqueuing a new job
 * Returns 202 Accepted
 */
export interface JobEnqueueResponse {
  /** Unique job identifier for polling */
  jobId: string;
  /** Initial status (always 'queued') */
  status: 'queued';
  /** Confirmation message */
  message: string;
}

/**
 * Job result structure when completed
 */
export interface JobResult {
  /** Generated component specification */
  spec: ComponentSpec;
  /** Validation result */
  validation: {
    valid: boolean;
    errors: string[];
  };
  /** Raw LLM output (for debugging) */
  raw: string;
  /** Tool definitions used */
  toolDefinitions: Array<{
    name: string;
    description: string;
    response: Record<string, unknown>;
  }>;
  /** Serialized spec (JSON string) */
  serializedSpec: string;
  /** Original session ID */
  sessionId: string;
  /** Original thread ID */
  threadId: string | null;
}

/**
 * Response when polling job status
 * GET /api/agent/:jobId
 */
export interface JobStatusResponse {
  /** Job identifier */
  jobId: string;
  /** Current job status */
  status: JobStatus;
  /** When job was created */
  createdAt: string;
  /** When job started processing (if status >= processing) */
  startedAt?: string;
  /** When job completed (if status = completed/failed/timeout) */
  completedAt?: string;
  /** Result payload (if status = completed) */
  result?: JobResult;
  /** Error message (if status = failed/timeout) */
  error?: string;
  /** Optional progress indicator (0-100) */
  progress?: number;
}

/**
 * Queue statistics
 * GET /api/queue/status
 */
export interface QueueStatus {
  /** Number of jobs in queue */
  queueLength: number;
  /** Total jobs in memory */
  totalJobs: number;
  /** Breakdown by status */
  jobs: {
    queued: number;
    processing: number;
    completed: number;
    failed: number;
    timeout: number;
  };
}

/**
 * Backend health payload
 */
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  queue: QueueStatus;
  worker: {
    running: boolean;
    pendingJobs: number;
    queueLength: number;
  };
  environment: {
    port: number;
    model: string;
    jobTimeoutMs: number;
  };
  schema: {
    hasSchema: boolean;
    components: number;
    categories: number;
  };
  message?: string;
}

/**
 * Generic API error response
 */
export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

/**
 * Polling configuration
 */
export interface PollingConfig {
  /** Interval between polls in milliseconds */
  pollInterval?: number;
  /** Maximum polling duration in milliseconds */
  maxDuration?: number;
  /** Callback for status updates */
  onStatusUpdate?: (status: JobStatus) => void;
  /** Callback for progress updates */
  onProgress?: (progress: number) => void;
}
