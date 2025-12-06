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

export async function checkOutUser(user_id: string)
{
    try 
    {
        const { data, error } = await supabase
            .from("profiles")
            .update({ checked_in: false })
            .eq("id", user_id)
            .select()
            .single();

        if (error) throw error;

        return data; // updated profile row
    } 
    catch (err) 
    {
        console.error("Error checking out user:", err);
        return null;
    }
}