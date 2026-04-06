import { useState } from "react";
//ICONS
import { ChevronLeft_Icon, ChevronRight_Icon } from "../../assets/assets.ts";
//TYPES
import type { WeeklyActivityData } from '../../types/progressTypes.tsx';

interface weeklyDataInterface 
{
    //THE WEEKLY DATA JSON
    weeklyData: WeeklyActivityData[];
    //THE COLOR OF THE BAR CANDLES
    barColor?: string;
    //HEADER TITLE OF THE WIDGET
    chartTitle: string;

    //NAVIGATION
    // //IF ANY OF THE NAVIGATION IS PRESSED
        //<
        setButtonPressed_leftChevron?: (value: boolean) => void;
        //Today
        setButtonPressed_today?: (value: boolean) => void;
        //>
        setButtonPressed_rightChevron?: (value: boolean) => void;
}

export default function WeeklyChart({ 
    weeklyData, 
    barColor, 
    chartTitle, 
    setButtonPressed_leftChevron, 
    setButtonPressed_today, 
    setButtonPressed_rightChevron
}: weeklyDataInterface) 
{
    //#region bar chart candle size
        const maxHeight = 130; // max bar height in px
        const barWidth = 35; // fixed width for each bar

        //remove all null 
        const values = weeklyData
            .map(d => d.value)
            .filter((v): v is number => v !== null && v > 0);

        // if there is no left value then all is null 
        // IF ALL weeklyData VALUE = NULL then SET MAX VALUE TO 100
        const maxValue = values.length ? Math.max(...values) : 100;
    //#endregion

    //#region WEEKLY ACTIVITY WIDGET DATE RANGE
        const startDate = weeklyData[0]?.date;
        const endDate = weeklyData[weeklyData.length - 1]?.date;

        const formattedRange = startDate && endDate
        ? `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : 'N/A';
    //#endregion

    const flashGray = (el: HTMLElement, duration = 200) => 
    {
        el.classList.add("bg-gray-300");
        el.classList.remove("bg-white");

        setTimeout(() => 
        {
            el.classList.remove("bg-gray-300");
            el.classList.add("bg-white");
        }, duration);
    };

    return (
        <div>
            {/* Header */}
            <section>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-base">{chartTitle}</h3>
                        <p className="text-xs text-[#434343]">{formattedRange}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <div className="rounded-xl p-[0.1rem] bg-white toggle-bg transition-colors duration-300 active:scale-[0.98]" 
                            onClick={(e) => 
                            {
                                flashGray(e.currentTarget);
                                setButtonPressed_leftChevron?.(true)
                            }}
                        >
                            <img
                                src={ChevronLeft_Icon}
                                alt="Previous"
                                className="w-5 h-5  cursor-pointer"
                            />
                        </div>
                        
                        <p className="text-xs text-[#434343] font-medium rounded-xl px-2 py-[0.3rem] bg-white toggle-bg transition-colors duration-300 active:scale-[0.98] "
                            onClick={(e) => 
                            {
                                flashGray(e.currentTarget);
                                setButtonPressed_today?.(true)
                            }}
                        >
                            Today
                        </p>

                        <div className="rounded-xl p-[0.1rem] bg-white toggle-bg transition-colors duration-300 active:scale-[0.98]"
                            onClick={(e) => 
                            {
                                flashGray(e.currentTarget);
                                setButtonPressed_rightChevron?.(true)
                            }}
                        >
                            <img
                                src={ChevronRight_Icon}
                                alt="Next"
                                className="w-5 h-5 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="w-full rounded-xl px-0 shadow-sm mt-6">
                    <div className="flex justify-between items-end h-[160px] px-2">
                        {weeklyData.map((data, index) => {
                        const height = ((data.value ?? 0) / maxValue) * maxHeight;
                        const minHeightForLabel = 24;
                        const adjustedHeight =
                            height < minHeightForLabel ? minHeightForLabel : height;

                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-end relative"
                                style={{ width: `${barWidth}px` }}
                            >
                                {/* Bar area (fixed height container) */}
                                <div className="relative w-full" style={{ height: `${maxHeight}px` }}>
                                    {/* Gray background box */}
                                    <div
                                        className="w-full rounded-md bg-[#D9D9D9] absolute bottom-0"
                                        style={{ height: `${maxHeight}px` }}
                                    ></div>

                                    {/* Foreground (black) bar */}
                                    <div
                                        className="absolute bottom-0 w-full rounded-md rounded-b-none flex items-center justify-center text-white text-xs font-medium transition-all duration-300"
                                        style={{
                                            height: `${adjustedHeight}px`,
                                            backgroundColor: barColor ?? "#000000",
                                            zIndex: 0,
                                        }}
                                    >
                                        {data.value ?? 0}
                                    </div>
                                </div>

                                {/* Label under bar */}
                                <p className="mt-2 text-sm font-medium text-[#434343]">
                                    {data.day}
                                </p>
                            </div>
                        );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
