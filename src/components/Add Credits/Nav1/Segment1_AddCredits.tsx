
import PackageRenderer from "../../Partials/PackageRenderer";
import FooterButton from "../../Partials/FooterButton";

//SCROLL TO TOP
import ScrollToTop from "../../../components/ScrollToTop.tsx";

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
}
// FOR USER PACKAGES
type UserPackage = 
{
    user_package_id: number;
    user_id: string;
    package_id: string;
    expiration_date: string;
    credits_remaining: number;
    status: "active" | "expired" | "used_up";
    purchased_at: string;
    transaction_id: number;
};
// Props interface
interface AddCredits_Main1Props 
{
    packages: Package[];
    userPackages: UserPackage[];

    //Selected Package
    selectedPackage?: Package | null;
    setSelectedPackage: (pkg: Package) => void;

    //IF Bottom navbar BUTTON IS PRESSED
    setButtonPressed: (value: boolean) => void;

    // IF Bottom navbar BUTTON IS PRESSABLE
    buttonPressable: boolean;

    setquantityTotal: (value: number) => void;
    setamountTotal: (value: number) => void;

    // If package is already owned by the user l197
    packageAlreadyOwned: boolean;
}

export default function AddCredits_Segment1({ packages, selectedPackage, setSelectedPackage, setButtonPressed: buttonPressed, buttonPressable, setquantityTotal, setamountTotal, packageAlreadyOwned }: AddCredits_Main1Props) 
{
    //#region FOR FOOTER ERROR DISPLAY
        function getError(stackable: boolean | undefined) 
        {
            if (packageAlreadyOwned)
            {
                if (stackable === false)
                {
                    return{
                        showError: true,
                        message: "You still have an active package similar to this"
                    };
                }
            }
            else if (stackable === false) 
            {
                return {
                    showError: true,
                    message: "This package can't be stacked"
                };
            }

            return {
                showError: false,
                message: ""
            };
        }
        const { showError, message } = getError(selectedPackage?.stackable);
    //#endregion

    return (
        <div>
            {/* Scroll To Top */}
            <ScrollToTop />

            <div className="flex-1 px-4 pt-[120px]">
                <div className="px-2 pb-5">
                    <h2 className="text-xl font-bold">Credits Packages</h2>
                    <p className="text-base text-black">
                        Select from the available credit packages below.
                    </p>
                </div>

                <PackageRenderer packages={packages} onSelect={setSelectedPackage} />
            </div>

            <FooterButton label="Next" 
                onReturnBool={buttonPressed} canPress={buttonPressable} 
                renderAmount={true} canChangeQuantity={selectedPackage?.stackable || false} defaultQuantityValue={1} maxQuantityValue={10} price={selectedPackage?.price || 0} 
                setamountTotal={setamountTotal} setquantityTotal={setquantityTotal} 
                displayError={showError} errorMessage={message}/>
        </div>
    );
}