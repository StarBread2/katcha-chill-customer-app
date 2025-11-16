import { useState, useEffect } from "react";
//PARTIALS
import HeaderNav from "../components/Partials/HeaderNav";
//MAIN
import Segment1 from "../components/Check In/Nav1/Segment1_CheckIn.tsx";
import Segment2 from "../components/Check In/Nav2/Segment2_CheckIn.tsx";
//PAGE ANIMATIONS
import PageTransition from "../components/Transitions/PageTransition.tsx";
//DB
import { useUser } from "../context/UserContext";
import { createNewAttendance, getPendingAttendanceByUser } from "../services/attendanceService.tsx";



// Package Format
interface Package 
{
    package_id: string;
    name: string;
    coins: number;
    expiration?: string | null;
    description?: string | null;
    price?: number | null;
    stackable: boolean;
    user_package_id?: number | null;
}

export default function CheckIn() 
{
    //#region UNIVERSAL PARAMETERS
        //Hook Call
            const { userPackages, profile } = useUser();
        // SEGMENT NAVIGATION
            // Show segment 1 or 2 (true = 1 else 2)
            const [showSegment1, setShowSegment1] = useState(true);
            const activeSegment = showSegment1 ? 1 : 2;
            // segment1 footer button is pressed (will go to next segment)
            const [segment1ButtonPressed, setSegment1ButtonPressed] = useState<boolean>(false); 
            // If headerback button is pressed
            const [HeaderBackPressed, setHeaderBackPressed] = useState(false);
        //APPEARANCE
            // Main container margin top size depending on segment
            const marginTopSize = showSegment1 ? "" : "mt-[25px]";
            // Main container size depending on segment
            const containerSize = showSegment1 ? "pb-[210px]" : "pb-[100px]";
    //#endregion 
    //#region UNIVERSAL FUNCTIONS
        const checkPendingAttendance = async () => 
        {
            if (profile?.id) 
            {
                try 
                {
                    const existingAttendance = await getPendingAttendanceByUser(profile.id);
                    if (existingAttendance) 
                    {
                        console.log("Pending attendance found:", existingAttendance);
                        setpendingAttendance(existingAttendance);
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
        }
    //#endregion


    



    // #region 1
        // The selected package
        const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
        // If segment1 button is pressable or not
        const [segment1ButtonPressable, setsegment1ButtonPressable] = useState<boolean>(false);
        //Check if currentPackage is in userPackages (using currentPackage.packageId) and if credits >= 1
        const checkIfInUserPackage = (packageId: string) =>
            userPackages.some(up =>
                Number(up.package_id) === Number(packageId) &&
                up.credits_remaining >= 1
            );
    // #endregion

    




    // #region 2
        //THE CREATED ATTENDANCE ROW
        const [pendingAttendance, setpendingAttendance] = useState<any | null>(null);
        //FOR MODAL
            //Wait for modal close confirmation
            const [closeModalPressed, setcloseModalPressed] = useState(false);
        
    // #endregion





    //#region USEEFFECTS (NEED TO BE HERE FOR EVERYTHING TO BE DELCARED)
        //#region UNIVERSAL PART
            //ANIMATION
            const [transitionType, setTransitionType] = useState<"slide-left" | "slide-right">("slide-right");
            //DURING MOUNT
                //CHECK IF THERE IS PENDING ATTENDANCE
                //IF TRUE THEN GO DIRECTLY TO SEGMENT2
                useEffect(() => 
                {
                    console.log("Useeffect checkPendingAttendance()")
                    if (!profile?.id) return;

                    // run only once
                    let hasRun = false;

                    if (!hasRun) 
                    {
                        hasRun = true;
                        checkPendingAttendance();
                    }
                }, [profile?.id]);
            
            //CONDITIONAL USEEFFECT
                //GO TO SEGMENT 2
                //IF SEGMENT 1 FOOTER BUTTON IS PRESSED
                //GO TO SEGMENT 2
                useEffect(() => 
                {
                    if (!segment1ButtonPressed) return;
                    if (!selectedPackage) return;

                    // ASYNC WRAPPER createNewAttendance (await)
                    const handleCreateAttendance = async () => 
                    {
                        try 
                        {
                            //Check if selectedPackage is in userPackage or credits >= 1
                            if (!checkIfInUserPackage(selectedPackage.package_id)) 
                            {
                                console.log("No matching user package with enough credits found.");
                                return;
                            }

                            //Check if any accounts are logged in
                            if (!profile?.id) 
                            {
                                console.log("NO USER ID FOUND (NO USER LOGGED IN)"); 
                                return;
                            }

                            // DB insert attendance row
                            const created = await createNewAttendance(profile.id, String(selectedPackage.user_package_id));
                            console.log("Attendance created:", created);

                            // optional: reset the button pressed state so effect doesn't re-run unexpectedly
                            setSegment1ButtonPressed(false);
                            setTransitionType("slide-left");
                            setShowSegment1(false);
                        } 
                        catch (err) 
                        {
                            console.error("Failed to create attendance:", err);
                        }
                    };

                    handleCreateAttendance();
                    
                }, [segment1ButtonPressed, selectedPackage?.package_id]);
                //RETURN TO SEGMENT 1
                //IF BACK BUTTON IS PRESSED
                //GO TO SEGMENT 1 (Unless when currently in segment 1 go directly to home (disableBackNavigation={!showSegment1} part in headernav))
                useEffect(() => 
                {
                    if (HeaderBackPressed && closeModalPressed) 
                    {
                        setTransitionType("slide-right");
                        setShowSegment1(true);
                        setHeaderBackPressed(false);        // reset so it only triggers once
                        setSegment1ButtonPressed(false);    //========================================CAN REMEMBER THE PAST (CHOOSEN PACKAGE OR NAHHG)========================================
                        setSelectedPackage(null);           //RESET THE SELECTED PACKAGE
                    }
                }, [HeaderBackPressed, closeModalPressed]);
        //#endregion
        
        //#region segment1 USEEFFECT
            // Make segment1 button pressable or not 
                // If there is no selected package = false
            useEffect(() => 
            {
                //IF THERE IS A SELECTED PACAKAGE, IF NONE THEN RETURN
                if (!selectedPackage?.package_id) 
                {
                    setsegment1ButtonPressable(false);
                    return;
                }
                else
                {
                    setsegment1ButtonPressable(true);
                    return;
                }
            }, [selectedPackage?.package_id]);
    //#endregion

    return (
        <div className={`min-h-screen bg-white font-montserrat relative ${containerSize} ${marginTopSize}`}>
            <HeaderNav title="Check-in" backRoute="/home" showNavigator segments={2} activeSegment={activeSegment} onBackPressed={setHeaderBackPressed} disableBackNavigation={!showSegment1}/>

            
            <PageTransition type={transitionType}>
                {/* Conditional rendering */}
                {showSegment1 ? 
                (
                    <Segment1 setButtonPressed={setSegment1ButtonPressed} setSelectedPackage={setSelectedPackage} footerButtonPressable={segment1ButtonPressable}/>
                ):
                (
                    <Segment2 pendingAttendance={pendingAttendance} headerBackPressed={HeaderBackPressed} buttonPressed_Modal={setcloseModalPressed} onResetHeaderBackPressed={setHeaderBackPressed}/>
                )}
            </PageTransition>
            
        </div>
    );
}