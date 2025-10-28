import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { Home_Icon, MyProgress_Icon, Store_Icon } from "../../assets/index.ts";

export default function BottomNav() 
{
    const [active, setActive] = useState("home");
    const navigate = useNavigate(); 

  const tabs = [
    { id: "progress", label: "My Progress", icon: MyProgress_Icon, path: "/progress" },
    { id: "home", label: "Home", icon: Home_Icon, path: "/home" },
    { id: "store", label: "Store", icon: Store_Icon, path: "/" }
  ];

return (
    <nav
    className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        w-[90%] max-w-xs
        bg-white/40 backdrop-blur-md
        border border-white/20 shadow-lg
        rounded-3xl
        flex justify-between items-center
        px-2 py-3
    "
    >
    {tabs.map((tab) => (
        <button
        key={tab.id}
        onClick={() => {
            setActive(tab.id);
            navigate(tab.path); // navigate to the tab’s route
        }}
        className="
            flex-1 flex flex-col items-center justify-center text-xs
            transition-all duration-200
        "
        >
        <div
            className={`flex flex-col items-center gap-1 ${
            active === tab.id ? "text-black scale-110" : "text-gray-500"
            }`}
        >
            <img
            src={tab.icon}
            alt={tab.label}
            className={`w-6 h-6 transition-opacity ${
                active === tab.id ? "opacity-100" : "opacity-60"
            }`}
            />
            <span
            className={`text-[11px] font-normal ${
                active === tab.id ? "text-black" : "text-gray-400"
            }`}
            >
            {tab.label}
            </span>
        </div>
        </button>
    ))}
    </nav>
);

}
