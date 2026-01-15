/**
 * API Service for AI UI Generator
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const DEFAULT_POLL_INTERVAL = 500; // 500ms - faster polling for quicker response
const DEFAULT_MAX_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiService {
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
    config?: PollingConfig
  ): Promise<ComponentSpec> {
    const sessionId = SessionManager.getSessionId();

    // Step 1: Enqueue the job
    const jobId = await this.enqueueJob({
      sessionId,
      message,
      threadId,
      context,
    });

    // Step 2: Poll for completion
    const result = await this.pollJobStatus(jobId, config);

    // Step 3: Transform result to ComponentSpec
    return this.transformResultToComponentSpec(result);
  }

  /**
   * Enqueue a new job and get jobId
   */
  static async enqueueJob(request: JobRequest): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Network Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        }));

        throw new Error(errorData.message || errorData.error || 'Failed to enqueue job');
      }

      const data: JobEnqueueResponse = await response.json();
      console.log(`[ApiService] Job ${data.jobId} enqueued successfully`);

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
    config?: PollingConfig
  ): Promise<JobResult> {
    const pollInterval = config?.pollInterval ?? DEFAULT_POLL_INTERVAL;
    const maxDuration = config?.maxDuration ?? DEFAULT_MAX_DURATION;
    const startTime = Date.now();
    let lastStatus: JobStatus | null = null;
    let adaptiveInterval = pollInterval;

    console.log(`[ApiService] Starting to poll job ${jobId}`);

    while (true) {
      // Check timeout
      const elapsed = Date.now() - startTime;
      if (elapsed > maxDuration) {
        throw new Error(`Job ${jobId} timed out after ${maxDuration}ms`);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/agent/${jobId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
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
            console.log(`[ApiService] Job ${jobId} completed successfully`);
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${API_BASE_URL}/health`, {
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
      const spec = result.spec;

      // Validate spec has minimum required structure
      if (!this.isValidComponentData(spec)) {
        console.error('[ApiService] Invalid component spec received:', spec);
        throw new Error('Invalid component specification');
      }

      // Normalize to ComponentSpec format
      return this.normalizeToComponentSpec(spec as Record<string, unknown>);

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

    if (children && children.length > 0) {
      componentSpec.children = children;
    }

    return componentSpec as ComponentSpec;
  }
}

export default ApiService;
