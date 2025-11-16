import { useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";

// MERGE USER PACKAGES WITH AVAILABLE PACKAGES (ALSO SHOW PACKAGES NOT OWNEDE BY USER)
// 2 SUPABASE CALL (2 because of strict mode)
export default function mergeUserPackages()
{
    const { userPackages, packages, refreshUserPackages } = useUser();

    // refresh available user packages only once on load
    useEffect(() => 
    {
        refreshUserPackages();
    }, []);

    const merged = useMemo(() => 
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
                ? new Date(up.expiration_date).toLocaleDateString("en-US", 
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })
                : "None";

            // Format purchase date safely
            const purchasedAt = up?.purchased_at
                ? new Date(up.purchased_at).toLocaleDateString("en-US", 
                {
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
                user_package_id: up?.user_package_id ?? null,
            };
        });
    }, [userPackages, packages]);

    return merged;
}
