const SESSION_EXPIRED_EVENT = 'incidents:session-expired';

export function notifySessionExpired(): void {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function subscribeToSessionExpired(listener: () => void): () => void {
  window.addEventListener(SESSION_EXPIRED_EVENT, listener);
  return () => {
    window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
  };
}
