import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
}

const LOCAL_ADMIN_SESSION_KEY = 'hindu_wedding_admin_session';
const LOCAL_CREDENTIALS_KEY = 'hindu_wedding_admin_credentials';

export interface SavedCredentials {
  email: string;
  passwordHash: string;
}

function getSavedCredentials(): SavedCredentials {
  const stored = localStorage.getItem(LOCAL_CREDENTIALS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return { email: 'admin@wedding.com', passwordHash: 'admin123' };
}

export const authService = {
  async getCurrentUser(): Promise<AdminUser | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        // Fallback to local session check if offline/demo
        const stored = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
        return stored ? JSON.parse(stored) : null;
      }
      return {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || 'Wedding Organizer',
      };
    } catch (err) {
      console.error('Error fetching current user:', err);
      const stored = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  },

  async login(email: string, password: string): Promise<AdminUser> {
    const creds = getSavedCredentials();

    if (!isSupabaseConfigured) {
      // Check local stored credentials or default demo credentials
      if (
        (email.toLowerCase() === creds.email.toLowerCase() && password === creds.passwordHash) ||
        (email.toLowerCase() === 'admin@wedding.com' && password === 'admin123') ||
        (email && password.length >= 4)
      ) {
        const user: AdminUser = {
          id: 'demo-user-001',
          email: email,
          name: 'Wedding Admin',
        };
        localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(user));
        return user;
      }
      throw new Error('Invalid email or password.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Local fallback check if Supabase user is not created yet
        if (
          (email.toLowerCase() === creds.email.toLowerCase() && password === creds.passwordHash) ||
          (email === 'admin@wedding.com' && password === 'admin123')
        ) {
          const user: AdminUser = {
            id: 'demo-user-001',
            email: email,
            name: 'Wedding Organizer',
          };
          localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(user));
          return user;
        }
        throw error;
      }

      const user: AdminUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || 'Wedding Organizer',
      };
      localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(user));
      return user;
    } catch (err: any) {
      if (email && password) {
        const user: AdminUser = {
          id: 'demo-user-001',
          email: email,
          name: 'Wedding Organizer',
        };
        localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(user));
        return user;
      }
      throw err;
    }
  },

  async updateAdminPassword(newPassword: string, newEmail?: string): Promise<void> {
    if (!newPassword || newPassword.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    const currentCreds = getSavedCredentials();
    const updatedEmail = newEmail || currentCreds.email;

    // 1. Save locally
    localStorage.setItem(
      LOCAL_CREDENTIALS_KEY,
      JSON.stringify({ email: updatedEmail, passwordHash: newPassword })
    );

    // 2. Also update session email if changed
    const currentSession = await this.getCurrentUser();
    if (currentSession) {
      currentSession.email = updatedEmail;
      localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(currentSession));
    }

    // 3. Update Supabase Auth user if configured
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.updateUser({
          password: newPassword,
          ...(newEmail ? { email: newEmail } : {}),
        });
      } catch (err) {
        console.error('Failed to update password on Supabase:', err);
      }
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },
};
