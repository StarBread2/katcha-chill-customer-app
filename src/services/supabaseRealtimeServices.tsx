// src/services/supabaseRealtimeService.ts
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { createPortal } from "react-dom";

/**
 * Starts listening for changes in credit_purchases for a given user.
 * When a purchase's state becomes "paid", a toast notification is shown,
 * and the provided callback is triggered (e.g., to refresh user profile).
 *
 * Returns the Supabase channel (so you can remove it later).
 */
// src/services/supabaseRealtimeService.ts
export function startPurchaseListener(userId: string, onPaid: () => void): Promise<any> {
    console.log("🟢 Starting listening for purchases (startPurchaseListener)");

    return new Promise((resolve, reject) => {
        try {
        const channel = supabase
            .channel("credit_purchases_listener")
            .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "credit_purchases",
                filter: `user_id=eq.${userId}`,
            },
            (payload) => {
                const updated = payload.new as any;

                if (updated.purchase_state === "paid") 
                {
                    const formattedDate = new Date(updated.created_at).toLocaleString(
                        "en-US",
                        {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        }
                    );

                    createPortal(
                        toast("✅ Purchase Successful", {
                        description: `Your transaction made on ${formattedDate} has been processed by our worker.`,
                        duration: 10000,
                        }),
                        document.body
                    );

                    console.log("✅ Purchase marked as paid — refreshing user profile...");
                    onPaid();

                    console.log("🛑 Stopping listener for credit_purchases — purchase is now paid");
                    supabase.removeChannel(channel);

                    // ✅ Resolve the promise after toast is shown and callback done
                    resolve(updated);
                }
            }
            )
            .subscribe();
        } catch (err) {
        reject(err);
        }
    });
}

