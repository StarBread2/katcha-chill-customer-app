import { useState, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
//PARTIALS
import CrowdMeter_Bar from "../Partials/CrowdMeter_Bar";
import ModalConfirmation from "../Partials/modalConfirmation.tsx";
//ICONS
import { Crowd_Icon, MoreHorizontal_Icon, CheckIn_Icon, CheckOut_Icon } from '../../assets/index.ts';
//CONTEXT
import { useUser } from "../../context/UserContext";
import { useCrowdHistoryContext } from "../../context/CrowdHistoryContext.tsx";

export default function CrowdMeter() 
{
    //#region UNIVERSAL 
        //DB
            const { profile, checkOutUser } = useUser();
            const { crowdCountNow } = useCrowdHistoryContext();
        const navigate = useNavigate();
        const GymCoins = profile?.credits_balance ?? 0;
        // FOR CROWD BAR
            let Customerlimit = 50;
        
    //#endregion

    //#region UNIVERSAL FUNCTION
        function formatToHourMinute(t: string) 
        {
            return new Date(t).toLocaleTimeString("en-US", 
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        }
    //#endregion

    //#region WARNING MODALS
        //CREDITS WARNING MODAL
            const [displayWarningModal_Credits, setdisplayWarningModal_Credits] = useState(false);
            const [modalCloseButtonClicked_Credits, setmodalCloseButtonClicked_Credits] = useState(false);
            //USEEFFECT
            // When modal "Close" button is clicked → hide modal
            useEffect(() => 
            {
                if (modalCloseButtonClicked_Credits) 
                {
                    setdisplayWarningModal_Credits(false); // close modal
                    setmodalCloseButtonClicked_Credits(false); // reset flag
                }
            }, [modalCloseButtonClicked_Credits]);

        //ATTENDANCE WARNING MODAL
            const [displayWarningModal_CheckIn, setdisplayWarningModal_CheckIn] = useState(false);
            const [modalCloseButtonClicked_CheckIn, setmodalCloseButtonClicked_CheckIn] = useState(false);
            //USEEFFECT
            // When modal "Close" button is clicked → hide modal
            useEffect(() => 
            {
                if (modalCloseButtonClicked_CheckIn) 
                {
                    setdisplayWarningModal_CheckIn(false); // close modal
                    setmodalCloseButtonClicked_CheckIn(false); // reset flag
                }
            }, [modalCloseButtonClicked_CheckIn]);
        //CHECK OUT WARNING MODAL
            const [displayWarningModal_CheckOut, setdisplayWarningModal_CheckOut] = useState(false);
            const [modalCloseButtonClicked_CheckOut, setmodalCloseButtonClicked_CheckOut] = useState(false);
            const [modalAgreeButtonClicked_CheckOut, setmodalAgreeButtonClicked_CheckOut] = useState(false);
            //USEEFFECT
            // When modal "Close" button is clicked → hide modal
            useEffect(() => 
            {
                if (modalCloseButtonClicked_CheckOut) 
                {
                    setdisplayWarningModal_CheckOut(false); // close modal
                    setmodalCloseButtonClicked_CheckOut(false); // reset flag
                }
            }, [modalCloseButtonClicked_CheckOut]);
            useEffect(() => 
            {
                if(modalAgreeButtonClicked_CheckOut)
                {
                    checkOutUser();
                    setdisplayWarningModal_CheckOut(false);
                    setmodalAgreeButtonClicked_CheckOut(false);
                }
            }, [modalAgreeButtonClicked_CheckOut]);
        //HANDLE CLIKC (CLICK)
        const handleCheckInClick = (e: React.MouseEvent) => 
        {
            if (profile?.checked_in)
            {
                setdisplayWarningModal_CheckOut(true);
            }
            else if(GymCoins <= 0)
            {
                setdisplayWarningModal_Credits(true);
            }
            else if( !profile?.checked_in && profile?.CheckInResult?.checkedInForTheDay)
            {
                setdisplayWarningModal_CheckIn(true);
            }
            else
            {
                navigate("/home/checkIn");
            }
        }
    //#endregion

    return (
        <div className="bg-white rounded-[20px] p-6 pb-6  font-montserrat w-[98%] mx-auto">
            {/* 🔹 Top Bar */}
            <div className="flex justify-between items-center mb-0">
                <h3 className="font-bold text-base text-black">Magatas, Sibulan</h3>

                {/* More Button */}
                <Link to="/home/crowd">
                    <button>
                        <img
                            src={MoreHorizontal_Icon}
                            alt="More"
                            className="w-5 h-5 opacity-60"
                        />
                    </button>
                </Link>
            </div>

            {/* 🔹 Crowd Meter Row */}
            <div className="flex justify-between items-center mb-5 mt-2">
                <div className="flex items-center gap-2">
                    <img src={Crowd_Icon} alt="Crowd" className="w-5 h-5" />
                    <p className="text-sm text-[#434343] font-semibold">Crowd Meter</p>
                </div>
                
                <div className="flex space-x-1">
                    <CrowdMeter_Bar limit={Customerlimit} value={crowdCountNow} />
                </div>
            </div>

            {/* 🔹 Check Button */}
            <div className="flex flex-col items-center">
                <button
                    onClick={handleCheckInClick}
                    className={`flex items-center justify-center gap-2 rounded-full w-[221px] py-3 text-base font-medium text-white transition-all duration-300 ${
                    profile?.checked_in ? "bg-[#28D977]" : "bg-red-600"
                    }`}
                >
                    <img
                    src={profile?.checked_in ? CheckOut_Icon : CheckIn_Icon}
                    alt={profile?.checked_in ? "Check Out" : "Check In"}
                    className="w-5 h-5"
                    />
                    {profile?.checked_in ? "Check Out" : "Check In"}
                </button>
                
                {/* 🔹 Started At Text */}
                {profile?.checked_in && (
                    <p className="text-xs text-gray-500 mt-1">
                    Started out at {profile?.CheckInResult?.checkInTime? formatToHourMinute(profile.CheckInResult.checkInTime): null}
                    </p>
                )}
            </div>

            {displayWarningModal_Credits && 
                (<ModalConfirmation 
                    title="Not Enough Credits" 
                    message="Do you want to buy credit packages?" 
                    buttonLabel="Add Credits"
                    onClose={setmodalCloseButtonClicked_Credits}
                    navigateTo="/home/AddCredits"
                />)
            }
            
            {displayWarningModal_CheckIn && 
                (<ModalConfirmation 
                    title="You have already checked-in" 
                    message="Check in again?" 
                    buttonLabel="Check-In"
                    onClose={setmodalCloseButtonClicked_CheckIn}
                    navigateTo="/home/checkIn"
                />)
            }
            
            {displayWarningModal_CheckOut && 
                (<ModalConfirmation 
                    title="Check Out?" 
                    message="Do u want to stay small bro?" 
                    buttonLabel="Check Out"
                    onClose={setmodalCloseButtonClicked_CheckOut}
                    onConfirm={setmodalAgreeButtonClicked_CheckOut}
                />)
            }
        </div>
    );
}