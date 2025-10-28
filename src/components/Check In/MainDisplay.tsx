import { useUser } from "../../context/UserContext";

import { QRPlaceholder_Image } from "../../assets/index.ts"; 

export default function MainDisplay_CheckIn() 
{
    const { user, profile, loading, refreshProfile, qrDataUrl } = useUser();

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
                <h3 className="pb-3 text-3xl font-semibold mb-2 text-center">Daily Walk-in</h3>


                <p className="text-black mb-10 text-center px-6">
                    Have an awesome workout, {profile?.full_name?.split(" ")[0] ?? "friend"}! You got this!
                </p>
            </div>
        </div>
    );
}