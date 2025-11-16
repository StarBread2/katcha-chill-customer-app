//PARTIALS
import PackageRenderer from "../../../components/Partials/PackageRenderer.tsx";
import FooterButton from "../../../components/Partials/FooterButton.tsx";
//UTILS
import mergeUserPackages from "../../../utils/mergeUserPackages";


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
interface CheckIn_Main1Props 
{
    //IF Bottom navbar BUTTON IS PRESSED
    setButtonPressed: (value: boolean) => void;

    //Selected Package
    // selectedPackage?: Package | null; // NOT NEEDED HERE
    //Set Selected Package
    setSelectedPackage: (pkg: Package) => void;

    // IF Bottom navbar BUTTON IS PRESSABLE
    footerButtonPressable: boolean;
}



export default function Segment2_CheckIn( { setButtonPressed, setSelectedPackage, footerButtonPressable } : CheckIn_Main1Props ) 
{
    return (
        <div>
            <div className="flex-1 px-4 pt-[120px]">
                <div className="px-2 pb-5">
                    <h2 className="text-xl font-bold">Credits Packages</h2>
                    <p className="text-base text-black">
                        Select from your available credit packages below.
                    </p>
                </div>

                <PackageRenderer packages={mergeUserPackages()} coinCentered={true} onlyInteractIfPackageIsAvailable={true} onSelect={setSelectedPackage}/>
            </div>

            <FooterButton label="Next" onReturnBool={setButtonPressed} canPress={footerButtonPressable} />

        </div>
    );
}