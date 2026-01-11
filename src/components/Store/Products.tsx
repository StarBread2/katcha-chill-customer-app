import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

//DB
import { useUser } from "../../context/UserContext";

//SVG
import { ShoppingCart_Icon, ShoppingCart_Gray_Icon } from '../../assets/assets.ts';
import { div } from "framer-motion/client";

type addToCartPressed = 
{
    pressed?: boolean | null;
    productPressedID?: number | null;
}

interface HeaderProps 
{
    setAddToCartPressed: Dispatch<SetStateAction<addToCartPressed>>; // React setter
    //SEARCH QUERRY PASSED
    searchQuery: string;
}

export default function Products({ setAddToCartPressed, searchQuery }: HeaderProps)
{
    //USER CONTEXT DATA (STORED Store DATA)
    const { storeProducts } = useUser();

    //filteredProducts (Searched Products)
    const filteredProducts = storeProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(
        <div>
            {storeProducts.length === 0 ? (
                <div className="px-3">
                    <div className="flex items-center justify-center text-center bg-white rounded-[30px] h-[150px]">
                        <p className="w-[70%]">No products? thats weird</p>
                        <p className="w-[70%]">- Insert sus megamind image</p>
                    </div>
                </div>
            ): filteredProducts.length === 0 ? (
                <div className="px-3">
                    <div className="flex items-center justify-center text-center bg-white rounded-[30px] h-[150px]">
                        <p className="w-[70%]">No product exist that starts with that name</p>
                    </div>
                </div>
            ):(
                <div className="grid grid-cols-2 gap-2">
                    {filteredProducts.map((product) => (
                    // If product stock <= 0 then border == gray
                    // if featured then red otherwise black (default)
                    <div key={product.id} 
                        className={`bg-white p-2 rounded-xl border 
                            ${product.stock <= 0 ? "border-gray-400" : 
                            product.featured ? "border-[#DE2B2D]" : "border-black"} `
                        }
                        onClick={() => setAddToCartPressed({
                            pressed: true,
                            productPressedID: product.id,
                        })}>
                        <div className="relative">
                            {/* FEATURED LABEL */}
                            {/* display red label if its featured or almost out 
                            and if the product.stock is <=0 then dont display it (dafault) */}
                            { product.stock > 0 && (product.stock < 10 || product.featured) &&
                                <div className='absolute p-1 px-2 -right-4 -top-4 bg-[#DE2B2D] text-white text-xs rounded-[10px] '>
                                    {product.stock <= 10 ? "Almost Out" : "Featured"}
                                </div>
                            }

                            <img 
                                src={product.image_url} 
                                className="mx-auto rounded-[10px] w-full h-[120px] object-cover" 
                                alt={product.name} 
                            />

                            {/* OUT OF STOCK (ADD TO CART) */}
                            {product.stock > 0 ? (
                                <button 
                                    className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-[5px] flex justify-center"
                                    onClick={() => setAddToCartPressed({
                                            pressed: true,
                                            productPressedID: product.id,
                                        })}>
                                <img 
                                    src={ShoppingCart_Icon} 
                                    alt="Store Icon" 
                                    className="w-[18px] h-[18px]" 
                                />
                                </button>
                            ):(
                                <button className="absolute bottom-1 right-[6px] bg-white p-2 rounded-[5px] flex gap-3 border-[1px] border-[#434343]">
                                    <img 
                                        src={ShoppingCart_Gray_Icon} 
                                        alt="Store Icon" 
                                        className="w-[18px] h-[18px]" 
                                    />
                                    <p className='text-[#434343] text-xs font-semibold'>Out of stock</p>
                                </button>
                            )}
                                
                            
                        </div>

                        <p className="text-xs text-black mt-2">{product.name}</p>
                        <p className="text-xs font-bold text-black mt-1">
                            ₱ {product.price.toLocaleString()}
                        </p>
                    </div>
                    ))}
                </div>
            )}
            
        </div>
    );
}