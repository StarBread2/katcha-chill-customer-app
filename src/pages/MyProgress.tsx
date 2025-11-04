import UserProgress from "../components/MyProgress/UsersProgressHeader.tsx"; 
import WeeklyChart from "../components/MyProgress/WeeklyChart.tsx";    
import HeaderNav from "../components/Partials/HeaderNav";

export default function MyProgress() 
{
    // Gym Activity (Header)
    const CheckIns = 20;
    const AvgWorkoutMin = 50; 

    return (
        <div className="font-montserrat min-h-screen bg-white flex flex-col">
            {/* HEADER PART */}
            <div className="relative h-[450px] flex flex-col px-6 pb-20 text-center">
                <div className="pt-[115px]">
                    <HeaderNav title="Progress" showBackButton={false}/>
                </div>
                
                <UserProgress CheckIns={CheckIns} AvgWorkoutMin={AvgWorkoutMin}/>
            </div>

            {/* GRAY PART */}
            <div className="relative bg-[#E6E6E6] rounded-t-[50px] -mt-12 w-full h-[600px] shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                <WeeklyChart/>
            </div>
        </div>
    );
}
