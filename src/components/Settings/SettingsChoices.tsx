import { CheckOut_Settings_Icon, Profile_Icon, QRCode_Icon, SignOut_Icon, ChevronRight_Icon, ChevronRightRed_Icon, HealthConnect_Icon } from "../../assets/index.ts";

type ChoicesProps = 
{
    onSignOut: () => void;
};


export default function Choices_Settings({ onSignOut }: ChoicesProps) 
{
    return (
        <div className="px-4 bg-[#E6E6E6] flex-1">
            {/* General Label Section */}
            <div className="pt-7 pb-2 text-xl font-bold text-black pl-1 py-2">
                General
            </div>

            {/* Settings List */}
            <div className="flex flex-col gap-1">
                <button
                    className="flex items-center justify-between px-6 py-3 bg-white rounded-md"
                    // onClick={onEditProfile}
                >
                    <div className="flex items-center gap-4">
                        <img src={Profile_Icon} className="w-5 h-5" alt="Profile" />
                        <span className="text-sm text-black font-semibold">Profile</span>
                    </div>
                    <img src={ChevronRight_Icon} className="w-6 h-6" alt="Profile" />
                </button>    

                <button
                    className="flex items-center justify-between px-6 py-3 bg-white rounded-md"
                    // onClick={onCheckOut}
                >
                    <div className="flex items-center gap-4">
                        <img src={CheckOut_Settings_Icon} className="w-5 h-5" alt="Check Out" />
                        <span className="text-sm text-black font-semibold">Check Out</span>
                    </div>
                    <img src={ChevronRight_Icon} className="w-6 h-6" alt="Profile" />
                </button>

                <button
                    className="flex items-center justify-between px-6 py-3 bg-white rounded-md"
                    // onClick={onQRCode}
                >
                    <div className="flex items-center gap-4">
                        <img src={HealthConnect_Icon} className="w-5 h-5" alt="QR Code" />
                        <span className="text-sm text-black font-semibold">Health Connect</span>
                    </div>
                    <img src={ChevronRight_Icon} className="w-6 h-6" alt="Profile" />
                </button>

                <button
                    className="flex items-center justify-between px-6 py-3 bg-white rounded-md"
                    // onClick={onQRCode}
                >
                    <div className="flex items-center gap-4">
                        <img src={QRCode_Icon} className="w-5 h-5" alt="QR Code" />
                        <span className="text-sm text-black font-semibold">Download QR Code</span>
                    </div>
                    <img src={ChevronRight_Icon} className="w-6 h-6" alt="Profile" />
                </button>

                <button
                    className="flex items-center justify-between px-6 py-3 bg-white rounded-md"
                    onClick={onSignOut}
                >
                    <div className="flex items-center gap-4">
                        <img src={SignOut_Icon} className="w-5 h-5" alt="Sign Out" />
                        <span className="text-sm text-[#DE2B2D] font-semibold">Sign Out</span>
                    </div>
                    <img src={ChevronRightRed_Icon} className="w-6 h-6" alt="Profile" />
                </button>
            </div>
        </div>
    );
}