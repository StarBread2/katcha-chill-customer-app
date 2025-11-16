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
export async function createNewAttendance(user_id: string, user_package_id: string) {
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
export async function deleteAttendanceById(attendance_id: string | number) {
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