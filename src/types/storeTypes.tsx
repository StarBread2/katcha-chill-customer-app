//SHOULD HAVE DONE THIS BEFORE TAE
// FOR STORE PRODUCTS
export type StoreProduct = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    featured: boolean;
};
export type OrderItems = {
    id: string;
    product: StoreProduct;
    quantity: number;
    total: number;
    unit_price: number;
};
export type OrderGroups = {
    created_at: string;
    id: string;
    order_items: OrderItems[];
    status: string;
    total_amount: number;
    updated_at: string;
    user_id: string;
    paid_on: string;
    payment_method: "gcash" | "cash";
};
export type OrderGroupsData = {
    order_groups: OrderGroups[];
};