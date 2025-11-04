import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { ChevronUp_Icon } from "../../assets/index.ts";

import { useState, memo } from "react";

//Used memo to not re render shit
const CrowdHistoryChart = memo(function CrowdHistoryChart()
{
    // Local config
    const limit = 50;
    const colors = {
        low: "#28D977", // Green
        medium: "#FDB927", // Yellow
        high: "#FF3B3B", // Red
    };

    // Crowd data
    const data = [
        { time: "01:00 AM", value: 0 },
        { time: "02:00 AM", value: 0 },
        { time: "03:00 AM", value: 0 },
        { time: "04:00 AM", value: 0 },
        { time: "05:00 AM", value: 0 },
        { time: "06:00 AM", value: 0 },
        { time: "07:00 AM", value: 0 },
        { time: "08:00 AM", value: 0 },
        { time: "09:00 AM", value: 2 },
        { time: "10:00 AM", value: 3 },
        { time: "11:00 AM", value: 10 },
        { time: "12:00 PM", value: 5 },
        { time: "01:00 PM", value: 8 },
        { time: "02:00 PM", value: 9 },
        { time: "03:00 PM", value: 16 },
        { time: "04:00 PM", value: 15 },
        { time: "05:00 PM", value: 19 },
        { time: "06:00 PM", value: 25 },
        { time: "07:00 PM", value: 32 },
        { time: "08:00 PM", value: 10 },
        { time: "09:00 PM", value: 10 },
        { time: "10:00 PM", value: 0 },
        { time: "11:00 PM", value: 0 },
        { time: "12:00 PM", value: 0 }
    ];

    // Current day highlight
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const currentDay = new Date().getDay();

    // For hide toggle state (animation)
    const [isExpanded, setIsExpanded] = useState(true);
    const toggleExpand = () => setIsExpanded((prev) => !prev);

    return (
        <div className="rounded-2xl w-full max-w-sm font-montserrat bg-white shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-xl font-bold text-black">Crowd History</h2>
                <button
                onClick={toggleExpand}
                className="text-black transition-transform duration-300"
                >
                <img
                    src={ChevronUp_Icon}
                    alt="Dropdown"
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                    }`}
                />
                </button>
            </div>

            {/* ========== ANIMATION ========== */}
                <div
                className={`overflow-hidden transition-[max-height] duration-400 ease-in-out ${
                    isExpanded ? "max-h-[300px]" : "max-h-0"
                }`}
                >       
                    {/* Days row */}
                    <div className="flex justify-between mt-3">
                    {days.map((day, i) => (
                        <div
                        key={i}
                        className={`text-xs font-semibold px-2 py-2 rounded-full transition-all duration-300 ${
                            i === currentDay ? "bg-[#DE2B2D] text-white" : "text-black"
                        }`}
                        >
                        {day}
                        </div>
                    ))}
                    </div>

                    {/* Chart */}
                    <div className="mt-4 text-[#434343]" style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 11, fill: "#434343", fontWeight: 600 }}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                            tickFormatter={(time) =>
                            ["12:00 AM", "06:00 AM", "12:00 PM", "06:00 PM"].includes(time)
                                ? time
                                : ""
                            }
                        />

                        <ReferenceLine y={0} stroke="#434343" />

                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "#f9f9f9",
                            fontSize: "0.8rem",
                            }}
                            formatter={(value) => [`${value} people`, "Crowd Count"]}
                            labelFormatter={(label) => `Time: ${label}`}
                        />

                        <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={10}>
                            {data.map((entry, index) => {
                            const percentage = (entry.value / limit) * 100;
                            let color =
                                percentage <= 40
                                ? colors.low
                                : percentage <= 75
                                ? colors.medium
                                : colors.high;
                            return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                        </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-[#434343] font-semibold mb-6">
                        Meter based on recent average activity
                    </p>
                </div> 
            {/* ========== ANIMATION ========== */}
        </div>
    );
});

export default memo(CrowdHistoryChart);
