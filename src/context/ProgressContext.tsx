import { useContext, createContext, useState, useEffect } from "react";
//SHITLY CODED CONTEXT
import { UserContext } from "./UserContext.tsx";
//AUTHPROVIDER
import { useAuth } from "../auth/AuthProvider";
//SERVICES
import { getWeeklyActivity, getMonthlySummary, getYearlySummary } from "../services/progressServices.tsx";
//TYPES
import type { WeeklyActivityData, WeeklyActivityByOffset, gymActivityStats, GymActivityStatsSummary } from '../types/progressTypes.tsx';

type ProgressContextType = 
{
    getCurrentWeeklyActivity: (weekOffset: number) => Promise<WeeklyActivityData[]>
    gymActivityStatsSummary: GymActivityStatsSummary;

    getMonthlyGymActivitySummary: (weekOffset: number) => Promise<void>;
    getYearlyGymActivitySummary: (weekOffset: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => 
{
    //USERAUTH
    const { user } = useAuth();
    //USER PROFILE FROM USERCONTEXT
    const { profile } = useContext(UserContext)!;

    //#region weeklyActivity data for weeklyActivity widget
        // Weeklyactivity with its offset
        // Fetch on the db only once per week offset
        const [WeeklyActivityByOffset, setWeeklyActivityByOffset] = useState<WeeklyActivityByOffset[] | null>(null);

        const getCurrentWeeklyActivity = async (weekOffset: number = 0): Promise<WeeklyActivityData[]> => 
        {
            if (!user?.id) 
            {
                console.warn("getCurrentWeeklyActivity: No logged-in user");
                return [];
            }

            //Check if the data exist in weekOffset
            const cached = WeeklyActivityByOffset?.find(
                w => w.weekOffset === weekOffset
            );

            // Then return it if it exist
            if (cached) 
            {
                // Already exists → return cached data
                return cached.weeklyActivityData;
            }

            // Else, fetch the data and return it
            try 
            {
                //DB FETCH
                const data = await getWeeklyActivity(user.id, weekOffset);

                setWeeklyActivityByOffset(prev => [
                    ...(prev ?? []),
                    {
                        weekOffset,
                        weeklyActivityData: data,
                    },
                ]);

                //Return fetched data
                return data;
            } 
            catch (error) 
            {
                console.error("Error fetching current weekly activity:", error);
                return [];
            }
        }
    //#endregion
    
    //After fetching weekly activity calculate the gym activity for the week
    useEffect(() =>
    {
        console.log(WeeklyActivityByOffset);
        getWeeklyGymActivitySummary();
    }, [WeeklyActivityByOffset])

    //#region gym activity data
        //#region default data of gym activity stats
            const EMPTY_STATS: gymActivityStats = {
                dateRange: 'loading...',
                checkIn: 0,
                avgWorkoutMin: 0,
                burnedCalories: 0,
            };
            const NOUSER_STATS: gymActivityStats = {
                dateRange: 'error',
                checkIn: 0,
                avgWorkoutMin: 0,
                burnedCalories: 0,
            };
            const ERROR_STATS: gymActivityStats = {
                dateRange: 'error',
                checkIn: 0,
                avgWorkoutMin: 0,
                burnedCalories: 0,
            };
        //#endregion
        // Initialize empty stats
        const [gymActivityStatsSummary, setGymActivityStatsSummary] = useState<GymActivityStatsSummary>({
            stats: 
            {
                weekly: EMPTY_STATS,
                monthly: EMPTY_STATS,
                yearly: EMPTY_STATS,
            },
        });
        //#region Weekly data
            const getWeeklyGymActivitySummary = () => 
            {
                if (!user?.id) 
                {
                    console.warn("getCurrentWeeklyActivity: No logged-in user");
                    setGymActivityStatsSummary(prev => ({
                        stats: {
                            ...prev.stats,
                            weekly: NOUSER_STATS
                        },
                    }));
                    return;
                }

                //Check if the data default week is already fetched
                const cached = WeeklyActivityByOffset?.find(
                    w => w.weekOffset === 0
                );
                if (!cached || cached.weeklyActivityData.length === 0) 
                {
                    console.log("getWeeklyGymActivitySummary: default week data not yet fetched")
                    setGymActivityStatsSummary(prev => ({
                        stats: {
                            ...prev.stats,
                            weekly: ERROR_STATS
                        },
                    }));
                    return ;
                }
                

                const { weeklyActivityData } = cached;
                // calculate the date range of the weekly activity summary
                    const startDate = weeklyActivityData[0]?.date;
                    const endDate = weeklyActivityData[weeklyActivityData.length - 1]?.date;

                    const formattedRange =
                    startDate && endDate
                        ? `${new Date(startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })} - ${new Date(endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}, ${new Date(endDate).getFullYear()}`
                        : "N/A";
                

                // Filter non null values 
                const validValues = weeklyActivityData
                .map(d => d.value)
                .filter((v): v is number => v !== null);

                // Then count the non null values
                const checkIn = validValues.length;

                // Calculate the avg workout minute
                const avgWorkoutMin =
                checkIn > 0
                ? Math.round(
                    validValues.reduce((sum, v) => sum + v, 0) / checkIn
                    )
                : 0;
                
                setGymActivityStatsSummary(prev => ({
                    stats: {
                        ...prev.stats,
                        weekly: {
                        dateRange: formattedRange,
                        checkIn: checkIn,
                        avgWorkoutMin: avgWorkoutMin,
                        burnedCalories: 0,
                        },
                    },
                }));
            }
        //#endregion
        //#region Monthly data
            const getMonthlyGymActivitySummary = async (weekOffset: number = 0): Promise<void> => 
            {
                if (!user?.id) 
                {
                    console.warn("getMonthlyGymActivitySummary: No logged-in user");
                    setGymActivityStatsSummary(prev => ({
                        stats: {
                            ...prev.stats,
                            monthly: NOUSER_STATS
                        },
                    }));
                    return;
                }
                try 
                {
                    const data = await getMonthlySummary(user.id, weekOffset);
                    
                    setGymActivityStatsSummary(prev => ({
                        stats: {
                            ...prev.stats,
                            monthly: {
                            dateRange: data.dateRange,
                            checkIn: data.checkIn,
                            avgWorkoutMin: data.avgWorkoutMin,
                            burnedCalories: 0,
                            },
                        },
                    }));
                } 
                catch (err) 
                {
                    console.error("Error fetching monthly gym activity summary:", err);

                    setGymActivityStatsSummary(prev => ({
                        stats: {
                            ...prev.stats,
                            monthly: ERROR_STATS
                        },
                    }));
                }
            }
        //#endregion
        //#region Yearly Data
            const getYearlyGymActivitySummary = async (weekOffset: number = 0): Promise<void> => 
            {
                if (!user?.id) 
                {
                    console.warn("getYearlyGymActivitySummary: No logged-in user");
                    setGymActivityStatsSummary(prev => ({
                        stats: {
                            ...prev.stats,
                            yearly: NOUSER_STATS
                        },
                    }));
                    return;
                }
                try 
                {
                    const data = await getYearlySummary(user.id, weekOffset);
                    
                    setGymActivityStatsSummary(prev => ({
                        stats: {
                            ...prev.stats,
                            yearly: {
                            dateRange: data.dateRange,
                            checkIn: data.checkIn,
                            avgWorkoutMin: data.avgWorkoutMin,
                            burnedCalories: 0,
                            },
                        },
                    }));
                } 
                catch (err) 
                {
                    console.error("Error fetching yearly gym activity summary:", err);
                    setGymActivityStatsSummary(prev => ({
                        stats: {
                            ...prev.stats,
                            yearly: ERROR_STATS
                        },
                    }));
                }
            }
        //#endregion
    //#endregion

    return (
        <ProgressContext.Provider 
        value={{
            getCurrentWeeklyActivity,
            gymActivityStatsSummary,
            getMonthlyGymActivitySummary,
            getYearlyGymActivitySummary,
        }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgressContext = () => 
{
    const context = useContext(ProgressContext);
    if (!context) throw new Error("ProgressContext must be used within a UserProvider");
    return context;
};
