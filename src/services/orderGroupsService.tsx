import { supabase } from "../lib/supabaseClient";

export async function deleteOrderGroup(id: string, userId: string) 
{
    const { error } = await supabase
        .from("order_groups")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (error) throw error;
    return true;
}

//SCAN THE WHOLE DB FOR CHANGES IN THAT SPECIFIC ORDER_ID
export const watchOrderStatus = (orderId: string, onUpdate: (row: any) => void) => 
{
    const channel = supabase
        .channel("order-status-" + orderId)
        .on(
        "postgres_changes",
        {
            event: "UPDATE",
            schema: "public",
            table: "order_groups",
            filter: `id=eq.${orderId}`,
        },
        (payload) => 
        {
            console.log("🟢 Order status changed:", payload.new);
            onUpdate(payload.new);
        }
        )
        .subscribe();

    return channel;
};

//CHECK THE DB IF status is completed or out of stock
export const waitForOrderCompletion = (orderId: string) => 
{
    let channel: any = null;

    const promise = new Promise<any>((resolve) => 
    {
        channel = watchOrderStatus(orderId, (updatedOrder) => 
        {
            if (updatedOrder.status === "Completed" ||
                updatedOrder.status === "Out of Stock") 
            {
                console.log("✅ Final status:", updatedOrder.status);

                // ✅ Auto stop when finished
                if (channel) {
                supabase.removeChannel(channel);
                channel = null;
                }

                resolve(updatedOrder);
            }
        });
    });

    // ✅ RETURN BOTH
    return { promise, channel };
};

export const stopWatchingOrder = (orderChannel: any | null) => 
{
    if (orderChannel) 
    {
        supabase.removeChannel(orderChannel);
        orderChannel = null;
        console.log("🛑 Order status listener stopped");
    }
};