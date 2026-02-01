'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const refreshUser = () => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user ?? null);
        setLoading(false);
      });
    };

    // İlk yükleme
    refreshUser();

    // Auth değişikliklerini dinle (Supabase session)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Server action (login/register/logout) sonrası client state senkronu
    const handleAuthChanged = () => {
      refreshUser();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:changed', handleAuthChanged);
    }

    return () => {
      subscription.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:changed', handleAuthChanged);
      }
    };
  }, []);

  const value: AuthContextValue = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext, AuthProvider içinde kullanılmalıdır');
  }
  return ctx;
}
