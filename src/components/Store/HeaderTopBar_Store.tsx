import {  ShoppingCart_Black_Icon, Search_Icon, Orders_Icon } from '../../assets/assets.ts';

import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { createPortal } from "react-dom"; //FOR RENDERING IN DIV (Z-1) FOR NAVBARS

interface HeaderProps 
{
    searchQuery: (value: string) => void;
}

export default function HeaderTopBar({ searchQuery }: HeaderProps)
{

    //UNIVERSAL
        const navigate = useNavigate();

    // #region FOR TOP NAVBAR ANIM
        const [hidden, setHidden] = useState(false);
        const { scrollY } = useScroll();
    
        useMotionValueEvent(scrollY, "change", (latest) => {
            const previous = scrollY.getPrevious() ?? 0;
            if (latest > previous && latest > 200) setHidden(true);  // scroll down → hide
            else setHidden(false);                                  // scroll up → show
        });
    // #endregion FOR TOP NAVBAR ANIM

    return createPortal(
        <div className='relative z-20'>
            {/* 🔹 Top bar */}
            <div className="
                fixed top-[5%] left-[5%] w-[90%] z-50 flex justify-between items-center
                px-3 py-2 bg-black/70 text-white rounded-full"
            >
                {/* Search Bar */}
                <div className="flex items-center bg-white/10 backdrop-blur-sm w-[65%] px-1 py-1 rounded-full">
                    <div className="flex items-center gap-2 bg-white rounded-full w-[100%]">
                        <img src={Search_Icon} alt="Settings" className="w-[18px] h-[18px] ml-3" />
                        <input
                            type="text"
                            placeholder="Search Product"
                            className="w-[75%] py-[0.4rem] outline-none bg-transparent text-gray-700 "
                            onChange={(e) => searchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Shoppin Cart and Order Icon */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-1 py-1 rounded-full">
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center" 
                        onClick={() => navigate("/store/cart")}>
                        <img src={ShoppingCart_Black_Icon} alt="Settings" className="w-[18px] h-[18px] mr-[1px]" />
                    </div>
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center" 
                        onClick={() => navigate("/store/orders")}>
                        <img src={Orders_Icon} alt="Settings" className="w-[22px] h-[22px] " />
                    </div>
                </div>
            </div>
        </div>, document.body
    );
}


//<div className='relative z-20'>
//    {/* 🔹 Top bar */}
//    <motion.div
//        variants={{
//            visible: { y: 0 },
//            hidden: { y: -150 },
//        }}
//        animate={hidden ? "hidden" : "visible"}
//        transition={{ duration: 0.4, ease: "easeInOut" }}
//        className="fixed top-[5%] left-[5%] w-[90%] z-50 flex justify-between items-center
//                    px-3 py-2 bg-black/30 text-white rounded-full"
//    >
//        {/* Search Bar */}
//        <div className="flex items-center bg-white/10 backdrop-blur-sm w-[65%] px-1 py-1 rounded-full">
//            <div className="flex items-center gap-2 bg-white rounded-full w-[100%]">
//                <img src={Search_Icon} alt="Settings" className="w-[18px] h-[18px] ml-3" />
//                <input
//                    type="text"
//                    placeholder="Search Product"
//                    className="w-[75%] py-[0.4rem] outline-none bg-transparent text-gray-700 "
//                    onChange={(e) => searchQuery(e.target.value)}
//                />
//            </div>
//        </div>
//
//        {/* Shoppin Cart and Order Icon */}
//        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-1 py-1 rounded-full">
//            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center" 
//                onClick={() => navigate("/store/cart")}>
//                <img src={ShoppingCart_Black_Icon} alt="Settings" className="w-[18px] h-[18px] mr-[1px]" />
//            </div>
//            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center" 
//                onClick={() => navigate("/store/orders")}>
//                <img src={Orders_Icon} alt="Settings" className="w-[22px] h-[22px] " />
//            </div>
//        </div>
//
//    </motion.div>
//</div>