import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom"; //NOT USED YET (FOR LOGOUT)

import Header from "../components/Home/Header"
import CrowdMeter from "../components/Home/CrowdMeter.tsx"
import GymCreditsCard from "../components/Home/GymCreditsCard.tsx"
// import MembershipCard from "../components/Home/MembersShipCard.tsx"(MONTHLY UNUSED)

// import PullToRefresh from "react-pull-to-refresh";
import { Ring } from "@uiball/loaders"; // FOR LOADING ANIMATION

export default function Dashboard() 
{
    const navigate = useNavigate();
    // #region NOT USED YET (FOR LOGOUT)
        const handleLogout = async () => 
        {
            await supabase.auth.signOut();
            navigate("/login");
        };
    // #endregion

    // #region QUERY
        const NotifState=true; //FOR FUTURE IF THERE IS NOTIFICATION
        const { user, profile, loading, refreshProfile, qrDataUrl } = useUser();
    // #endregion

    // #region IF LOADING (loading animation)
        // Show loading animation if still fetching user/profile
        // Show TailChase loader while fetching
        if (loading) 
        {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <Ring size={60} speed={1.4} color="#DE2B2D" />
                    <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            );
        }
    // #endregion

    return ( 
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* ========== PULL TO REFRESH (disabled for now) ========== */}
                {/* <PullToRefresh
                onRefresh={async () => {
                    console.log(" Refresh triggered...");
                    await refreshProfile();
                    console.log(" Refresh complete!");
                }}
                className=" bg-white"
                style={{ touchAction: "pan-y" }} // ensures smooth scroll
                > */}

                    {/* ========== DEBUG ========== */}
                        {/* <p>User id: {user?.id ?? "Not logged in"}</p>
                        <p>Credits Balance: {profile?.credits_balance ?? 69}</p> */}
                    {/* ========== DEBUG ========== */}
                    
                {/* </PullToRefresh> */}
            {/* ========== PULL TO REFRESH (disabled for now) ========== */}

            <Header GymCoin={profile?.credits_balance ?? 0} NotifState={NotifState} Name={profile?.full_name ?? "freind"}/>
            
            {/* Overlapping section with main inside */}
            <div className="relative bg-[#E6E6E6] rounded-t-[50px] -mt-12 z-1 w-full h-[500px] shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                {/* Main content sits inside the section */}
                <main className="relative px-2 py-6 space-y-6 -mt-16 z-2">
                    <CrowdMeter GymCoins={profile?.credits_balance ?? 0} />
                    <section>
                        <h2 className="font-bold text-xl mb-2 ml-3">Gym Credits</h2>
                        <GymCreditsCard GymCoins={profile?.credits_balance ?? 0}/>
                    </section>
                </main>
            </div>
        </div>
    )
}