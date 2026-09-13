import { generateUUID } from '../utils/uuid';

class SessionManager {
  private static SESSION_KEY = 'ai-ui-generator-session-id';

  static getSessionId(): string {
    let sessionId = sessionStorage.getItem(this.SESSION_KEY);

    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem(this.SESSION_KEY, sessionId);
    }

    return sessionId;
  }

  static clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  static hasActiveSession(): boolean {
    return sessionStorage.getItem(this.SESSION_KEY) !== null;
  }
}

export default SessionManager;
