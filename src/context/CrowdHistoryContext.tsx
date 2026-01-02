import { useContext, createContext, useState, useEffect } from "react";
//SERVICES
import { getCrowdHistoryByDay } from "../services/crowdHistoryService.tsx";
//AUTHPROVIDER
import { useAuth } from "../auth/AuthProvider";
//TYPES
import type { CrowdHistoryPoint, CrowdHistoryDay } from '../types/crowdHistorytypes.tsx';
import { FULL_DAY_TIMES } from '../types/crowdHistorytypes';

type CrowdHistoryContextType = 
{
    getCurrentWeeklyCrowdHistory: (date: string) => Promise<CrowdHistoryPoint[]>
    crowdCountNow: number;
}

const CrowdHistoryContext = createContext<CrowdHistoryContextType | undefined>(undefined);

export const CrowdHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => 
{
    // USERAUTH
    const { user } = useAuth();
    // CACHE
        const [weeklyCrowdHistory, setWeeklyCrowdHistory] = useState<
            Record<string, CrowdHistoryPoint[]>
        >({});
        const [crowdCountNow, setCrowdCountNow] = useState<number>(0);
    
    //#region Crowd History Data (for char)
        // Normalized crowd history data (it returns only if there is value and can be null if no value)
        const normalizeCrowdHistoryDay = (crowdHistoryFetch: CrowdHistoryDay | null): CrowdHistoryPoint[] => 
        {
            if (!crowdHistoryFetch?.data) {
                // No data → all zeros
                return FULL_DAY_TIMES;
            }

            // Convert API data to lookup map
            const valueMap = new Map(
                crowdHistoryFetch?.data.map(item => [item.time, item.value])
            );

            // Fill missing hours with 0
            return FULL_DAY_TIMES.map(slot => ({
                time: slot.time,
                value: valueMap.get(slot.time) ?? 0,
            }));
        };

        // Fetch data in DB, normalize it, then store it in weeklyCrowdHistory,
        // If the data exist in cache then dont fetch
        const getCurrentWeeklyCrowdHistory = async (date: string): Promise<CrowdHistoryPoint[]> => 
        {
            if (!user?.id) 
            {
                console.warn("getCurrentWeeklyActivity: No logged-in user");
                return [];
            }

            // CHECK CACHE FIRST
            const cached = weeklyCrowdHistory[date];
            if (cached) 
            {
                return cached;  
            }

            try 
            {
                // DB FETCH
                const data = await getCrowdHistoryByDay(date);
                // Normalized data (it returns null if no people that day and returns only time where people is in the gym)
                const normalized = normalizeCrowdHistoryDay(data);

                // Assign data to weeklyCrowdHistory
                setWeeklyCrowdHistory(prev => ({
                    ...prev,
                    [date]: normalized,
                }));

                //Return fetched data
                return normalized;
            } 
            catch (error) 
            {
                console.error("Error fetching crowd history:", error);
                return [];
            }
        }
    //#endregion

    //#region Get Crowd Count Now 
        // Get current day (format: "2026-01-01")
        const getTodayDateString = () => new Date().toISOString().split("T")[0];
        // Get current hour now
        const getCurrentHourLabel = () =>
        {
            const now = new Date();
            let hour = now.getHours(); // 0–23
            const ampm = hour >= 12 ? "PM" : "AM";

            hour = hour % 12;
            hour = hour === 0 ? 12 : hour;

            return `${hour.toString().padStart(2, "0")}:00 ${ampm}`;
        };
        
        // Use cached weeklyCrowdHistory to current hour and use its value as crowdCountNow
        // If value is not yet cached then fetch
        useEffect(() =>
        {
            if (!user?.id) return;

            const resolveCrowdCountNow = async () =>
            {
                const today = getTodayDateString();
                const currentHour = getCurrentHourLabel();

                let dayData = weeklyCrowdHistory[today];

                // Not cached yet → fetch once
                if (!dayData)
                {
                    dayData = await getCurrentWeeklyCrowdHistory(today);
                }

                //  Find current hour value
                const currentPoint = dayData.find(
                    point => point.time === currentHour
                );

                setCrowdCountNow(currentPoint?.value ?? 0);
            };

            resolveCrowdCountNow();

        }, [user]);

    //#endregion





    return (
        <CrowdHistoryContext.Provider 
        value={{
            getCurrentWeeklyCrowdHistory,
            crowdCountNow,
        }}> 
            {children}
        </CrowdHistoryContext.Provider>
    );
};

export const useCrowdHistoryContext = () => 
{
    const context = useContext(CrowdHistoryContext);
    if (!context) throw new Error("CrowdHistoryContext must be used within a UserProvider");
    return context;
};

