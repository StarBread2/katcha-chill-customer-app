import { div } from "framer-motion/client";
import { ChevronLeft_Icon, ChevronRight_Icon } from "../../assets/index.ts";

interface WeeklyData 
{
    day: string;
    value: number;
}

interface weeklyDataInterface 
{
    weeklyData: WeeklyData[];
    barColor?: string;
    chartTitle: string;
}

export default function WeeklyChart({ weeklyData, barColor, chartTitle }: weeklyDataInterface) 
{

    const maxHeight = 130; // max bar height in px
    const barWidth = 35; // fixed width for each bar
    const maxValue = Math.max(...weeklyData.map((d) => d.value));

    return (
        <div>
            {/* Header */}
            <section>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-base">{chartTitle}</h3>
                        <p className="text-xs text-[#434343]">Sep 20 - Now</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <img
                        src={ChevronLeft_Icon}
                        alt="Previous"
                        className="w-5 h-5 cursor-pointer"
                        />
                        <p className="text-xs text-[#434343] font-medium">Today</p>
                        <img
                        src={ChevronRight_Icon}
                        alt="Next"
                        className="w-5 h-5 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Chart Container */}
                <div className="w-full rounded-xl px-0 shadow-sm mt-6">
                    <div className="flex justify-between items-end h-[160px] px-2">
                        {weeklyData.map((data, index) => {
                        const height = (data.value / maxValue) * maxHeight;
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
                                        {data.value}
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
