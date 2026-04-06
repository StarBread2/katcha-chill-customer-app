import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
//PARTIALS
import StarRating from "../../components/Partials/StarRating.tsx"
//DB
import { useUser } from "../../context/UserContext";
//SVG
import { ShoppingCart_Icon, ShoppingCart_Gray_Icon } from '../../assets/assets.ts';
import { p } from "framer-motion/client";
//

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
    const { storeProducts, reviewsData, fetchReviewsData } = useUser();

    //filteredProducts (Searched Products)
    const filteredProducts = storeProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //TEST
    // const reviews = await getProductReviews(productId);

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
                <div className="grid grid-cols-2 gap-3 gap-y-5">
                    {filteredProducts.map((product) => (
                    <div key={product.id} 
                        className={`bg-white rounded-xl active:scale-[0.98] transition`
                        }
                        onClick={() => setAddToCartPressed({
                            pressed: true,
                            productPressedID: product.id,
                        })}>
                        <div className="relative">
                            {/* FEATURED LABEL */}
                            {/* display red label if its featured or almost out 
                            and if the product.stock is <=0 then dont display it (dafault) */}
                            { product.stock > 0 && (product.stock < 10) &&
                                <div className='absolute p-1 px-2 -right-2 -top-1 bg-[#DE2B2D] text-white text-xs rounded-[10px] '>
                                    {product.stock <= 10 && "Almost Out"}
                                </div>
                            }

                            <img 
                                src={product.image_url} 
                                className="mx-auto rounded-[10px] w-full h-[170px] object-cover" 
                                alt={product.name} 
                            />

                            {/* OUT OF STOCK (ADD TO CART) */}
                            {product.stock > 0 ? (
                                <button 
                                    className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-[5px] flex justify-center active:scale-[0.98] transition"
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
                                <button className="absolute bottom-1 right-[6px] bg-white p-2 rounded-[5px] flex gap-3 border-[1px] border-[#434343] active:scale-[0.98] transition">
                                    <img 
                                        src={ShoppingCart_Gray_Icon} 
                                        alt="Store Icon" 
                                        className="w-[18px] h-[18px]" 
                                    />
                                    <p className='text-[#434343] text-xs font-semibold'>Out of stock</p>
                                </button>
                            )}
                                
                            
                        </div>

                        <p className="text-sm font-semibold text-[#434343] mt-2 mb-2">{product.name}</p>
                            {product.review_count !== 0 ? 
                                <StarRating rating={product?.average_rating ?? 0} vertical={true} includeText={true} textInput={`${product?.review_count ?? 0} ${(product?.review_count ?? 0) === 1 ? "review" : "reviews"}`}/>
                            :
                                <p className="text-xs text-[#434343] font-normal">
                                    No reviews yet
                                </p>
                            }
                            
                        <p className="text-base font-semibold text-black mt-1">
                            ₱ {product.price.toLocaleString()}
                        </p>
                    </div>
                    ))}
                </div>
            )}
            
        </div>
    );
}