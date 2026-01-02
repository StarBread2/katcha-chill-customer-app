//FOR WEEKLY ACTIVITY DATA WIDGET
export type WeeklyActivityData = 
{
    date: string;       
    day: string;       
    value: number | null;
};

export type WeeklyActivityByOffset = 
{
    weekOffset: number;
    weeklyActivityData: WeeklyActivityData[];
};

export type gymActivityStats = 
{
    dateRange: string;
    checkIn: number;
    avgWorkoutMin: number;
    burnedCalories: number;
};

export type GymActivityStatsSummary = 
{
    stats: {
        weekly: gymActivityStats;
        monthly: gymActivityStats;
        yearly: gymActivityStats;
    };
}




