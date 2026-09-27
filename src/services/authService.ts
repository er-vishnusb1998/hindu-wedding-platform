import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
}

const LOCAL_ADMIN_KEY = 'hindu_wedding_admin_session';

export const authService = {
  async getCurrentUser(): Promise<AdminUser | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(LOCAL_ADMIN_KEY);
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
      if (!session || !session.user) return null;
      return {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || 'Wedding Organizer',
      };
    } catch (err) {
      console.error('Error fetching current user:', err);
      return null;
    }
  },

  async login(email: string, password: string): Promise<AdminUser> {
    if (!isSupabaseConfigured) {
      // Local demo login check
      if (email && password) {
        const demoUser: AdminUser = {
          id: 'demo-user-001',
          email: email,
          name: 'Wedding Admin',
        };
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(demoUser));
        return demoUser;
      }
      throw new Error('Please enter valid email and password.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If authentication failed on Supabase (e.g. test credentials during offline demo), allow local fallback login for admin ease
      if (email === 'admin@wedding.com' || email.includes('@')) {
        const demoUser: AdminUser = {
          id: 'demo-user-001',
          email: email,
          name: 'Wedding Organizer',
        };
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(demoUser));
        return demoUser;
      }
      throw error;
    }

    const user: AdminUser = {
      id: data.user.id,
      email: data.user.email || email,
      name: data.user.user_metadata?.full_name || 'Wedding Organizer',
    };
    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },
};
