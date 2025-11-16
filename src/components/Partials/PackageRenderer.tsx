import { useState } from "react";
import { GymCoin_Colored, KatchaChillLogo_Image_BW } from "../../assets/index.ts";

// Package Format
interface Package 
{
    package_id: string;
    name: string;
    coins: number;
    expiration?: string | null;
    purchasedAt?: string | null;
    description?: string | null;
    price?: number | null;
    stackable: boolean;
    user_package_id?: number | null;
}

// Props interface
interface PackageRendererProps 
{
    packages: Package[];

    //SET THE VOID WHATS SELECTED PACKAGE
    onSelect?: (pkg: Package) => void;

    // Coin svg on the right will be centered or at the top (default: top)
    coinCentered?: boolean;
    // Disable interaction (default: false)
    disableInteraction?: boolean;
    //onlyInteractIfPackageIsAvailable
    onlyInteractIfPackageIsAvailable?: boolean;
    // Highlight border black if coins > 0
    highlightPositiveCoins?: boolean;
}

export default function PackageRenderer({ 
    packages, 
    onSelect, 
    coinCentered=false, 
    disableInteraction=false, 
    highlightPositiveCoins=false, 
    onlyInteractIfPackageIsAvailable=false}: PackageRendererProps)
{

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // coinCentered variable
    // Decide parent vertical alignment based on the toggle prop
    const parentAlignClass = coinCentered ? "items-center" : "items-start";

    return (
        <div>
            <div className="px-1 space-y-4">
                {packages.map((pkg, index) => 
                {
                    // 🔹 Border logic
                    let borderClass = "border-[#E6E6E6]";
                    if (!disableInteraction && selectedIndex === index) 
                    {
                        borderClass = "border-black";
                    } else if (highlightPositiveCoins && pkg.coins > 0) 
                    {
                        borderClass = "border-black";
                    }

                    return (
                        <div
                            key={index}
                            onClick={() => 
                                {
                                    //IF DISABLE INTERACTION THEN U CANT CHOOSE IT
                                    if (disableInteraction) return;

                                    //IF COINS <=0 THEN U CANT CHOOSE IT
                                    if (onlyInteractIfPackageIsAvailable && pkg.coins <= 0) return;

                                    setSelectedIndex(index);
                                    onSelect?.(pkg);
                                }
                            }
                            className={`px-4 py-5 rounded-xl border-[3px] cursor-pointer transition-all duration-200 ${borderClass}`}
                        >
                            {/* parentAlignClass toggles between items-start and items-center */}
                            <div className={`flex justify-between ${parentAlignClass}`}>
                                <div className="w-[80%]">
                                    <h3 className="font-semibold text-lg">{pkg.name}</h3>
                                    <p className="text-sm text-gray-500 -mt-1">
                                        Expiration: {pkg.expiration ?? "None"}
                                    </p>

                                    {pkg.purchasedAt && (
                                        <p className="text-sm text-gray-500">
                                            Purchased: {pkg.purchasedAt}
                                        </p>
                                    )}

                                    {pkg.description && (
                                        <p className="text-xs text-gray-600 mt-3">
                                            {pkg.description}
                                        </p>
                                    )}

                                    {pkg.price != null && (
                                        <p className="text-lg font-semibold">₱ {pkg.price}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-center flex-shrink-0">
                                    <span className="font-semibold text-lg">{pkg.coins}</span>
                                    <img
                                        src={
                                            pkg.coins <= 0
                                                ? KatchaChillLogo_Image_BW
                                                : GymCoin_Colored
                                        }
                                        alt="Coin"
                                        className="w-7 h-7 pl-1"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}