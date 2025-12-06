import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
//PARTIALS
import FooterButton from "../../components/Partials/FooterButton";
//SVG
import { Close_Icon } from "../../assets/index.ts";

//FOR STORE PRODUCTS
type StoreProduct = 
{
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    featured: boolean;
}
type OrderItems = 
{
    id: string;
    product: StoreProduct; 
    quantity: number;
    total: number;
    unit_price: number;
}
type OrderGroups = 
{
    created_at: string;
    id: string;
    order_items: OrderItems[];
    status: string;
    total_amount: number;
    updated_at: string;
    user_id: string;
}
type OrderGroupsData = 
{
    order_groups: OrderGroups[];
}

interface ModalProps
{
    //WHEN THE MODAL CLOSE IS PRESSED (RETURNS BOOL)
    onClose: (value: boolean) => void;

    userItemsClickedData: OrderGroups | null;

    //WHEN THE FOOTER BUTTON IS PRESSED (THEN SET TO TRUE) 
    setFooterButtonPressed: (value: boolean) => void;
}


export default function RenderOrderItemSModal({onClose, userItemsClickedData, setFooterButtonPressed}:ModalProps)
{
    return createPortal(
        <div 
            className=" fixed inset-0 bg-black/40 bg-gradient-to-b from-transparent to-black/40 backdrop-blur-sm flex items-end justify-center font-montserrat"
            onClick={() => onClose?.(true)}
            >
            <div 
                className="bg-white w-full max-w-md rounded-t-3xl p-5 h-[90vh] overflow-y-auto shadow-xl z-25"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Close button */}
                <button
                    className="absolute right-4 bg-white rounded-[20px] hover:text-gray-600 transition-all"
                    onClick={() => onClose?.(true)}
                >
                    <img
                        src={Close_Icon}
                        alt="Close"
                        className="w-7 h-7"
                    />
                </button>

                {/* CONTAINER OF THE PRODUCTS AND HEADER */}
                <div>
                    {/* HEADER TEXT */}
                    <p className="text-center py-3 text-lg font-bold">
                        Order #{userItemsClickedData?.id.toString().slice(0, 8)}
                    </p>

                    {/* ACTUAL PRODUCTS IN THE ORDER */}
                    <div className="flex flex-col gap-3 pb-[190px]">
                        {userItemsClickedData?.order_items.map((userItemClickedData) => (
                        <div className="flex items-start p-4 w-full bg-white rounded-[20px] border border-black">
                            {/* Product Image */}
                            <div className="w-[110px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                                <img
                                    src={userItemClickedData.product?.image_url ?? ""}
                                    alt={userItemClickedData.product?.name ?? "Error"}
                                    className="w-full h-full object-cover"
                                />
                                
                            </div>
                            

                            {/* Right section */}
                            <div className="flex flex-col justify-between ml-4 w-full">
                                {/* Name */}
                                <p className="font-semibold leading-tight text-sm w-[95%] mb-2">
                                    {userItemClickedData.product?.name ?? "error"}
                                </p>

                                {/* Quantity + Price */}
                                <div className="flex flex-col mt-1">
                                    <div className="flex w-fit items-center space-x-3 mb-1">
                                        <span className="text-sm text-[#434343] font-semibold">
                                            Quantity: {userItemClickedData.quantity}
                                        </span>
                                    </div>
                                    <p className="text-xl font-semibold -mt-2 text-[#434343]">
                                        ₱ {(userItemClickedData.total)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                    ))}
                    </div>
                    
                </div>
                <FooterButton label= {userItemsClickedData?.status === "Pending" ? "Pay" :
                                        userItemsClickedData?.status === "Out of Stock" ? "Out of Stock" :
                                        "Already Paid"}
                                        
                    canPress={userItemsClickedData?.status === "Pending" && !!userItemsClickedData?.order_items?.length} onReturnBool={setFooterButtonPressed}
                    renderAmount={true} displayAmount={false}
                    enableCurrentAmountPreCalculated={true} currentAmountPreCalculated={userItemsClickedData?.total_amount}/>
            </div>
        </div>, document.body
    );
}