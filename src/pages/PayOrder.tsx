import React, { useEffect, useState, useRef  } from "react";
import HeaderNav from "../components/Partials/HeaderNav";
import { useNavigate } from "react-router-dom"
//PARTIALS
import FooterButton from "../components/Partials/FooterButton.tsx";
import ModalConfirmation from "../components/Partials/modalConfirmation.tsx";
//DB
import { useUser } from "../context/UserContext";
import { div } from "framer-motion/client";
//3RD PARTY
import { toast } from "sonner";

export default function payOrder()
{
    const { profile, qrDataUrl_ProductToBePaid, userOrdersToBePaid, checkIfOrderIsProcessed, stopWatchingOrderIsProcessed } = useUser();
    const navigate = useNavigate();

    //#region ON MOUNT (FALLBACK AND START REALTIME)
        //REF TO BE BASE TO ONLY TO RUN ONCE REALTIME LISTENER
        const hasRunRef = useRef(false);

        //IF userOrdersToBePaid IS EMPTY (NO SELECTED ORDER)
        useEffect(() => 
        {
            //MAKE IT ONLY RUN ONCE (REACT STRICT MODE RUN TWICE)
            if (hasRunRef.current) return; // Block second run
            hasRunRef.current = true;      // Allow first run only

            if (userOrdersToBePaid)
            {
                //START REALTIME IF ORDER IS COMPLETED========================================================
                const promise  = checkIfOrderIsProcessed(userOrdersToBePaid.id);
                // IF ITS DONE THEN NOTIFY AND GO BACK HOME
                promise.then((result) => 
                {
                    if (!result) return;

                    const itemCount = userOrdersToBePaid.order_items?.length ?? 0;

                    if (result.status === "Completed") 
                    {
                        console.log("userOrdersToBePaid",userOrdersToBePaid)
                        toast("✅ Order Completed!", 
                        {
                            description: `You've succesfully paid ₱ ${userOrdersToBePaid.total_amount}, you can now get your 
                            ${itemCount} ${itemCount === 1 ? "item." : "items."}`,
                            duration: 10000,
                        })
                        navigate("/store/orders");
                    } 
                    else
                    {
                        toast("❌ Out of Stock!", 
                        {
                            description: `One of the products in the order have run out of stock, Better luck next time pal`,
                            duration: 10000,
                        })
                        navigate("/store/orders");
                    }
                });
            }
            else
            {
                navigate("/store/orders");
                toast("❌ ERROR: No selected orders to be paid", 
                {
                    description: `Select an order in My Orders you want to pay`,
                    duration: 10000,
                })
                stopWatchingOrderIsProcessed();
            }
            
        }, [userOrdersToBePaid]);
    //#endregion

    //#region DELETE WARNING MODAL
        //FOR MODAL
            const [displayWarningModal_Delete, setdisplayWarningModal_Delete] = useState(false);
            const [modalCloseButtonClicked_Delete, setmodalCloseButtonClicked_Delete] = useState(false);
            const [modalAgreeButonClicled_Delete, setmodalAgreeButonClicled_Delete] = useState(false);
        //USEEFFECT
            // When modal "Close" button is clicked → hide modal
            useEffect(() => 
            {
                if (modalCloseButtonClicked_Delete) 
                {
                    //RESET ANY RETURN BUTTON CLIKCED (2 (RETURN BY BACK) (RETURN BY FOOTER BUTTON))
                    setDsiplayModal_Delete(false);
                    setdisplayWarningModal_Delete(false); // close modal
                    setmodalCloseButtonClicked_Delete(false); // reset flag
                }
            }, [modalCloseButtonClicked_Delete]);

            //IF WARNING GO BACK MODAL DELETE AGREE BUTTON IS CLICKED
            //THEN GO BACK AND STOP REALTIME LISTENER
            useEffect(() => 
            {
                if (!modalAgreeButonClicled_Delete) return;

                //STOP LISTENER AND GO BACK
                stopWatchingOrderIsProcessed();
                navigate("/store/orders");
                setmodalAgreeButonClicled_Delete(false);
            }, [modalAgreeButonClicled_Delete]);

        //DISPLAY WARNING MODAL
            //IF THE MODAL FOOTER BUTTON IS PRESSED (THE USER WILL NOW PAY)
            const [displayModal_Delete, setDsiplayModal_Delete] = useState(false);

            // When footer button is clicked show warning
            useEffect(() => 
            {
                if(!displayModal_Delete) return;

                setdisplayWarningModal_Delete(true);
            }, [displayModal_Delete]);
        
    //#endregion
    
    return(
        <div className="bg-white">
            <HeaderNav title="Process Order" backRoute="/store/orders" disableBackNavigation onBackPressed={setDsiplayModal_Delete} />

            {/* RENDER ALL MAIN BODY */}
            <div className="pb-20 px-10 flex flex-col justify-center items-center font-montserrat pt-[130px]">
                {/* User Name */}
                <h1 className="text-3xl font-semibold mb-6 text-center">
                    {profile?.full_name ?? "Error: No profile detected"}
                </h1>

                {/* https://chatgpt.com/c/68f655fa-1c78-8320-9fdb-5c80be87ccee MARK ACCOUNT*/} 
                {/* QR Display */}
                <div className="w-[180px] h-[180px] flex items-center justify-center mb-6 rounded-lg overflow-hidden bg-gray-200">
                    {qrDataUrl_ProductToBePaid ? (
                        <img src={qrDataUrl_ProductToBePaid} alt="QR Code" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#E6E6E6] text-black font-semibold">
                            Error: no user found (try relog-in) goofy ahh code
                        </div>
                    )}
                </div>


                {/* Label */}
                <h3 className="pb-3 text-3xl font-semibold mb-2 text-center">Paying Order</h3>

                {userOrdersToBePaid ? (
                    <p className="text-black mb-10 text-center px-6">
                        You’re paying for order 
                        <span className="font-semibold"> #{userOrdersToBePaid?.id.toString().slice(0, 8)} </span>
                        with 
                        <span className="font-semibold"> {userOrdersToBePaid?.order_items.length} 
                            {userOrdersToBePaid?.order_items.length === 1 ? " item, " : " items, "}
                        </span>
                            please prepare  
                        <span className="font-semibold"> ₱{userOrdersToBePaid?.total_amount}</span>. Thank you! 
                    </p>
                ):(
                    <p className="text-black mb-10 text-center px-6">
                        It seems theres an error
                    </p>
                )}
                
            </div>
            
            {displayWarningModal_Delete && (
                <ModalConfirmation 
                    title="Cancel Transaction?" 
                    message={"Going back will result to your order not being processed by our worker"} 
                    buttonLabel="Delete Order"
                    onClose={setmodalCloseButtonClicked_Delete}
                    onConfirm={setmodalAgreeButonClicled_Delete}
                />
            )}
            
            {/* GO BACK TO ORDERS FOOTER BUTTON */}
            <FooterButton label="Go Back To Orders" navigateTo="/store/orders"
                onReturnBool={setDsiplayModal_Delete}/>
        </div>
    );
} 