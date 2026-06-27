import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id, role, email) => {
    return jwt.sign({ id, role, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if user already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format & strong password
        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters" });
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine role (for demo, any mail with admin@larome.com is admin, others customer)
        const role = email.toLowerCase() === "admin@larome.com" ? "admin" : "customer";

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        const user = await newUser.save();
        const token = createToken(user._id, user.role, user.email);

        res.json({ success: true, token, role: user.role, name: user.name });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id, user.role, user.email);
            res.json({ success: true, token, role: user.role, name: user.name });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get User Cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await User.findById(userId);
        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Update User Cart
const updateUserCart = async (req, res) => {
    try {
        const { userId, cartData } = req.body;
        await User.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Wishlist toggle
const toggleWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await User.findById(userId);
        let wishlist = user.wishlist || [];
        
        if (wishlist.includes(productId)) {
            wishlist = wishlist.filter(id => id.toString() !== productId);
        } else {
            wishlist.push(productId);
        }
        
        user.wishlist = wishlist;
        await user.save();
        res.json({ success: true, wishlist, message: "Wishlist Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Wishlist
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).populate('wishlist');
        res.json({ success: true, wishlist: user.wishlist || [] });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, getUserCart, updateUserCart, toggleWishlist, getWishlist };
