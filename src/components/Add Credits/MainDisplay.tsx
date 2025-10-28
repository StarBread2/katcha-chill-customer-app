import { useUser } from "../../context/UserContext";

import { QRPlaceholder_Image, GymCoin_Colored } from "../../assets/index.ts"; 

export default function MainDisplay_AddCredits() 
{
    const {  profile, loading, refreshProfile, qrDataUrl } = useUser();

    return (
        <div>
            <div className="pt-20 pb-20 px-10 flex flex-col justify-center items-center font-montserrat">
                {/* User Name */}
                <h1 className="text-3xl font-semibold mb-4 text-center">
                    {profile?.full_name ?? "Error: Fuck u Jordan"}
                </h1>

                {/* https://chatgpt.com/c/68f655fa-1c78-8320-9fdb-5c80be87ccee MARK ACCOUNT*/} 
                {/* QR Display */}
                <div className="w-[180px] h-[180px] flex items-center justify-center mb-6 rounded-lg overflow-hidden bg-gray-200">
                    {qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-cover" />
                    ) : (
                        <img
                        src={QRPlaceholder_Image}
                        alt="QR Placeholder"
                        className="w-full h-full object-cover"
                        />
                    )}
                </div>


                {/* Label */}
                <h3 className="pb-3 text-3xl font-semibold mb-2 text-center">Credits Top-up</h3>


                <p className="text-black mb-1 mt-5 text-center px-6">
                    In app credits:
                </p>

                <div className="flex items-center justify-center gap-2 mb-10">
                    <img
                        src={GymCoin_Colored}
                        alt="GymCoin Icon"
                        className="w-7 h-7"
                    />
                    <p className="text-black text-center font-semibold text-xl">
                        {profile?.credits_balance ?? 69}
                    </p>
                </div>
            </div>
        </div>
    );
}