import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabaseClient";
//AUTHPROVIDER
import { useAuth } from "../auth/AuthProvider";
//SERVICES
import { getPendingPurchaseByUser } from "../services/purchaseService";
import { getPendingAttendanceByUser, checkIfUserHaveCheckedInForTheDay } from "../services/attendanceService";
import { startPurchaseListener, startAttendanceApprovalListener } from "../services/supabaseRealtimeServices";
import { getUserPackages } from "../services/userPackageService";
import { getUserProfile, checkOutUser as checkOutUserService } from "../services/profileService";
import { getCreditPackages } from "../services/packageService";
import { getStoreItems, getStoreItemById } from "../services/storeProductsService";
import { addToCart, getUserCart, getUserCartWithProducts, deleteCartItem as deleteCartItemService, updateCartItemQuantity as updateCartItemQuantityService } from "../services/userCartService";
import { checkOutCart } from "../services/checkOutCartServiceRPC";
import { getUserOrders as getUserOrdersService } from "../services/orderGroupsAndItemsRPC";
import { deleteOrderGroup as deleteOrderGroupService, waitForOrderCompletion, stopWatchingOrder} from "../services/orderGroupsService";
import { getProductReviews, checkIfUserCanReview as checkIfUserCanReview_rpc, createProductReview } from "../services/reviewsServices.tsx";
//SVG
import { GymCoin_Colored } from '../assets/assets.ts';
//3RD PARTY SHITS
import QRCode from "qrcode";
import { toast } from "sonner";
//TYPES
    //FOR STORE TYPES
    import type { OrderGroupsData, OrderGroups, OrderItems, StoreProduct } from '../types/storeTypes.tsx';
    //FOR REVIEW TYPES
    import type { UserReviewStatus, ProductReviews } from '../types/reviewTypes.tsx';


type CheckInResult = 
{
    checkedInForTheDay: boolean;
    checkInTime: string | null; // human readable string
    count: number;               // how many approved check-ins for today
    timeSpent: string | null;    // human readable duration (e.g. "1 hour and 30 minutes")
};
type RealTimeListeners = 
{
    attendanceListener: boolean; //OR CHECK IN
    creditPackageListener: boolean;
};
type UserProfile = 
{
    id?: string;
    avatar_url?: string | null;
    role: string;
    checked_in: boolean;
    full_name: string;
    credits_balance: number;
    created_at: string;
    updated_at: string;

    //other addition
    //IF HAVE CHECKED IN FOR THE DAY
    CheckInResult?: CheckInResult | null;

    //CHECK ACTIVE LISTENERS
    RealTimeListeners?: RealTimeListeners| null
};
type UserContextType = 
{
    user: any | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    qrDataUrl?: string | null;
    qrDataUrl_WName?: string | null;
    refreshQr: () => Promise<void>;
    packages: CreditPackage[];
    refreshPackages: () => Promise<void>;

    //manually start scanning for credit_purchases if worker approves it
    watchPendingPurchase: () => Promise<any | null>;
    //manually stop scanning for credit_purchases
    stopPurchaseListener: () => void;

    //manually start scanning for attendance if worker approves it
    watchPendingAttendance: () => Promise<any | null>;
    //manually stop scanning for attendance
    stopAttendanceListener: () => void;

    //Get User packages and refresher
    userPackages: UserPackage[];
    refreshUserPackages: () => Promise<void>;

    //CHECK OUT CURRENTLY LOGGED IN USER
    checkOutUser: () => Promise<any | null>;

    //STORE PRODUCT
    storeProducts: StoreProduct[];
    featuredProducts: StoreProduct[];
    fetchStoreProducts: () => Promise<any | null>;
    getStoreProductById: (productId: number) => StoreProduct | null;

    //CART INSIDE
    cart: UserCart[];
    cartGrandTotal: number;
    //ADD TO CART FUNCTION
    addItemToCart: (productId: number, quantity: number, navigate: (path: string) => void) => Promise<any | null>;
    fetchUserCartWithProducts: () => Promise<any | null>
    deleteCartItem: (cart_id: number) => Promise<any | null>
    updateCartItemQuantity: (cart_id: number, quantity: number) => Promise<any | null>
    //USER CART -> CHECKOUT
    checkOutUserCart: (user_id: string) => Promise<any | null>
    //USER_ITEMS AND USER ORDERS
        //GET USER ORDERS
        userOrders: OrderGroupsData | null;
        getUserOrders: () => Promise<any | null>
        //USER ITEMS
            //DELETE
            deleteOrderGroup: (order_id: string) => Promise<any | null>

    // ORDER ROW TO BE PAID (SINGLE ROW)
    userOrdersToBePaid: OrderGroups | null;
    setUserOrdersToBePaid: React.Dispatch<React.SetStateAction<OrderGroups | null>>;
    //QR FOR PRODUCT TO BE PAID
        qrDataUrl_ProductToBePaid?: string | null;
        //CREATE AND DELETE QR
            makeQrForProductTobePaid: (order_id: string) => Promise<any | null>;
            clearQrForProductTobePaid: () => void;

    // REALTIME CHECKER FOR ORDERS (listener)
        //REALTIME CHECK IF ORDER IS PAID
        checkIfOrderIsProcessed: (order_id: string) => Promise<any | null>;
        // STOP THE REALTIME LISTENER
        stopWatchingOrderIsProcessed: () => void;

    //PRODUCT REVIEWS
        reviewsData: ProductReviews[];
        fetchReviewsData: (productId: number) => Promise<any | null>;

        // TURNING REVIEW TO NULL (OUTSIDE) SO THAT IT WILL REFETCH DATA IN DB
        setuserReviewStatus: React.Dispatch<React.SetStateAction<UserReviewStatus | null>>;
        checkIfUserCanReview: (productId: number, forceFetch?: boolean) => Promise<UserReviewStatus | null>;
        createReview: (data: {
            product_id: number;
            order_item_id: number;
            rating: number;
            review_text: string;
        }) => Promise<any | null>;
};


// // FOR CREDIT PACKAGES
type CreditPackage = {
    package_id: string;
    name: string;
    coins: number;
    expiration?: string | null;
    description?: string | null;
    price?: number | null;
    stackable: boolean;
};
// FOR USER PACKAGES
type UserPackage = {
    user_package_id: number;
    user_id: string;
    package_id: string;
    expiration_date: string;
    credits_remaining: number;
    status: "active" | "expired" | "used_up";
    purchased_at: string;
    transaction_id: number;
};
type UserCart = {
    cart_id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    created_at: string;
    product: StoreProduct| null;
    cartTotalAmount: number;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => 
{
    const { user } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // JSON DATA BROS
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    
    //FETCH EVERYTHING NEEDED BY THE USER
    const fetchProfile = async () => 
    {
        if (!user) 
        {
            setProfile(null);
            setLoading(false);
            return;
        }
            setLoading(true);
            try 
            {
                const data = await getUserProfile(user.id);
                const checkInStatus = await checkIfUserHaveCheckedInForTheDay(user.id);

                const formattedProfile: UserProfile = 
                {
                    id: user.id,
                    avatar_url: user.user_metadata.avatar_url,
                    role: data.role,
                    checked_in: data.checked_in,
                    full_name: data.full_name,
                    credits_balance: data.credits_balance,
                    created_at: data.created_at,
                    updated_at: data.updated_at,

                    // FOR CHECK IN
                    //checkedIn, checkInTime, count, timeSpent
                    CheckInResult: checkInStatus,
                };

                setProfile(formattedProfile);
            } 
            catch (err) 
            {
                console.error("Error fetching profile:", err);
                setProfile(null);
            } 
            finally 
            {
                setLoading(false);
            }
    };

    // Generate a QR data URL from a string and cache it in localStorage
    const generateQrWithLogo = async (text: string, name?: string, role?: string, size = 512): Promise<string | null> => 
    {
        try 
        {
            const hasText = Boolean(name);

            const paddingBottom = hasText ? 90 : 0;
            const canvas = document.createElement("canvas");

            canvas.width = size;
            canvas.height = size + paddingBottom;

            // QR canvas
            const qrCanvas = document.createElement("canvas");
            await QRCode.toCanvas(qrCanvas, text, {
            width: size,
            margin: 1,
            errorCorrectionLevel: "H",
            });

            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            // Background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw QR
            ctx.drawImage(qrCanvas, 0, 0);

            // Load logo
            const logo = new Image();
            logo.src = GymCoin_Colored;

            return new Promise<string | null>((resolve) => {
            logo.onload = () => {
                const logoSize = size * 0.22;
                const x = (size - logoSize) / 2;
                const y = (size - logoSize) / 2;

                // White rounded background
                ctx.beginPath();
                ctx.roundRect(x - 10, y - 10, logoSize + 20, logoSize + 20, 16);
                ctx.fillStyle = "white";
                ctx.fill();

                // Logo
                ctx.drawImage(logo, x, y, logoSize, logoSize);

                // ---- OPTIONAL TEXT ----
                if (hasText && name) {
                const centerX = size / 2;
                const baseY = size + 30;

                ctx.textAlign = "center";
                ctx.fillStyle = "#000";

                // Name
                ctx.font = "bold 20px Montserrat, sans-serif";
                ctx.fillText(name, centerX, baseY);

                // Role
                const roleLabel =
                    role === "admin"
                    ? "Katcha Chill Admin"
                    : "Katcha Chill Member";

                ctx.font = "16px Montserrat, sans-serif";
                ctx.fillText(roleLabel, centerX, baseY + 26);
                }

                resolve(canvas.toDataURL("image/png"));
            };

            logo.onerror = () => resolve(null);
            });
        } catch (err) 
        {
            console.error("QR generation error:", err);
            return null;
        }
    };

    // For in app use
    const [qrDataUrl, setqrDataUrl] = useState<string | null>(null);
    // For downloadble user qr
    const [qrDataUrl_WName, setQrDataUrl_WName] = useState<string | null>(null);

    const refreshQr = async () => 
    {
        if (!profile?.id) 
        {
            setqrDataUrl(null);
            return;
        }

        const key = `qr_${profile.id}`;
        // use cached version if available
        const cached = localStorage.getItem(key);

        if (cached) 
        {
            setqrDataUrl(cached);
            return;
        }

        const url = await generateQrWithLogo(profile.id);
        const url_wName = await generateQrWithLogo(profile.id, profile.full_name, profile.role);

        if (url) 
        {
            localStorage.setItem(key, url);
            setqrDataUrl(url);
        } 
        else 
        {
            setqrDataUrl(null);
        }

        if (url_wName)
        {
            setQrDataUrl_WName(url_wName);
        }
        else
        {
            setQrDataUrl_WName(null);
        }
    };

    //Get available credit packages
    const fetchPackages = async () => 
    {
        try 
        {
            const data = await getCreditPackages();
            setPackages(data);
        } 
        catch (err) {
            console.error("Error fetching credit packages:", err);
            setPackages([]);
        }
    };

    // Fetch profile when auth user changes
    useEffect(() => 
    {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Generate QR whenever profile is set/updated
    useEffect(() => 
    {
        if (!profile) 
        {
            setQrDataUrl_WName(null);
            return;
        }
        // try to use cached copy OR generate
        (async () => 
        {
            await refreshQr();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id]);

    // Get available credit packages(made by the gym) after user dock
    useEffect(() => 
    {
        if (user) fetchPackages();
    }, [user]);

    //#region credit_purchases
        //Do setPurchaseListener watch and stop of getting pending purchase listener (to be able to manually stop the listener)
        const [purchaseListener, setPurchaseListener] = useState<any>(null);
        // Start watching for pending purchases
        const watchPendingPurchase = async () => 
        {
            console.log("🟢 scanning for pending Purchases (watchPendingPurchase)");

            if (!user?.id) return;

            //CHECK IF USER HAS PENDING ORDERS
            const pending = await getPendingPurchaseByUser(user.id);
            if (!pending) {
                console.log("No pending purchase found.");
                return null;
            }

            console.log("There is a pending order (watchPendingPurchase)");

            // Wait for the purchase listener to complete
            const result = await startPurchaseListener(user.id, fetchProfile);
            return result; // return the updated purchase
        };
        // Stop watching manually for pending purchases
        const stopPurchaseListener = () => 
        {
            if (purchaseListener) 
            {
                supabase.removeChannel(purchaseListener);
                setPurchaseListener(null);
                console.log("🛑 Manually stopped watching pending purchases");
            } 
            else 
            {
                console.log("⚪ No active listener to stop");
            }
        };

        // if user log in and have an order, start listening
        useEffect(() => 
        {
            if (!user?.id) return;

            let channel: any = null;

            const setupListener = async () => 
            {
                const pending = await getPendingPurchaseByUser(user.id);
                if (pending) 
                {
                    // There’s a pending order — start listening for updates
                    channel = startPurchaseListener(user.id, fetchProfile);
                    setPurchaseListener(channel);
                    console.log("CREDIT_PURCHASES There is a pending order (useeffect)")
                }
                else
                {
                    console.log("There is no pending order (useeffect)")
                }
            };

            setupListener();

            return () => 
            {
                if (channel) supabase.removeChannel(channel);
            };
        }, [user?.id]);
        // If user logs out then stop scanning for pending purchases
        useEffect(() => 
        {
            if (!user) stopPurchaseListener();
        }, [user]);
    //#endregion

    //#region ATTENDANCE
        const [attendanceListener, setAttendanceListener] = useState<{ channel: any; promise: Promise<any> } | null>(null);
        // Start watching for pending attendance approvals
        const watchPendingAttendance = async () => 
        {
            console.log("🟢 scanning for pending Attendance (watchPendingAttendance)");
            if (!user?.id) return null;

            //CHECK IF THERE IS PENDING ATTENDANCE NOT YET APPROVE BY WORKER
            const pending = await getPendingAttendanceByUser(user.id);
            if (!pending) 
            {
                console.log("No pending attendance found.");
                return null;
            }

            console.log("There is a pending attendance (watchPendingAttendance)");

            //START THE REALTIME LISTENER FOR ATTENDANCE
            const { channel, promise } = startAttendanceApprovalListener(user.id, async (updatedRow) => 
            {
                try 
                {
                    await fetchProfile();
                } 
                catch (e) 
                {
                    console.error("Error refreshing profile after attendance approved:", e);
                }
            });

            //PREPARE THE CHANNEL TO BE STOP LATER
            setAttendanceListener({ channel, promise });

            try 
            {
                const updated = await promise;
                try { supabase.removeChannel(channel); } catch (e) {}
                setAttendanceListener(null);
                return updated;
            } 
            catch (err) 
            {
                console.error("Error in attendance promise:", err);
                try { supabase.removeChannel(channel); } catch (e) {}
                setAttendanceListener(null);
                return null;
            }
        };
        // Stop watching manually for pending attendance
        const stopAttendanceListener = () => 
        {
            if (attendanceListener?.channel) 
            {
                try 
                {
                    //STOP THE REALTIME CHANNEL
                    supabase.removeChannel(attendanceListener.channel);
                } 
                    catch (e) 
                {
                    console.warn("Failed to remove attendance listener channel:", e);
                }
                setAttendanceListener(null);
                console.log("🛑 Manually stopped watching attendance approvals");
            } 
            else 
            {
                console.log("⚪ No active attendance listener to stop");
            }
        };

        // auto-start attendance watcher if user logs in and has pending attendance
        useEffect(() => 
        {
            if (!user?.id) return;
            let createdObj: { channel: any; promise: Promise<any> } | null = null;

            const setupListener = async () => 
            {
                //CHECK IF THERE IS PENDING ATTENDANCE NOT YET APPROVED BY THE WORKER
                const pending = await getPendingAttendanceByUser(user.id);
                
                if (pending) 
                {
                    //START REALTIME LISTENER FOR WORKER APPROVAL
                    const obj = startAttendanceApprovalListener(user.id, fetchProfile);
                    //GET THE CHANNEL AND PROMISE
                    setAttendanceListener(obj);
                    createdObj = obj;
                    console.log("ATTENDANCE There is a pending attendance (useEffect)");

                    obj.promise.then(() => {
                            try { supabase.removeChannel(obj.channel); } catch (e) {}
                            setAttendanceListener(null);
                        })
                        .catch((e) => {
                            console.error("attendance listener promise rejected:", e);
                            try { supabase.removeChannel(obj.channel); } catch (e) {}
                            setAttendanceListener(null);
                        });
                } 
                else 
                {
                    console.log("There is no pending attendance (useEffect)");
                }
            };

            setupListener();

            //REMOVE CHANNEL
            return () => 
            {
                if (createdObj?.channel) supabase.removeChannel(createdObj.channel);
            };
        }, [user?.id]);

        // If user logs out then stop scanning for pending attendance
        useEffect(() => 
        {
            if (!user) stopAttendanceListener();
        }, [user]);
    //#endregion

    //#region user_packages
        const [userPackages, setUserPackages] = useState<UserPackage[]>([]);

        const fetchUserPackages = async () => 
        {
            if (!user?.id) return;
            // console.log("Fetching fetchUserPackages")
            try 
            {
                const data = await getUserPackages(user.id);
                setUserPackages(data);
            } 
            catch (err) 
            {
                console.error("Error fetching user packages:", err);
                setUserPackages([]);
            }
        };

        useEffect(() => 
        {
            if (user) fetchUserPackages();
        }, [user]);
    //#endregion

    //#region CHECKOUT USER
        const checkOutUser = async (): Promise<boolean> => 
        {
            // always use the logged-in user from context
            const id = user?.id;

            if (!id) 
            {
                console.warn("checkOutUser: no logged-in user found");
                return false;
            }

            try 
            {
                //supabase update
                const result = await checkOutUserService(id); 
                console.log("CHECKING OUT:", result)
                if (!result) 
                {
                    console.warn("checkOutUser: service returned null/failed");
                    return false;
                }

                // refresh profile in context
                try 
                {
                    await fetchProfile();
                } 
                catch (e) 
                {
                    console.warn("checkOutUser: failed to refresh profile", e);
                }

                return true;
            } 
            catch (err) 
            {
                console.error("checkOutUser: unexpected error", err);
                return false;
            }
        }

    //#endregion
    
    //#region STORE PRODUCTS
        const [storeProducts, setStoreProducts] = useState<any[]>([]);
        const [featuredProducts, setfeaturedProducts] = useState<any[]>([]);

        const fetchStoreProducts = async () => 
        {
            try 
            {
                const items = await getStoreItems(); // from your Supabase service
                setStoreProducts(items);

                const featured = items.filter((item: any) => item.featured === true);
                setfeaturedProducts(featured);
            } 
            catch (err) 
            {
                console.error("Error fetching store products:", err);
                setStoreProducts([]);
            }
        };

        const getStoreProductById_Nofetch = (productId: number): StoreProduct | null =>
        {
            //IF storeProducts EMPTY THEN RETURN 
            if (!storeProducts || storeProducts.length === 0) return null;

            return storeProducts.find((item) => item.id === productId) || null;
        };
    //#endregion

    //#region USER CART (INSERT AND CURRENT CART)
        const [cart, setCart] = useState<UserCart[]>([]);
        const [cartGrandTotal, setCartGrandTotal] = useState<number>(0);
        const [newCartChanges, setNewCartChanges] = useState<boolean>(true);
        
        //ADD ITEM TO USER CART
        const addItemToCart = async (productId: number, quantity: number, navigate: (path: string) => void) => 
        {
            if (!user?.id) 
            {   
                console.warn("addItemToCart: No logged-in user");
                return null;
            }

            try 
            {
                const result = await addToCart(user.id, productId, quantity, navigate);
                setNewCartChanges(true);
                // console.log("result:",result)
                // OPTIONAL: update local state so UI shows updated cart instantly
                // setCart((prev) => [...prev, result]);
                return result;
            } 
            catch (err: any) 
            {
                console.error("Failed to add item to cart:", err);

                if (err?.hint === "CART_STOCK_LIMIT") 
                {
                    createPortal(
                        toast("❌ Product stock limit", 
                        {
                            description: `You already have the product in your cart, and it exceeded the remaining stock of the product`,
                            duration: 10000,
                        }),
                        document.body
                    );
                }
                return null;
            }
        };

        // Fetch cart with related products
        const fetchUserCartWithProducts = async () =>
        {
            if (!user?.id) return;
            if (!newCartChanges) return;

            try 
            {
                console.log("fetchUserCartWithProducts refetching shits")
                const {cartItems, cartGrandTotal} = await getUserCartWithProducts(user.id);
                setCart(cartItems);
                setCartGrandTotal(cartGrandTotal);
            } 
            catch (error) 
            {
                console.error("Error fetching user cart with products:", error);
                setCart([]);
                setCartGrandTotal(0);
            }

            setNewCartChanges(false);
        };

        //DELETE CART
        const deleteCartItem = async (cart_id: number) => 
        {
            if (!user?.id) 
            {
                console.warn("deleteCartItem: No logged-in user");
                return false;
            }

            // Get the cart item data from state
            const cartItem = cart.find((item) => item.cart_id === cart_id);
            console.log("cartItem", cartItem)

            try 
            {
                const data = await deleteCartItemService(user.id, cart_id);
                setNewCartChanges(true);
            } 
            catch (error) 
            {
                console.error("Error deleting cart item:", error);
            }
        };

        const updateCartItemQuantity = async (cart_id: number, quantity: number) => 
        {
            if (!user?.id) 
            {
                console.warn("updateCartItemQuantity: No logged-in user");
                return false;
            }

            try 
            {
                const data = await updateCartItemQuantityService(user.id, cart_id, quantity);
                setNewCartChanges(true);
            } 
            catch (err) 
            {
                console.error("Error updating cart item:", err);
            }
        };

        //EVERY CHANGE THEN UPDATE THE CART DATA
        useEffect(() => 
        {
            fetchUserCartWithProducts();
        }, [newCartChanges]);
    //#endregion
    
    //#region USER_CART -> CHECKOUT (USING USER_CART)
        const checkOutUserCart = async (user_id: string) => 
        {
            if (!user?.id) 
            {
                console.warn("checkOutUser: No logged-in user");
                return false;
            }

            try 
            {
                const data = await checkOutCart(user_id);
                setNewCartChanges(true);
                setNewUserOrdersChanges(true);
            } 
            catch (error) 
            {
                console.error("Error checking out user cart:", error);
            }
        };
    //#endregion

    //#region USER ORDERS
        //USER ORDERS
        const [userOrders, setUserOrders] = useState<OrderGroupsData | null>(null);
        //IF THIS IS TRUE THEN UPDATE THE USER ORDERS
        const [newUserOrdersChanges, setNewUserOrdersChanges] = useState<boolean>(true);

        //GET USER ORDERS
        const getUserOrders = async () => 
        {
            if (!user?.id) 
            {
                console.warn("loadUserOrders: No logged-in user");
                return;
            }

            try 
            {
                const data = await getUserOrdersService(user.id);

                if (data !== null) 
                {
                    setUserOrders(data);
                }
            } 
            catch (error) 
            {
                console.error("Error getting user cart:", error);
            }

            setNewUserOrdersChanges(false);
        };

        //EVERY CHANGE THEN UPDATE THE USER ORDERS DATA
        useEffect(() => 
        {
            console.log("fetch new userorder")
            getUserOrders();
        }, [newUserOrdersChanges]);

        //DELETE USER ORDERS
        
        const deleteOrderGroup = async (order_id: string) => 
        {
            if (!user?.id) 
            {
                console.warn("loadUserOrders: No logged-in user");
                return;
            }

            try 
            {
                const data = await deleteOrderGroupService(order_id, user.id);
                setNewUserOrdersChanges(true);
            } 
            catch (error) 
            {
                console.error("Error deleteing Order Group:", error);
            }
        }
    //#endregion
    
    //#region PAY ORDER (Single Order Row)
        //DATA TO BE REF OR ORDER ROW TO BE PAID (Single order row)
        const [userOrdersToBePaid, setUserOrdersToBePaid] = useState<OrderGroups | null>(null);
        // QR OF PRODUCT TO BE PAID
        const [qrDataUrl_ProductToBePaid, setQrDataUrl_ProductToBePaid] = useState<string | null>(null);
        
        //MAKE QR
        const makeQrForProductTobePaid = async (order_id: string) => 
        {
            if (!profile?.id) 
            {
                setQrDataUrl_ProductToBePaid(null);
                return;
            }

            const url = await generateQrWithLogo(order_id);
            if (url) 
            {
                setQrDataUrl_ProductToBePaid(url);
            } 
            else 
            {
                setQrDataUrl_ProductToBePaid(null);
            }
        }
        //CLEAR QR
        const clearQrForProductTobePaid = () =>
        {
            setQrDataUrl_ProductToBePaid(null);
        }
    //#endregion

    //#region REALTIME IF ORDER IS PAID (SINGLE ROW)
        const [activeOrderChannel, setactiveOrderChannel] = useState<any>(null);

        //CHECK IF ORDER_ID IS COMPLETED
        const checkIfOrderIsProcessed = async (order_id: string) =>
        {
            try 
            {
                // ✅ 1. Start watching
                const { promise, channel } = waitForOrderCompletion(order_id);

                // ✅ 2. Store channel so we can manually stop later
                setactiveOrderChannel(channel);

                // ✅ 3. Wait until status becomes Completed or Out of Stock
                const updatedOrder = await promise;

                // console.log("✅ Order final status:", updatedOrder.status);

                // ✅ 4. Handle result
                if (updatedOrder.status === "Completed") 
                {
                    // console.log("🎉 Order completed successfully!");
                    // TODO: grant items, show success popup, refresh UI
                } 
                else 
                {
                    // console.log("❌ Order out of stock!");
                    // TODO: show error UI, revert cart, refund, etc.
                }

                return updatedOrder;
            } 
            catch (error) 
            {
                console.error("❌ Failed while waiting for order:", error);
                return null;
            }
        }

        //STOP WATCHING REALTIME ORDERS 
        const stopWatchingOrderIsProcessed = () =>
        {
            if (activeOrderChannel) 
            {
                supabase.removeChannel(activeOrderChannel);
                console.log("🛑 Order status listener stopped");
                setactiveOrderChannel(null); // actually clears it
            }
            else
            {
                console.log("🛑ERROR: NO LISTENER TO STOP");
            }
        }
    //#endregion
    
    // #region REVIEWS SERVICES
        // #region READ REVIEWS DATA
            const [reviewsData, setreviewsData] = useState<ProductReviews[]>([]);
            const [userReviewStatus, setuserReviewStatus] =useState<UserReviewStatus | null>(null);
            
            // GET ALL THE REVIEWS BY EVERY USER OF THE productId 
            const fetchReviewsData = async (productId: number) => 
            {
                try 
                {
                    const reviews = await getProductReviews(productId); // from your Supabase service
                    setreviewsData(reviews);
                } 
                catch (err) 
                {
                    console.error("Error fetching reviews data:", err);
                    setreviewsData([]);
                }
            };

            // CHECK IF CURRENT USER CAN REVIEW THE productId
            // IF SAME PRODUCT ID THEN DONT FETCH IN DB
            const checkIfUserCanReview = async (productId: number, forceFetch: boolean = false) =>
            {
                if (!user?.id) 
                {
                    console.warn("checkIfUserCanReview: No logged-in user");
                    return null;
                }

                if(!forceFetch)
                {
                    console.log("cache")
                    if (userReviewStatus?.product_id === productId) return userReviewStatus;
                }

                try 
                {
                    const data = await checkIfUserCanReview_rpc(user.id, productId);
                    setuserReviewStatus(data);
                    console.log(data)
                    return data;
                } 
                catch (error) 
                {
                    console.error("Error checking if user can review:", error);
                    return null;
                }
            };

            const createReview = async ({
                product_id,
                order_item_id,
                rating,
                review_text
            }: {
                product_id: number;
                order_item_id: number;
                rating: number;
                review_text: string;
            }) => 
            {
                if (!user?.id) 
                {
                    console.warn("createReview: No logged-in user");
                    return null;
                }

                try 
                {
                    const reviews = await createProductReview({
                        user_id: user.id,
                        product_id,
                        order_item_id,
                        rating,
                        review_text
                    });

                    // Refresh reviews after insert
                    await fetchReviewsData(product_id);
                    // Refresh if user can review
                    await checkIfUserCanReview(product_id, true);

                    await fetchStoreProducts();
                } 
                catch (err) 
                {
                    console.error("createReview error:", err);
                    return null;
                }
            };

        // #endregion
        
    // #endregion
    return (
        <UserContext.Provider
            value={{
                user,
                profile,
                loading,
                refreshProfile: fetchProfile,
                qrDataUrl,
                qrDataUrl_WName,
                refreshQr,
                packages,
                refreshPackages: fetchPackages,
                userPackages,
                refreshUserPackages: fetchUserPackages,
                watchPendingPurchase,
                stopPurchaseListener,
                watchPendingAttendance,
                stopAttendanceListener,
                checkOutUser,
                //STORE PRODUCT
                storeProducts,
                featuredProducts,
                fetchStoreProducts,
                getStoreProductById: getStoreProductById_Nofetch,

                addItemToCart,
                cart,
                cartGrandTotal,
                fetchUserCartWithProducts,
                deleteCartItem,
                updateCartItemQuantity,
                
                checkOutUserCart,
                userOrders,
                getUserOrders,

                deleteOrderGroup,

                userOrdersToBePaid,
                setUserOrdersToBePaid,

                qrDataUrl_ProductToBePaid,
                makeQrForProductTobePaid,
                clearQrForProductTobePaid,

                checkIfOrderIsProcessed,
                stopWatchingOrderIsProcessed,

                reviewsData,
                fetchReviewsData,

                setuserReviewStatus,
                checkIfUserCanReview,
                createReview,
            }}>
                {children}
        </UserContext.Provider>
    );
};

export const useUser = () => 
{
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
