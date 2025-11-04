import HeaderNav from "../components/Partials/HeaderNav";
import FooterButton from "../components/Partials/FooterButton.tsx";
import { GymCoin_Colored, KatchaChillLogo_Image_BW } from "../assets/index.ts"; 
import MainDisplay_CheckIn from "../components/Check In/MainDisplay.tsx";

import { useUser } from "../context/UserContext";

export default function CheckIn() {

    // #region 1
        const packages = [
        {
            name: "Regular Package",
            coins: 1,
            price: 40,
            expiration: "None",
            description: "Non-expiring coins for regular members",
        },
        {
            name: "Hell Week",
            coins: 7,
            price: 240,
            expiration: "7 days",
            description: "Lock in, twin, and challenge your friends for 7 days of pure grind.",
        },
        {
            name: "Monthly Package",
            coins: 30,
            price: 500,
            expiration: "30 days",
            description: "30 credits valid for 30 days perfect for consistent training.",
        },];
    // #endregion

    // #region 2
        const { qrDataUrl } = useUser();
    // #endregion

    

    return (
        <div className="min-h-screen bg-white font-montserrat relative h-[1000px]">
            <HeaderNav title="Check-in" backRoute="/home" />

            {/* Content */}
            <div className="flex-1 px-4 py-6 space-y-6 pt-[115px]">
                <div>
                    <h2 className="text-lg font-semibold">Credits Packages</h2>
                    <p className="text-sm text-gray-500 mt-1">
                    Select from the available credit packages below.
                    </p>
                </div>

                <div className="space-y-4">
                    {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-xl border transition-all duration-200 first-letter: border-gray-200"
                    >

                        <div className="flex justify-between items-start">

                            <div>
                                <h3 className="font-semibold text-base">{pkg.name}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                Expiration: {pkg.expiration}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
                                <p className="text-base font-semibold mt-2">₱ {pkg.price}</p>
                            </div>
                            
                            <div className="flex items-center justify-center w-6 h-6">
                                <img src={GymCoin_Colored} alt="Coin" className="w-5 h-5" />
                                <span className="ml-1 font-medium text-sm">{pkg.coins}</span>
                            </div>

                        </div>
                    </div>
                    ))}
                </div>
            </div>


            {/* PART 2 */}
            {/* <MainDisplay_CheckIn /> */}

            <FooterButton
                label="Next"
            /> 
        </div>
    );
}