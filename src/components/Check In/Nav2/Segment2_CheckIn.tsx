import { useState, useEffect } from "react";

//PARTIALS
import FooterButton from "../../../components/Partials/FooterButton.tsx";
import ModalConfirmation from "../../Partials/modalConfirmation.tsx";
//DB
import { useUser } from "../../../context/UserContext";
import { deleteAttendanceById } from "../../../services/attendanceService.tsx";

interface Segment2Props 
{
    pendingAttendance: any | null;

    //If header back is pressed then it opens the modal
    headerBackPressed: boolean;

    //Modal back confirmation (when modal confirm close is pressed)
    buttonPressed_Modal?: (value: boolean) => void;

    //reset the headerback when modal is closed
    onResetHeaderBackPressed: (value: boolean) => void;
}

export default function Segment2_CheckIn({pendingAttendance, headerBackPressed, buttonPressed_Modal, onResetHeaderBackPressed}:Segment2Props) 
{
    const { profile, qrDataUrl } = useUser();

    //#region HANDLE DELETE
        const handleDelete = async () => 
        {
            if (modalAgreeButtonClicked && pendingAttendance?.attendance_id) 
            {
                try 
                {
                    console.log("Deleting attendance:", pendingAttendance.attendance_id);
                    const success = await deleteAttendanceById(pendingAttendance.attendance_id);

                    if (success) 
                    {
                        console.log(" Attendance deleted successfully");
                        buttonPressed_Modal?.(true); // notify parent
                    } 
                    else 
                    {
                        console.error(" Failed to delete attendance");
                    }

                } 
                catch (error) 
                {
                    console.error("Error deleting attendance:", error);
                } 
                finally 
                {
                    // Always reset modal and button states
                    setdisplayWarningModal(false);
                    setmodalAgreeButtonClicked(false);
                }
            }
        };
    //#endregion
    //#region WARNING MODAL
        //For headernav
        const [displayWarningModal, setdisplayWarningModal] = useState(false);
        //For modal pressables
        const [modalCloseButtonClicked, setmodalCloseButtonClicked] = useState(false);
        const [modalAgreeButtonClicked, setmodalAgreeButtonClicked] = useState(false);
    //#endregion

    //#region USEEFFECT
        //#region MODAL USEFFECT
            //show modal when header back is pressed
            useEffect(() => 
            {
                if (headerBackPressed) 
                {
                    setdisplayWarningModal(true); //show modal
                }
            }, [headerBackPressed]);

                    // When modal "Close" button is clicked → hide modal
            useEffect(() => 
            {
                if (modalCloseButtonClicked) 
                {
                    setdisplayWarningModal(false); // close modal
                    setmodalCloseButtonClicked(false); // reset flag
                    onResetHeaderBackPressed(false);
                }
            }, [modalCloseButtonClicked]);
        //#endregion 
        
        //#region CONDITIONAL USEEFECT
            // When modal "Agree" button is clicked → delete attendance row record and notify parent
            useEffect(() => 
            {
                handleDelete();
            }, [modalAgreeButtonClicked]);
        //#endregion
    //#endregion
    return (
        <div>
            <div className="pb-20 px-10 flex flex-col justify-center items-center font-montserrat pt-[130px]">
                {/* User Name */}
                <h1 className="text-3xl font-semibold mb-6 text-center">
                    {profile?.full_name ?? "Error: No profile detected"}
                </h1>

                {/* https://chatgpt.com/c/68f655fa-1c78-8320-9fdb-5c80be87ccee MARK ACCOUNT*/} 
                {/* QR Display */}
                <div className="w-[180px] h-[180px] flex items-center justify-center mb-6 rounded-lg overflow-hidden bg-gray-200">
                    {qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#E6E6E6] text-black font-semibold">
                            Error: no user found (try relog-in) goofy ahh code
                        </div>
                    )}
                </div>


                {/* Label */}
                <h3 className="pb-3 text-3xl font-semibold mb-2 text-center">Daily Walk-in</h3>


                <p className="text-black mb-10 text-center px-6">
                    Have an awesome workout, {profile?.full_name?.split(" ")[0] ?? "friend"}! You got this!
                </p>
            </div>

            {/* <FooterButton label="Go Home" navigateTo="/home"/> */}

            {displayWarningModal &&
            (<ModalConfirmation 
                title="Go Back?" 
                message="Are you sure you want to do this?" 
                buttonLabel="Choose Credits"
                onClose={setmodalCloseButtonClicked}
                onConfirm={setmodalAgreeButtonClicked}
            />)}
        </div>
    );
}