// AuthProvider.tsx (updated)
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface AuthContextProps 
{
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => 
{
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        let mounted = true;

        // Get initial session (v2 API)
        supabase.auth.getSession()
        .then(({ data }) => 
        {
            if (!mounted) return;
            setUser(data.session?.user ?? null);
        })
        .catch((err) => 
        {
            console.error("getSession error:", err);
        })
        .finally(() => 
        {
            if (!mounted) return;
            setLoading(false);
        });

        // Subscribe to auth changes and update user
        // supabase.auth.onAuthStateChange returns { data: { subscription } } in v2
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // unsubscribe on unmount
        return () => 
        {
            mounted = false;
            try 
            {
                data?.subscription?.unsubscribe();
            } 
            catch (e) 
            {
                // defensive: fallback if shape differs
                try 
                {
                    // @ts-ignore
                    data?.unsubscribe?.();
                } catch {}
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
