import { supabase } from "../lib/supabaseClient";

export const checkOutCart = async (user_id: string) => 
{
    const { data, error } = await supabase.rpc (
        'order_items_order_groups_checkoutorder', 
        { p_user_id: user_id, }
    );

    if (error) console.error(error)
    else console.log(data)
}