import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//MAIN
import FeaturedProducts from "../components/Store/FeaturedProducts.tsx"
import Products from "../components/Store/Products.tsx"
//PARTIALS
import HeaderTopBar from "../components/Store/HeaderTopBar_Store.tsx"
import AddToCartPopUp from "../components/Store/SelectedProduct.tsx"
//SVG
import { ShoppingCart_Icon, GymBg } from '../assets/assets.ts';
//DB
import { useUser } from "../context/UserContext";
import { addToCart } from "../services/userCartService.tsx";




type addToCartPressed = 
{
    pressed?: boolean | null;
    productPressedID?: number | null;
}

export default function Store() 
{
    //#region SEARCH QUERY
        const [searchQuery, setSearchQuery] = useState<string>("");
    //#endregion

    //#region MODAL 
        //#region IF ANY PRODUCTS ARE PRESSED OPEN MODAL
            const [addToCartPressed, setAddToCartPressed] = useState<addToCartPressed>({});

            //IF ANY OF THE PRODUCTCS ARE PRESSED
            useEffect(() => 
            {
                //DISPLAY THE ADD TO CART POPUP
                setDisplayAddToCartPopup(true);
                
            }, [addToCartPressed.pressed]);
        //#endregion

        //#region HIDE ADD TO CART MODAL
            const [displayAddToCartPopup, setDisplayAddToCartPopup] = useState(false);
            const [closeAddToCartModalPressed, setCloseAddToCartModalPressed] = useState(false);

            //IF MODAL CLOSED
            useEffect(() => 
            {
                //HIDE THE ADD TO CART POPUP
                setDisplayAddToCartPopup(false);
                //RESET MODAL X PRESSED 
                setCloseAddToCartModalPressed(false);
                //RESET THE ID AND PRODUCT PRESSED
                setAddToCartPressed({});
            }, [closeAddToCartModalPressed]);
        //#endregion

        //#region MODAL PRESSABLES
            const navigate = useNavigate();
            // Add to cart footer button pressed
            const [AddToCartButtonPressed, setAddToCartButtonPressed] = useState<boolean>(false); 
            // Quantity Total of product to add to cart (FOOTER BUTTON MODAL QUANTITY)
            const [quantityTotal, setquantityTotal] = useState(1);

            //IF ADD TO CART IS PRESSED
            useEffect(() => 
            {
                if (!AddToCartButtonPressed) return;

                const onAdd = async () => 
                {
                    if(addToCartPressed.productPressedID)
                    {
                        await addItemToCart(addToCartPressed.productPressedID, quantityTotal, navigate);
                    }
                };
                onAdd();

                //HIDE THE ADD TO CART POPUP
                setCloseAddToCartModalPressed(true);
                setAddToCartButtonPressed(false);
            }, [AddToCartButtonPressed]);
        //#endregion
    //#endregion

    //#region FETCH STORE PRODUCTS (ON MOUNT)
        const { storeProducts, featuredProducts, fetchStoreProducts, addItemToCart } = useUser();
        useEffect(() => 
        {
            if(storeProducts.length === 0 && featuredProducts.length === 0)
            {
                fetchStoreProducts();
            }
        }, []);
    //#endregion

    return (
        <div 
            className="font-montserrat bg-black flex flex-col"
            style={{
                backgroundImage: `url(${GymBg})`,
                backgroundSize: "190%",
                backgroundPosition: "center 0%",
                }}
        > 

            {/* CART, ORDERS ICON, AND SEARCH BAR */}
            {!displayAddToCartPopup && (
                <HeaderTopBar searchQuery={setSearchQuery}/>
            )}
            
            {/* TOP SHIT */}
            <div className=" text-5xl font-bebas leading-tight relative h-[355px] flex flex-col justify-center items-center px-6 pb-20 mt-10 text-center">
                <h1 className=" text-white">SHOP NOW</h1>
                <h2 className="font-bold text-red-600 -mt-1">
                    LIFT BETTER
                </h2>
            </div>
            
            {/* MAIN BOTTOM SHIT */}
            <div className="relative bg-[#e7e2e7] rounded-t-[50px] -mt-12 w-full pb-[70px]">
                <h3 className="font-bold -mt-20 px-6 text-white mb-3">Featured Products</h3>
                {/* Featured Products */}
                <FeaturedProducts setAddToCartPressed={setAddToCartPressed}/>
                
                {/* Products Box */}
                <div className="px-1.5">
                    <div className="relative px-4 pb-[50px] py-3 mt-6 bg-white rounded-[20px]">
                        <h2 className="font-bold text-xl mt-3 mb-3 ">Products</h2>
                        {/* Products */}
                        <Products setAddToCartPressed={setAddToCartPressed} searchQuery={searchQuery}/>
                    </div>
                </div>
            </div>

            {/* DSIPALY ADD TO CART POPUP */}
            {displayAddToCartPopup && (
                <AddToCartPopUp footerButtonText="Add To Cart"
                setButtonPressed={setAddToCartButtonPressed} setquantityTotal={setquantityTotal}
                productPressedID={addToCartPressed.productPressedID} onClose={setCloseAddToCartModalPressed}/>
            )}
        </div>
    );
}
