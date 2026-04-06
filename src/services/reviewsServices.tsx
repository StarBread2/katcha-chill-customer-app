import { supabase } from "../lib/supabaseClient";

export const checkIfUserCanReview = async (
    user_id: string,
    product_id: number
) => 
{
    const { data, error } = await supabase.rpc(
        "check_product_review_status",
        { 
            p_user_id: user_id,
            p_product_id: product_id
        }
    );

    if (error) 
    {
        console.error(error);
        return null; // ALWAYS return null on error
    }

    return data ?? null; // returns { state: 'REVIEWED' | 'PURCHASED' } or null
};

export const getProductReviews = async (product_id: number) => {
    if (!product_id) return [];

    const { data, error } = await supabase
        .from("product_reviews")
        .select(`
            *,
            profiles:user_id (
                full_name
            )
        `)
        .eq("product_id", product_id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching product_reviews:", error);
        throw error;
    }

    return data || [];
};

export const createProductReview = async ({
    user_id,
    product_id,
    order_item_id,
    rating,
    review_text
}: {
    user_id: string;
    product_id: number;
    order_item_id: number;
    rating: number;
    review_text: string;
}) => 
{
    const { data, error } = await supabase
        .from("product_reviews")
        .insert([
            {
                user_id,
                product_id,
                order_item_id,
                rating,
                review_text
            }
        ])
        .select() // returns inserted row
        .single();

    if (error) {
        console.error("Error creating review:", error);
        throw error;
    }

    return data;
};