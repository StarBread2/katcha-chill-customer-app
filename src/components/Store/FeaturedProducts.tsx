import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

//SVG
import { ShoppingCart_Icon, ShoppingCart_Gray_Icon } from '../../assets/assets.ts';

//DB
import { useUser } from "../../context/UserContext";

//3RD PARTY
    //SWIPE
    import { Swiper, SwiperSlide } from "swiper/react";
    import { Pagination, Autoplay } from "swiper/modules";

type addToCartPressed = 
{
    pressed?: boolean | null;
    productPressedID?: number | null;
}

interface HeaderProps 
{
    setAddToCartPressed: Dispatch<SetStateAction<addToCartPressed>>; // React setter
}

export default function FeaturedProducts({ setAddToCartPressed }: HeaderProps)
{
    // FOR WHAT ACTIVE FEATURED PRODUCT
    const [active, setActive] = useState(0);

    //USER CONTEXT DATA (STORE DATA)
    const { featuredProducts } = useUser();

    return(
        <div>
            {featuredProducts.length === 0 ? (
                <div className="px-3">
                    <div className="flex items-center justify-center text-center bg-white rounded-[30px] h-[150px]">
                        <p className="w-[70%]">It seems there are no featured products for now.</p>
                    </div>
                </div>
            ):(
                <Swiper
                    modules={[Pagination, Autoplay]}
                    slidesPerView={1.2}
                    centeredSlides={true}
                    spaceBetween={5}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: true,
                    }}
                    pagination={{     
                        clickable: true,
                        dynamicBullets: true, }}
                    onSlideChange={(swiper) => setActive(swiper.realIndex)}
                    className="mySwiper w-full pb-8"
                >
                    {featuredProducts.map((p, index) => {
                        const isActive = index === active;

                        return (
                            <SwiperSlide key={p.id}>
                                <div
                                    className={`
                                        bg-white rounded-[30px] w-full mx-auto transition-all duration-300
                                        ${isActive ? "scale-100" : "scale-90"}
                                    `}
                                    onClick={() => setAddToCartPressed({
                                        pressed: true,
                                        productPressedID: p.id,
                                    })}
                                >
                                    <div className="relative">
                                        <img
                                            src={p.image_url}
                                            alt={p.name}
                                            className="w-full h-[130px] object-cover rounded-t-[30px]"
                                        />

                                        {p.stock > 0 ? (
                                            <button 
                                            className="ml-4 absolute rounded-[20px] -mt-6 px-7 py-[10px] bg-black text-white flex items-center justify-center gap-2 text-xs"
                                                onClick={() => setAddToCartPressed({
                                                        pressed: true,
                                                        productPressedID: p.id,
                                                    })}
                                                >
                                                <img src={ShoppingCart_Icon} className="w-[14px] h-[15px]" />
                                                Add to Cart
                                            </button>
                                        ):(
                                            <button className="ml-4 absolute rounded-[20px] -mt-6 px-7 py-[10px] bg-white flex items-center justify-center gap-2 text-xs border-[1px] border-[#434343]">
                                                <img src={ShoppingCart_Gray_Icon} className="w-[14px] h-[15px]" />
                                                <p className='text-[#434343] text-xs font-semibold'>Out of stock</p>
                                            </button>
                                        )}
                                        

                                        <div className={`px-4 pr-5 mt-6 flex flex-col justify-between h-full ${p.stock > 0 ? "text-black": "text-[#434343]"}`}>
                                            <p className="font-semibold leading-4 w-[95%]">{p.name}</p>
                                            <p className="text-lg font-bold mt-3 mb-2 text-right">
                                                ₱ {p.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}
            

        </div>
    );
}