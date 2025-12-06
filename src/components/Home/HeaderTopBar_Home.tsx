
import { GymBg, GymCoin_Colored, Notification_Icon, Settings_Icon } from '../../assets/index.ts';

import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { createPortal } from "react-dom"; //FOR RENDERING IN DIV (Z-1) FOR NAVBARS

interface HeaderProps 
{
    GymCoin: number;
}

export default function HeaderTopBar({ GymCoin}: HeaderProps)
{

    //UNIVERSAL
    const navigate = useNavigate();
    const [container, setContainer] = useState<HTMLElement | null>(null);

    // #region FOR TOP NAVBAR ANIM
        const [hidden, setHidden] = useState(false);
        const { scrollY } = useScroll();
    
        useMotionValueEvent(scrollY, "change", (latest) => {
            const previous = scrollY.getPrevious() ?? 0;
            if (latest > previous && latest > 80) setHidden(true);  // scroll down → hide
            else setHidden(false);                                  // scroll up → show
        });
    // #endregion FOR TOP NAVBAR ANIM

    //#region rendering this headerbar not to the highest shit 
        //Wait until the component mounts (DOM is ready)
        useEffect(() => 
        {
            setContainer(document.getElementById("dashboardMain"));
        }, []);

        // If container not ready yet, render nothing
        if (!container) return null;
    //#endregion

    return createPortal(
        <div className='relative z-10'>
            {/* 🔹 Top bar */}
            <motion.div
            variants={{
                visible: { y: 0 },
                hidden: { y: -100 },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-[5%] left-[5%] w-[90%] z-50 flex justify-between items-center
                        // px-6 py-3 bg-black/30 text-white rounded-full"
            >
                {/* 🔹 GymCoin Display */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full"
                    onClick={() => navigate("/home/availableCredits")}>
                    <img src={GymCoin_Colored} alt="Gym Coin" className="w-6 h-6" />
                    <span className="font-bold text-base">{GymCoin}</span>
                </div>

                {/* 🔹 Icons */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-1 py-1 rounded-full">
                    {/* ========== NOTIFICATION ========== */}
                        {/* <div className="relative">
                            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                                <img src={Notification_Icon} alt="Notification" className="w-5 h-5" />
                            </div>
                            {NotifState && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                            )}
                        </div> */}
                    {/* ========== NOTIFICATION ========== */}

                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center" 
                        onClick={() => navigate("/settings")}>
                        <img src={Settings_Icon} alt="Settings" className="w-5 h-5" />
                    </div>
                </div>
            </motion.div>
        </div>, document.body
    );
}