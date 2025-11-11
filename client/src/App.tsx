import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import ChatPage from "@/pages/chat";
import { useAuth } from "@/hooks/useAuth";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600 font-medium">Cargando...</p>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Home /> : <Landing />}
      </Route>
      <Route path="/profile">
        {isAuthenticated ? <Profile /> : <Landing />}
      </Route>
      <Route path="/chat/:patientId">
        {isAuthenticated ? <ChatPage /> : <Landing />}
      </Route>
      <Route path="/admin">
        {isAuthenticated && user?.role === 'psychologist' ? <Admin /> : <Landing />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
