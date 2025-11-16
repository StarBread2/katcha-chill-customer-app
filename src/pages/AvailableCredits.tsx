import { useUser } from "../context/UserContext";

//PARTIALS
import HeaderNav from "../components/Partials/HeaderNav";
import PackageRenderer from "../components/Partials/PackageRenderer";
import FooterButton from "../components/Partials/FooterButton";

//MAINS
import TotalCredits from "../components/Available Credits/TotalCreditBalance";

//UTILS
import mergeUserPackages from "../utils/mergeUserPackages";

//ICONS
import { Refresh_Icon } from "../assets/index";


export default function AvailableCredits() 
{
    // ACCESING QUERY DATA
    const {profile, userPackages, packages} = useUser();

    const debug = () =>
    {
        console.log("userPackages: ", userPackages)
        console.log("packages: ", packages);
        console.log("mergeUserPackages: ",mergeUserPackages())
    }

    // debug();

    return (
        <div className="pb-[150px] bg-white px-4">
            <HeaderNav title="Credit Packages" backRoute="/home"/>

            <div className="pt-[100px] font-montserrat">

                {/* Loading bar unused */}
                {/* <div className="flex justify-end px-2">
                    <div className="w-9 h-9 rounded-full border-[1px] border-[#757575] flex items-center justify-center"
                        onClick={refreshUserPackages}>
                        <img src={Refresh_Icon} className="w-[18px] h-[18px] active:rotate-180 transition-transform duration-300" alt="Refresh" />
                    </div>
                </div> */}

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