import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps 
{
    // STARS
        /** Percentage of the calculated rating, eg(5, 4.5, 3), Only can display full or half star*/
        rating: number;

    // INTERACTIVE STAR
        interactive?: boolean;
        value?: number;                         // controlled value
        onChange?: (rating: number) => void;

    // PROGRESS BAR
        barValue?: number;      // current value
        barMax?: number;        // max value

    // PROPERTIES
        vertical?: boolean;     // If u want to vertically put the star and text or not 
        sizePxStar?: number;    // Size in px stars 
        sizePxText?: number;    // Size in px text
        includeText?: boolean;  // If u include text 
        textInput?: string;     // what text?
}

export default function StarRating({    
    rating, 
    interactive = false, value, onChange,
    barValue, barMax,
    vertical, sizePxText = 12, sizePxStar = 15, includeText = true, textInput }: StarRatingProps) 
{
     // IF STAR INTERACTIVE
        // Use controlled value if interactive
        const displayRating = interactive ? (value ?? 0) : rating;

    // PROGRESS BAR 
        const percentage = barMax ? (barValue ?? 0) / barMax * 100 : 0;

    return (
        <div className={vertical ? "flex flex-col gap-[3px]" : "flex items-center gap-2"}>
            
            {/* STAR */}
            <div 
                className={`flex text-[#FDB927] ${interactive ? "cursor-pointer" : ""}`}
                style={{ fontSize: `${sizePxStar}px` }}
            >
                {[1, 2, 3, 4, 5].map((i) => {
                    
                    const isFull = displayRating >= i;
                    const isHalf = displayRating >= i - 0.5;

                    const StarIcon = isFull
                        ? FaStar
                        : isHalf
                        ? FaStarHalfAlt
                        : FaRegStar;

                    return (
                        <span
                            key={i}
                            onClick={() => {
                                if (!interactive) return;
                                onChange?.(i); // return selected rating
                            }}
                        >
                            <StarIcon />
                        </span>
                    );
                })}
            </div>

            {/* PROGRESS BAR */}
            {barMax !== undefined && (
                <div className="flex items-center gap-2 flex-1 ml-3">
                    
                    <div className="w-[100px] h-[13px] bg-[#D9D9D9]  overflow-hidden">
                        <div
                            className="h-full bg-[#FDB927]"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <p className="text-[#434343] text-xs ml-1">
                        {barValue}
                    </p>
                </div>
            )}

            {includeText && (
                <p 
                    className="text-[#434343] font-semibold" 
                    style={{ fontSize: `${sizePxText}px` }}
                >
                    {textInput}
                </p>
            )}
            
        </div>  
    );
}