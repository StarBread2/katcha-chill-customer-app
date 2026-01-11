import { useState, memo, useEffect } from "react";
//ICONS
import { ChevronUp_Icon } from "../../assets/assets.ts";
//CONTEXT
import { useCrowdHistoryContext } from "../../context/CrowdHistoryContext.tsx";
//PARTIALS
import ModalConfirmation from "../../components/Partials/modalConfirmation.tsx";
//3RD PARTY
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
//TYPES
import type { CrowdHistoryPoint, CrowdHistoryDay } from '../../types/crowdHistorytypes.tsx';
import { FULL_DAY_TIMES } from '../../types/crowdHistorytypes';


//Used memo to not re render shit
const CrowdHistoryChart = memo(function CrowdHistoryChart()
{
    // DB FETCH
    const { getCurrentWeeklyCrowdHistory } = useCrowdHistoryContext();

    //#region Utils
        // Get current day with dayIndex (Week -> day -> number)
        const getDateFromWeekday = (dayIndex: number) =>
        {
            const today = new Date();
            const todayIndex = today.getDay();

            const diff = dayIndex - todayIndex;
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + diff);

            return targetDate.toISOString().split("T")[0]; // YYYY-MM-DD
        }
    //#endregion
    //#region Local config (chart limit, color of candles, hide animation, chart button texts)
        const limit = 50;
        const colors = {
            low: "#28D977", // Green
            medium: "#FDB927", // Yellow
            high: "#FF3B3B", // Red
        };

        // For hide toggle state (animation)
        const [isExpanded, setIsExpanded] = useState(true);
        const toggleExpand = () => setIsExpanded((prev) => !prev);

        // Current day highlight
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    //#endregion
    
    //#region crowdHistory Data
        // Get current day index (used in onclick below)
        const todayIndex = new Date().getDay();
        // Crowd data
        const [crowdHistoryDataDay, setCrowdHistoryDataDay] = useState<CrowdHistoryPoint[]>(FULL_DAY_TIMES);
        // selected day, default: today selected
        const [selectedDay, setSelectedDay] = useState<number>(todayIndex);
        
        // fetch data and update crowdHistoryDataDay for every update of selectedDay
        useEffect(() => 
        {
            let isMounted = true;

            const fetchCrowdHistory = async () => 
            {
                const data = await getCurrentWeeklyCrowdHistory(
                    getDateFromWeekday(selectedDay)
                );

                if (isMounted) {
                    setCrowdHistoryDataDay(data);
                }
            };

            fetchCrowdHistory();

            return () => 
            {
                isMounted = false;
            };
        }, [selectedDay])

        // Check if the selectedDay has data
        const hasData = crowdHistoryDataDay.some(point => point.value > 0);
    //#endregion
    
    //#region Warning Modal
        const [displayWarningModal_CrowdHistory, setDisplayWarningModal_CrowdHistory] = useState(false);
        const [modalCloseButtonClicked_CrowdHistory, setmodalCloseButtonClicked_CrowdHistory] = useState(false);
        const [modalAgreeButonClicled_CrowdHistory, setmodalAgreeButonClicled_CrowdHistory] = useState(false);

        // When modal "Close" button is clicked → hide modal
        useEffect(() => 
        {
            if (modalCloseButtonClicked_CrowdHistory) 
            {
                setDisplayWarningModal_CrowdHistory(false); // close modal
                setmodalCloseButtonClicked_CrowdHistory(false); // reset flag
            }
        }, [modalCloseButtonClicked_CrowdHistory]);
        //WHEN MODAL AGREE (DELETE) IS CLICKED
        useEffect(() => 
        {
            if(!modalAgreeButonClicled_CrowdHistory) return;
            
            setDisplayWarningModal_CrowdHistory(false); // close modal
            setmodalAgreeButonClicled_CrowdHistory(false); //RESET AGREE MODAL CLICKED
        }, [modalAgreeButonClicled_CrowdHistory]);
    //#endregion

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
                            <button
                                key={i}
                                onClick={() => 
                                {
                                    if (i > todayIndex) 
                                    {
                                        setDisplayWarningModal_CrowdHistory(true)
                                        return;
                                    }
                                    setSelectedDay(i)
                                }}
                                className={`text-xs font-semibold px-2 py-2 rounded-full transition-all duration-300 ${
                                    i === selectedDay 
                                    ? "bg-[#DE2B2D] text-white" 
                                    : "text-black"
                                }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="mt-4 text-[#434343]" style={{ height: 180 }}>
                        {hasData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={crowdHistoryDataDay} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
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
                                <YAxis
                                    domain={[0, limit]}
                                    hide
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
                                    {crowdHistoryDataDay.map((entry, index) => {
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
                        ): (
                            <div className="flex items-center justify-center text-center h-full text-sm font-semibold text-gray-400 px-5">
                                No crowd data available for this day or the gym is closed
                            </div>
                        )}
                        
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-[#434343] font-semibold mb-6">
                        Meter based on recent average activity
                    </p>
                </div> 
            {/* ========== ANIMATION ========== */}

            {displayWarningModal_CrowdHistory && (
                (<ModalConfirmation 
                    title="Ooopss" 
                    message={`You're local gym can't see the future`}
                    buttonLabel="Go back"
                    onClose={setmodalCloseButtonClicked_CrowdHistory}
                    onConfirm={setmodalAgreeButonClicled_CrowdHistory}
                />)
            )}
            
        </div>
        
    );
});

export default memo(CrowdHistoryChart);
