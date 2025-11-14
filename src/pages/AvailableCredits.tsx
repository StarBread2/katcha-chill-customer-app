import { useEffect } from "react";  
import { useUser } from "../context/UserContext";

import HeaderNav from "../components/Partials/HeaderNav";
import PackageRenderer from "../components/Partials/PackageRenderer";
import FooterButton from "../components/Partials/FooterButton";

import TotalCredits from "../components/Available Credits/TotalCreditBalance";

export default function AvailableCredits() 
{
    // ACCESING QUERY DATA
    const {profile, userPackages, packages} = useUser();

    // #region JSON PACKAGE MAKER FOR DISPLAY
        const mergeUserPackages = () =>
        {
            if (!userPackages || !packages) return [];

            // lookup map of package_id → package data
            const userPackageMap = Object.fromEntries(
                (userPackages || []).map(up => [up.package_id, up])
            );

            // Merge every package (from master list) with matching user data (if any)
            return packages.map(pkg => 
            {
                const up = userPackageMap[pkg.package_id];

                // Format expiration safely
                const expiration = up?.expiration_date
                    ? new Date(up.expiration_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })
                    : "None";

                // Format purchase date safely
                const purchasedAt = up?.purchased_at
                    ? new Date(up.purchased_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })
                    : "None";

                // Merge data
                return {
                    package_id: pkg.package_id,
                    name: pkg.name ?? "Unknown Package",
                    coins: up ? up.credits_remaining : 0,  // default to 0 if not owned
                    expiration,
                    purchasedAt,
                    stackable: pkg.stackable ?? false,
                };
            });
        }
    // #endregion

    const debug = () =>
    {
        console.log("userPackages: ", userPackages)
        console.log("packages: ", packages);
        console.log("mergeUserPackages: ",mergeUserPackages())
    }

    return (
        <div className="pb-[150px] bg-white px-4">
            <HeaderNav title="Credit Packages" backRoute="/home"/>

            <div className="pt-[100px] font-montserrat">

                <TotalCredits credits_balance={profile?.credits_balance}/>
                
                <div className="px-2 pb-2">
                    <h2 className="text-xl font-bold">Available Packages</h2>
                    <p className="text-base text-black w-[90%]">
                        Keep track of your current credit packages below.
                    </p>
                </div>

                <PackageRenderer packages={mergeUserPackages()} coinCentered={true} disableInteraction={true} highlightPositiveCoins={true}/>

            </div>

            <FooterButton label="Add Credits" navigateTo="/home/AddCredits"/>
        </div>
    );
}