
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
//PARTIALS
import FooterButton from "./FooterButton.tsx";
//SVG
import { Close_Icon } from "../../assets/assets.ts";
//DB
import { useUser } from "../../context/UserContext.tsx";
//CSS TRANSITION
import PageTransition from "../Transitions/PageTransition.tsx";

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

interface ModalProps
{
    //THE PRODUCT PRESSED ID (GET NUMBER_ID)
    productPressedID?: number | null;
    //WHEN THE MODAL CLOSE IS PRESSED (RETURNS BOOL)
    onClose: (value: boolean) => void;

    //FOOTER BUTTON
        //IF Bottom navbar BUTTON IS PRESSED (ADDTOCART BUTTON)
        setButtonPressed: (value: boolean) => void;
        //Quantity of the product to be add to cart
        setquantityTotal: (value: number) => void;

    //SKIP TO THIS NUMBER
    currentValueQuantity?: number;
    //TEXT FOR THE FOOTER BUTTON
    footerButtonText: string;

    //IF VALUE IS SAME AS BEFORE THEN U CANT PRESS SHIT (AVOID FETCH SPAM BRO)
    cantChangeIfQuantityIsSame?: boolean;
    //NEEDED IF cantChangeIfQuantityIsSame === TRUE
    quantityTotal?: number;
}


export default function AddToCartPopup({productPressedID, onClose, setButtonPressed, setquantityTotal, currentValueQuantity = 1, footerButtonText, cantChangeIfQuantityIsSame = false, quantityTotal = 0}: ModalProps) 
{
    //#region PRESSED PRODUCT
        //DB USED TO GET PRODUCT BY ID IN CURRENT USER CONTEXT (NO DB FETCH SHITS)
        const { getStoreProductById } = useUser();
        //THE PRODUCT ITSELF
        const [product, setproduct] = useState<StoreProduct | null>();
        //IF THERE IS A PRODUCTPRESSEDID THEN GET THE PRODUCT BY ID
        useEffect(() => 
        {
            if (productPressedID != null) 
            {
                setproduct(getStoreProductById(productPressedID));
            }
        }, [productPressedID]);
    //#endregion

    //DISABLE SCROLL IN THE BACK
    useEffect(() => 
    {
        // Disable background scroll
        document.body.style.overflow = "hidden";

        return () => {
            // Re-enable scroll when modal closes
            document.body.style.overflow = "";
        };
    }, []);

    return createPortal(
        <div className=
            "fixed inset-0 bg-black/40 bg-gradient-to-b from-transparent to-black/40 backdrop-blur-sm flex items-end justify-center z-20 font-montserrat"
            onClick={() => onClose?.(true)}>
            {/* POPUP CONTAINER */}
            <PageTransition type="slide-up"> {/* animation wrapper */}
                <div 
                    className="bg-white w-full max-w-md rounded-t-3xl px-5 h-[70vh] overflow-y-auto shadow-xl"
                    onClick={(e) => e.stopPropagation()} > {/* PREVENT SCROLLIONG*/}
                    {/* Close button */}
                    <div className="flex flex-col sticky mb-1 top-0 bg-white z-10">
                        <button
                            className="w-full flex justify-end mt-5"
                            onClick={() => onClose?.(true)}
                        >
                            <img
                                src={Close_Icon}
                                alt="Close"
                                className="w-7 h-7"
                            />
                        </button>
                    </div>
                    

                    {/* IMAGE & TITLE */}
                    <div className="flex gap-4 mt-7">
                        <img
                            src={product?.image_url}
                            className="rounded-[10px] h-[150px] w-[40%] object-cover"
                        />

                        <div className="w-[60%]">
                            <h2 className="text-xl font-semibold break-words w-[85%]">
                                {product?.name}
                            </h2>
                            <p className={`text-sm ${product?.stock && product.stock > 10 ? 'text-green-600' : 'text-red-600'} mt-2 w-[85%] break-words`}>
                                ● Stock Remaining: {product?.stock ?? 0}
                            </p>
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="mt-5 pb-[150px]">
                        <h3 className="font-semibold mb-1">Details</h3>
                        <p className="text-sm text-gray-600 text-justify">
                            {product?.description}    {product?.description}  
                        </p>
                    </div>

                    import QRCode from "qrcode";
                    {product && (
                        <FooterButton label={footerButtonText} 
                            onReturnBool={setButtonPressed} 
                            canPress={product.stock > 0 && (!cantChangeIfQuantityIsSame || quantityTotal !== currentValueQuantity)}
                            setquantityTotal={setquantityTotal} currentValueQuantity={currentValueQuantity}
                            renderAmount={true}  canChangeQuantity={!!product && product.stock > 0} defaultQuantityValue={1} maxQuantityValue={Math.min(product.stock, 50)}  price={product?.price}/>
                    )}
                    
                </div>
            </PageTransition>
        </div>, document.body
    );
}
