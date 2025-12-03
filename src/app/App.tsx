// Ruta: src/app/App.tsx
import { Router } from './router';
import { AuthProvider } from '../features/auth/AuthProvider';
import { Toaster } from '../shared/ui/Toast';

export default function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}