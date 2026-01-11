import { Clock_Icon, Location_Icon, Phone_Icon } from "../../assets/assets.ts";
import { ChevronUp_Icon } from "../../assets/assets.ts";

import { useState,memo } from "react";

const GymInfoCard = memo(function GymInfoCard()
{
    // For hide toggle state (animation)
    const [isExpanded, setIsExpanded] = useState(true);
    const toggleExpand = () => setIsExpanded((prev) => !prev);

    return (

            <div
            className={`mt-2 space-y-3 text-sm font-montserrat font-semibold text-[#434343] flex flex-col px-6 bg-white transition-all duration-300 ${
                isExpanded ? "p-5" : "p-5 pb-0"
            }`}
            >
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Gym Info</h2>
                <button className="text-black text-sm" onClick={toggleExpand}>
                <img
                    src={ChevronUp_Icon}
                    alt="Dropdown"
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                    }`}
                />
                </button>
            </div>

            {/* Collapsible section */}
            <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                isExpanded ? "max-h-[200px] mt-3" : "max-h-0"
                }`}
            >
                <div className="flex items-center gap-4 max-w-[70%]">
                <img src={Location_Icon} alt="Location" className="w-5 h-5" />
                Purok 2, Magatas, Sibulan, Negros Oriental
                </div>

                <div className="border-t border-[#E6E6E6] w-full mt-3 mb-5" />

                <div className="flex items-center gap-4 max-w-[70%]">
                <img src={Phone_Icon} alt="Phone" className="w-5 h-5" />
                12345678910
                </div>

                <div className="border-t border-[#E6E6E6] w-full mt-3 mb-5" />

                <div className="flex items-center gap-4 max-w-[70%]">
                <img src={Clock_Icon} alt="Clock" className="w-5 h-5" />
                8:00 AM - 9:00 PM
                </div>
            </div>
            </div>


    );
});

// const GymInfoCard = () => (
    
// );

export default memo(GymInfoCard);
