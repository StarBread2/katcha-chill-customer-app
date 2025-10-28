import { Check_Icon, ClockRed_Icon } from '../../assets/index.ts';

interface HeaderProps {
    CheckIns: number;     
    AvgWorkoutMin: number;     
}

export default function UserProgress({ CheckIns, AvgWorkoutMin }: HeaderProps) 
{
    
    return (
        <div>
            {/* Gym Activity */}
            <section>
                <h2 className="font-bold text-lg text-left mb-5">Gym Activity</h2>
                <p className="text-base font-semibold text-black text-left ml-2">Sep 20 - Sep 26, 2025</p>


                {/* Stats Cards */}
                <div className="flex justify-between mt-3 mb-5 px-2 gap-0.5">
                    <div className="flex-1 bg-white rounded-[20px] border-2 border-[#E6E6E6] shadow-sm p-4  mr-2 flex flex-col justify-between h-[115px]">
                        <div className="flex items-center justify-between">
                            <img src={Check_Icon} alt="Check Icon" className="w-6 h-6" />
                            <p className="text-2xl font-bold">{CheckIns}</p>
                        </div>
                        <p className="text-sm text-[#434343] text-left">Check-ins</p>
                    </div>

                    <div className="flex-1 bg-white rounded-[20px] border-2 border-[#E6E6E6] shadow-sm p-4 flex flex-col justify-between h-[115px]">
                        <div className="flex items-center justify-between">
                            <img src={ClockRed_Icon} alt="Clock Icon" className="w-6 h-6" />
                            <p className="text-2xl font-bold">{AvgWorkoutMin}</p>
                        </div>
                        <p className="text-sm text-[#434343] text-left">Avg Workout Min</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="inline-flex justify-center space-x-2 bg-[#E6E6E6] rounded-[20px]">
                    <button className="bg-black text-white px-5 py-3 rounded-[20px] text-sm font-medium">Week</button>
                    <button className="bg-[#E6E6E6] px-5 py-3 rounded-full text-sm font-medium">Month</button>
                    <button className="bg-[#E6E6E6] px-5 py-3 rounded-full text-sm font-medium">Year</button>
                </div>
            </section>
        </div>
    );
}