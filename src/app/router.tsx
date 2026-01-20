// src/app/router.tsx - ACTUALIZADO CON RUTAS MOBILE
import { Route, Switch, useLocation } from 'wouter';
import { lazy, Suspense, useEffect } from 'react';
import { useAuthStore } from '../features/auth/store';
import { LoadingScreen } from '../shared/ui/LoadingScreen';
import { Layout } from '../shared/ui/Layout';
import { MobileLayout } from '../features/mobile/layout/MobileLayout';

// Desktop Pages
const Landing = lazy(() => import('../features/landing/Landing'));
const Login = lazy(() => import('../features/auth/Login'));
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const Chat = lazy(() => import('../features/chat/Chat'));
const Appointments = lazy(() => import('../features/appointments/Appointments'));
const Profile = lazy(() => import('../features/profile/Profile'));
const AIAssistant = lazy(() => import('../features/ai-assistant/AIAssistant'));
const PatientList = lazy(() => import('../features/patients/PatientList'));
const PatientDetail = lazy(() => import('../features/patients/PatientDetail'));
const Settings = lazy(() => import('../features/settings/PsychologistSettings'));
const NotFound = lazy(() => import('../features/not-found/NotFound'));

// Mobile Pages
const MobileBooking = lazy(() => import('../features/mobile/booking/MobileBooking'));
const MobileAppointments = lazy(() => import('../features/mobile/appointments/MobileAppointments'));

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);
  return null;
}

function ProtectedRoute({
  component: Component,
  requiredRole
}: {
  component: React.ComponentType;
  requiredRole?: 'psychologist' | 'patient';
}) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

export function Router() {
  const [location] = useLocation();
  const isMobileRoute = location.startsWith('/mobile');

  return (
    <Suspense fallback={<LoadingScreen />}>
      {isMobileRoute ? (
        // Mobile Layout
        <MobileLayout>
          <Switch>
            <Route path="/mobile/booking">
              <MobileBooking />
            </Route>
            
            <Route path="/mobile/appointments">
              <MobileAppointments />
            </Route>

            <Route path="*">
              <Redirect to="/mobile/booking" />
            </Route>
          </Switch>
        </MobileLayout>
      ) : (
        // Desktop Layout
        <Layout>
          <Switch>
            {/* Public Routes */}
            <Route path="/">
              <PublicRoute component={Landing} />
            </Route>

            <Route path="/login">
              <PublicRoute component={Login} />
            </Route>

            {/* Protected Routes - All Users */}
            <Route path="/dashboard">
              <ProtectedRoute component={Dashboard} />
            </Route>

            <Route path="/profile">
              <ProtectedRoute component={Profile} />
            </Route>

            <Route path="/chat/:patientId?">
              <ProtectedRoute component={Chat} />
            </Route>

            <Route path="/appointments">
              <ProtectedRoute component={Appointments} />
            </Route>

            {/* Protected Routes - Psychologist Only */}
            <Route path="/ai-assistant">
              <ProtectedRoute component={AIAssistant} requiredRole="psychologist" />
            </Route>

            <Route path="/patients">
              <ProtectedRoute component={PatientList} requiredRole="psychologist" />
            </Route>

            <Route path="/patients/:patientId">
              <ProtectedRoute component={PatientDetail} requiredRole="psychologist" />
            </Route>

            <Route path="/settings">
              <ProtectedRoute component={Settings} requiredRole="psychologist" />
            </Route>

            {/* 404 */}
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Layout>
      )}
    </Suspense>
  );
}