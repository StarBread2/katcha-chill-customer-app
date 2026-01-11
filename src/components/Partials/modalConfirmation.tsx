import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Close_Icon } from "../../assets/assets.ts";

//CSS TRANSITION
import PageTransition from "../../components/Transitions/PageTransition.tsx";

interface ModalConfirmationProps 
{
    title: string;
    message: string;
    buttonLabel: string;

    onClose?: (value: boolean) => void;   // called when the close button is pressed
    onConfirm?: (value: boolean) => void; // called when the main (confirm) button is pressed

    //Navigate to where
    navigateTo?: string;
}

export default function ModalConfirmation({ title, message, buttonLabel, onClose, onConfirm, navigateTo, }: ModalConfirmationProps) 
{
    const navigate = useNavigate();

    useEffect(() => 
    {
        // Disable scroll when modal opens
        document.body.style.overflow = "hidden";

        // Re-enable scroll when modal unmounts
        return () => 
        {
            document.body.style.overflow = "auto";
        };
    }, []);

    return createPortal(
        <div 
            className="z-50 font-montserrat fixed bottom-0 left-0 w-full h-full flex justify-center items-end bg-gradient-to-b from-transparent to-black/40 backdrop-blur-sm p-6"
            onClick={() => onClose?.(true)} // Clicking outside closes modal
        >
            <PageTransition type="slide-up"> {/* animation wrapper */}
                <div 
                    className="bg-white rounded-[30px] shadow-2xl px-10 pt-10 pb-8  w-[100%] max-w-sm text-center relative"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Close button */}
                    <button
                        className="absolute top-5 right-4 text-gray-400 hover:text-gray-600 transition-all"
                        onClick={() => onClose?.(true)}
                    >
                        <img
                            src={Close_Icon}
                            alt="Close"
                            className="w-7 h-7"
                        />
                    </button>

                    {/* Title */}
                    <h2 className="pt-4 text-lg font-semibold text-gray-900">{title} </h2>

                    {/* Message */}
                    <p className="text-gray-600 text-sm mt-1">
                        {message} 
                    </p>

                    {/* Button */}
                    <button 
                        onClick={() => {
                            if (navigateTo) 
                            {
                                navigate(navigateTo);
                            }
                            onConfirm?.(true);
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-all mt-6">
                        {buttonLabel} 
                    </button>
                </div>
            </PageTransition>
        </div>, document.body
    );
}