import { useState } from "react";
import Slider from "react-slick";

import UserProgress from "../components/MyProgress/UsersProgressHeader.tsx"; 
import WeeklyChart from "../components/Partials/WeeklyChart.tsx";    
import HeaderNav from "../components/Partials/HeaderNav";


export default function MyProgress() 
{
    //ToggleVariable If Connected to health connect
    const [isConnectedHealthConnect, setisConnectedHealthConnect] = useState(false);

    //#region Gym Activity (Header)
        const gymActivityStats = 
        {
            weekly: {
                period: "Sep 20 - Sep 26, 2025",
                totalCheckIns: 20,
                avgWorkoutMin: 50,
                totalBurnedCalories: 1012,
            },

            monthly: {
                period: "September 2025",
                totalCheckIns: 85,
                avgWorkoutMin: 48,
                totalBurnedCalories: 4120,
            },

            yearly: {
                period: "2025",
                totalCheckIns: 932,
                avgWorkoutMin: 46,
                totalBurnedCalories: 46200,
            },
        };
    //#endregion

    //#region Data for mini modals
        const weeklyActData = [
            { day: "S", value: 30 },
            { day: "M", value: 65 },
            { day: "T", value: 77 },
            { day: "W", value: 0 },
            { day: "T", value: 0 },
            { day: "F", value: 77 },
            { day: "S", value: 150 },
        ];
        const weeklyActData_BarColor = "#3B7BF9";

        const burnedCalories = [
            { day: "S", value: 50 },
            { day: "M", value: 80 },
            { day: "T", value: 90 },
            { day: "W", value: 0 },
            { day: "T", value: 0 },
            { day: "F", value: 117 },
            { day: "S", value: 200 },
        ];
        const burnedCalories_BarColor = "#DE2B2D";
    //#endregion

    //#region sliderShit
        const settings = 
        {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            adaptiveHeight: true,
            appendDots: (dots: React.ReactNode) => (
                <div className="mt-[10px]">
                    <ul className="flex justify-center ">{dots}</ul>
                </div>
            ),
            customPaging: () => (
                <div className="w-2 h-2 rounded-full bg-[#AFAFAF] transition-all duration-200" />
            ),
        };
    //#endregion

    return (
        <div className="font-montserrat min-h-screen bg-white flex flex-col">
            {/* HEADER PART */}
            <div className="relative h-[575px] flex flex-col px-6 pb-20 text-center">
                <div className="pt-[115px]">
                    <HeaderNav title="Progress" showBackButton={false}/>
                </div>
                
                <UserProgress stats={gymActivityStats}/>
            </div>

            {/* GRAY PART */}
            <div className="relative bg-[#E6E6E6] rounded-t-[50px] -mt-12 w-full h-[600px] shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                <div className="mt-8 bg-white rounded-[20px] p-5 pb-10 w-[90%] space-y-6 mx-auto shadow-sm">
                    <Slider {...settings}>
                        <WeeklyChart weeklyData={weeklyActData} barColor={weeklyActData_BarColor} chartTitle="Weekly Activity"/>

                        {isConnectedHealthConnect ? (
                            <WeeklyChart weeklyData={burnedCalories} barColor={burnedCalories_BarColor} chartTitle="Burned Calories"/>
                        ): (
                            <div className="flex items-center justify-center">
                                <div className="h-[224px] flex flex-col items-center justify-center text-center">
                                    <p className="text-lg font-semibold text-black">Connect Health Connect</p>
                                    <p className="text-sm text-gray-500 mb-3">To see burned calories</p>
                                    
                                    <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                                        Connect
                                    </button>
                                </div>
                            </div>
                            )
                        }

                    </Slider>
                </div>
            </div>
        </div>
    );
}
