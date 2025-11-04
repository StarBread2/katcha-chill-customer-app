import { GymBg, GymCoin_Colored, Notification_Icon, Settings_Icon } from '../../assets/index.ts';
import { useState } from "react";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom"; // FOR RENDERING FROM BODY ()

import HeaderTopBar from "../Home/HeaderTopBar.tsx"


interface HeaderProps {
    NotifState: boolean;
    GymCoin: number;
    Name: string;
}

export default function Header({ NotifState, GymCoin, Name }: HeaderProps) 
{
    // #region FOR NOTIFICATION (IF NOTIFICATION GREEN BAR ABOVE BELL)
    const [hasNotification, setHasNotification] = useState(NotifState);
    // #endregion
    
    // #region FOR TOP NAVBAR ANIM
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 80) setHidden(true);  // scroll down → hide
        else setHidden(false);                                  // scroll up → show
    });
    // #endregion FOR TOP NAVBAR ANIM

    // For navigation to other pages
    const navigate = useNavigate();

    return (
        <div
        className="relative h-[470px] text-white flex flex-col justify-center items-center px-6 pb-20 text-center"
        style={{
            backgroundImage: `url(${GymBg})`,
            backgroundSize: "190%",
            backgroundPosition: "70% center",
        }}
        >
            
            {/* 🔹 Top bar */}
            <HeaderTopBar GymCoin={GymCoin}/>

            <div className="relative z-10 mt-20">
                <h1 className="text-5xl font-bebas leading-tight">
                <span className="text-white">WELCOME BACK, {Name?.split(" ")[0] ?? "friend"}</span>
                <br />
                <span className="text-red-500">YOUR PROGRESS WON’T BUILD ITSELF</span>
                </h1>
            </div>
        </div>

        
    )
}