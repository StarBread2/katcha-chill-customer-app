import { supabase } from "../lib/supabaseClient";

export const getStoreItems = async () => 
{
    const { data, error } = await supabase
        .from("store_items")
        .select("*")
        .order("featured", { ascending: false })   // featured first
        .order("created_at", { ascending: false }); // newest first inside each group

    if (error) 
    {
        console.error("Error fetching store_items:", error);
        throw error;
    }

    return data || [];
};

export const getStoreItemById = async (id: string) => 
{
    const { data, error } = await supabase
        .from("store_items")
        .select("*")
        .eq("id", id)
        .single(); // returns exactly one row

    if (error) 
    {
        console.error(`Error fetching store item with id ${id}:`, error);
        throw error;
    }

    return data;
};



