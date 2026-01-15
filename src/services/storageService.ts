import type { GenerationHistory } from '../templates/core/types';

class StorageService {
  private static HISTORY_KEY = 'ai-ui-generator-history';
  private static PREFERENCES_KEY = 'ai-ui-generator-preferences';

  /**
   * Save generation to history
   */
  static saveToHistory(item: GenerationHistory): void {
    const history = this.getHistory();
    history.unshift(item); // Add to beginning

    // Keep only last 100 items
    if (history.length > 100) {
      history.splice(100);
    }

    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  /**
   * Get all history items
   */
  static getHistory(): GenerationHistory[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Get history item by ID
   */
  static getHistoryItem(id: string): GenerationHistory | null {
    const history = this.getHistory();
    return history.find(item => item.id === id) || null;
  }

  /**
   * Delete history item
   */
  static deleteHistoryItem(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
  }

  /**
   * Clear all history
   */
  static clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
  }

  /**
   * Save user preferences
   */
  static savePreferences(prefs: Record<string, any>): void {
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(prefs));
  }

  /**
   * Get user preferences
   */
  static getPreferences(): Record<string, any> {
    const data = localStorage.getItem(this.PREFERENCES_KEY);
    if (!data) return {};

    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  /**
   * Get history by thread ID
   */
  static getHistoryByThread(threadId: string): GenerationHistory[] {
    const history = this.getHistory();
    return history.filter(item => item.threadId === threadId);
  }

  /**
   * Search history by prompt
   */
  static searchHistory(query: string): GenerationHistory[] {
    const history = this.getHistory();
    const lowerQuery = query.toLowerCase();
    return history.filter(item =>
      item.prompt.toLowerCase().includes(lowerQuery)
    );
  }
}

export default StorageService;
