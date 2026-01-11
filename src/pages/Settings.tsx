import { useNavigate } from "react-router-dom";
//MAIN
import ProfileSection_Settings from "../components/Settings/ProfileSection.tsx";
import Choices_Settings from "../components/Settings/SettingsChoices.tsx";
//PARTIALS
import HeaderNav from "../components/Partials/HeaderNav";
//CONTEXT
import { useUser } from "../context/UserContext";
//SUPABASE
import { supabase } from "../lib/supabaseClient";


export default function Settings() 
{
    // #region LOGOUT SUPABASE
        //DB
        const { profile, qrDataUrl_WName } = useUser();
        const navigate = useNavigate();

        const handleLogout = async () => 
        {
            // Clear cache of profile id 
            if (profile?.id) 
            {
                localStorage.removeItem(`qr_${profile.id}`);
            }

            await supabase.auth.signOut();
            navigate("/");
        };

        const handleDownloadQrCode = () =>
        {
            if(qrDataUrl_WName)
            {
                const link = document.createElement("a");
                link.href = qrDataUrl_WName;
                link.download = "userQRcode.png";
                link.click();
            }
            else
            {
                console.log("Error")
            }
        }
    // #endregion
    
    //For top profile section
    const userName = "Mike";
    const memberSince = "September 01, 2025";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="bg-white font-montserrat min-h-screen flex flex-col overflow-hidden">
            
            {/* Header */}
            <HeaderNav title="Settings" showBackButton={false}/>
            
            <div className="pt-[100px]"></div>
            {/* Top Profile Section */}
            <ProfileSection_Settings userName={profile?.full_name ?? "error"} memberSince={profile?.created_at ?? "error"} user_avatar={profile?.avatar_url ?? null} />

            {/* Stacked Navigations */}
            <Choices_Settings onSignOut={handleLogout} onDownloadQRCode={handleDownloadQrCode}/>

        </div>
    );
}
