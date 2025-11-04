import HeaderNav from "../components/Partials/HeaderNav";

import ProfileSection_Settings from "../components/Settings/ProfileSection.tsx";
import Choices_Settings from "../components/Settings/SettingsChoices.tsx";

import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

// GETTING USERS DATA
import { useUser } from "../context/UserContext";


export default function Settings() 
{
    // #region LOGOUT SUPABASE
        const navigate = useNavigate();

        const handleLogout = async () => 
        {
            await supabase.auth.signOut();
            navigate("/");
        };
    // #endregion
    
    //For top profile section
    const userName = "Mike";
    const memberSince = "September 01, 2025";
    const userInitial = userName.charAt(0).toUpperCase();

    const { user, profile, loading, refreshProfile, qrDataUrl } = useUser();

    return (
        <div className="bg-white font-montserrat min-h-screen flex flex-col overflow-hidden">
            
            {/* Header */}
            <HeaderNav title="Settings" backRoute="/home" />
            
            <div className="pt-[100px]"></div>
            {/* Top Profile Section */}
            <ProfileSection_Settings userName={profile?.full_name ?? "error"} memberSince={profile?.created_at ?? "error"} user_avatar={profile?.avatar_url ?? null} />

            {/* Stacked Navigations */}
            <Choices_Settings onSignOut={handleLogout}/>

        </div>
    );
}
