//3RD PARTY
import { motion, useMotionValue, animate } from "framer-motion";

// FOR STORE PRODUCTS
type StoreProduct = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    featured: boolean;
};

// FOR USER CART
type UserCart = {
    cart_id: number;
    user_id: number;
    product_id: number;
    product: StoreProduct | null;
    quantity: number;
    created_at: string;
    cartTotalAmount: number;
};

interface ModalProps {
    cart: UserCart[];
    setDeletePressed: (value: boolean) => void;
    setCartIdPresed: (value: UserCart) => void;
    setdisplayUpdatePopup: (value: boolean) => void;
}

export default function RenderCartInstance({ cart, setDeletePressed, setCartIdPresed, setdisplayUpdatePopup }: ModalProps) 
{
    function CartItemRow({ product }: { product: UserCart }) 
    {
        const x = useMotionValue(0); // Hook is top-level in component

        return (
            <div key={product.cart_id} className="relative w-full">
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
                        pointerEvents: x.get() === -100 ? "none" : "auto", // pass through when fully swiped
                    }}
                >
                    <div className="flex items-start p-4 w-full bg-white rounded-[20px] border border-black">
                        {/* Product Image */}
                        <div className="w-[110px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                            <img
                                src={product.product?.image_url ?? ""}
                                alt={product.product?.name ?? "Error"}
                                className="w-full h-full object-cover"
                            />
                            
                        </div>
                        

                        {/* Right section */}
                        <div className="flex flex-col justify-between ml-4 w-full">
                            {/* Name */}
                            <p className="font-semibold leading-tight text-sm w-[95%] mb-2">
                                {product.product?.name ?? "error"}
                            </p>

                            {/* Quantity + Price */}
                            <div className="flex flex-col mt-1">
                                <div className="flex w-fit items-center space-x-3 mb-1">
                                    <span className="text-sm text-[#434343] font-semibold">
                                        Quantity: {product.quantity}
                                    </span>
                                </div>
                                <p className="text-xl font-semibold -mt-2 text-[#434343]">
                                    ₱ {(product.cartTotalAmount)}
                                </p>
                            </div>
                            <button 
                                className=" bg-black text-white text-sm p-2 px-3 rounded-[20px] flex justify-center"
                                onClick={() => {
                                        setdisplayUpdatePopup(true)
                                        setCartIdPresed(product)
                                    }}>
                                Update
                            </button>
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
                            setDeletePressed(true)
                            setCartIdPresed(product)
                        }}>
                        Delete
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="flex flex-col gap-3 mb-[180px]">
            {cart.length === 0 ? (
                <div className="px-3">
                    <div className="flex flex-col items-center justify-center text-center bg-white rounded-[30px]">
                        <p className="w-[70%] mt-10">It seems u dont have any products in your cart? Then make one!</p>
                        <p className="w-[70%] mt-5">If this is wrong then try going back to the store and go back here after</p>
                    </div>
                </div>
            ):(
                cart.map((product) => (
                    <CartItemRow key={product.cart_id} product={product} />
                ))
            )}
            
        </div>
    );
}
