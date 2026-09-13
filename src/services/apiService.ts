/**
 * API Service for AI UI-UX Generator
 *
 * Handles async job queue communication with the Express backend.
 * Replaces the old n8nService with a polling-based architecture.
 */

import type {
  JobRequest,
  JobEnqueueResponse,
  JobStatusResponse,
  JobResult,
  JobStatus,
  ApiError,
  PollingConfig,
  QueueStatus,
  HealthStatus,
} from '../types/api.types';
import type { ComponentSpec } from '../templates/core/types';
import SessionManager from './sessionManager';
import { auth } from '../config/firebase';

const envUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = envUrl !== undefined ? (envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl) : 'http://localhost:4000';
const DEFAULT_POLL_INTERVAL = 500; // 500ms - faster polling for quicker response
const DEFAULT_MAX_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiService {
  /** Detect raw React elements to avoid treating them as component specs */
  private static isReactElement(data: unknown): boolean {
    return Boolean(
      data &&
      typeof data === 'object' &&
      // React elements carry a $$typeof symbol
      '$$typeof' in (data as Record<string, unknown>)
    );
  }

  /**
   * Helper to retrieve Firebase ID Token headers
   * @param forceRefresh - If true, forcefully invalidates the cached JWT and mints a fresh token
   */
  private static async getHeaders(forceRefresh = false): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken(forceRefresh);
        headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error('[ApiService] Failed to fetch Firebase auth token', e);
      }
    }
    
    return headers;
  }

  /**
   * Send a message and wait for completion using async polling
   */
  static async sendMessage(
    message: string,
    threadId?: string,
    context?: {
      previousComponents?: ComponentSpec[];
      userPreferences?: Record<string, unknown>;
    },
    config?: PollingConfig & { onJobId?: (jobId: string) => void; signal?: AbortSignal }
  ): Promise<ComponentSpec> {
    const sessionId = SessionManager.getSessionId();

    // Step 1: Enqueue the job
    const jobId = await this.enqueueJob({
      sessionId,
      message,
      threadId,
      context,
    }, config?.signal);

    if (config?.onJobId) {
      config.onJobId(jobId);
    }

    // Step 2: Poll for completion
    const result = await this.pollJobStatus(jobId, config, config?.signal);

    // Step 3: Transform result to ComponentSpec
    return this.transformResultToComponentSpec(result);
  }

  /**
   * Enqueue a new job and get jobId
   */
  static async enqueueJob(request: JobRequest): Promise<string>;
  static async enqueueJob(request: JobRequest, signal?: AbortSignal): Promise<string>;
  /**
   * Enqueue a new job with optional abort signal and token retry mechanisms
   */
  static async enqueueJob(request: JobRequest, signal?: AbortSignal, retryOn401 = true): Promise<string> {
    try {
      let headers = await this.getHeaders(false);
      let response = await fetch(`${API_BASE_URL}/api/agent`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
        signal,
      });

      // SECURITY/UX FIX: Intercept 401 Unauthorized errors caused by expired tokens.
      // Forcefully grab a perfectly fresh token and replay the network request automatically.
      if (response.status === 401 && retryOn401) {
        console.warn('[ApiService] Session token detected as expired (401). Force-refreshing JWT and retrying network request...');
        headers = await this.getHeaders(true);
        response = await fetch(`${API_BASE_URL}/api/agent`, {
          method: 'POST',
          headers,
          body: JSON.stringify(request),
          signal,
        });
      }

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Network Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        }));

        throw new Error(errorData.message || errorData.error || 'Failed to enqueue job');
      }

      const data: JobEnqueueResponse = await response.json();
      return data.jobId;
    } catch (error) {
      console.error('[ApiService] Error enqueuing job:', error);
      throw error;
    }
  }

  /**
   * Poll job status until completion or timeout
   * Uses adaptive polling: faster when processing, slower when queued
   */
  static async pollJobStatus(
    jobId: string,
    config?: PollingConfig,
    signal?: AbortSignal
  ): Promise<JobResult> {
    const pollInterval = config?.pollInterval ?? DEFAULT_POLL_INTERVAL;
    const maxDuration = config?.maxDuration ?? DEFAULT_MAX_DURATION;
    const startTime = Date.now();
    let lastStatus: JobStatus | null = null;
    let adaptiveInterval = pollInterval;


    while (true) {
      // Check timeout
      const elapsed = Date.now() - startTime;
      if (elapsed > maxDuration) {
        throw new Error(`Job ${jobId} timed out after ${maxDuration}ms`);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/agent/${jobId}`, {
          method: 'GET',
          headers: await this.getHeaders(),
          signal,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Job ${jobId} not found`);
          }

          const errorData: ApiError = await response.json().catch(() => ({
            error: 'Network Error',
            message: `HTTP ${response.status}: ${response.statusText}`,
          }));

          throw new Error(errorData.message || errorData.error || 'Failed to get job status');
        }

        const status: JobStatusResponse = await response.json();

        // Adaptive polling: faster when processing, slower when queued
        if (status.status !== lastStatus) {
          if (status.status === 'processing') {
            adaptiveInterval = Math.max(150, pollInterval * 0.75); // 75% of normal when processing (150ms)
          } else if (status.status === 'queued') {
            adaptiveInterval = pollInterval; // Normal interval when queued (200ms)
          }
          lastStatus = status.status;
        }

        // Call status update callback
        if (config?.onStatusUpdate) {
          config.onStatusUpdate(status.status);
        }

        // Call progress callback if available
        if (config?.onProgress && status.progress !== undefined) {
          config.onProgress(status.progress);
        }

        // Handle different statuses
        switch (status.status) {
          case 'completed':
            if (!status.result) {
              throw new Error('Job completed but no result returned');
            }
            return status.result;

          case 'failed':
            throw new Error(`Job failed: ${status.error || 'Unknown error'}`);

          case 'timeout':
            throw new Error(`Job timed out: ${status.error || 'Exceeded maximum processing time'}`);

          case 'queued':
            // Don't log on every poll to reduce noise
            break;

          case 'processing':
            // Don't log on every poll to reduce noise
            break;

          default:
            console.warn(`[ApiService] Unknown job status: ${status.status}`);
        }

        // Wait before next poll with adaptive interval
        await new Promise(resolve => setTimeout(resolve, adaptiveInterval));

      } catch (error) {
        console.error('[ApiService] Error polling job status:', error);
        throw error;
      }
    }
  }

  /**
   * Cancel a job (if still queued)
   */
  static async cancelJob(jobId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/${jobId}`, {
        method: 'DELETE',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel job ${jobId}`);
      }

      console.log(`[ApiService] Job ${jobId} cancelled`);
    } catch (error) {
      console.error('[ApiService] Error cancelling job:', error);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  static async getQueueStatus(): Promise<QueueStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/queue/status`, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to get queue status');
      }

      return await response.json();
    } catch (error) {
      console.error('[ApiService] Error getting queue status:', error);
      throw error;
    }
  }

  /**
   * Fetch backend health metadata
   */
  static async getHealthStatus(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to get health status');
      }

      return await response.json();
    } catch (error) {
      console.error('[ApiService] Error getting health status:', error);
      throw error;
    }
  }

  /**
   * Test API connectivity
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get the current API base URL
   */
  static getApiUrl(): string {
    return API_BASE_URL;
  }

  /**
   * Transform JobResult to ComponentSpec format
   */
  private static transformResultToComponentSpec(result: JobResult): ComponentSpec {
    try {
      let spec: unknown = result.spec;

      // CRITICAL FIX: Check if spec is a string and parse it
      if (typeof spec === 'string') {
        try {
          spec = JSON.parse(spec);
        } catch (parseError) {
          throw new Error('Spec is a string but failed to parse as JSON');
        }
      }

      console.log('[ApiService] Spec type:', typeof spec);
      console.log('[ApiService] Spec structure:', spec);

      // Validate spec has minimum required structure
      if (!this.isValidComponentData(spec)) {
        throw new Error('Invalid component specification');
      }

      // Normalize to ComponentSpec format
      const normalized = this.normalizeToComponentSpec(spec as Record<string, unknown>);
      return normalized;

    } catch (error) {
      console.error('[ApiService] Error transforming result:', error);

      // Return error component as fallback
      return {
        type: 'alert',
        props: {
          type: 'error',
          title: 'Component Parsing Error',
          message: `Failed to parse component: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        metadata: {
          componentId: `error-${Date.now()}`,
          generatedAt: new Date().toISOString(),
          description: 'Error fallback component',
        },
      };
    }
  }

  /**
   * Validate if data has the minimum required structure
   */
  private static isValidComponentData(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false;

    // Ignore already-rendered React elements
    if (this.isReactElement(data)) return false;

    const obj = data as Record<string, unknown>;

    // Must have either 'name' or 'type'
    const hasIdentifier = Boolean(obj.name || obj.type);

    // Must have valid props structure (if present)
    const hasValidTemplateProps = !obj.templateProps || typeof obj.templateProps === 'object';
    const hasValidProps = !obj.props || typeof obj.props === 'object';

    return hasIdentifier && hasValidTemplateProps && hasValidProps;
  }

  /**
   * Normalize children arrays recursively
   */
  private static normalizeChildren(children: unknown): ComponentSpec[] | undefined {
    if (!children) return undefined;

    // Handle various children formats
    let childArray: unknown[] = [];

    if (Array.isArray(children)) {
      childArray = children;
    } else if (typeof children === 'string') {
      // CRITICAL FIX: Handle stringified children
      try {
        const parsed = JSON.parse(children);
        if (Array.isArray(parsed)) {
          childArray = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
          childArray = [parsed];
        } else {
          console.warn('[ApiService] Children is a string but not valid JSON:', children.substring(0, 100));
          return undefined;
        }
      } catch (e) {
        console.warn('[ApiService] Children is a string but failed to parse:', children.substring(0, 100));
        return undefined;
      }
    } else if (typeof children === 'object' && (children as any).name) {
      // Single child object
      childArray = [children];
    } else {
      return undefined;
    }

    // Filter and transform valid children
    return childArray
      .filter((child) => this.isValidComponentData(child))
      .map((child) => this.normalizeToComponentSpec(child as Record<string, unknown>));
  }

  /**
   * Normalize any format to standard ComponentSpec
   */
  private static normalizeToComponentSpec(data: Record<string, unknown>): ComponentSpec {
    // Safeguard against React elements sneaking through
    if (this.isReactElement(data)) {
      throw new Error('Received React element instead of component spec');
    }

    // Extract component identifier
    const type = (data.type || data.name) as string;

    // Extract props (merge templateProps and props for flexibility)
    const props: Record<string, unknown> = {
      ...(data.props as Record<string, unknown> || {}),
      ...(data.templateProps as Record<string, unknown> || {}),
    };

    // Handle various children patterns
    let children: ComponentSpec[] | undefined = undefined;

    // Pattern 1: children array directly in data
    if (data.children && Array.isArray(data.children)) {
      children = this.normalizeChildren(data.children);
    }

    // Pattern 2: children in templateProps/props
    if (props.children && Array.isArray(props.children)) {
      children = this.normalizeChildren(props.children);
      delete props.children; // Remove from props
    }

    // Pattern 3: sections array (layout pattern)
    if (data.sections && Array.isArray(data.sections)) {
      children = this.normalizeChildren(data.sections);
    }

    // Pattern 4: sections in templateProps/props
    if (props.sections && Array.isArray(props.sections)) {
      children = this.normalizeChildren(props.sections);
      delete props.sections; // Remove from props
    }

    // Pattern 5: content property with nested component
    if (props.content && typeof props.content === 'object' && ((props.content as any).name || (props.content as any).type)) {
      const contentChild = this.normalizeToComponentSpec(props.content as Record<string, unknown>);
      children = children ? [...children, contentChild] : [contentChild];
      delete props.content; // Remove from props
    }

    // Generate metadata
    const metadata = (data.metadata as ComponentSpec['metadata']) || {
      componentId: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      generatedAt: new Date().toISOString(),
      description: `Generated ${type} component`,
    };

    const componentSpec: ComponentSpec = {
      type,
      props,
      metadata,
    };

    // Preserve data block if present (for scavenging)
    if (data.data) {
      (componentSpec as any).data = data.data;
    }

    if (children && children.length > 0) {
      componentSpec.children = children;
    }

    return componentSpec as ComponentSpec;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STREAMING API — Real-time SSE Generation
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Stream a generation request via SSE.
   *
   * Opens a long-lived connection to POST /api/agent/stream and yields
   * text chunks as they arrive. The caller accumulates the full text
   * and can attempt incremental parsing at each chunk.
   *
   * @example
   * ```ts
   * let fullText = '';
   * for await (const chunk of ApiService.streamGeneration('Create a dashboard')) {
   *   fullText += chunk;
   *   tryParseAndRender(fullText);
   * }
   * // Stream done — fullText is the complete response
   * ```
   */
  static async *streamGeneration(
    message: string,
    options?: {
      threadId?: string;
      context?: {
        previousComponents?: ComponentSpec[];
        userPreferences?: Record<string, unknown>;
      };
      signal?: AbortSignal;
      onStreamStart?: () => void;
      onStreamEnd?: (totalChars: number) => void;
      onError?: (error: string) => void;
    }
  ): AsyncGenerator<string, void, undefined> {
    const sessionId = SessionManager.getSessionId();

    let headers = await this.getHeaders(false);
    let response = await fetch(`${API_BASE_URL}/api/agent/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sessionId,
        message,
        threadId: options?.threadId,
        context: options?.context,
      }),
      signal: options?.signal,
    });

    // Retry on 401 with fresh token
    if (response.status === 401) {
      console.warn('[ApiService] Streaming: 401 received, refreshing token...');
      headers = await this.getHeaders(true);
      response = await fetch(`${API_BASE_URL}/api/agent/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId,
          message,
          threadId: options?.threadId,
          context: options?.context,
        }),
        signal: options?.signal,
      });
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Stream request failed (${response.status}): ${errorText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null — streaming not supported');
    }

    options?.onStreamStart?.();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let totalChars = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE frames (each ends with \n\n)
        const frames = buffer.split('\n\n');
        buffer = frames.pop() || ''; // Keep incomplete frame in buffer

        for (const frame of frames) {
          if (!frame.trim()) continue;

          // Find the data line
          const dataLine = frame.split('\n').find(line => line.startsWith('data: '));
          if (!dataLine) continue;

          const payload = dataLine.slice(6); // Remove "data: " prefix

          // SSE termination sentinel
          if (payload === '[DONE]') {
            options?.onStreamEnd?.(totalChars);
            return;
          }

          try {
            const data = JSON.parse(payload);

            // Handle error events from backend
            if (data.error) {
              options?.onError?.(data.error);
              console.error('[ApiService] Stream error from backend:', data.error);
              continue;
            }

            // Yield the text chunk
            if (data.text) {
              totalChars += data.text.length;
              yield data.text;
            }
          } catch {
            // Non-fatal: skip unparseable frames (e.g. heartbeat comments)
          }
        }
      }

      // If we exit the read loop without [DONE], stream ended normally
      options?.onStreamEnd?.(totalChars);
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Stream generation and return the complete accumulated text.
   * A simpler wrapper when you don't need chunk-by-chunk access.
   */
  static async streamGenerationFull(
    message: string,
    options?: {
      threadId?: string;
      context?: {
        previousComponents?: ComponentSpec[];
        userPreferences?: Record<string, unknown>;
      };
      signal?: AbortSignal;
      onChunk?: (chunk: string, accumulated: string) => void;
    }
  ): Promise<string> {
    let accumulated = '';

    for await (const chunk of this.streamGeneration(message, {
      threadId: options?.threadId,
      context: options?.context,
      signal: options?.signal,
    })) {
      accumulated += chunk;
      options?.onChunk?.(chunk, accumulated);
    }

    return accumulated;
  }

  /**
   * Stream generation, accumulate text, try to parse as JSON ComponentSpec
   * at the end, and return it. This bridges streaming with the existing
   * ComponentSpec-based rendering system.
   */
  static async streamAndParse(
    message: string,
    options?: {
      threadId?: string;
      context?: {
        previousComponents?: ComponentSpec[];
        userPreferences?: Record<string, unknown>;
      };
      signal?: AbortSignal;
      onChunk?: (chunk: string, accumulated: string) => void;
      onStreamStart?: () => void;
      onStreamEnd?: (totalChars: number) => void;
    }
  ): Promise<ComponentSpec> {
    let accumulated = '';

    for await (const chunk of this.streamGeneration(message, {
      threadId: options?.threadId,
      context: options?.context,
      signal: options?.signal,
      onStreamStart: options?.onStreamStart,
      onStreamEnd: options?.onStreamEnd,
    })) {
      accumulated += chunk;
      options?.onChunk?.(chunk, accumulated);
    }

    // Use format detector to auto-parse JSON or OpenUI Lang
    const { parseResponse } = await import('./formatDetector');
    const result = parseResponse(accumulated);

    if (result.spec) {
      if (result.errors?.length) {
        console.warn('[ApiService] Parse warnings:', result.errors);
      }
      console.log(`[ApiService] Parsed as ${result.format}`, result.spec);
      return result.spec;
    }

    // All parsers failed — return error component
    console.error('[ApiService] All parsers failed:', result.errors);
    return {
      type: 'text',
      props: {
        content: `Streaming completed but failed to parse response (${result.format}). Raw length: ${accumulated.length} chars.`,
        variant: 'body',
      },
      metadata: {
        componentId: `stream-error-${Date.now()}`,
        generatedAt: new Date().toISOString(),
      },
    };
  }
}

export default ApiService;
