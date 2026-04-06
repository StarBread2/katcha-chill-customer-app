import { createPortal } from "react-dom"; //FOR RENDERING IN DIV (Z-1) FOR NAVBARS

import { useNavigate } from "react-router-dom";
import BackButton_Icon from "../../assets/HeaderNavBar/ChevronLeft.png";

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

    /** Toggle visibility of back button (default: true) */
    showBackButton?: boolean;

    /** callback when back button is pressed */
    onBackPressed?: (pressed: boolean) => void;

    /** Disable navigation when back button is pressed (default: false) */
    disableBackNavigation?: boolean;
}

export default function HeaderNav(
{
    title,
    showNavigator = false,
    segments = 2,
    activeSegment = 1,
    onBack,
    backRoute,
    showBackButton = true,
    onBackPressed,
    disableBackNavigation = false,
}: HeaderNavProps) 
    {
        const navigate = useNavigate();

        // Smart back handler
        const handleBack = () => 
        {
            // Trigger callback with "true"
            if (onBackPressed) 
            {
                onBackPressed(true);
            }

            // If temporarily disabled, stop here
            if (disableBackNavigation) return;


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

        return createPortal(
            
            <div className="fixed top-0 left-0 w-full bg-white z-10">
                {/* 🔹 Top Header */}
                <div className="flex items-center justify-between px-4 pt-14 pb-2">

                    {/* TOGGLE TO SHOW THE BACK BUTTON */}
                    {showBackButton ? (
                        <button onClick={handleBack} className="flex items-center">
                            <img src={BackButton_Icon} alt="Back" className="w-7 h-7" />
                        </button>
                    ) : (
                        // Empty spacer to keep layout centered
                        <div className="w-7 h-7" />
                    )}

                    <h2 className="font-montserrat font-bold text-lg text-center flex-1 text-black">
                    {title}
                    </h2>

                    <div className="w-5" />
                </div>

                {/* 🔹 Optional Bottom Navigator */}
                {showNavigator && (
                <div className="flex w-full px-4 gap-1">
                {Array.from({ length: segments }).map((_, i) => (
                    <div
                    key={i}
                    className={`h-[4px] rounded-full transition-all duration-300 ${
                        i + 1 === activeSegment
                        ? "bg-black flex-1"
                        : "bg-gray-300 flex-1"
                    }`}
                    ></div>
                ))}
                </div>
            )}
            </div>, document.body
        );
}
