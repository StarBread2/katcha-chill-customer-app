import { supabase } from "../lib/supabaseClient"; 

//format 
//type NewAttendance = {
//     user_id: string;
//     user_package_id: number;
//     check_in: string | null;
//     check_out: string | null;
//     checkIn_Approved: boolean;
// };
// Create a new purchase
// Only user_id and user_package_id (for security reasons?)
export async function createNewAttendance(user_id: string, user_package_id: string) 
{
    try 
    {
        const { data, error } = await supabase
        .from("attendance")
        .insert({
                user_id,
                user_package_id
            })
        .select("*")
        .single();

        if (error) throw error;
        return data;
    } 
    catch (err) 
    {
        console.error("Error creating attendance:", err);
        throw err;
    }
}

// Check if the user has an existing pending attendance (not approved check-in)
export async function getPendingAttendanceByUser(user_id: string) 
{
    try 
    {
        const { data, error } = await supabase
            .from("attendance")
            .select("*")
            .eq("user_id", user_id)
            .eq("checkin_approved", false)   // pending check-in approval
            .order("check_in", { ascending: false }) // latest first
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        // if no pending attendance, data = null
        return data;
    } 
    catch (err) 
    {
        console.error("Error fetching pending attendance:", err);
        return null;
    }
}

// Delete an attendance record by its ID
export async function deleteAttendanceById(attendance_id: string | number) 
{
    try 
    {
        const { error } = await supabase
            .from("attendance")
            .delete()
            .eq("attendance_id", attendance_id);

        if (error) throw error;

        console.log(`Attendance with ID ${attendance_id} deleted successfully`);
        return true;
    } 
    catch (err) 
    {
        console.error("Error deleting attendance:", err);
        return false;
    }
}

type CheckInResult = 
{
    checkedInForTheDay: boolean;
    checkInTime: string | null; // human readable string
    count: number;               // how many approved check-ins for today
    timeSpent: string | null;    // human readable duration (e.g. "1 hour and 30 minutes")
};

/**
 * Format milliseconds into a human friendly string like:
 * "1 hour and 30 minutes", "45 minutes", "2 hours", "1 minute and 10 seconds"
 */
function formatDuration(ms: number): string 
{
    if (ms <= 0) return "0 seconds";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (minutes) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
    if (!hours && !minutes && seconds) parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);

    // Join with " and " for the last two parts
    if (parts.length === 0) return "0 seconds";
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(", ") + " and " + parts.slice(-1);
}


//Check if user have checked in for the day
//returns 4 values: 
    // check in date and time (string)
    // if user have checked in (boolean)
    // count of how many check-in for the day (number)
    // time spent in the gym (string)
export async function checkIfUserHaveCheckedInForTheDay(user_id: string): Promise<CheckInResult>
{
    try 
    {
        // compute start and end of the current day in the runtime's local timezone
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

        // fetch approved attendance entries for the user for today, newest first
        const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user_id)
        .eq("checkin_approved", true)
        .gte("check_in", startOfDay)
        .lte("check_in", endOfDay)
        .order("check_in", { ascending: false });

        if (error) throw error;

        const records = data ?? [];
        const count = records.length;

        if (count === 0) 
        {
            return {
                checkedInForTheDay: false,
                checkInTime: null,
                count: 0,
                timeSpent: null,
            };
        }

        const mostRecent = records[0];

        // Determine the check-in time string
        // Use toLocaleString for readability; you can change to toISOString() if you prefer an ISO string.
        const checkInTime = mostRecent.check_in ? new Date(mostRecent.check_in).toLocaleString() : null;

        // Compute time spent: if check_out exists, use check_out - check_in; otherwise use now - check_in
        let timeSpent: string | null = null;
        if (mostRecent.check_in) 
        {
            const inDate = new Date(mostRecent.check_in);
            let diffMs: number;

            if (mostRecent.check_out) 
            {
                const outDate = new Date(mostRecent.check_out);
                diffMs = outDate.getTime() - inDate.getTime();
            } 
            else 
            {
                diffMs = new Date().getTime() - inDate.getTime();
            }

            // guard: if negative (bad timestamps), clamp to 0
            diffMs = Math.max(0, diffMs);
            timeSpent = formatDuration(diffMs);
        }

        return {
            checkedInForTheDay: true,
            checkInTime,
            count,
            timeSpent,
        };
    } 
    catch (err) 
    {
        console.error("Error in checkIfUserHaveCheckedInForTheDay:", err);
        // Re-throw so callers can handle UI/errors; alternatively you could return a default object
        throw err;
    }
}
//get current day
//check for current user_id 
//check the most recent one where checkin_approved is true for this day

//if there are multiple then count them, and with the most recent one calculate the time in between check_in and check_out (automatically return string like (1 hour and 30 minutes or like that))

//and its true then return true and the checkin time, and the count of how many check in for the day, and the time inbetween check_in and check_out (return 4 values)
//else return false and null