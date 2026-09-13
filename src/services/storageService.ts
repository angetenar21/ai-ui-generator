import type { GenerationHistory } from '../templates/core/types';

class StorageService {
  private static HISTORY_KEY = 'ai-ui-generator-history';
  private static PREFERENCES_KEY = 'ai-ui-generator-preferences';
  // In-memory cache to avoid re-parsing localStorage JSON on every call
  private static _historyCache: GenerationHistory[] | null = null;

  // ── Private helpers ──────────────────────────────────────────────────────────

  /** Read from cache or parse localStorage once. */
  private static _read(): GenerationHistory[] {
    if (this._historyCache !== null) return this._historyCache;
    const data = localStorage.getItem(this.HISTORY_KEY);
    if (!data) { this._historyCache = []; return []; }
    try {
      this._historyCache = JSON.parse(data);
      return this._historyCache!;
    } catch {
      this._historyCache = [];
      return [];
    }
  }

  /**
   * Persist the cache to localStorage.
   * Implements a QuotaExceededError guard: if storage is full, evict
   * the oldest 20 items and retry once before giving up.
   */
  private static _write(history: GenerationHistory[]): void {
    this._historyCache = history;
    const serialized = JSON.stringify(history);
    try {
      localStorage.setItem(this.HISTORY_KEY, serialized);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        // Evict oldest 20 items and retry
        const trimmed = history.slice(0, Math.max(1, history.length - 20));
        this._historyCache = trimmed;
        try {
          localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmed));
        } catch {
          // Storage completely full — fail silently; data is still in memory
        }
      }
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  /** Save generation to history */
  static saveToHistory(item: GenerationHistory): void {
    const history = this._read();
    history.unshift(item);
    // Keep only last 100 items
    if (history.length > 100) history.splice(100);
    this._write(history);
  }

  /** Get all history items */
  static getHistory(): GenerationHistory[] {
    return this._read();
  }

  /** Get history item by ID */
  static getHistoryItem(id: string): GenerationHistory | null {
    return this._read().find(item => item.id === id) || null;
  }

  /** Delete history item */
  static deleteHistoryItem(id: string): void {
    const history = this._read().filter(item => item.id !== id);
    this._write(history);
  }

  /** Update an existing history item (or add if missing) */
  static updateHistoryItem(id: string, updates: Partial<GenerationHistory>): void {
    const history = this._read();
    const index = history.findIndex(item => item.id === id);

    if (index === -1) {
      if (updates && Object.keys(updates).length > 0) {
        history.unshift({
          id,
          prompt: updates.prompt || '',
          response: updates.response as GenerationHistory['response'],
          timestamp: updates.timestamp || Date.now(),
          threadId: updates.threadId || id,
          sessionId: updates.sessionId || '',
        });
      }
    } else {
      history[index] = { ...history[index], ...updates };
    }

    this._write(history);
  }

  /** Clear all history */
  static clearHistory(): void {
    this._historyCache = [];
    localStorage.removeItem(this.HISTORY_KEY);
  }

  /** Save user preferences */
  static savePreferences(prefs: Record<string, unknown>): void {
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(prefs));
  }

  /** Get user preferences */
  static getPreferences(): Record<string, unknown> {
    const data = localStorage.getItem(this.PREFERENCES_KEY);
    if (!data) return {};
    try { return JSON.parse(data); } catch { return {}; }
  }

  /** Get history by thread ID */
  static getHistoryByThread(threadId: string): GenerationHistory[] {
    return this._read()
      .filter(item => (item.threadId || item.id) === threadId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /** Search history by prompt */
  static searchHistory(query: string): GenerationHistory[] {
    const lowerQuery = query.toLowerCase();
    return this._read().filter(item =>
      item.prompt.toLowerCase().includes(lowerQuery)
    );
  }
}

export default StorageService;
