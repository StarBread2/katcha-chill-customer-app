import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//MAIN
import RenderOrderInstance from "../components/Orders/RenderOrderInstance.tsx";
import RenderOrderItemSModal from "../components/Orders/RenderOrderItemsModal.tsx";
//PARTIALS
import HeaderNav from "../components/Partials/HeaderNav";
import ModalConfirmation from "../components/Partials/modalConfirmation.tsx";
//SVG
import { Check_White_Icon } from '../assets/index.ts';
//DB
import { useUser } from "../context/UserContext";
//3RD PARTY
import { toast } from "sonner";

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

export default function Order() 
{
    const { userOrders, getUserOrders, deleteOrderGroup, setUserOrdersToBePaid, makeQrForProductTobePaid, checkIfOrderIsProcessed } = useUser();
    const navigate = useNavigate();
    //#region FETCH USER ORDERS 1ST MOUNT (If there are changes (inside code))
        useEffect(() => 
        {
            getUserOrders();
        }, []);
    //#endregion

    //#region DELETE WARNING MODAL
        //FOR MODAL
            const [displayWarningModal_Orders, setdisplayWarningModal_Orders] = useState(false);
            const [modalCloseButtonClicked_Orders, setmodalCloseButtonClicked_Orders] = useState(false);
            const [modalAgreeButonClicled_Orders, setmodalAgreeButonClicled_Orders] = useState(false);
            //PRODUCT CHOOSEN BY USER
            const [choosenOrderToBeDeleted, setChoosenOrderToBeDeleted] = useState<OrderGroups | null>(null);
            //USEEFFECT
                // When modal "Close" button is clicked → hide modal
                useEffect(() => 
                {
                    if (modalCloseButtonClicked_Orders) 
                    {
                        setdisplayWarningModal_Orders(false); // close modal
                        setmodalCloseButtonClicked_Orders(false); // reset flag
                        setChoosenOrderToBeDeleted(null); //reset data to be deleted
                    }
                }, [modalCloseButtonClicked_Orders]);
                //WHEN MODAL AGREE (DELETE) IS CLICKED
                useEffect(() => 
                {
                    if(!modalAgreeButonClicled_Orders) return;
                    if(!choosenOrderToBeDeleted) return;
    
                    const onDelete = async () => 
                    {
                        try
                        {
                            deleteOrderGroup(choosenOrderToBeDeleted.id);
                        }
                        catch(err)
                        {
                            console.error("Error deleting user cart:", err);
                        }
                    };

                    onDelete();
                    
                    setChoosenOrderToBeDeleted(null);
                    setdisplayWarningModal_Orders(false); // close modal
                    setmodalAgreeButonClicled_Orders(false); //RESET AGREE MODAL CLICKED
                }, [modalAgreeButonClicled_Orders]);
    //#endregion
    
    //#region USER_ITEMS DISPLAY
        //IF ANY OF THE DIV INSTANCES IS CLICKED
        const [displayUserItemsModal, setDisplayUserItemsModal] = useState(false);
        const [closeUserItemsModalPressed, setCloseUserItemsModalPressed] = useState(false);
        //THE DATA OF THE CLICKED DIV
        const [userItemsClickedData, setuserItemsClickedData] = useState<OrderGroups | null>(null);

        //IF MODAL CLOSED
            useEffect(() => 
            {
                if (!closeUserItemsModalPressed) return;

                //HIDE THE USER ITEM POPUP
                setDisplayUserItemsModal(false);
                //RESET MODAL X PRESSED 
                setCloseUserItemsModalPressed(false);
                //RESET THE CHOOSEN USER ORDER
                setuserItemsClickedData(null);
            }, [closeUserItemsModalPressed]);

        //IF THE MODAL FOOTER BUTTON IS PRESSED (THE USER WILL NOW PAY)
        const [userItemsModalFooterButtonPressed, setUserItemsModalFooterButtonPressed] = useState(false);

            //IF PAY IS PRESSED (FOOTER BUTTON MODAL) THE USER WILL GO TO (/store/orders/pay)
            useEffect(() => 
            {
                if (!userItemsModalFooterButtonPressed) return;
                if (!userItemsClickedData) return;
                
                //PASS THE SELECTED ORDER GROUP DATA TO USER CONTEXT SO I CAN ACCESS IT LATER
                setUserOrdersToBePaid(userItemsClickedData);
                //MAKE QR CODE
                makeQrForProductTobePaid(userItemsClickedData.id);
                //RESET THE PAY BUTTON CLICKED
                setUserItemsModalFooterButtonPressed(false);
                //GO TO ANOTHER PAGE (QR PAY)
                navigate("/store/orders/pay");
            }, [userItemsModalFooterButtonPressed]);

    //#endregion
    return(
        <div className="flex flex-col gap-3 bg-white py-[100px] min-h-screen px-3 font-montserrat">
            <HeaderNav title="My Orders" backRoute="/store" />

            {/* RENDER ORDERS */}
                {/* READ */} 
                {/* DELETE MODAL */} 
            <RenderOrderInstance userOrders={userOrders}
                setDeletePressed={setdisplayWarningModal_Orders} setCartIdPresed={setChoosenOrderToBeDeleted} 
                setDisplayUser_Items={setDisplayUserItemsModal} setuserItemsClickedData={setuserItemsClickedData}/>
            
            {/* DELETE CONFIRMATION MODAL */}
            {displayWarningModal_Orders && 
                (<ModalConfirmation 
                    title="Delete this order?" 
                    message={`Are you sure you want to delete this order with ${choosenOrderToBeDeleted?.order_items?.length}
                        ${choosenOrderToBeDeleted?.order_items?.length != null 
                            ? (choosenOrderToBeDeleted.order_items.length === 1 ? " item, " : " items, ")
                            : "Error"} a total of ₱${choosenOrderToBeDeleted?.total_amount ?? "Error"}` } 
                    buttonLabel="Delete Order"
                    onClose={setmodalCloseButtonClicked_Orders}
                    onConfirm={setmodalAgreeButonClicled_Orders}
                />)
            }


            {displayUserItemsModal && (
                <RenderOrderItemSModal onClose={setCloseUserItemsModalPressed}
                    userItemsClickedData={userItemsClickedData} 
                    setFooterButtonPressed={setUserItemsModalFooterButtonPressed}/>
            )}
            
        </div>
    );
}