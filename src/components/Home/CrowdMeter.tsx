import { Link, useNavigate  } from "react-router-dom";

import { Crowd_Icon, MoreHorizontal_Icon, CheckIn_Icon, CheckOut_Icon } from '../../assets/index.ts';
import { useState } from "react";

import CrowdMeter_Bar from "../Partials/CrowdMeter_Bar";

//DB
import { useUser } from "../../context/UserContext";

interface HeaderProps 
{    
    GymCoins: number;     
}

export default function CrowdMeter({GymCoins}: HeaderProps) 
{
    // FOR CHECK IN BUTTON (Unpressable if gymcoin <= 0)
    const navigate = useNavigate();
    // FOR CROWD BAR
    let Customerlimit = 50;
    let customerCount = 20;
    // Variables / States
    const [isCheckedIn, setIsCheckedIn] = useState(false); //Check in or not (for button state)
    const [startTime, setStartTime] = useState("5:00 PM"); //Check in time (For button dertails)
    // Handle Check-In Click
    const handleCheckInClick = (e: React.MouseEvent) => 
    {
        if (GymCoins <= 0) 
        {
            e.preventDefault(); // Stop navigation
            alert("You need at least 1 GymCoin to check in!");
            return;
        }
        navigate("/home/checkIn"); // Navigate manually after validation
    }


    //NEW SIGMA CODE BRO
    const { profile } = useUser();

    return (
        <div className="bg-white rounded-[20px] p-6 pb-6 shadow-md font-montserrat w-[98%] mx-auto">
            {/* 🔹 Top Bar */}
            <div className="flex justify-between items-center mb-0">
                <h3 className="font-bold text-base text-black">Magatas, Sibulan</h3>

                {/* More Button */}
                <Link to="/home/crowd">
                    <button>
                        <img
                            src={MoreHorizontal_Icon}
                            alt="More"
                            className="w-5 h-5 opacity-60"
                        />
                    </button>
                </Link>
            </div>

            {/* 🔹 Crowd Meter Row */}
            <div className="flex justify-between items-center mb-5 mt-2">
                <div className="flex items-center gap-2">
                    <img src={Crowd_Icon} alt="Crowd" className="w-5 h-5" />
                    <p className="text-sm text-[#434343] font-semibold">Crowd Meter</p>
                </div>
                
                <div className="flex space-x-1">
                    <CrowdMeter_Bar limit={Customerlimit} value={customerCount} />
                </div>
            </div>

            {/* 🔹 Check Button */}
            <div className="flex flex-col items-center">
                <Link to="/home/checkIn">
                    <button
                        onClick={handleCheckInClick}
                        className={`flex items-center justify-center gap-2 rounded-full w-[221px] py-3 text-base font-medium text-white transition-all duration-300 ${
                        profile?.checked_in ? "bg-[#28D977]" : "bg-red-600"
                        }`}
                    >
                        <img
                        src={profile?.checked_in ? CheckOut_Icon : CheckIn_Icon}
                        alt={profile?.checked_in ? "Check Out" : "Check In"}
                        className="w-5 h-5"
                        />
                        {profile?.checked_in ? "Check Out" : "Check In"}
                    </button>
                </Link>
                
                {/* 🔹 Started At Text */}
                {profile?.checked_in && (
                    <p className="text-xs text-gray-500 mt-1">
                    Started out at {startTime}
                    </p>
                )}
            </div>

        </div>
    );
}