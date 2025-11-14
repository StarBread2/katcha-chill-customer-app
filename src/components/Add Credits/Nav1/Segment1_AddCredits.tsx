
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

// Props interface
interface AddCredits_Main1Props 
{
    packages: Package[];

    //Selected Package
    selectedPackage?: Package | null;
    setSelectedPackage: (pkg: Package) => void;

    //IF Bottom navbar BUTTON IS PRESSED
    setButtonPressed: (value: boolean) => void;

    // IF Bottom navbar BUTTON IS PRESSABLE
    buttonPressable: boolean;

    setquantityTotal: (value: number) => void;
    setamountTotal: (value: number) => void;
}

export default function AddCredits_Segment1({ packages, selectedPackage, setSelectedPackage, setButtonPressed: buttonPressed, buttonPressable, setquantityTotal, setamountTotal }: AddCredits_Main1Props) 
{
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
                setamountTotal={setamountTotal} setquantityTotal={setquantityTotal}/>
        </div>
    );
}