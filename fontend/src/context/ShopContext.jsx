import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'Rs.';
    const delivery_fee = 100;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    
    // Auth States
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || 'customer');
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [wishlist, setWishlist] = useState([]);
    
    // Coupon State
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState('');

    const applyCouponCode = async (code) => {
        try {
            const response = await axios.post(`${backendUrl}/api/coupon/validate`, { code });
            if (response.data.success) {
                setDiscount(response.data.discountPercent / 100);
                setAppliedCoupon(`${code.toUpperCase()} (${response.data.discountPercent}%)`);
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: error.message };
        }
    };

    // Fetch Products List
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Failed to load products from server. Is backend running?");
        }
    };

    // Load Cart from DB
    const loadCartData = async (userToken) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/cart`, {}, {
                headers: { token: userToken }
            });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("Failed to load cart:", error);
        }
    };

    // Load Wishlist from DB
    const loadWishlistData = async (userToken) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/wishlist`, {}, {
                headers: { token: userToken }
            });
            if (response.data.success) {
                setWishlist(response.data.wishlist || []);
            }
        } catch (error) {
            console.error("Failed to load wishlist:", error);
        }
    };

    // Add to Cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Please select a volume before adding to cart");
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        
        setCartItems(cartData);

        if (token) {
            try {
                const response = await axios.post(`${backendUrl}/api/user/cart/update`, { cartData }, {
                    headers: { token }
                });
                if (response.data.success) {
                    toast.success("Added to cart");
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        } else {
            toast.success("Added to cart (local)");
        }
    };

    // Update Quantity
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        
        if (quantity === 0) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = quantity;
        }
        
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/user/cart/update`, { cartData }, {
                    headers: { token }
                });
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    };

    // Toggle Wishlist
    const toggleWishlist = async (productId) => {
        if (!token) {
            toast.warn("Please login to manage your wishlist");
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/user/wishlist/toggle`, { productId }, {
                headers: { token }
            });
            if (response.data.success) {
                // The API returns the updated wishlist
                setWishlist(response.data.wishlist);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    // Get Cart Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    // Ignore errors
                }
            }
        }
        return totalCount;
    };

    // Get Cart Amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id.toString() === items.toString());
            if (!itemInfo) continue;
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    // Ignore errors
                }
            }
        }
        return totalAmount;
    };

    // Initial load
    useEffect(() => {
        fetchProducts();
    }, []);

    // Sync auth details
    useEffect(() => {
        if (token) {
            loadCartData(token);
            loadWishlistData(token);
        } else {
            setCartItems({});
            setWishlist([]);
        }
    }, [token]);

    const value = {
        products, fetchProducts, currency, delivery_fee, backendUrl,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, getCartCount, updateQuantity, getCartAmount,
        token, setToken, role, setRole, name, setName,
        wishlist, toggleWishlist,
        discount, setDiscount, appliedCoupon, setAppliedCoupon, applyCouponCode
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;