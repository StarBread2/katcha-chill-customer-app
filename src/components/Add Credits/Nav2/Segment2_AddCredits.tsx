import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext.tsx";

import { GymCoin_Colored } from "../../../assets/index.ts"; 
import FooterButton from "../../Partials/FooterButton.tsx";
import ModalConfirmation from "../../Partials/modalConfirmation.tsx";

//SUPABASE
import { getCreditPackageById } from "../../../services/packageService.tsx";
import { deleteCreditPurchaseById } from "../../../services/purchaseService.tsx";

//SCROLL TO TOP
import ScrollToTop from "../../../components/ScrollToTop.tsx";

interface Segment2Props 
{
    pendingPurchase: any | null;

    //If header back is pressed then it opens the modal
    headerBackPressed: boolean;
    
    //reset the headerback when modal is closed
    onResetHeaderBackPressed: (value: boolean) => void;

    //Modal back confirmation (when modal confirm close is pressed)
    buttonPressed_Modal?: (value: boolean) => void;
}

export default function MainDisplay_AddCredits({ pendingPurchase, headerBackPressed, onResetHeaderBackPressed, buttonPressed_Modal }: Segment2Props) 
{
    //#region Universal Code
        const navigate = useNavigate();
        const { profile, qrDataUrl } = useUser();

        // getting package_id to its data row
        const [creditPackage, setCreditPackage] = useState<any | null>(null);
        useEffect(() => 
        {
            const fetchPackage = async () => 
            {
                if (!pendingPurchase?.package_id) 
                {
                    navigate("/home");
                    return;
                }

                const fetchPackage = async () => 
                {
                    console.log("Segment2 USEEFFECT DONE");
                    const pkg = await getCreditPackageById(pendingPurchase.package_id);
                    setCreditPackage(pkg);
                };

                fetchPackage();
            };
            
            fetchPackage();
        }, [pendingPurchase?.id]);

        //Variables to display
        const packageName = creditPackage?.name ?? "Loading...";
        const price = creditPackage?.price ?? 0;
        const footerButton = "Finish"; //Scanned if finish scanning in worker side (no code yet)
    //#endregion



    //#region Functions
    // When modal "Agree" button is clicked → delete transaction row record and notify parent
        const handleDelete = async () => 
        {
            if (modalAgreeButtonClicked && pendingPurchase?.id) 
            {
                try 
                {
                    console.log("Deleting purchase:", pendingPurchase.id);
                    const success = await deleteCreditPurchaseById(pendingPurchase.id);

                    if (success) 
                    {
                        console.log(" Purchase deleted successfully");
                        buttonPressed_Modal?.(true); // notify parent
                    } 
                    else 
                    {
                        console.error(" Failed to delete purchase");
                    }

                } 
                catch (error) 
                {
                    console.error("Error deleting purchase:", error);
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



    //#region For warning modal
        //For headernav
        const [displayWarningModal, setdisplayWarningModal] = useState(false);

        //For modal pressables
        const [modalCloseButtonClicked, setmodalCloseButtonClicked] = useState(false);
        const [modalAgreeButtonClicked, setmodalAgreeButtonClicked] = useState(false);

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

        // When modal "Agree" button is clicked → delete transaction row record and notify parent
        useEffect(() => 
        {
            handleDelete();
        }, [modalAgreeButtonClicked]);
    //#endregion
    
    return (
        <div>
            
            {/* Scroll To Top */}
            <ScrollToTop />
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
                <h3 className="pb-3 text-3xl font-semibold text-center">Credits Top-up</h3>

                <p className="text-black mb-3 text-center -mx-4">
                    You’re purchasing 
                    <span className="font-semibold"> {pendingPurchase.package_amount}</span>
                    <span className="font-semibold"> {packageName}</span>. Kindly prepare
                    <span className="font-semibold"> ₱{pendingPurchase.amount_paid}</span> and let our staff
                    scan this QR to complete your transaction.
                </p>

                <p className="text-[#434343] mb-1 mt-5 text-center px-6">
                    In app credits:
                </p>

                <div className="flex items-center justify-center gap-2 mb-10">
                    <p className="text-black text-center font-semibold text-xl">
                        {profile?.credits_balance ?? -69}
                    </p>
                    <img
                        src={GymCoin_Colored}
                        alt="GymCoin Icon"
                        className="w-7 h-7"
                    />
                </div>
            </div>

            <FooterButton label={footerButton} navigateTo="/home"/>

            {displayWarningModal &&
            (<ModalConfirmation 
                title="Delete Transaction" 
                message="Are you sure you want to do this?" 
                buttonLabel="Delete Transaction"
                onClose={setmodalCloseButtonClicked}
                onConfirm={setmodalAgreeButtonClicked}
            />)
            }
        </div>
    );
}


{/* DEBUG */}
{/* <p>
    modalCloseButtonClicked: {modalCloseButtonClicked? "true": "false"} 
</p>
<p>
    modalAgreeButtonClicked: {modalAgreeButtonClicked? "true": "false"}
</p>
<p>
    pendingPurchase_id: {pendingPurchase.id}
</p>
<p>
    pendingPurchase?.id: {pendingPurchase?.id ? pendingPurchase?.id : "null"}
</p> */}