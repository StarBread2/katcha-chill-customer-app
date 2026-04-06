import { Link } from "react-router-dom";

import { GymCoin_Colored, Help_Icon } from '../../assets/assets.ts';

interface HeaderProps {    
    GymCoins: number;     
}

export default function GymCreditsCard({GymCoins}: HeaderProps) {
    return (
        <div className="relative bg-white rounded-[20px] p-6 pb-6  font-montserrat w-[98%] mx-auto">
            
            {/* 🔹 Help Icon (top-right corner) */}
            <img
                src={Help_Icon}
                alt="Help"
                className="absolute top-4 right-4 w-5 h-5 cursor-pointer"
            />

            <div className="flex justify-between items-center">
                {/* 🔹 Left Section */}
                <div>
                    <p className="font-semibold text-lg">{GymCoins} Credits</p>
                    <p className="text-sm text-gray-500 w-[80%] leading-none">
                        1 Credits = 1 gym session
                    </p>
                </div>

                {/* 🔹 Right Section */}
                    <div className="flex flex-col items-center">
                        <img src={GymCoin_Colored} alt="Gym" className="w-22 h-22 mb-2" />
                        <Link to="/home/AddCredits">
                            <button className="bg-black text-white text-sm rounded-full px-5 py-2.5 active:scale-[0.98] transition">
                                Add Credits
                            </button>
                        </Link>
                    </div>
                
            </div>
        </div>
    );
}
