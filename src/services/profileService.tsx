import { supabase } from "../lib/supabaseClient";

// ✅ Fetch user profile by user id
export async function getUserProfile(userId: string) 
{
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) throw error;
    return data;
}


