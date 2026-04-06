export type UserReviewStatus = 
{
    state: "REVIEWED" | "PURCHASED" | "NOT_PURCHASED",
    product_id: number,
    order_item_id: number
};

export type ProductReviews = 
{
    id: number;              

    user_id: number;        
    product_id: number;     
    order_item_id: number;  

    rating: number;        
    review_text: string;

    created_at: string;     
    updated_at: string;    
    
    profiles?: {
        full_name: string;
    };
};