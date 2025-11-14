import React, { useState } from "react";
import { Check_Icon, ClockRed_Icon, Fire_Icon } from '../../assets/index.ts';

type PeriodKey = "weekly" | "monthly" | "yearly";

interface ActivityPeriod {
    period: string;
    totalCheckIns: number;
    avgWorkoutMin: number;
    totalBurnedCalories: number;
}

interface HeaderProps {
    stats: {
        weekly: ActivityPeriod;
        monthly: ActivityPeriod;
        yearly: ActivityPeriod;
    };
}

export default function UserProgress({ stats }: HeaderProps) 
{
    const [selected, setSelected] = useState<PeriodKey>("weekly");

    const current = stats[selected];

    const tabBaseClass =
        "px-5 py-3 rounded-[20px] text-sm font-medium transition-all";
    const activeClass = "bg-black text-white";
    const inactiveClass = "bg-[#E6E6E6] text-black";
    
    return (
        <div>
            {/* Gym Activity */}
            <section>
                <h2 className="font-bold text-lg text-left mb-5">Gym Activity</h2>
                <p className="text-base font-semibold text-black text-left ml-2">{current.period}</p>


                {/* Stats Cards */}
                <div className="flex justify-between mt-3 mb-2.5 px-2">
                    <div className="flex-1 bg-white rounded-[20px] border-2 border-[#E6E6E6] shadow-sm p-4  mr-2 flex flex-col justify-between h-[115px]">
                        <div className="flex items-center justify-between">
                            <img src={Check_Icon} alt="Check Icon" className="w-6 h-6" />
                            <p className="text-2xl font-bold">{current.totalCheckIns}</p>
                        </div>
                        <p className="text-sm text-[#434343] text-left">Check-ins</p>
                    </div>

                    <div className="flex-1 bg-white rounded-[20px] border-2 border-[#E6E6E6] shadow-sm p-4 flex flex-col justify-between h-[115px]">
                        <div className="flex items-center justify-between">
                            <img src={ClockRed_Icon} alt="Clock Icon" className="w-6 h-6" />
                            <p className="text-2xl font-bold">{current.avgWorkoutMin}</p>
                        </div>
                        <p className="text-sm text-[#434343] text-left">Avg Workout Min</p>
                    </div>

                </div>

                <div className="px-2 mb-6">
                    <div className="flex-1 bg-white rounded-[20px] border-2 border-[#E6E6E6] shadow-sm p-4 flex flex-col justify-between h-[105px]">
                        <div className="flex items-center justify-between">
                            <img src={Fire_Icon} alt="Clock Icon" className="w-6 h-6" />
                            <p className="text-2xl font-bold">{current.totalBurnedCalories}</p>
                        </div>
                        <p className="text-sm text-[#434343] text-left">Burned Calories</p>
                    </div>
                </div>
                

                {/* Tabs */}
                <div className="inline-flex justify-center space-x-2 bg-[#E6E6E6] rounded-[20px] p-1">
                    <button
                        onClick={() => setSelected("weekly")}
                        className={`${tabBaseClass} ${selected === "weekly" ? activeClass : inactiveClass}`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setSelected("monthly")}
                        className={`${tabBaseClass} ${selected === "monthly" ? activeClass : inactiveClass}`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setSelected("yearly")}
                        className={`${tabBaseClass} ${selected === "yearly" ? activeClass : inactiveClass}`}
                    >
                        Year
                    </button>
                </div>
            </section>
        </div>
    );
}