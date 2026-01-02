import { supabase } from "../lib/supabaseClient";   

//#region GET Weekkly activity for weekly activity widget
    export const getWeeklyActivity = async (user_id: string, weekOffset: number = 0) => 
    {
        const { data, error } = await supabase.rpc(
            "progress_getweeklyactivity",
            {   p_user_id: user_id,
                p_week_offset: weekOffset,
            }
        );

        if (error) 
        {
            console.error("Error fetching weekly attendance:",error);
            return null;  // ALWAYS return null on error
        }

        return data ?? []; // ALWAYS return array
    }
//#endregion

//#region GYM ACTIVITY SUMMARY
    // MONTHLY
    export const getMonthlySummary = async (user_id: string, weekOffset: number = 0) => 
    {
        const { data, error } = await supabase.rpc(
            "progress_getmonthly_gym_activity_stats",
            {   p_user_id: user_id,
                month_offset: weekOffset,
            }
        );

        if (error) 
        {
            console.error("Error fetching monthly gym activity stats:",error);
            return null;  // ALWAYS return null on error
        }

        return data ?? []; // ALWAYS return array
    }
    //YEARLY
    export const getYearlySummary = async (user_id: string, weekOffset: number = 0) => 
    {
        const { data, error } = await supabase.rpc(
            "progress_getyearly_gym_activity_stats",
            {   p_user_id: user_id,
                year_offset: weekOffset,
            }
        );

        if (error) 
        {
            console.error("Error fetching yearly gym activity stats:",error);
            return null;  // ALWAYS return null on error
        }

        return data ?? []; // ALWAYS return array
    }
//#endregion