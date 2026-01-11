import { GymCoin_Colored } from "../../assets/assets"; 

interface TotalCredits_Props
{
    credits_balance?: number | 69;
}

export default function TotalCredits({credits_balance}:TotalCredits_Props) 
{
    return (
        <div>
            {/* In-app credits label + big number */}
            <div className="mt-3 mb-5 flex flex-col items-center">
                <p className="text-lg font-normal text-gray-500">In app credits</p>

                <div className="-mt-2 flex items-center">
                    <span className="text-7xl leading-tight font-bebas font-normal mt-1">{credits_balance}</span>
                    <img
                    src={GymCoin_Colored}
                    alt="Coin"
                    className="w-[39px] h-[42px] ml-1"
                    />
                </div>
            </div>
        </div>
    );
}