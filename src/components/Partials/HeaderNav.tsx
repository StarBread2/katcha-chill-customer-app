import { useNavigate } from "react-router-dom";
import BackButton_Icon from "../../assets/HeaderNavBar/ChevronLeft.png";

import { motion } from "framer-motion";

// how to use
// Basic (no bottom navigator)
// <HeaderNav title="Check-in" /> 

// With 2-step navigator
// <HeaderNav title="Check-in" showNavigator segments={2} activeSegment={1} />

// With 3-step navigator
// <HeaderNav title="Registration" showNavigator segments={3} activeSegment={2} />

// With Back button behavior
// <HeaderNav title="Check-in" onBack={() => navigate(-1)} showNavigator /> 



interface HeaderNavProps {
    /** The main title in the center */
    title: string;

    /** Toggle the bottom progress navigator */
    showNavigator?: boolean;

    /** Number of steps/segments in the navigator (e.g. 2 or 3) */
    segments?: number;

    /** Which segment is active (1-based index) */
    activeSegment?: number;

    /** Optional back button handler */
    onBack?: () => void;

    /** Optional back route (used if no onBack is provided) */
    backRoute?: string;
}

export default function HeaderNav({
    title,
    showNavigator = false,
    segments = 2,
    activeSegment = 1,
    onBack,
    backRoute,
    }: HeaderNavProps) 
    {
        const navigate = useNavigate();

        // Smart back handler
        const handleBack = () => 
        {
            if (onBack) 
            {
                onBack(); // manual handler (custom behavior)
            } 
            else if (backRoute) 
            {
                navigate(backRoute); // route-based navigation
            } 
            else 
            {
                navigate(-1); // default browser back
            }
        };

        return (
            <div className="w-full">
                {/* 🔹 Top Header */}
                <div className="flex items-center justify-between px-4 pt-14 pb-4">
                    <button onClick={handleBack} className="flex items-center">
                    <img src={BackButton_Icon} alt="Back" className="w-7 h-7" />
                    </button>

                    <h2 className="font-montserrat font-bold text-lg text-center flex-1 text-black">
                    {title}
                    </h2>

                    <div className="w-5" />
                </div>

                {/* 🔹 Optional Bottom Navigator */}
                {showNavigator && (
                <div className="flex w-full px-4 gap-2">
                {Array.from({ length: segments }).map((_, i) => (
                    <div
                    key={i}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                        i + 1 === activeSegment
                        ? "bg-black flex-1"
                        : "bg-gray-300 flex-1"
                    }`}
                    ></div>
                ))}
                </div>
            )}
            </div>
        );
}
