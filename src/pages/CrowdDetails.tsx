
import HeaderNav from "../components/Partials/HeaderNav";
import Header from "../components/Crowd Details/Header.tsx";
import CrowdHistoryChart from "../components/Crowd Details/CrowdHistory";
import GymInfoCard from "../components/Crowd Details/GymInfo";

export default function CrowdDetails() 
{
    // Crowd Meter
    const Customerlimit = 50; 
    const customerCount = 20;

    return (
        <div className="min-h-screen bg-[#E6E6E6]">
            <div className="px-2 bg-white">
                <HeaderNav title="Crowd Details" backRoute="/home" />
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col px-6 bg-white">
                    <Header CustomerLimit={Customerlimit} CustomerCount={customerCount}/>
                    {/* line */}
                    <div className="border-t border-[#E6E6E6] w-full mt-5 mb-9">
                    </div>
                    <CrowdHistoryChart />
                </div>

                <GymInfoCard />

            </div>

        </div>
    );
}
