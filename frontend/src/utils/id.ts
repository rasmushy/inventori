// Generate a unique identifier for testing purposes before backend is implemented
export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() ??
      ('id_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36))
  }
  return 'id_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}


