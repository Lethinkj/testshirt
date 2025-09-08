import { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchRole = async (id) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', id).single();
    setRole(data?.role || 'user');
  };

  return <AuthContext.Provider value={{ user, role, fetchRole }}>{children}</AuthContext.Provider>;
};