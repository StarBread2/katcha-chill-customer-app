import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";


interface BottomButtonProps {
    icon?: string | null;
    label: string;
    onClick?: () => void;
    bgColor?: string;
    textColor?: string;
    /** Optional: if provided, will trigger file download */
    downloadDataUrl?: string | null;
    downloadFilename?: string;

    /** returns a boolean when clicked */
    onReturnBool?: (value: boolean) => void;

    /** optional navigation path */
    navigateTo?: string;

    /** booleans for if the button can be pressed or not  */
    pressable?: boolean; // controls if button is active or disabled
    canPress?: boolean;  // condition that determines if button can be pressed
}

const FooterButton: React.FC<BottomButtonProps> = ({
    icon,
    label,
    onClick,
    bgColor = "bg-black",
    textColor = "text-white",
    downloadDataUrl,
    downloadFilename = "qrcode.png",
    onReturnBool,
    navigateTo,
    pressable = true,
    canPress = true,
}) => 
{
    const navigate = useNavigate();

    const handleClick = () => 
    {
        // Prevent click if not pressable or not allowed (if variable pressable is hilabtan)
        if (!pressable || !canPress) return;

        if (downloadDataUrl) 
        {
            // Create an invisible <a> tag to download the QR image
            const link = document.createElement("a");
            link.href = downloadDataUrl;
            link.download = downloadFilename;
            link.click();
        } 
        else if (onReturnBool) 
        {
            onReturnBool(true); // returns true when pressed
        } 
        else if (navigateTo) 
        {
            navigate(navigateTo); // go to whatever path is passed
        } 
        else if (onClick) 
        {
            onClick();
        }
    };

    // 🔘 Change appearance if cannot be pressed
    const disabledStyles = !pressable || !canPress;
    const buttonBg = disabledStyles ? "bg-[#434343]" : bgColor;
    const buttonText = disabledStyles ? "text-white" : textColor;
    const cursorStyle = disabledStyles ? "cursor-not-allowed opacity-60" : "cursor-pointer";

    return createPortal(
        <div className="w-[100%] h-[115px] fixed bottom-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] font-montserrat">
            <div className="flex justify-center">
                <button
                    onClick={handleClick}
                    disabled={disabledStyles}
                    className={`w-[90%] ${buttonBg} ${buttonText} ${cursorStyle} py-4 rounded-[10px] flex items-center justify-center gap-2 text-base shadow-lg mt-6 transition-all duration-300`}
                >
                    {icon ? (<img src={icon} alt={`${label} Icon`} className="w-5 h-5" />) : null}

                    <span>{label}</span>
                </button>
            </div>
        </div>, document.body
    );
};

export default FooterButton;
