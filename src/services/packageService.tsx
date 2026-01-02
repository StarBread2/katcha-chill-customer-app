import { supabase } from "../lib/supabaseClient";

//Get available credit packages
export const getCreditPackages = async () => {
    const { data, error } = await supabase
        .from("credit_packages")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) throw error;

    // map DB columns → frontend format
    return data.map((pkg) => ({
        package_id: pkg.package_id,
        name: pkg.name,
        coins: pkg.credit_count, // rename for frontend
        expiration: pkg.expiration_days
        ? `${pkg.expiration_days} days`
        : null,
        description: pkg.details || null,
        price: pkg.price ?? null,
        stackable: pkg.stackable,
    }));
};

// Get a single credit package by its package_id
export const getCreditPackageById = async (package_id: string) => 
{
    try 
    {
        const { data, error } = await supabase
        .from("credit_packages")
        .select("*")
        .eq("package_id", package_id)
        .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        // Map DB columns → frontend format
        return {
            package_id: data.package_id,
            name: data.name,
            coins: data.credit_count,
            expiration: data.expiration_days ? `${data.expiration_days} days` : null,
            description: data.details || null,
            price: data.price ?? null,
            stackable: data.stackable,
        };
    } 
    catch (err) 
    {
        console.error("Error fetching credit package by ID:", err);
        return null;
    }
};

