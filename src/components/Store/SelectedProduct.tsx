
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown } from "react-icons/fa";
//NPM
import { Filter } from "bad-words";
//PARTIALS
import HeaderNav from "../Partials/HeaderNav.tsx";
import StarRating from "../Partials/StarRating.tsx"
import FooterButton from "../Partials/FooterButton.tsx"
import ModalConfirmation from "../Partials/modalConfirmation.tsx";
//SVG
import { Close_Icon } from "../../assets/assets.ts";
import { FaCircle } from "react-icons/fa";
//DB
import { useUser } from "../../context/UserContext.tsx";
//CSS TRANSITION
import PageTransition from "../Transitions/PageTransition.tsx";
import { body, div } from "framer-motion/client";




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
    average_rating: number;
    review_count: number;

    rating_1_count: number;
    rating_2_count: number;
    rating_3_count: number;
    rating_4_count: number;
    rating_5_count: number;
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
        const { getStoreProductById, storeProducts } = useUser();
        //THE PRODUCT ITSELF
        const [product, setproduct] = useState<StoreProduct | null>();
        //IF THERE IS A PRODUCTPRESSEDID THEN GET THE PRODUCT BY ID
        useEffect(() => 
        {
            if (productPressedID != null) 
            {
                setproduct(getStoreProductById(productPressedID));
            }
        }, [productPressedID, storeProducts]);
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

    //#region REVIEW FEATURES
        // INDIVIDUAL STAR RATING (Max count reference for the star bar)
        const barMax = product?.review_count ?? 0;

        //#region SHOW REVIEW FORM
            // REVIEW FORM
                const {checkIfUserCanReview, setuserReviewStatus, createReview} = useUser();
                const [showReviewForm, setShowReviewForm] = useState(false);    // SHOW OR HIDE REVIEW FORM
                const [userRating, setUserRating] = useState(0);                // USER STAR RATING
                const [reviewContent, setReviewContent] = useState("");         // USER REVIEW TEXT
                // CHECK IF USER CAN REVIEW THE PRODUCT OR NOT (checkIfUserCanReview (optimized btw if same product id it doesnt go to db))
                const handleReviewClick = async () => 
                {
                    if (!productPressedID) return;

                    if(showReviewForm)
                    {
                        setShowReviewForm(false);
                        return;
                    }

                    const status = await checkIfUserCanReview(productPressedID);
                    // console.log(status)

                    if (!status || status.state === "NOT_PURCHASED") {
                        setModalTitle("Cannot Write Review");
                        setModalMessage("You must purchase this product before writing a review.");
                        setShowReviewModal(true);
                        return;
                    }

                    // 2. Already reviewed
                    if (status.state === "REVIEWED") {
                        setModalTitle("Already Reviewed");
                        setModalMessage("You have already submitted a review for this product.");
                        setShowReviewModal(true);
                        return;
                    }

                    // 3. Allowed to review (PURCHASED)
                    if (status.state === "PURCHASED") {
                        setShowReviewForm(true);
                    }
                };

            // FORM VERIFICATIONS
                const [ratingError, setRatingError] = useState(false);          // IF USER HAVENT RATED YET
                const [reviewError, setReviewError] = useState(false);          // IF USER HAVENT WRITTEN THEIR REVIEW YET
                const [submitReview, setSubmitReview] = useState(false);        // SUBMIT REVIEW
                
                // useEffect(() => {
                //     if (productPressedID == null) return;

                //     const updated = getStoreProductById(productPressedID);
                //     setproduct(updated);
                // }, [storeProducts, productPressedID]);

                // CHECK IF USER HAS COMPLETED THE FORM, IF NOT THROW AN ERROR
                // ADDITIONALLY SEND REVIEWW TO DB IF SUCCESSFUL
                const handleSubmitReview = async () => 
                {
                    if(!productPressedID) return;

                    let ratingErr = false;
                    let reviewErr = false;

                    // validate rating
                    if (userRating < 1 || userRating > 5) {
                        ratingErr = true;
                        setRatingError(true);
                    } else {
                        setRatingError(false);
                    }

                    // validate review text
                    if (!reviewContent.trim()) {
                        reviewErr = true;
                        setReviewError(true);
                    } else {
                        setReviewError(false);
                    }

                    // show modal based on validation
                    if (ratingErr && reviewErr) {
                        setModalTitle("Incomplete Review");
                        setModalMessage("Please select a rating and write a review.");
                        setShowReviewModal(true);
                        return;
                    }

                    if (ratingErr) {
                        setModalTitle("Missing Rating");
                        setModalMessage("Please select a rating (1–5 stars).");
                        setShowReviewModal(true);
                        return;
                    }

                    if (reviewErr) {
                        setModalTitle("Empty Review");
                        setModalMessage("Please write something in your review.");
                        setShowReviewModal(true);
                        return;
                    }
                    
                    // success case
                    setShowReviewForm(false);
                    // GET ORDER ITEM ID HEHEH kapoy
                    const status = await checkIfUserCanReview(productPressedID, true);
                    console.log(status)
                    if (!status) 
                    {
                        console.log('ERROR');
                        return;
                    }

                    // ALSO RECHECKS IF USER CAN REVIEW AGAIN (IT WILL FETCH IN DB TOO)
                    await createReview({
                        product_id: productPressedID,
                        order_item_id: status.order_item_id,
                        rating: userRating,
                        review_text: cleanReviewText
                    });

                    // TURN VALUES TO DEFAULT AFTER createReview
                    setUserRating(0);
                    setReviewContent("");
                };

            // FORM MODALS CONFIRMATION
            const [showReviewModal, setShowReviewModal] = useState(false);
            const [modalTitle, setModalTitle] = useState("");
            const [modalMessage, setModalMessage] = useState("");

            
        //#endregion

        // USER REVIEWS
            // DROPDOWN (SORT REVIEWS)
            const [open, setOpen] = useState(false);
            const [selected, setSelected] = useState("Highest Rating");

            const handleSelect = (value: string) => {
                setSelected(value);
                setOpen(false);
            };

            //#region  FETCH USER REVIEWS after dock and sort based on dropdown
                const { fetchReviewsData, reviewsData } = useUser();

                useEffect(() => 
                {
                    if (productPressedID == null) return;

                    fetchReviewsData(productPressedID);

                }, [productPressedID]);

                // SORT reviewsData depending on dropdown
                const sortedReviews = [...(reviewsData ?? [])].sort((a, b) => {
                    switch (selected) {
                        case "Highest Rating":
                            return (b.rating ?? 0) - (a.rating ?? 0);

                        case "Lowest Rating":
                            return (a.rating ?? 0) - (b.rating ?? 0);

                        case "Oldest":
                            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

                        case "Most Recent":
                        default:
                            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    }
                });
            //#endregion
        
        //Input Santitation (Remove bad words) 
        const profanityFilter = new Filter();
        const cleanReviewText = profanityFilter.clean(reviewContent);
    // #endregion

    return createPortal(
        <div className="fixed inset-0 flex justify-center font-montserrat">
            {/* POPUP CONTAINER */}
            <PageTransition type="fade"> {/* animation wrapper */}
                <div 
                    className="bg-white w-full px-5 h-[100vh] overflow-y-auto font-montserrat"
                    onClick={(e) => e.stopPropagation()} > {/* PREVENT SCROLLIONG*/}
                    {/* Close button */}
                    {/* ALSO RESET THE REVIEW STATUS OF THE USER (fixes: what if user buy product and go back here (due to optimization it will not update)) */}
                    <HeaderNav title="Selected Product" showBackButton={true} onBack={() => 
                    {
                        setuserReviewStatus(null);
                        onClose?.(true)
                    } }/>

                    {/* MAIN */}
                    <div className="flex flex-col justify-center gap-4 mt-[110px] mb-[200px]">
                        {/* IMAGE & TITLE */}
                        <div className="w-[100%] h-[360px] overflow-hidden rounded-[10px] ">
                            <img
                                src={product?.image_url}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* PRODUCT NAME AND SHII */}
                        <div>
                            <h2 className="text-2xl font-semibold break-words w-[85%]">
                                {product?.name}
                            </h2>
                            
                            <p className="text-base font-medium break-words w-[85%] my-2">
                                ₱{product?.price}
                            </p>
                            {product?.review_count !== 0 ? 
                                <StarRating rating={product?.average_rating ?? 0} vertical={false} sizePxStar={18} includeText={true} textInput={`${product?.review_count ?? 0} ${product?.review_count ?? 0 ? "review" : "reviews"}`}/>
                            :
                                <p className="text-xs text-[#434343] font-normal">
                                    No reviews yet
                                </p>
                            }               
                            

                            <p className="ml-1 text-xs mt-2 w-[85%] break-words flex items-center gap-2">
                                <FaCircle className="text-green-600 text-[10px]" />
                                <span className="text-[#434343]">
                                    Stock Remaining: {product?.stock ?? 0}
                                </span>
                            </p>
                        </div>

                        {/* DETAILS */}
                        <div className="flex flex-col mx-auto w-[96%] mt-[30px]">
                            <h3 className="font-bold mb-2">Description</h3>
                            <p className="text-sm text-gray-600 text-justify">
                                {product?.description}
                            </p>
                        </div>

                        {/* CUSTOMER REVIEWS */}
                        <div className="flex flex-col items-center mt-[50px]">
                            {/* HEADER */}
                            <p className="font-bold text-base">
                                Customer Reviews
                            </p>

                            {/* OVERALL STAR RATING */}
                            {product?.review_count !== 0 ? 
                                <div className="flex flex-col items-center mt-4 mb-5 "> 
                                    <StarRating rating={product?.average_rating ?? 0} vertical={false} sizePxText={14} sizePxStar={20} includeText={true} textInput={`${(product?.average_rating ?? 0).toFixed(2)} out of ${product?.review_count ?? 0}`}/>
                                    <p className="text-[#434343] font-semibold text-xs mt-[3px]">
                                        {`Based on ${product?.review_count ?? 0} ${(product?.review_count ?? 0) === 1 ? "review" : "reviews"}`}
                                    </p>
                                </div>
                            :
                                <div className="flex flex-col items-center mb-5 mt-4">
                                    <p className="text-[#434343] font-semibold text-xs mt-[3px]">
                                        No reviews yet
                                    </p>
                                </div>
                            }
                            
                            {/* INDIVIDUAL STAR RATING */}
                            <div className="flex flex-col w-[70%] gap-[1px]">
                                <StarRating rating={5} vertical={false} sizePxStar={18} barMax={barMax} barValue={product?.rating_5_count ?? 0} />
                                <StarRating rating={4} vertical={false} sizePxStar={18} barMax={barMax} barValue={product?.rating_4_count ?? 0} />
                                <StarRating rating={3} vertical={false} sizePxStar={18} barMax={barMax} barValue={product?.rating_3_count ?? 0} />
                                <StarRating rating={2} vertical={false} sizePxStar={18} barMax={barMax} barValue={product?.rating_2_count ?? 0} />
                                <StarRating rating={1} vertical={false} sizePxStar={18} barMax={barMax} barValue={product?.rating_1_count ?? 0} />
                            </div>
                            
                            {/* WRITE A REVIEW BUTTON */}
                            <button 
                                onClick={() => handleReviewClick()}
                                className={`mt-6 w-[100%] bg-[#FDB927] text-[#FFFFFF] font-semibold text-base py-[10px] rounded-[6px] flex items-center justify-center gap-2 active:scale-[0.98] transition`}
                            >
                                {showReviewForm ? "Cancel Review" : "Write a Review"}
                            </button>
                            
                            {/* USER REVIEW FORM */}
                            <div
                                className={`
                                    w-full overflow-hidden transition-all duration-300 ease-in-out transform
                                    ${showReviewForm 
                                        ? "max-h-[500px] opacity-100 translate-y-0" 
                                        : "max-h-0 opacity-0 -translate-y-2"}
                                `}
                            >
                                <div className="flex flex-col items-center my-[50px] w-full">
                                    {/* Title */}
                                    <p className="font-semibold text-base text-center mb-5">
                                        Write a review
                                    </p>

                                    {/* STAR RATING */}
                                    <p className="font-normal text-sm text-center mb-3">
                                        Rating
                                    </p>
                                    <StarRating rating={0} sizePxStar={30} interactive value={userRating} onChange={(val) => setUserRating(val)} />

                                    {/* Review Content */}
                                    <div className="mt-[40px] w-full">
                                        <p className="text-sm mb-1 text-center">Review content</p>
                                        <textarea
                                            placeholder="Start writing here..."
                                            value={reviewContent}
                                            onChange={(e) => setReviewContent(e.target.value)}
                                            className="w-full border border-gray-300 px-3 py-2 text-sm h-[120px] resize-none outline-none"
                                        />
                                    </div>
                                    
                                    {/* Submit Review */}
                                    <button 
                                        onClick={handleSubmitReview}
                                        className={`mt-6 w-[60%] bg-[#FDB927] text-[#FFFFFF] font-semibold text-base py-[10px] rounded-[6px] flex items-center justify-center gap-2 active:scale-[0.98] transition`}
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                            
                            {/* DROPDOWN AND USER REVIEWS */}
                            {reviewsData && reviewsData.length > 0 ?
                            (
                                <div className="w-[96%]">
                                    {/* DROPDOWN BUTTON (SORT REVIEWS)*/}
                                    <div className="relative w-full mt-[50px] mb-5 z-10">
                                        {/* Button */}
                                        <button
                                            onClick={() => setOpen(!open)}
                                            className="flex items-center gap-2 text-[#FDB927] font-semibold active:scale-[0.98] transition"
                                        >
                                            <span>{selected}</span>
                                            <FaChevronDown
                                                className={`text-sm transition ${
                                                    open ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>

                                        {/* Dropdown*/}
                                        {open && (
                                            <div className="absolute text-sm mt-2 w-40 bg-white border rounded-md shadow-md">
                                                <button 
                                                    onClick={() => handleSelect("Highest Rating")}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 active:scale-[0.98] transition"
                                                >
                                                    Highest Rating
                                                </button>
                                                <button 
                                                    onClick={() => handleSelect("Lowest Rating")}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 active:scale-[0.98] transition"
                                                >
                                                    Lowest Rating
                                                </button>
                                                <button 
                                                    onClick={() => handleSelect("Most Recent")}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 active:scale-[0.98] transition"
                                                >
                                                    Most Recent
                                                </button>
                                                <button 
                                                    onClick={() => handleSelect("Oldest")}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 active:scale-[0.98] transition"
                                                >
                                                    Oldest
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* CUSTOMER REVIEW CHATS */}
                                    <div className="w-[98%]">
                                        {sortedReviews.map((review) => {
                                            const fullName = review.profiles?.full_name ?? "";

                                            // get first 2 initials: "Mike Rasell C. Dago-oc" -> "M. R."
                                            const initials = fullName
                                                .split(" ")
                                                .filter(Boolean)
                                                .slice(0, 2)
                                                .map(name => name[0].toUpperCase())
                                                .join(". ");

                                            // avatar letter (first name only)
                                            const avatarLetter = fullName?.[0]?.toUpperCase() ?? "?";

                                            // format date
                                            const date = new Date(review.created_at).toLocaleDateString("en-US");

                                            return(
                                                <div key={review.id} className="mb-[45px]">
                                                    {/* STAR AND DATE */}
                                                    <div className="flex justify-between items-center mb-3">
                                                        <StarRating rating={review.rating ?? 0}/>

                                                        <p className="text-xs text-[#434343]">
                                                            {date}
                                                        </p>
                                                    </div>

                                                    {/* AVATAR AND NAME */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {/* Avatar */}
                                                        <div className="flex-shrink-0 aspect-square font-bebas w-10 h-10 bg-black rounded-full flex items-center justify-center text-2xl font-semibold text-white">
                                                            <span className="translate-y-[2px]">
                                                                {avatarLetter}
                                                            </span>
                                                        </div>

                                                        {/* Name */}
                                                        <p className="font-semibold text-[#434343]">
                                                            {initials}
                                                        </p>
                                                    </div>
                                                    {/* REVIEW TEXT */}
                                                    <p className="text-sm text-[#434343] leading-relaxed text-justify">
                                                        {review.review_text}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-[96%] mt-[50px]">
                                    <p className="text-[#434343] text-center font-semibold text-sm mt-[3px]">
                                        Make the first review
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {product && (
                        <FooterButton label={footerButtonText} 
                            onReturnBool={setButtonPressed} 
                            canPress={product.stock > 0 && (!cantChangeIfQuantityIsSame || quantityTotal !== currentValueQuantity)}
                            setquantityTotal={setquantityTotal} currentValueQuantity={currentValueQuantity}
                            renderAmount={true}  canChangeQuantity={!!product && product.stock > 0} defaultQuantityValue={1} maxQuantityValue={Math.min(product.stock, 10)}  price={product?.price}/>
                    )}

                    {showReviewModal && (
                        <ModalConfirmation
                            title={modalTitle}
                            message={modalMessage}
                            buttonLabel="OK"
                            onClose={() => setShowReviewModal(false)}
                            onConfirm={() => setShowReviewModal(false)}
                        />
                    )}
                </div>
            </PageTransition>
        </div>, document.body
    );
}
