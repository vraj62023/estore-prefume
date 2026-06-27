import express from 'express';
import { registerUser, loginUser, getUserCart, updateUserCart, toggleWishlist, getWishlist } from '../controllers/userController.js';
import { authUser } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.post('/cart', authUser, getUserCart);
userRouter.post('/cart/update', authUser, updateUserCart);

userRouter.post('/wishlist/toggle', authUser, toggleWishlist);
userRouter.post('/wishlist', authUser, getWishlist); // changed get to post to easily parse token in body if needed, or get works too. To keep it simple, post works great for payload endpoints

export default userRouter;
