import { useNavigate, useLocation  } from "react-router-dom";

import { Home_Icon, MyProgress_Icon, Store_Icon, Settings_Icon } from "../../assets/index.ts";

export default function BottomNav() 
{
    const location = useLocation();
    const navigate = useNavigate(); 

    const tabs = [
        { id: "progress", label: "Progress", icon: MyProgress_Icon, path: "/progress" },
        { id: "home", label: "Home", icon: Home_Icon, path: "/home" },
        { id: "store", label: "Store", icon: Store_Icon, path: "/" },
    ];
// fixed bottom-6 left-1/2 -translate-x-1/2
return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 
                    w-[85%] max-w-md 
                    flex items-center justify-between gap-3"
    >
            {/* ⚙️ Left Floating Settings Island */}
            <div className="bg-white/40 backdrop-blur-md
                    border border-white/20 shadow-lg
                    rounded-full px-5 py-3">
                <button
                    onClick={() => navigate("/settings")}

                    className="rounded-full"
                >
                    <div className={`flex flex-col items-center gap-0.5 ${
                                    location.pathname === "/settings"
                                    ? "text-black scale-110" : "text-gray-500"}`}
                    >

                        <img
                        src={Settings_Icon}
                        alt="Settings"
                        className={`w-5 h-5 ${location.pathname === "/settings" 
                                            ? "opacity-100" : "opacity-70"}`}
                        />
                        
                        <span
                            className={`text-[11px] font-normal ${location.pathname === "/settings"
                                    ? "text-black" : "text-gray-400"}`}
                        >
                            Settings
                        </span>
                    </div>
                </button>
            </div>   
            

            {/* 🏠 Main Center Navigation */}
            <nav
                className="
                    flex-1
                    bg-white/40 backdrop-blur-md
                    border border-white/20 shadow-lg
                    rounded-full
                    flex justify-between items-center
                    px-4 py-3
                "
            >
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.path)}
                            className=" flex-1 flex flex-col items-center justify-center text-xs transition-all duration-200"
                        >
                            <div
                                className={`flex flex-col items-center gap-0.5 
                                            ${ isActive ? "text-black scale-110" : "text-gray-500" }`}
                            >
                                <img
                                    src={tab.icon}
                                    alt={tab.label}
                                    className={`w-5 h-5 transition-opacity 
                                                ${ isActive ? "opacity-100" : "opacity-60" }`}
                                />
                                <span
                                    className={`text-[11px] font-normal 
                                                ${ isActive ? "text-black" : "text-gray-400" }`}
                                >
                                    {tab.label}
                                </span>
                            </div>
                        </button>
                );
            })}
            </nav>
        </div>
);
}
