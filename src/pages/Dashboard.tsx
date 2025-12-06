import { useUser } from "../context/UserContext";

//PARTIALS
import Header from "../components/Home/Header"
import CrowdMeter from "../components/Home/CrowdMeter.tsx"
import GymCreditsCard from "../components/Home/GymCreditsCard.tsx"

// 3RD PARTY
// FOR LOADING ANIMATION
import { Ring } from "@uiball/loaders"; 

export default function Dashboard() 
{
    // #region QUERY
        const NotifState=true; //FOR FUTURE IF THERE IS NOTIFICATION
        const { profile, loading } = useUser();
    // #endregion

    // #region IF LOADING (loading animation)
        // Show loading animation if still fetching user/profile
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
        <div id="dashboardMain" className="min-h-screen bg-gray-100 flex flex-col">
            <Header GymCoin={profile?.credits_balance ?? 0} NotifState={NotifState} Name={profile?.full_name ?? "freind"}/>
            
            {/* Overlapping section with main inside */}
            <div className="relative bg-[#E6E6E6] rounded-t-[50px] -mt-12 z-1 w-full h-[500px]">
                {/* Main content sits inside the section */}
                <main className="relative px-2 py-6 space-y-6 -mt-16 z-2">
                    <CrowdMeter />
                    <section>
                        <h2 className="font-bold text-xl mb-2 ml-3">Gym Credits</h2>
                        <GymCreditsCard GymCoins={profile?.credits_balance ?? 0}/>
                    </section>
                </main>
            </div>
        </div>
    )
}