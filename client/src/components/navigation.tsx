import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Chrome as Home, User, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import AuthDialog from "@/components/auth-dialog";
import { supabase } from "@/lib/supabase";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">PsicoConecta</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              // Not logged in - Landing page navigation
              <>
                <a href="#inicio" className="text-foreground hover:text-primary transition-colors">Inicio</a>
                <a href="#servicios" className="text-foreground hover:text-primary transition-colors">Servicios</a>
                <a href="#testimonios" className="text-foreground hover:text-primary transition-colors">Testimonios</a>
                <a href="#contacto" className="text-foreground hover:text-primary transition-colors">Contacto</a>
              </>
            ) : (
              // Logged in - App navigation
              <>
                <Link 
                  href="/" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/') ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary'
                  }`}
                  data-testid="link-dashboard"
                >
                  <Home className="w-4 h-4" />
                  <span>Inicio</span>
                </Link>
                <Link 
                  href="/profile" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/profile') ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary'
                  }`}
                  data-testid="link-profile"
                >
                  <User className="w-4 h-4" />
                  <span>Perfil</span>
                </Link>
                {user?.role === 'psychologist' && (
                  <Link 
                    href="/admin" 
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary'
                    }`}
                    data-testid="link-admin"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              // Not logged in buttons
              <>
                <Button
                  variant="ghost"
                  onClick={() => setShowAuthDialog(true)}
                  data-testid="button-login"
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => setShowAuthDialog(true)}
                  data-testid="button-register"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Reservar Cita
                </Button>
              </>
            ) : (
              // Logged in user info and logout
              <>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt={user.firstName || "Usuario"}
                        className="w-8 h-8 rounded-full object-cover"
                        data-testid="img-user-avatar-nav"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm" data-testid="text-user-initials-nav">
                          {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')}
                        </span>
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="font-medium text-foreground" data-testid="text-user-name-nav">
                        {user?.firstName || 'Usuario'}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {user?.role === 'psychologist' ? 'Psicólogo' : 'Paciente'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/";
                  }}
                  data-testid="button-logout"
                  className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card" data-testid="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAuthenticated ? (
                // Not logged in - Landing page navigation
                <>
                  <a href="#inicio" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">Inicio</a>
                  <a href="#servicios" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">Servicios</a>
                  <a href="#testimonios" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">Testimonios</a>
                  <a href="#contacto" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">Contacto</a>
                  <div className="border-t border-border mt-4 pt-4 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => { setShowAuthDialog(true); setIsMobileMenuOpen(false); }}
                      data-testid="button-mobile-login"
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => { setShowAuthDialog(true); setIsMobileMenuOpen(false); }}
                      data-testid="button-mobile-register"
                    >
                      Reservar Cita
                    </Button>
                  </div>
                </>
              ) : (
                // Logged in - App navigation
                <>
                  <Link 
                    href="/" 
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/') ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Inicio</span>
                  </Link>
                  <Link 
                    href="/profile" 
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/profile') ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Perfil</span>
                  </Link>
                  {user?.role === 'psychologist' && (
                    <Link 
                      href="/admin" 
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <div className="border-t border-border mt-4 pt-4">
                    {user && (
                      <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                        {user.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt={user.firstName || "Usuario"}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {user.firstName || 'Usuario'}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {user.role === 'psychologist' ? 'Psicólogo' : 'Paciente'}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = "/";
                      }}
                      data-testid="button-mobile-logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </nav>
  );
}
