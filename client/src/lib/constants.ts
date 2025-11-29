export const APP_CONFIG = {
  name: 'PsicoConecta',
  description: 'Plataforma de bienestar mental',
  defaultLocale: 'es',
} as const;

export const ROUTES = {
  landing: '/',
  home: '/home',
  profile: '/profile',
  admin: '/admin',
  chat: '/chat',
} as const;

export const API_ENDPOINTS = {
  auth: {
    user: '/api/auth/user',
    wsToken: '/api/auth/ws-token',
  },
  chat: '/api/chat',
  appointments: '/api/appointments',
  psychologist: '/api/psychologist',
} as const;

export const WEBSOCKET_CONFIG = {
  reconnectAttempts: 5,
  reconnectDelay: 1000,
  tokenRefreshInterval: 14 * 60 * 1000, // 14 minutes
} as const;

export const QUERY_KEYS = {
  user: (id?: string) => [API_ENDPOINTS.auth.user, id],
  chat: (otherUserId?: string) => [API_ENDPOINTS.chat, otherUserId],
  appointments: () => [API_ENDPOINTS.appointments],
  psychologist: () => [API_ENDPOINTS.psychologist],
} as const;
