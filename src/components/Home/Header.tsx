
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom"; // FOR RENDERING FROM BODY ()

//3RD PARTY
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

//PARTIALS
import HeaderTopBar from "./HeaderTopBar_Home.tsx"

//DB
import { useUser } from "../../context/UserContext";

//ICONS
import { GymBg } from '../../assets/assets.ts';

interface HeaderProps {
    NotifState: boolean;
    GymCoin: number;
    Name: string;
}

export default function Header({ NotifState, GymCoin, Name }: HeaderProps) 
{
    // #region UNUSED
        // FOR NOTIFICATION (IF NOTIFICATION GREEN BAR ABOVE BELL)
        const [hasNotification, setHasNotification] = useState(NotifState);
    // #endregion

    //#region UNIVERSAL
        const { profile } = useUser();
        const navigate = useNavigate();
    //#endregion

    // #region FOR TOP NAVBAR ANIM
        const [hidden, setHidden] = useState(false);
        const { scrollY } = useScroll();

        useMotionValueEvent(scrollY, "change", (latest) => {
            const previous = scrollY.getPrevious() ?? 0;
            if (latest > previous && latest > 80) setHidden(true);  // scroll down → hide
            else setHidden(false);                                  // scroll up → show
        });
    // #endregion FOR TOP NAVBAR ANIM

    //#region HEADER
        //ONLY GET THE HOUR IF IT PAST AN HOUR AND ONLY MINUTES IF DOESNT GO PAST AN HOUR
        function simplifyTimeSpent(timeSpent: string): string 
        {
            if (!timeSpent) return "";

            // Extract hours and minutes numbers
            const hoursMatch = timeSpent.match(/(\d+)\s*hour/);
            const minutesMatch = timeSpent.match(/(\d+)\s*minute/);

            const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
            const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

            // If no hours, return only minutes
            if (hours === 0) 
            {
                return `${minutes} minutes`;
            }

            // If hours exist, return only hours
            return `${hours} hour${hours > 1 ? "s" : ""}`;
        }
        const simplifiedTime = simplifyTimeSpent(profile?.CheckInResult?.timeSpent ?? "0");
        const ifAlreadyHaveCheckedIn = profile?.CheckInResult?.timeSpent ? `${simplifiedTime} ON THE GYM? SO TUFF BRO`: "THAT SESSION WAS TUFF LIL BRO";
        const headerText = profile?.checked_in ? "TIME TO SWEAT BROCHACHO" : profile?.CheckInResult?.checkedInForTheDay ? ifAlreadyHaveCheckedIn :profile?.checked_in ? "TIME TO SWEAT BROCHACHO" : "YOUR PROGRESS WON’T BUILD ITSELF";
    //#endregion
        

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

            <div className="relative z-10 mt-20 w-[100%]">
                <h1 className="text-5xl font-bebas leading-tight">
                    <span className=" text-white">WELCOME BACK, {Name?.split(" ")[0] ?? "friend"}</span>
                    <br />
                    <span className="font-bold text-red-500">{headerText}</span>
                </h1>
            </div>
        </div>

        
    )
}