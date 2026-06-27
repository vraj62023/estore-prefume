import express from 'express';
import { addProduct, listProducts, singleProduct, editProduct, deleteProduct, addProductReview } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import { authAdmin } from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post('/add', authAdmin, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

productRouter.post('/edit', authAdmin, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), editProduct);

productRouter.post('/delete', authAdmin, deleteProduct);

productRouter.get('/list', listProducts);
productRouter.post('/single', singleProduct);
productRouter.post('/review', addProductReview);

export default productRouter;
