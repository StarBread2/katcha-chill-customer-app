import { useState } from "react";
import { GymCoin_Colored, KatchaChillLogo_Image_BW } from "../../assets/index.ts";

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
interface PackageRendererProps 
{
    packages: Package[];
    onSelect?: (pkg: Package) => void;
}

export default function PackageRenderer({ packages, onSelect }: PackageRendererProps)
{

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    return (
        <div>
            <div className="px-1 space-y-4">
                {packages.map((pkg, index) => (
                <div
                    key={index}
                    onClick={() => {
                        setSelectedIndex(index)
                        onSelect?.(pkg);
                    }}
                    className={`px-4 py-5 rounded-xl border-[3px] cursor-pointer transition-all duration-200 
                    ${
                        selectedIndex === index
                        ? "border-black"
                        : "border-[#E6E6E6]"
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">{pkg.name}</h3>
                            <p className="text-sm text-gray-500 -mt-1">
                            Expiration: {pkg.expiration ?? "None"}
                            </p>


                            {/* DESCRIPTION CAN BE NULLABLE */}
                            {pkg.description && (
                                <p className="text-xs text-gray-600 mt-3 w-[85%]">
                                    {pkg.description}
                                </p>
                            )}

                            {/* PRICE CAN BE NULLABLE */}
                            {pkg.price != null && (
                                <p className="text-lg font-semibold">₱ {pkg.price}</p>
                            )}


                        </div>
                        
                        <div className="flex items-center justify-center flex-shrink-0">
                            <span className="font-medium text-lg">{pkg.coins}</span>
                            <img
                                src= { pkg.coins <= 0 ? KatchaChillLogo_Image_BW : GymCoin_Colored }
                                alt="Coin"
                                className="w-7 h-7 pl-1"
                            />
                        </div>
                    </div>

                </div>
                ))}
            </div>
        </div>
    );
}