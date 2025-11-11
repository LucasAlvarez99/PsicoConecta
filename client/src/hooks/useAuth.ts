import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { User } from "@shared/schema";
import { useEffect, useState } from "react";

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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

      return data;
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
