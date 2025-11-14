import { supabase } from "../lib/supabaseClient";

export const getUserPackages = async (userId: string) => 
{
    if (!userId) return [];

    const { data, error } = await supabase
        .from("user_packages")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("package_id", { ascending: true }); // sort by package_id

    if (error) 
    {
        console.error("Error fetching user_packages:", error);
        throw error;
    }

    return data || [];
    };
