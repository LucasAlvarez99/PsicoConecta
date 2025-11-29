import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../src/integrations/supabase/client";
import { mapDbUserToUser, type User } from "@/lib/mappers";
import { useEffect, useState } from "react";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsInitialized(true);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((
      _event: AuthChangeEvent,
      nextSession: Session | null,
    ) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user", session?.user?.id],
    enabled: !!session?.user?.id && isInitialized,
    retry: false,
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }

      return data ? mapDbUserToUser(data) : null;
    },
  });

  const isLoading = !isInitialized || (!!session && isUserLoading);

  return {
    user: user || null,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    error: null,
  };
}
