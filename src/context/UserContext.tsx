import React, { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "../auth/AuthProvider";

import { getUserProfile } from "../services/profileService";
import { getCreditPackages } from "../services/packageService";

import QRCode from "qrcode";

//credit_purchases
import { supabase } from "../lib/supabaseClient";

import { getPendingPurchaseByUser } from "../services/purchaseService";
import { startPurchaseListener } from "../services/supabaseRealtimeServices";
import { getUserPackages } from "../services/userPackageService";

type UserProfile = {
    id?: string;
    full_name: string;
    role: string;
    credits_balance: number;
    created_at: string;
    avatar_url?: string | null;
};

type UserContextType = {
    user: any | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    qrDataUrl?: string | null;
    refreshQr: () => Promise<void>;
    packages: CreditPackage[];
    refreshPackages: () => Promise<void>;

    //manually start scanning for credit_purchases
    watchPendingPurchase: () => Promise<void>;

    //manually stop scanning for credit_purchases
    stopPurchaseListener: () => void;

    //Get User packages and refresher
    userPackages: UserPackage[];
    refreshUserPackages: () => Promise<void>;

};

// FOR CREDIT PACKAGES
type CreditPackage = {
    package_id: string;
    name: string;
    coins: number;
    expiration?: string | null;
    description?: string | null;
    price?: number | null;
    stackable: boolean;
};

// FOR USER PACKAGES
type UserPackage = {
    user_package_id: number;
    user_id: string;
    package_id: string;
    expiration_date: string;
    credits_remaining: number;
    status: "active" | "expired" | "used_up";
    purchased_at: string;
    transaction_id: number;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => 
{
    const { user } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

    // JSON DATA BROS
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    

    const fetchProfile = async () => 
    {
        if (!user) 
        {
            setProfile(null);
            setLoading(false);
            return;
        }
            setLoading(true);
            try 
            {
                const data = await getUserProfile(user.id);
                const formattedProfile: UserProfile = 
                {
                    id: user.id,
                    full_name: data.full_name,
                    role: data.role,
                    credits_balance: data.credits_balance,
                    created_at: data.created_at,
                    avatar_url: user.user_metadata.avatar_url,
                };

                setProfile(formattedProfile);
            } 
            catch (err) 
            {
                console.error("Error fetching profile:", err);
                setProfile(null);
            } 
            finally 
            {
                setLoading(false);
            }
    };

    // Generate a QR data URL from a string and cache it in localStorage
    const generateQrFor = async (text: string, width = 512) => 
    {
        try 
        {
            const dataUrl = await QRCode.toDataURL(text, {
                width,
                margin: 1,
            });
            return dataUrl;
        } 
        catch (err) 
        {
            console.error("QR generation error:", err);
            return null;
        }
    };

    const refreshQr = async () => 
    {
        if (!profile?.id) 
        {
            setQrDataUrl(null);
            return;
        }

        const key = `qr_${profile.id}`;
        // use cached version if available
        const cached = localStorage.getItem(key);

        if (cached) 
        {
            setQrDataUrl(cached);
            return;
        }
            const url = await generateQrFor(profile.id, 512);
            if (url) {
            localStorage.setItem(key, url);
            setQrDataUrl(url);
        } 
        else 
        {
            setQrDataUrl(null);
        }
    };

    //
    const fetchPackages = async () => 
    {
        try 
        {
            const data = await getCreditPackages();
            setPackages(data);
        } 
        catch (err) {
            console.error("Error fetching credit packages:", err);
            setPackages([]);
        }
    };

    // Fetch profile when auth user changes
    useEffect(() => 
    {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Generate QR whenever profile is set/updated
    useEffect(() => 
    {
        if (!profile) 
        {
            setQrDataUrl(null);
            return;
        }
        // try to use cached copy OR generate
        (async () => 
        {
            await refreshQr();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id]);

    useEffect(() => 
    {
        if (user) fetchPackages();
    }, [user]);

    //#region credit_purchases
        //Do setPurchaseListener watch and stop of getting pending purchase listener (to be able to manually stop the listener)
        const [purchaseListener, setPurchaseListener] = useState<any>(null);

        // Start watching for pending purchases
        const watchPendingPurchase = async () => {
        console.log("🟢 scanning for pending Purchases (watchPendingPurchase)");

        if (!user?.id) return;

        const pending = await getPendingPurchaseByUser(user.id);
        if (!pending) {
            console.log("No pending purchase found.");
            return null;
        }

        console.log("There is a pending order (watchPendingPurchase)");

        // ✅ Wait for the purchase listener to complete
        const result = await startPurchaseListener(user.id, fetchProfile);
        return result; // return the updated purchase
        };


        // Stop watching manually for pending purchases
        const stopPurchaseListener = () => 
        {
            if (purchaseListener) 
            {
                supabase.removeChannel(purchaseListener);
                setPurchaseListener(null);
                console.log("🛑 Manually stopped watching pending purchases");
            } 
            else 
            {
                console.log("⚪ No active listener to stop");
            }
        };



        // if user log in and have an order, start listening
        useEffect(() => 
        {
            if (!user?.id) return;

            let channel: any = null;

            const setupListener = async () => 
            {
                const pending = await getPendingPurchaseByUser(user.id);
                if (pending) 
                {
                    // There’s a pending order — start listening for updates
                    channel = startPurchaseListener(user.id, fetchProfile);
                    setPurchaseListener(channel);
                    console.log("There is a pending order (useeffect)")
                }
                else
                {
                    console.log("There is no pending order (useeffect)")
                }
            };

            setupListener();

            return () => 
            {
                if (channel) supabase.removeChannel(channel);
            };
        }, [user?.id]);

        // If user logs out then stop scanning for pending purchases
        useEffect(() => 
        {
            if (!user) stopPurchaseListener();
        }, [user]);
    //#endregion

    //#region user_packages
        const [userPackages, setUserPackages] = useState<UserPackage[]>([]);

        const fetchUserPackages = async () => 
        {
            if (!user?.id) return;
            console.log("Fetching fetchUserPackages")
            try 
            {
                const data = await getUserPackages(user.id);
                setUserPackages(data);
            } 
            catch (err) 
            {
                console.error("Error fetching user packages:", err);
                setUserPackages([]);
            }
        };

        useEffect(() => 
        {
            if (user) fetchUserPackages();
        }, [user]);
    //#endregion

    return (
        <UserContext.Provider
            value={{
                user,
                profile,
                loading,
                refreshProfile: fetchProfile,
                qrDataUrl,
                refreshQr,
                packages,
                refreshPackages: fetchPackages,
                userPackages,
                refreshUserPackages: fetchUserPackages,
                watchPendingPurchase,
                stopPurchaseListener,
            }}>
                {children}
        </UserContext.Provider>
    );
    };

    export const useUser = () => 
    {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
