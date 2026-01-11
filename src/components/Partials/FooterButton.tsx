import React from "react";
import { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { Minus_Icon, Plus_Icon, PlusBlack_Icon, } from "../../assets/assets.ts";
import { div } from "framer-motion/client";


interface BottomButtonProps {
    icon?: string | null;
    //NAME OF THE FOOTER SHIT
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

    /** Renders the amount slider  */
    renderAmount?: boolean;
    //** Display the slider or the text "Total" */
    displayAmount?: boolean;
    //** Can change the amount */ 
    canChangeQuantity?: boolean;
    //default amount value
    defaultQuantityValue?: number; 
        //SKIP TO THIS NUMBER (CURRENT COUNT)
        currentValueQuantity?: number;
        enableCurrentAmountPreCalculated?: boolean;
        //USE THIS AMOUNT (CALCULATE OUTSIDE)
        currentAmountPreCalculated?: number;
        //max amount value
        maxQuantityValue?: number;
    // THE PASSED PRICE (WHAT THE SHIT WILL REFERENCE)
    price?: number;
    
    setquantityTotal?: (value: number) => void;
    setamountTotal?: (value: number) => void;

    //Show error or nah?
    displayError?: boolean;
    //What's the error?
    errorMessage?: string;
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

    renderAmount = false,
    displayAmount = true,
    canChangeQuantity: canChangeAmount = false,
    defaultQuantityValue: defaultAmountValue = 0,
    currentValueQuantity = defaultAmountValue,
    enableCurrentAmountPreCalculated = false,
    currentAmountPreCalculated = 0,
    maxQuantityValue: maxAmountValue = 0,
    setquantityTotal,
    setamountTotal,
    price = 0,

    displayError = false,
    errorMessage = false,
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

    // Change appearance if cannot be pressed
    const disabledStyles = !pressable || !canPress;
    const buttonBg = disabledStyles ? "bg-[#434343]" : bgColor;
    const buttonText = disabledStyles ? "text-white" : textColor;
    const cursorStyle = disabledStyles ? "cursor-not-allowed opacity-60" : "cursor-pointer";

    // For amount slider appearance [185px]
        // FOR MAIN CONTAINER SIZE
        const containerHeight = displayError ? "h-[185px]" : renderAmount ? "h-[155px]" : "h-[115px]";
        const marginAmountPart = displayError ?  "mt-[26px]" : "mt-3";
        const marginTopButton = renderAmount ?  "" : "mt-6";

        //if cant change amount
            //if amount is maxed
            const [isAmountMaxed, setisAmountMaxed] = useState(false);
            const [makeAmountPressable, setMakeAmountPressable] = useState(false);

            const buttonAdd = makeAmountPressable ?  "bg-black" : "bg-white";
            const amountNumColor = makeAmountPressable ?  "text-black" : "text-gray-500";

            //FOR AMOUNT VALUE CALCULATION
            const [quantityValue, setQuantityValue] = useState(currentValueQuantity);

        //#region functions and usestate
            const addAmountValue = () =>
            {
                if (!canChangeAmount) return;
                setQuantityValue((prev) => 
                {
                    if (prev >= maxAmountValue) 
                    {
                        return prev; // stop at the max
                    }
                    return prev + 1;
                });
            }
            const subtractAmountValue = () =>
            {
                if (!canChangeAmount) return;
                setQuantityValue((prev) => Math.max(defaultAmountValue, prev - 1));
            }
            // reset amount when cannot change amount 
            useEffect(() => 
            {
                if (!canChangeAmount) 
                {
                    setQuantityValue(defaultAmountValue);
                }
            }, [canChangeAmount]);

            //Listens if the amountValue reached to max
            useEffect(() =>
            {
                setisAmountMaxed(quantityValue >= maxAmountValue);
            }, [quantityValue]);

            //Make the appearance of the amount slider pressable or not (if it can be stackable or not maxed)(makeAmountPressable) 
            useEffect(() =>
            {
                
                if(!canChangeAmount) { setMakeAmountPressable(false); return; }

                if (canChangeAmount) 
                {
                    if (isAmountMaxed) { setMakeAmountPressable(false); return; }
                    setMakeAmountPressable(true);
                }

            }, [canChangeAmount, isAmountMaxed]);
        //#endregion


        

        
        //PRICE CALCULATION
        const [amountTotal, setAmountTotal] = useState(currentAmountPreCalculated);
        //#region CALCULATE THE PRICE INTERNALLY (SKIP THIS IF enableCurrentAmountPreCalculated)
            useEffect(() => 
            {
                if(enableCurrentAmountPreCalculated) return;

                setAmountTotal(quantityValue * price);
            }, [quantityValue, price]);

            // Watch for changes from parent (cartGrandTotal) (USE THIS INSTEAD IF enableCurrentAmountPreCalculated enabled)
            useEffect(() => 
            {
                if (enableCurrentAmountPreCalculated) 
                {
                    setAmountTotal(currentAmountPreCalculated ?? 0);
                }
            }, [enableCurrentAmountPreCalculated, currentAmountPreCalculated]);
        //#endregion





        //PASS ALL THE VALUE TO EXTERNAL SHITTER
            useEffect(() => 
            {
                if (setquantityTotal) 
                {
                    setquantityTotal(quantityValue);
                }
            }, [quantityValue, setquantityTotal]);
            useEffect(() => 
            {
                if (setamountTotal) {
                    setamountTotal(amountTotal);
                }
            }, [amountTotal, setamountTotal]);

    return createPortal(
        <div
            className={`w-[100%] z-50 fixed bottom-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] font-montserrat ${containerHeight}`}>

            {/* AMOUNT SLIDER SHIT render this if renderAmount is true */}
            {renderAmount && (
                <div className={`flex flex-col items-center justify-between px-7 ${marginAmountPart} mb-5`}>

                    {displayError &&
                        (<div className="text-xs -mt-1 pb-1">
                            <p>{errorMessage}</p>
                        </div>)
                    }
                    
                    
                    <div className="flex items-center justify-between w-full mt-2">
                            {displayAmount ? (
                                <div className="flex items-center gap-2 ">
                                    <button
                                        aria-label="Increase quantity"
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-800 bg-white text-white text-lg"
                                        onClick={subtractAmountValue}
                                    >
                                        <img
                                            src={Minus_Icon}
                                            alt="Subtract"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <div className={`min-w-[28px] text-center text-lg font-medium ${amountNumColor}`}>
                                        {quantityValue}
                                    </div>
                                    <button
                                        aria-label="Increase quantity"
                                        className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-800 text-white text-lg ${buttonAdd}`}
                                        onClick={addAmountValue}
                                    >
                                        {makeAmountPressable ? (
                                            <img
                                                src={Plus_Icon}
                                                alt="Plus"
                                                className="w-4 h-4"
                                            />
                                        ): (
                                            
                                            <img
                                                src={PlusBlack_Icon}
                                                alt="Plus"
                                                className="w-4 h-4"
                                            />
                                        )}
                                    </button>
                                </div>
                            ):(
                                <div>
                                    <p className="text-[#434343] text-lg font-semibold">Total</p>
                                </div>
                            )}
                        
                        <div className="text-right text-xl font-semibold text-[#434343]">
                            ₱ {amountTotal} 
                        </div>
                    </div>
                    
                </div>
            )}

            

            <div className="flex justify-center">
                <button
                    onClick={handleClick}
                    disabled={disabledStyles}
                    className={`w-[90%] ${buttonBg} ${buttonText} ${cursorStyle} py-4 rounded-[10px] flex items-center justify-center gap-2 text-base shadow-lg transition-all duration-300 ${marginTopButton}`}
                >
                    {icon ? (<img src={icon} alt={`${label} Icon`} className="w-5 h-5" />) : null}

                    <span>{label}</span>
                </button>
            </div>
        </div>, document.body
    );
};

export default FooterButton;
