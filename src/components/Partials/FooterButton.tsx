// src/components/Partials/FooterButton.tsx
import React from "react";

interface BottomButtonProps {
    icon: string;
    label: string;
    onClick?: () => void;
    bgColor?: string;
    textColor?: string;
    /** Optional: if provided, will trigger file download */
    downloadDataUrl?: string | null;
    downloadFilename?: string;
}

const FooterButton: React.FC<BottomButtonProps> = ({
    icon,
    label,
    onClick,
    bgColor = "bg-black",
    textColor = "text-white",
    downloadDataUrl,
    downloadFilename = "qrcode.png",
}) => {
    const handleClick = () => {
        if (downloadDataUrl) {
        // Create an invisible <a> tag to download the QR image
        const link = document.createElement("a");
        link.href = downloadDataUrl;
        link.download = downloadFilename;
        link.click();
        } else if (onClick) {
        onClick();
        }
    };

    return (
        <div className="fixed bottom-6 left-0 w-full flex justify-center">
        <button
            onClick={handleClick}
            className={`w-[90%] ${bgColor} ${textColor} py-5 rounded-[10px] flex items-center justify-center gap-2 text-base shadow-lg`}
        >
            <img src={icon} alt={`${label} Icon`} className="w-5 h-5" />
            <span>{label}</span>
        </button>
        </div>
    );
};

export default FooterButton;
