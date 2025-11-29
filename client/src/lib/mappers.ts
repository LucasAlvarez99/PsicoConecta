import type { Database } from "../../../src/integrations/supabase/types";

type DbUser = Database['public']['Tables']['users']['Row'];

// Map database user to application user format
export function mapDbUserToUser(dbUser: DbUser) {
  return {
    ...dbUser,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    profileImageUrl: dbUser.profile_image_url,
    // Keep both formats for compatibility
    first_name: dbUser.first_name,
    last_name: dbUser.last_name,
    profile_image_url: dbUser.profile_image_url,
  };
}

export type User = ReturnType<typeof mapDbUserToUser>;

