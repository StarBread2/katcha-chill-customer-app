// src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { getUserProfile } from "../services/profileService";
import QRCode from "qrcode";

type UserProfile = {
    id?: string;
    full_name: string;
    role: string;
    credits_balance: number;
    created_at: string;
};

type UserContextType = {
    user: any | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    qrDataUrl?: string | null;
    refreshQr: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

    const fetchProfile = async () => {
        if (!user) {
        setProfile(null);
        setLoading(false);
        return;
        }
        setLoading(true);
        try {
        const data = await getUserProfile(user.id);
        const formattedProfile: UserProfile = {
            id: user.id,
            full_name: data.full_name,
            role: data.role,
            credits_balance: data.credits_balance,
            created_at: data.created_at,
        };
        setProfile(formattedProfile);
        } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
        } finally {
        setLoading(false);
        }
    };

    // Generate a QR data URL from a string and cache it in localStorage
    const generateQrFor = async (text: string, width = 512) => {
        try {
        const dataUrl = await QRCode.toDataURL(text, {
            width,
            margin: 1,
        });
        return dataUrl;
        } catch (err) {
        console.error("QR generation error:", err);
        return null;
        }
    };

    const refreshQr = async () => {
        if (!profile?.id) {
        setQrDataUrl(null);
        return;
        }
        const key = `qr_${profile.id}`;
        // use cached version if available
        const cached = localStorage.getItem(key);
        if (cached) {
        setQrDataUrl(cached);
        return;
        }
        const url = await generateQrFor(profile.id, 512);
        if (url) {
        localStorage.setItem(key, url);
        setQrDataUrl(url);
        } else {
        setQrDataUrl(null);
        }
    };

    // Fetch profile when auth user changes
    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Generate QR whenever profile is set/updated
    useEffect(() => {
        if (!profile) {
        setQrDataUrl(null);
        return;
        }
        // try to use cached copy OR generate
        (async () => {
        await refreshQr();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id]);

    return (
        <UserContext.Provider
        value={{
            user,
            profile,
            loading,
            refreshProfile: fetchProfile,
            qrDataUrl,
            refreshQr,
        }}
        >
        {children}
        </UserContext.Provider>
    );
    };

    export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
