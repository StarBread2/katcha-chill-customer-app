import { supabase } from "../lib/supabaseClient"; 

type CreditPurchase = 
{
    id?: string;
    user_id: string;
    package_id: string;
    package_amount: number;
    amount_paid: number;
    payment_method?: "gcash" | "cash" | null;
    created_at?: string;
    purchase_state: "pending" | "paid";
};

// Create a new purchase
export async function createCreditPurchase(purchase: CreditPurchase) {
    try 
    {
        const { data, error } = await supabase
        .from("credit_purchases")
        .insert([purchase])
        .select("*")
        .single();

        if (error) throw error;
        return data;
    } 
    catch (err) 
    {
        console.error("Error creating credit purchase:", err);
        throw err;
    }
}

// Check if the user has an existing pending purchase
export async function getPendingPurchaseByUser(user_id: string) 
{
    try 
    {
        const { data, error } = await supabase
        .from("credit_purchases")
        .select("*")
        .eq("user_id", user_id)
        .eq("purchase_state", "pending")
        .order("created_at", { ascending: false }) // latest first, just in case
        .limit(1)
        .maybeSingle();

        if (error) throw error;

        // if none found, data will be null
        return data; // either object or null
    } 
    catch (err) 
    {
        console.error("Error checking pending purchase:", err);
        return null;
    }
}

// Delete a credit purchase by its ID
export async function deleteCreditPurchaseById(purchase_id: string) {
    try 
    {
        const { error } = await supabase
        .from("credit_purchases")
        .delete()
        .eq("id", purchase_id);

        if (error) throw error;

        console.log(`Purchase with ID ${purchase_id} deleted successfully`);
        return true;
    } 
    catch (err) 
    {
        console.error("Error deleting credit purchase:", err);
        return false;
    }
}

