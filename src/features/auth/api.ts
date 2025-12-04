// Ruta: src/features/auth/api.ts
import type { LoginForm, RegisterForm, User } from '../../shared/types';

// Mock users database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'psico': {
    password: 'admin',
    user: {
      id: 'psico-001',
      email: 'psico@psicoconecta.com',
      firstName: 'Dr. María',
      lastName: 'González',
      role: 'psychologist',
      profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      phone: '+54 11 1234-5678',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  'paciente': {
    password: 'admin',
    user: {
      id: 'patient-001',
      email: 'paciente@psicoconecta.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'patient',
      phone: '+54 11 9876-5432',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};

export const authApi = {
  /**
   * Login with username and password
   */
  async login(credentials: LoginForm) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user exists
    const mockUser = MOCK_USERS[credentials.email];
    
    if (!mockUser) {
      throw new Error('Usuario no encontrado');
    }

    if (mockUser.password !== credentials.password) {
      throw new Error('Contraseña incorrecta');
    }

    // Save to localStorage for persistence
    localStorage.setItem('mock-user', JSON.stringify(mockUser.user));
    localStorage.setItem('mock-session', JSON.stringify({
      token: 'mock-token-' + Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    }));

    return mockUser.user;
  },

  /**
   * Register new user (disabled in this version)
   */
  async register(credentials: RegisterForm) {
    throw new Error('El registro de nuevos usuarios está deshabilitado. Use las credenciales proporcionadas.');
  },

  /**
   * Logout
   */
  async logout() {
    localStorage.removeItem('mock-user');
    localStorage.removeItem('mock-session');
    return Promise.resolve();
  },

  /**
   * Get current session
   */
  async getSession() {
    const mockUser = localStorage.getItem('mock-user');
    const mockSession = localStorage.getItem('mock-session');

    if (!mockUser || !mockSession) {
      return null;
    }

    const session = JSON.parse(mockSession);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('mock-user');
      localStorage.removeItem('mock-session');
      return null;
    }

    return JSON.parse(mockUser);
  },

  /**
   * Refresh session
   */
  async refreshSession() {
    const user = await this.getSession();
    if (user) {
      localStorage.setItem('mock-session', JSON.stringify({
        token: 'mock-token-' + Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      }));
    }
    return user;
  },

  /**
   * Reset password request
   */
  async resetPassword(email: string) {
    throw new Error('La recuperación de contraseña no está disponible en modo demo');
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    throw new Error('El cambio de contraseña no está disponible en modo demo');
  }
};