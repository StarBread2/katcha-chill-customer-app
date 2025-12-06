import { supabase } from "../lib/supabaseClient";

export const getUserOrders = async (user_id: string) => 
{
    const { data, error } = await supabase.rpc(
        "order_groups_getuserorders",
        { p_user_id: user_id }
    );

    if (error) 
    {
        console.error(error);
        return null;  // ALWAYS return null on error
    }

    return data ?? []; // ALWAYS return array
}