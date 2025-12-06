import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//MAIN
import RenderCartInstance from "../components/Cart/RenderCartInstance.tsx";
//PARTIALS
import HeaderNav from "../components/Partials/HeaderNav";
import FooterButton from "../components/Partials/FooterButton";
import ModalConfirmation from "../components/Partials/modalConfirmation.tsx";
import AddToCartPopUp from "../components/Partials/AddToCartPopUp.tsx"
//DB
import { useUser } from "../context/UserContext";


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
};

export default function Cart() 
{
    const { profile, cart, 
            fetchUserCartWithProducts, deleteCartItem, updateCartItemQuantity, cartGrandTotal,
            checkOutUserCart } = useUser();
    const navigate = useNavigate();

    //#region FETCH CART PRODUCTS 1ST MOUNT 
        //IF PAGE IS REFRESHED USER_ID MIGHT NOT BE READY THAT WILL RESULT USER PRODUCTS NOT BEING FETCHED
            useEffect(() => 
            {
                fetchUserCartWithProducts();
            }, []);
    //#endregion
    
    //#region DELETE WARNING MODAL
        //FOR MODAL
        const [displayWarningModal_Delete, setdisplayWarningModal_Delete] = useState(false);
        const [modalCloseButtonClicked_Delete, setmodalCloseButtonClicked_Delete] = useState(false);
        const [modalAgreeButonClicled_Delete, setmodalAgreeButonClicled_Delete] = useState(false);
        //PRODUCT CHOOSEN BY USER
        const [choosenCartToBeDeleted, setchoosenCartToBeDeleted] = useState<UserCart | null>(null);
        //USEEFFECT
            // When modal "Close" button is clicked → hide modal
            useEffect(() => 
            {
                if (modalCloseButtonClicked_Delete) 
                {
                    setdisplayWarningModal_Delete(false); // close modal
                    setmodalCloseButtonClicked_Delete(false); // reset flag
                    setchoosenCartToBeDeleted(null); //reset data to be deleted
                }
            }, [modalCloseButtonClicked_Delete]);
            //WHEN MODAL AGREE (DELETE) IS CLICKED
            useEffect(() => 
            {
                if(!modalAgreeButonClicled_Delete) return;
                if(!choosenCartToBeDeleted) return;

                const onDelete = async () => 
                {
                    try
                    {
                        deleteCartItem(choosenCartToBeDeleted.cart_id);
                    }
                    catch(err)
                    {
                        console.error("Error deleting user cart:", err);
                    }
                };

                onDelete();
                
                setchoosenCartToBeDeleted(null);
                setdisplayWarningModal_Delete(false); // close modal
                setmodalAgreeButonClicled_Delete(false); //RESET AGREE MODAL CLICKED
            }, [modalAgreeButonClicled_Delete]);
    //#endregion

    //#region UPDATE MODAL 
        //HIDE Update MODAL
        const [displayUpdatePopup, setdisplayUpdatePopup] = useState(false);
        const [closeUpdateModalPressed, setcloseUpdateModalPressed] = useState(false);

        //IF MODAL CLOSED
            useEffect(() => 
            {
                //HIDE THE UPDATE POPUP
                setdisplayUpdatePopup(false);
                //RESET MODAL X PRESSED 
                setcloseUpdateModalPressed(false);
                //RESET THE CHOOSEN PRODUCT
                setchoosenCartToBeDeleted(null);
            }, [closeUpdateModalPressed]);

        //MODAL PRESSABLES
            // Update footer button pressed
            const [updateButtonPressed, setUpdateButtonPressed] = useState<boolean>(false); 
            // Quantity Total of product to change or update (FOOTER BUTTON MODAL QUANTITY)
            const [quantityTotal, setquantityTotal] = useState(1);

        //IF ADD TO CART IS PRESSED
            useEffect(() => 
            {
                if (!updateButtonPressed) return;
                if (!choosenCartToBeDeleted) return;

                const onUpdate = async () => 
                {
                    if(choosenCartToBeDeleted)
                    {
                        await updateCartItemQuantity(choosenCartToBeDeleted.cart_id, quantityTotal);
                    }
                };
                onUpdate();

                //HIDE THE ADD TO CART POPUP
                setcloseUpdateModalPressed(true);
                setUpdateButtonPressed(false);
            }, [updateButtonPressed]);
    //#endregion
        
    //#region CHECKOUT MODAL
        // IF CHECKOUT IS PRESSED
            // checkout button is pressed (will do checkout and go to my orders page)
            const [checkoutButtonPressed, setCheckoutButtonPressed] = useState<boolean>(false);

            // if Checkout button is pressed then do this 
            useEffect(() => 
            {
                if(!checkoutButtonPressed) return;

                setDisplayWarningModal_Checkout(true);
            }, [checkoutButtonPressed]);

        //FOR WARNING MODAL
            const [displayWarningModal_Checkout, setDisplayWarningModal_Checkout] = useState(false);
            const [modalCloseButtonClicked_Checkout, setmodalCloseButtonClicked_Checkout] = useState(false);
            const [modalAgreeButonClicled_Checkout, setmodalAgreeButonClicled_Checkout] = useState(false);
            //IF MODAL CLOSED
            useEffect(() => 
            {
                if (!modalCloseButtonClicked_Checkout) return;

                //HIDE THE CHECKOUT WARNING POPUP
                setDisplayWarningModal_Checkout(false);
                //RESET MODAL X PRESSED 
                setmodalCloseButtonClicked_Checkout(false);
                //RESET CHECKOUT BUTTON PRESSED
                setCheckoutButtonPressed(false);
            }, [modalCloseButtonClicked_Checkout]);

            // IF MODAL AGREE (CHECKOUT) IS CLIKCED
            useEffect(() => 
            {
                if(!profile?.id) return;
                if(!modalAgreeButonClicled_Checkout) return;
                if(!cart || cart.length === 0) return;

                const onCheckout = async () => 
                {
                    try
                    {
                        if(!profile?.id) return;

                        checkOutUserCart(profile?.id);
                    }
                    catch(err)
                    {
                        console.error("Error checking out the user cart:", err);
                    }
                };

                onCheckout();
                navigate("/store/orders")
                setDisplayWarningModal_Checkout(false); // close modal
                setmodalAgreeButonClicled_Checkout(false); //RESET AGREE MODAL CLICKED
            }, [modalAgreeButonClicled_Checkout]);
        
    //#endregion
    
    return (
        <div className="bg-white py-[100px] min-h-screen px-3 font-montserrat">
            <HeaderNav title="My Cart" backRoute="/store" />

            {/* RENDER CART */}
                {/* READ */} 
                {/* DELETE MODAL */} 
                {/* UPDATE MODAL */}
            <RenderCartInstance cart={cart} 
                setDeletePressed={setdisplayWarningModal_Delete} setCartIdPresed={setchoosenCartToBeDeleted} 
                setdisplayUpdatePopup={setdisplayUpdatePopup}/> 

            {/* CHECKOUT BUTTON */}
            {/* UNIQUE BUTTON */}
            { !displayUpdatePopup && (
                <FooterButton label="Checkout" 
                onReturnBool={setCheckoutButtonPressed} canPress={cart && cart.length > 0}
                renderAmount={true} displayAmount={false} 
                enableCurrentAmountPreCalculated={true} currentAmountPreCalculated={cartGrandTotal}/>
            )}
            
            {/* DELETE CONFIRMATION MODAL */}
            {displayWarningModal_Delete && 
                (<ModalConfirmation 
                    title="Delete this cart?" 
                    message={`Are you sure you want to delete this cart with ${choosenCartToBeDeleted?.quantity} ${choosenCartToBeDeleted?.product?.name}`} 
                    buttonLabel="Delete Cart"
                    onClose={setmodalCloseButtonClicked_Delete}
                    onConfirm={setmodalAgreeButonClicled_Delete}
                />)
            }

            {/* DELETE CONFIRMATION MODAL */}
            {displayWarningModal_Checkout && 
                (<ModalConfirmation 
                    title="Confirm Checkout?" 
                    message={`Do you want to check out with a total of ₱ ${cartGrandTotal} and finalize this? `} 
                    buttonLabel="Checkout"
                    onClose={setmodalCloseButtonClicked_Checkout}
                    onConfirm={setmodalAgreeButonClicled_Checkout}
                />)
            }

            {/* DSIPALY ADD TO CART POPUP */}
            {displayUpdatePopup && (
                <AddToCartPopUp footerButtonText="Update"
                    setButtonPressed={setUpdateButtonPressed} setquantityTotal={setquantityTotal}
                    productPressedID={choosenCartToBeDeleted?.product_id} onClose={setcloseUpdateModalPressed} currentValueQuantity={choosenCartToBeDeleted?.quantity}
                    cantChangeIfQuantityIsSame={true} quantityTotal={quantityTotal}/>
            )}
        </div>
    );
}






// {items.map((product) => (
// <div className="flex items-center px-2 py-3 w-full bg-white rounded-[20px] border border-black">
//     {/* Checkmark */}
//     <div className="flex items-center justify-center mr-3">
//         <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
//             <img
//             src={Check_White_Icon}
//             className="w-3 h-3"
//         />
//         </div>
//         {/* <div className="w-6 h-6 rounded-full border border-[1px] border-black flex items-center justify-center"></div> */}
//     </div>

//     {/* Product Image */}
//     <div className="w-[90px] h-[90px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
//         <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-full object-cover"
//         />
//     </div>

//     {/* Right section */}
//     <div className="flex flex-col justify-between ml-4 w-full">

//         {/* Name */}
//         <p className="font-semibold leading-tight text-sm w-[90%]">
//             {product.name}
//         </p>

//         {/* Quantity Selector */}
//         <div className="flex w-fit items-center p-1 mt-4 space-x-3 bg-[#D9D9D9] rounded-[20px]">

//             {/* Minus */}
//             <button className="w-7 h-7 flex items-center justify-center rounded-full border border-black">
//                 <img src={Minus_Icon} className="w-3 h-3" />
//             </button>

//             {/* Quantity number */}
//             <span className="text-lg text-[#434343] font-semibold">1</span>

//             {/* Plus */}
//             <button className="w-7 h-7 flex items-center justify-center rounded-full border border-black">
//                 <img src={PlusBlack_Icon} className="w-3 h-3" />
//             </button>
//             {/* <button className="w-7 h-7 flex items-center justify-center rounded-full border bg-black">
//                 <img src={Plus_Icon} className="w-3 h-3" />
//             </button> */}
//         </div>

//         {/* Price */}
//         <p className="text-xl font-semibold  text-[#434343]">
//             ₱ {product.price.toLocaleString()}
//         </p>
//     </div>
// </div>
// ))}


    // <div className="flex flex-col gap-3 mb-[180px]">
    // {cart.map((product) => 
    // {
    //     const x = useMotionValue(0);

    //     return (
    //         <div className="relative w-full">
    //             <motion.div
    //                 className="relative z-10"
    //                 style={{ x }}
    //                 drag="x"
    //                 dragConstraints={{ left: -100, right: 0 }}
    //                 dragElastic={0}
    //                 dragTransition={{
    //                     bounceStiffness: 0,            // ← NO RUBBER EFFECT
    //                     bounceDamping: 0
    //                 }}
    //                 dragMomentum={false}
    //                 onDragEnd={() => 
    //                 {
    //                     const current = x.get();

    //                     if (current < -50) 
    //                     {
    //                         // Snap to -100
    //                         animate(x, -100, 
    //                         { 
    //                             type: "spring", 
    //                             stiffness: 300,
    //                             damping: 25 
    //                         });
    //                     } 
    //                     else 
    //                     {
    //                         // Snap back to 0
    //                         animate(x, 0, 
    //                         { 
    //                             type: "spring", 
    //                             stiffness: 300, 
    //                             damping: 25 
    //                         });
    //                     }
    //                 }}
    //             >
    //                 <div className="flex items-start p-4 w-full bg-white rounded-[20px] border border-black">
    //                     {/* Product Image */}
    //                     <div className="w-[110px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
    //                         <img
    //                             src={product.product?.image_url ?? ""}
    //                             alt={product.product?.name ?? "Error"}
    //                             className="w-full h-full object-cover"
    //                         />
    //                     </div>

    //                     {/* Right section */}
    //                     <div className="flex flex-col ml-4 w-full">

    //                         {/* Name */}
    //                         <p className="font-semibold leading-tight text-sm w-[95%]">
    //                             {product.product?.name ?? "error"}
    //                         </p>

    //                         <div className="flex flex-col mt-2">
    //                             <div className="flex w-fit items-center p-1 space-x-3 ">
    //                                 {/* Quantity number */}
    //                                 <span className="text-sm text-[#434343] font-semibold">Quantity: 1</span>
    //                             </div>

    //                             {/* Price */}
    //                             <p className="text-xl font-semibold -mt-2 text-[#434343]">
    //                                 ₱ {product.product?.price.toLocaleString() ?? "0"}
    //                             </p>
    //                         </div> 
    //                     </div>
    //                 </div>
    //             </motion.div>

    //             <div className="absolute z-0 top-0 right-0 h-full flex items-center w-[80%] bg-red-500 rounded-[20px]">
    //                 <button className="absolute text-white font-semibold right-1 pr-5">
    //                     Delete
    //                 </button>
    //             </div>
    //         </div>
    //     ); 
    // })}
    // </div>