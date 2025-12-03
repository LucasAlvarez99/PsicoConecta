// Ruta: src/shared/lib/supabase.ts
// Mock temporal de Supabase para desarrollo sin base de datos

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      // Mock: simula login exitoso
      return {
        data: {
          user: {
            id: 'mock-user-id',
            email: email
          },
          session: {
            access_token: 'mock-token'
          }
        },
        error: null
      };
    },
    
    signUp: async ({ email, password, options }: any) => {
      // Mock: simula registro exitoso
      return {
        data: {
          user: {
            id: 'mock-user-id-' + Date.now(),
            email: email
          },
          session: {
            access_token: 'mock-token'
          }
        },
        error: null
      };
    },
    
    signOut: async () => {
      return { error: null };
    },
    
    getSession: async () => {
      // Mock: devuelve sesión falsa si hay algo en localStorage
      const mockUser = localStorage.getItem('mock-user');
      if (mockUser) {
        return {
          data: {
            session: {
              user: JSON.parse(mockUser),
              access_token: 'mock-token'
            }
          },
          error: null
        };
      }
      return {
        data: { session: null },
        error: null
      };
    },
    
    refreshSession: async () => {
      return {
        data: { session: null },
        error: null
      };
    },
    
    resetPasswordForEmail: async (email: string) => {
      return { error: null };
    },
    
    updateUser: async (data: any) => {
      return { error: null };
    },
    
    onAuthStateChange: (callback: any) => {
      // Mock: simula listener de cambios de auth
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },
  
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          // Mock: devuelve usuario falso
          if (table === 'users') {
            const mockUser = {
              id: 'mock-user-id',
              email: 'demo@psicoconecta.com',
              first_name: 'Usuario',
              last_name: 'Demo',
              role: 'patient',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            // Guardar en localStorage para persistencia
            localStorage.setItem('mock-user', JSON.stringify(mockUser));
            
            return {
              data: mockUser,
              error: null
            };
          }
          return {
            data: null,
            error: null
          };
        }
      })
    }),
    
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          // Mock: simula inserción exitosa
          const newUser = {
            ...data,
            id: 'mock-user-id-' + Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          localStorage.setItem('mock-user', JSON.stringify(newUser));
          
          return {
            data: newUser,
            error: null
          };
        }
      })
    }),
    
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            return {
              data: { ...data, updated_at: new Date().toISOString() },
              error: null
            };
          }
        })
      })
    }),
    
    delete: () => ({
      eq: (column: string, value: any) => async () => {
        return { error: null };
      }
    })
  })
};