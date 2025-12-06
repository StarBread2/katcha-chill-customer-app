//3RD PARTY
import { motion, useMotionValue, animate } from "framer-motion";
import { div } from "framer-motion/client";

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
    userOrders: OrderGroupsData | null;
    //DELETE ORDERS
    setDeletePressed: (value: boolean) => void;
    setCartIdPresed: (value: OrderGroups) => void;

    //SET_ITEMS DISPLAY
    setDisplayUser_Items: (value: boolean) => void;
    setuserItemsClickedData: (value: OrderGroups) => void;
}

export default function RenderOrderInstance({userOrders, setDeletePressed, setCartIdPresed, setDisplayUser_Items, setuserItemsClickedData}:ModalProps)
{
    function OrderItemRow({ orders }: { orders: OrderGroups })
    {
        const x = useMotionValue(0); // Hook is top-level in component

        return (
            <div 
            key={orders.id} 
            className="relative w-full ">
                <motion.div
                    className="relative z-10"
                    drag="x"
                    dragConstraints={{ left: -100, right: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragEnd={() => 
                    {
                        const current = x.get();
                        animate(x, current < -50 ? -100 : 0, 
                        {
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        });
                    }}
                    style={{
                        x, // motion value
                    }}
                >
                    <div className="bg-white rounded-[20px] border border-black">
                        <div 
                            className="flex items-center p-4 w-full"
                            
                        >
                            {/* Product Image */}
                            <div className="w-[110px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                                <img
                                    src={orders.order_items[0].product.image_url}
                                    alt={orders.order_items[0].product.name}
                                    className="w-full h-full object-cover"
                                    
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col w-full h-full ml-4 justify-between">
                                <div className="text-sm ">
                                    <p className={`font-semibold ${
                                        orders.status === "Completed" ? "text-green-600" :
                                        orders.status === "Out of Stock" ? "text-red-600" :
                                        "text-red-600" // Pending
                                    }`}>
                                        ● {orders.status === "Completed" ? "Completed" :
                                        orders.status === "Out of Stock" ? "Out of Stock" :
                                        "Pending"}
                                    </p>
                                    <p className="">
                                        Order #{orders.id.toString().slice(0, 8)}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm">
                                        {orders.order_items.length} 
                                        {orders.order_items.length === 1 ? " item, " : " items, "} Total:
                                    </p>
                                    <p className={`text-xl ${orders.status === "Pending" ? "text-black": "text-gray-700"} font-semibold `}> 
                                        ₱ {Number(orders.total_amount) % 1 === 0
                                            ? Number(orders.total_amount).toLocaleString('en-PH', { maximumFractionDigits: 0 })
                                            : Number(orders.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center -mt-2 pb-4">
                            {orders.status=="Pending" ? (
                                <button 
                                    className="bg-black text-white text-sm p-2 px-3 rounded-[20px] flex justify-center w-[90%]"
                                    onClick={() => 
                                            {    
                                                setDisplayUser_Items(true);
                                                setuserItemsClickedData(orders);
                                            }}
                                >
                                    Pay
                                </button>
                            ):(
                                <button 
                                    className="bg-white text-black text-sm p-2 px-3 rounded-[20px] flex justify-center w-[90%] border border-black"
                                    onClick={() => 
                                            {    
                                                setDisplayUser_Items(true);
                                                setuserItemsClickedData(orders);
                                            }}
                                >
                                    Check Items
                                </button>
                            )}
                        </div>
                    </div>
                    
                    
                    
                </motion.div>

                {/* Delete Button */}
                <div 
                    className="absolute z-0 top-0 right-0 h-full flex items-center w-[80%] bg-red-500 rounded-[20px]"
                    >
                    <button 
                    className="h-full absolute text-white font-semibold right-1 px-5"
                    onClick={() => {
                            //IF DELETE OR THE ABOVE DIV IS NOT -100 THEN U CANT DELETE
                            if(x.get() > -100) return;

                            setDeletePressed(true)
                            setCartIdPresed(orders)
                        }}>
                        Delete
                    </button>
                </div>
            </div>
        );
    }

    return(
        <div className="flex flex-col gap-3">
            {/* ORDERS */}
            {userOrders?.order_groups === null ? (
                <div className="px-3">
                    <div className="flex flex-col items-center justify-center text-center bg-white rounded-[30px]">
                        <p className="w-[70%] mt-10">It seems u dont have any orders? Then make one!</p>
                        <p className="w-[70%] mt-5">If this is wrong then try going back to the store and go back here after</p>
                    </div>
                </div>
            ):(
                userOrders?.order_groups?.map((userOrder) => (
                    <OrderItemRow key={userOrder.id} orders={userOrder} />
                ))
            )}
            
        </div>
    );
}