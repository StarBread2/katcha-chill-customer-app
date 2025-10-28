import { Crowd_Icon } from "../../assets";
import CrowdMeter_Bar from "../Partials/CrowdMeter_Bar";


interface HeaderProps {
    CustomerLimit: number;     
    CustomerCount: number;     
}

export default function Header({ CustomerLimit, CustomerCount }: HeaderProps) {
    return (
        <header className="px-0">
            {/* 🔹 Location Title */}
            <h1 className="text-4xl font-bebas leading-tight pt-2">
                Magatas, Sibulan, Negro..
            </h1>

            {/* 🔹 Crowd Mete   r Row */}
            <div className="flex justify-between items-center mb-5 mt-2">
                <div className="flex items-center gap-2">
                    <img src={Crowd_Icon} alt="Crowd" className="w-5 h-5" />
                    <p className="text-base text-[#434343] font-semibold">
                        Crowd Meter
                    </p>
                </div>

                <div className="flex space-x-1">
                    <CrowdMeter_Bar limit={CustomerLimit} value={CustomerCount} />
                </div>
            </div>
        </header>
    );
}
