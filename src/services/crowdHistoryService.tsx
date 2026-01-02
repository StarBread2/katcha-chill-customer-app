import { supabase } from "../lib/supabaseClient";  

export const getCrowdHistoryByDay = async (date: string) => 
{
    const { data, error } = await supabase.rpc(
        "get_crowd_history_by_day",
        {   
            p_date: date,
        }
    );

    if (error) 
    {
        console.error("Error fetching gym crowd history stats:",error);
        return null;  // ALWAYS return null on error
    }

    return data ?? []; // ALWAYS return array
}

