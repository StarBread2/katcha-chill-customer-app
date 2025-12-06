import { supabase } from "../lib/supabaseClient";

import { createPortal } from "react-dom";
import { toast } from "sonner";
import { getStoreItemById } from "../services/storeProductsService";

export const addToCart = async (user_id: string, product_id: number, quantity: number, navigate: (path: string) => void) => 
{
    const { data, error } = await supabase
        .from("user_cart")
        .insert([
            {
                user_id,
                product_id,
                quantity
            }
        ])
        .select("*")            // return the inserted row
        .limit(1);         // safe alternative to .single() (trigger bs)

    if (error) 
    {
        console.error("Error inserting into user_cart:", error);
        throw error;
    }

    const insertedRow = data?.[0] ?? null;
    console.log("insertedRow",insertedRow)

    createPortal(
        toast("✅ Added to cart", 
        {
            description: `You just added an item to your cart, check your cart by pressing the button!`,
            duration: 10000,
            action: 
            {
                label: "Open Cart",
                onClick: () => navigate("/store/cart")
            }
        }),
        document.body
    );
    return insertedRow;
};

export const getUserCart = async (user_id: string) => 
{
    const { data, error } = await supabase
        .from("user_cart")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

    if (error) 
    {
        console.error("Error fetching user_cart:", error);
        throw error;
    }

    return data || [];
};

export const getUserCartWithProducts = async (user_id: string) => {
    const cartItems = await getUserCart(user_id);

    let cartGrandTotal = 0;

    const result = await Promise.all(
        cartItems.map(async item => {
            const product = await getStoreItemById(item.product_id);

            const cartTotalAmount = product && item.quantity
                ? Number(product.price) * item.quantity
                : 0;

            cartGrandTotal += cartTotalAmount;

            return {
                ...item,
                product,
                cartTotalAmount
            };
        })
    );

    return {
        cartItems: result,
        cartGrandTotal
    };
};

export const deleteCartItem = async (user_id: string, cart_id: number): Promise<boolean> => 
{
    const { data, error } = await supabase
        .from("user_cart")
        .delete()
        .eq("user_id", user_id)
        .eq("cart_id", cart_id);

    if (error) 
    {
        console.error("Error deleting cart item:", error);
        return false;
    }

    return true;
};


export const updateCartItemQuantity = async (
    user_id: string,
    cart_id: number, // your cart_id is UUID
    quantity: number
): Promise<boolean> => 
{
    const { data, error } = await supabase
        .from("user_cart")
        .update({ quantity }) // the column(s) you want to update
        .eq("user_id", user_id)
        .eq("cart_id", cart_id)
        .select(); // optional, returns the updated row

    if (error) 
    {
        console.error("Error updating cart item quantity:", error);
        return false;
    }

    console.log("Updated cart item:", data);
    return true;
};









    // createPortal(
    // toast.custom((t) => (
    //     <div className="bg-white shadow-xl border border-gray-200 p-4 rounded-2xl flex flex-col gap-3 w-[260px]">
    //         <div className="font-semibold text-green-600">✅ Added to Cart</div>

    //         <div className="text-sm text-gray-700">
    //             You just added an item to your cart.
    //         </div>

    //         <button
    //             onClick={() => {
    //             navigate("/store/cart");
    //             toast.dismiss(t);
    //             }}
    //             className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-xl font-medium transition"
    //         >
    //             Open Cart
    //         </button>
    //     </div>
    // )), document.body);
