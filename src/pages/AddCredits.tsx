import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import HeaderNav from "../components/Partials/HeaderNav";
import Segment1 from "../components/Add Credits/Nav1/Segment1_AddCredits.tsx";
import Segment2 from "../components/Add Credits/Nav2/Segment2_AddCredits.tsx";

//PAGE ANIMATIONS
import PageTransition from "../components/Transitions/PageTransition.tsx";

//SUPABASE
import { createCreditPurchase, getPendingPurchaseByUser } from "../services/purchaseService.tsx";


interface Package 
{
    package_id: string;
    name: string;
    coins: number;
    expiration?: string | null;
    description?: string | null;
    price?: number | null;
    stackable: boolean;
}

export default function AddCredits() 
{
    // #region FUNCTIONs
    // After pushing new credit purchases it gets the data that just got pushed
    const checkPendingPurchase = async () => 
    {
        if (profile?.id) 
        {
            try 
            {
                const existingPurchase = await getPendingPurchaseByUser(profile.id);
                if (existingPurchase) 
                {
                    console.log("Pending purchase found:", existingPurchase);
                    setPendingPurchase(existingPurchase);
                    setTransitionType("slide-left");
                    setShowSegment1(false);
                } 
                else 
                {
                    console.log("No pending purchase found.");
                }
            } 
            catch (err) 
            {
                console.error("Error fetching pending purchase:", err);
            }
        }
    };

    // Start scanning for pending purchases
    // Data row insertion and collection of the data inserted
    // Whenever segment1ButtonPressed becomes true → show segment 2 (if segment1Button is pressed)
    const handlePurchase = async () => 
    {
        if (segment1ButtonPressed && selectedPackage && profile?.id) 
            {
            try 
            {
                // Create data to insert
                const purchaseData = 
                {
                    user_id: profile.id,
                    package_id: selectedPackage.package_id,
                    package_amount: selectedPackage.coins,
                    amount_paid: selectedPackage.price ?? 0,
                    payment_method: null,
                    purchase_state: "pending" as const,
                };

                console.log("Creating purchase…", purchaseData);
                // ====== DATA ROW INSERTION ======
                    const newPurchase = await createCreditPurchase(purchaseData); 
                    console.log("Purchase created:", newPurchase);

                //After pushing the data above update the currentPendingPurchase
                // ====== DATA ROW COLLECTION ======
                await checkPendingPurchase();

                // After purchase now wait if the worker has confirmed the purchase
                const result = await watchPendingPurchase();
                navigate("/home");

                // Wait complete → proceed to next segment
                setTransitionType("slide-left");
                setShowSegment1(false);
            } 
            catch (err) 
            {
                console.error("Failed to create purchase:", err);
            } 
            finally 
            {
                // Reset flag so effect doesn’t loop
                setSegment1ButtonPressed(false);
            }
        }
    };

    // #endregion



    // #region Universal
        const navigate = useNavigate();
        const { qrDataUrl, packages, user, profile, watchPendingPurchase, stopPurchaseListener } = useUser();

        // Show segment 1 or 2 (true = 1 else 2)
            const [showSegment1, setShowSegment1] = useState(true);
            const activeSegment = showSegment1 ? 1 : 2;

        // If headerback button is pressed
        const [HeaderBackPressed, setHeaderBackPressed] = useState(false);

        //================== REGION 2 ==================
            //FOR MODAL
            //Wait for modal close confirmation
            const [closeModalPressed, setcloseModalPressed] = useState(false);

        // IF THE HEADER BACK BUTTON IS PRESSED
        // slide-right, go to segment1, selected package in segment 1 is reseted, reset the data inserted and collected (PendingPurchase)
            useEffect(() => 
            {
                if (HeaderBackPressed && closeModalPressed) 
                {
                    setTransitionType("slide-right");
                    setShowSegment1(true);              // or false, depending on desired flow
                    setSelectedPackage(null);
                    setPendingPurchase(null);
                    setHeaderBackPressed(false);        // reset so it only triggers once
                    setSegment1ButtonPressed(false);
                    setcloseModalPressed(false);        // reset modal flag
                    stopPurchaseListener();
                }
            }, [HeaderBackPressed, closeModalPressed]);

        //ANIMATION
        const [transitionType, setTransitionType] = useState<"slide-left" | "slide-right">("slide-right");
    // #endregion
    


    // #region 1
        const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
        const [segment1ButtonPressed, setSegment1ButtonPressed] = useState<boolean>(false); // segment1 button is pressed (will go to next segment)

        // If segment1 button is pressable or not
        const [segment1ButtonPressable, setsegment1ButtonPressable] = useState<boolean>(false);

        // Whenever segment1ButtonPressed becomes true → show segment 2
        // and insert datarow if criterias are met
        useEffect(() => 
        {
            if (!segment1ButtonPressed) return;
            if (!selectedPackage) return;
            if (!profile?.id) return;

            let isActive = true;

            const doPurchase = async () => {
                try 
                {
                    await handlePurchase();
                } 
                    catch (err) 
                {
                    console.error(err);
                } 
                finally 
                {
                    // reset flag so it doesn't trigger again
                    if (isActive) setSegment1ButtonPressed(false);
                }
            };

            doPurchase();

            return () => {
                // prevent state updates if the component unmounts
                isActive = false;
            };
        }, [segment1ButtonPressed, selectedPackage?.package_id, profile?.id]);

        //Make segment1 button pressable or not (unlesd they have choosen a package)
        useEffect(() => 
        {
            if (selectedPackage?.package_id) 
            {
                setsegment1ButtonPressable(true);
            } 
            else 
            {
                setsegment1ButtonPressable(false);
            }
        }, [selectedPackage]);
    // #endregion 



    // #region 2
        const [pendingPurchase, setPendingPurchase] = useState<any | null>(null);
        //If there is pendingPurchase then go directly to segment 2 and use it as the data to be displayed
        useEffect(() => 
        {
            console.log("Useeffect checkPendingPurchase()")
            if (!profile?.id) return;

            // run only once
            let hasRun = false;

            if (!hasRun) 
            {
                hasRun = true;
                checkPendingPurchase();
            }
        }, [profile?.id]);

        //FOR MODAL
        //Wait for modal close confirmation
        //YAWA NAA SA TAAS KAY DECLARATION SHIT
    // #endregion 

    return (
        <div>
            <div className="min-h-screen bg-white font-montserrat relative pb-[150px]">
                <HeaderNav title="Add Credits" backRoute="/home" showNavigator segments={2} activeSegment={activeSegment} onBackPressed={setHeaderBackPressed} disableBackNavigation={!showSegment1}/>

                <PageTransition type={transitionType}>
                    {/* Conditional rendering */}
                    {showSegment1 ? 
                    (
                        <Segment1 packages={packages} selectedPackage={setSelectedPackage} buttonPressed={setSegment1ButtonPressed} buttonPressable={segment1ButtonPressable}/>
                    ) : (
                        <Segment2 pendingPurchase={pendingPurchase} headerBackPressed={HeaderBackPressed} onResetHeaderBackPressed={setHeaderBackPressed} buttonPressed_Modal={setcloseModalPressed}/>
                    )}
                </PageTransition>












                {/* DEBUG */}
                    <div className="-mt-20 pb-[200px]">
                        <p>
                            Segment: {showSegment1 ? "Segment1" : "Segment2" } 
                        </p>

                        <p>
                            segment1ButtonPressed: {segment1ButtonPressed ? "true" : "false" } 
                        </p>

                        <p>
                            {selectedPackage?.package_id ? selectedPackage?.package_id : "none"}
                        </p>
                        <p>
                            HeaderBackPressed: {HeaderBackPressed? "true": "false"}
                        </p>
                        <p>
                            closeModalPressed: {closeModalPressed? "true" : "false"}
                        </p>
                    </div>
                {/* DEBUG */}



            </div>
        </div>
        
    );
}