import { useEffect, useState, useRef } from "react";
//MAINS
import UserProgress from "../components/MyProgress/UsersProgressHeader.tsx"; 
//PARTIALS
import WeeklyChart from "../components/Partials/WeeklyChart.tsx";    
import HeaderNav from "../components/Partials/HeaderNav";
//3RD PARTY
// import Slider from "react-slick";
//PROGRESS CONTEXT
import { useProgressContext } from "../context/ProgressContext.tsx";
//TYPES
import type { WeeklyActivityData } from '../types/progressTypes.tsx';

export default function MyProgress() 
{
    const { getCurrentWeeklyActivity } = useProgressContext();

    //ToggleVariable If Connected to health connect
    const [isConnectedHealthConnect, setisConnectedHealthConnect] = useState(false);

    //#region WEEKLY ACTIVITY DATA MODAL
        // WIDGET NAVIGATION
            const [leftChevronPressed, setLeftChevronPressed] = useState<boolean>(false);
            const [todayPressed, setTodayPressed] = useState<boolean>(false);
            const [rightChevronPressed, setRightChevronPressed] = useState<boolean>(false);

        // Main data for weekly acitivity chart widget
        const [weeklyActivityData, setWeeklyActivityData] = useState<WeeklyActivityData[]>([]);
        //WEEK OFFSET (THE CURRENT BASED ON THIS 
        // 0 = now(), then less than 0 if previous week, then > 0 error db (future))
        const [currentWeekOffsset, setCurrentWeekOffsset] = useState<number>(0);
        
        //#region NAVIGATOR USEEFFECTS
            // DECREMENT 
            // IF LEFT CHEVRON PRESSED DECREMENT THE currentWeekOffsset
            useEffect(() => {
                if(!leftChevronPressed) return

                setCurrentWeekOffsset(prev => prev - 1);
                // RESET
                setLeftChevronPressed(false);
            }, [leftChevronPressed]);

            // GO TO DEFAULT (0) TODAY PRESSED
            useEffect(() => {
                if(!todayPressed) return

                setCurrentWeekOffsset(0);
                // RESET
                setTodayPressed(false);
            }, [todayPressed]);

            // INCREMENT
            // IF RIGHT CHEVRON PRESSED INCREMENT THE currentWeekOffsset
            // DONT INCREMENT IF currentWeekOffsset about to go > 0
            useEffect(() => {
                if(!rightChevronPressed) return
                //IF IT currentWeekOffsset TRIES TO GO ABOVE 0 THEN RETURN
                if((currentWeekOffsset + 1) >= 1)
                {
                    setRightChevronPressed(false); //RESET
                    return;
                }

                setCurrentWeekOffsset(prev => prev + 1);
                // RESET
                setRightChevronPressed(false);
            }, [rightChevronPressed]);
        //#endregion

        //FETCH CURRENT WEEKLY ACTIVITY IN DB 
        //get fetched twice at mount at 1st (strict mode)
        useEffect(() => 
        {
            const fetchWeeklyActivity = async () => {
                const data = await getCurrentWeeklyActivity(currentWeekOffsset);
                setWeeklyActivityData(data);
            };

            fetchWeeklyActivity();
        }, [currentWeekOffsset]);

    //#endregion

    //#region Data for mini modals
        // const burnedCalories: WeeklyActivityData[] = [
        //     { date: "error", day: "S", value: 50 },
        //     { date: "error", day: "M", value: 80 },
        //     { date: "error", day: "T", value: 90 },
        //     { date: "error", day: "W", value: 0 },
        //     { date: "error", day: "T", value: 0 },
        //     { date: "error", day: "F", value: 117 },
        //     { date: "error", day: "S", value: 200 },
        // ];
    //#endregion

    //#region sliderShit (UNUSED)
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
        <div className="font-montserrat min-h-screen bg-[#fefefe]  flex flex-col">
            {/* HEADER PART */}
            <div className="relative h-[400px] flex flex-col px-6 pb-0 text-center">
                <div className="pt-[115px]">
                    <HeaderNav title="Progress" showBackButton={false}/>
                </div>
                
                <UserProgress/>
            </div>

            {/* GRAY PART */}
            <div className="relative bg-[#f3f0f3] rounded-t-[50px] w-full h-[450px]">

                <p className="font-bold text-lg mt-8 mb-2 ml-5">Insights & Analytics</p>

                <div className="bg-white rounded-[20px] p-5 w-[90%] space-y-6 mx-auto shadow-sm">
                    {/* WEEKLY ACTIVITY */}
                    <WeeklyChart weeklyData={weeklyActivityData} barColor={"#3B7BF9"} chartTitle="Weekly Activity"
                        setButtonPressed_leftChevron={setLeftChevronPressed} setButtonPressed_today={setTodayPressed} setButtonPressed_rightChevron={setRightChevronPressed}/>
                </div>

                {/* <div className="mt-3 bg-white rounded-[20px] p-5 w-[90%] space-y-6 mx-auto shadow-sm"> */}
                    {/* BURNED CALORIES */}
                    {/* {isConnectedHealthConnect ? (
                        <WeeklyChart weeklyData={burnedCalories} barColor={"#DE2B2D"} chartTitle="Burned Calories"/>
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
                    } */}
                {/* </div> */}
            </div>
        </div>
    );
}
