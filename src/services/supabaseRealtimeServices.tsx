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
export function startPurchaseListener(userId: string, onPaid: () => void): Promise<any> 
{
    console.log("🟢 Starting listening for purchases (startPurchaseListener)");

    return new Promise((resolve, reject) => 
    {
        try 
        {
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
            (payload) => 
            {
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
                        toast("✅ Purchase Successful", 
                        {
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
            })
            .subscribe();
        } 
        catch (err) 
        {
            reject(err);
        }
    });
}



type ChannelWithPromise = 
{
    channel: ReturnType<typeof supabase.channel>;
    promise: Promise<any>;
};


/**
 * Starts listening for an update on attendance.checkin_approved for a given user.
 * Resolves when a matching attendance row's checkin_approved changes from false -> true.
 *
 * Usage:
 *   await startAttendanceApprovalListener(userId, (approvedRow) => {
 *     // refresh UI, fetch attendance, etc.
 *   });
 */
export function startAttendanceApprovalListener(userId: string, onApproved: (attendanceRow: any) => void): ChannelWithPromise 
{
    console.log("🟢 Starting listening for attendance approvals (startAttendanceApprovalListener)");

    let resolvePromise: (v: any) => void;
    let rejectPromise: (e: any) => void;

    const promise = new Promise<any>((resolve, reject) => 
    {
        resolvePromise = resolve;
        rejectPromise = reject;
    });

    const channel = supabase
    .channel("attendance_listener")
    .on(
    "postgres_changes",
    {
        event: "UPDATE",
        schema: "public",
        table: "attendance",
        // filter by user so we only receive relevant row updates
        filter: `user_id=eq.${userId}`,
    },
    (payload) => 
    { 
        try
        {
            const oldRow = payload.old as any;
            const newRow = payload.new as any;

            // defensive check: ensure we have the property and it flipped from false -> true
            const wasApproved = !!oldRow?.checkin_approved;
            const isApproved = !!newRow?.checkin_approved;

            if (!wasApproved && isApproved) 
            {
                // format a friendly timestamp if you want
                const checkInAt = newRow?.check_in ? new Date(newRow.check_in) : null;
                const formatted = checkInAt
                    ? checkInAt.toLocaleString("en-US", 
                    {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    })
                    : "recently";

                createPortal(
                    toast("✅ Check-in Approved", {
                        description: `Your check-in on (${formatted}) was approved.`,
                        duration: 10000,
                    }),
                    document.body
                );

                console.log("✅ Attendance checkin approved — calling callback and stopping listener");
                try 
                {
                    onApproved(newRow);
                } 
                catch (cbErr) 
                {
                    console.error("Error in onApproved callback:", cbErr);
                }

                // resolve promise with the new row
                resolvePromise(newRow);
            }
        }
        catch (e)
        {
            console.error("Error in attendance payload handler:", e);
            rejectPromise?.(e);
        }
        })
    .subscribe();

    return { channel, promise };
}