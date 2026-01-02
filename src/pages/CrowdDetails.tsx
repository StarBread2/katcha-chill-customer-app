//MAIN
import Header from "../components/Crowd Details/Header.tsx";
import CrowdHistoryChart from "../components/Crowd Details/CrowdHistory";
import GymInfoCard from "../components/Crowd Details/GymInfo";
//CONTEXT
import { useCrowdHistoryContext } from "../context/CrowdHistoryContext.tsx";
//PARTIALS
import HeaderNav from "../components/Partials/HeaderNav";

export default function CrowdDetails() 
{
    // DB FETCH
    const { crowdCountNow } = useCrowdHistoryContext();

    // Crowd Meter
    const Customerlimit = 50; 

    return (
        <div className="min-h-screen bg-white">
            <div className="px-2 bg-white">
                <HeaderNav title="Crowd Details" backRoute="/home" />
            </div>

            <div className="flex flex-col pt-[100px]">
                <div className="flex flex-col px-6 bg-white">
                    <Header CustomerLimit={Customerlimit} CustomerCount={crowdCountNow}/>
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
