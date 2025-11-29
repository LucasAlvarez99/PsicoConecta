import * as jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  role: string;
  [key: string]: any;
}

export function getWebSocketSecret(): string {
  const wsSecret = process.env.WS_JWT_SECRET;
  
  if (process.env.NODE_ENV === 'production' && !wsSecret) {
    throw new Error('WS_JWT_SECRET must be set in production');
  }
  
  if (!wsSecret) {
    throw new Error('WS_JWT_SECRET environment variable must be set');
  }
  
  return wsSecret;
}

export function createWebSocketToken(payload: JWTPayload, expiresIn: string | number = '15m'): string {
  const secret = getWebSocketSecret();
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as any,
    issuer: 'psicoconecta-ws',
    subject: payload.userId,
  });
}

export function verifyWebSocketToken(token: string): JWTPayload {
  const secret = getWebSocketSecret();
  return jwt.verify(token, secret) as JWTPayload;
}

export function getAuthSecret(): string {
  return process.env.JWT_SECRET || process.env.WS_JWT_SECRET || 'dev-secret';
}
