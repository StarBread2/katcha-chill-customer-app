export default function MembershipCard() 
{
    return (
        <div className="bg-white rounded-[20px] p-8 pb-6 shadow-md font-montserrat w-[98%] mx-auto">
            <div>
                <p className="text-bold text-black">Expiration Date</p>
                <p className="font-sm text-[#434343]">September 30, 2025</p>
            </div>

            <div className="w-20 h-20 flex items-center justify-center border-4 border-green-500 rounded-full">
                <p className="text-center text-sm font-semibold">
                30 days <br />
                <span className="text-gray-500 text-xs">until expiration</span>
                </p>
            </div>
        </div>
    )
}
