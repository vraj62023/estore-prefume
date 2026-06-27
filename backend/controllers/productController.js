import Product from "../models/Product.js";
import AdminLog from "../models/AdminLog.js";
import { v2 as cloudinary } from 'cloudinary';

// Add product (Admin only)
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, topNotes, heartNotes, baseNotes, adminUser, stock } = req.body;
        
        let imageUrls = [];
        
        // Handle images upload
        if (req.files && Object.keys(req.files).length > 0) {
            const imageFiles = [
                req.files.image1 && req.files.image1[0],
                req.files.image2 && req.files.image2[0],
                req.files.image3 && req.files.image3[0],
                req.files.image4 && req.files.image4[0],
            ].filter(Boolean);
            
            if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== "YOUR_API_KEY") {
                try {
                    const uploadPromises = imageFiles.map(async (file) => {
                        const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                        // Apply optimization directly to Cloudinary URL (f_auto, q_auto)
                        return result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
                    });
                    imageUrls = await Promise.all(uploadPromises);
                } catch (cloudinaryError) {
                    console.error("Cloudinary upload failed, falling back to local Express storage:", cloudinaryError.message);
                    imageUrls = imageFiles.map((file) => {
                        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
                    });
                }
            } else {
                console.warn("Cloudinary not configured. Saving to local Express storage.");
                imageUrls = imageFiles.map((file) => {
                    return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
                });
            }
        }
        
        // If no images uploaded, use default luxury perfume mockup
        if (imageUrls.length === 0) {
            imageUrls = ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600"];
        }

        const productData = {
            name,
            description,
            price: Number(price),
            image: imageUrls,
            category,
            subCategory,
            sizes: JSON.parse(sizes || "[]"),
            bestseller: bestseller === "true",
            stock: stock ? Number(stock) : 50,
            date: Date.now(),
            notes: {
                top: topNotes || "",
                heart: heartNotes || "",
                base: baseNotes || ""
            },
            reviews: []
        };

        const product = new Product(productData);
        await product.save();

        // Create Admin Log
        const log = new AdminLog({
            action: "CREATE_PRODUCT",
            user: adminUser || "Admin System",
            details: `Created product: "${name}" (Stock: ${product.stock}, ID: ${product._id})`
        });
        await log.save();

        res.json({ success: true, message: "Product Added successfully", product });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// List products
const listProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Edit product (Admin only)
const editProduct = async (req, res) => {
    try {
        const { productId, name, description, price, category, subCategory, sizes, bestseller, topNotes, heartNotes, baseNotes, adminUser, stock } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Handle new images upload if provided
        let imageUrls = product.image;
        if (req.files && Object.keys(req.files).length > 0) {
            const imageFiles = [
                req.files.image1 && req.files.image1[0],
                req.files.image2 && req.files.image2[0],
                req.files.image3 && req.files.image3[0],
                req.files.image4 && req.files.image4[0],
            ].filter(Boolean);

            if (imageFiles.length > 0) {
                if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== "YOUR_API_KEY") {
                    try {
                        const uploadPromises = imageFiles.map(async (file) => {
                            const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                            return result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
                        });
                        imageUrls = await Promise.all(uploadPromises);
                    } catch (cloudinaryError) {
                        console.error("Cloudinary upload failed during edit, falling back to local Express storage:", cloudinaryError.message);
                        imageUrls = imageFiles.map((file) => {
                            return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
                        });
                    }
                } else {
                    imageUrls = imageFiles.map((file) => {
                        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
                    });
                }
            }
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price ? Number(price) : product.price;
        product.image = imageUrls;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.bestseller = bestseller !== undefined ? bestseller === "true" : product.bestseller;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        product.notes = {
            top: topNotes !== undefined ? topNotes : product.notes.top,
            heart: heartNotes !== undefined ? heartNotes : product.notes.heart,
            base: baseNotes !== undefined ? baseNotes : product.notes.base
        };

        await product.save();

        // Create Admin Log
        const log = new AdminLog({
            action: "EDIT_PRODUCT",
            user: adminUser || "Admin System",
            details: `Edited product: "${product.name}" (Stock: ${product.stock}, ID: ${product._id})`
        });
        await log.save();

        res.json({ success: true, message: "Product Edited successfully", product });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const { productId, adminUser } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        await Product.findByIdAndDelete(productId);

        // Create Admin Log
        const log = new AdminLog({
            action: "DELETE_PRODUCT",
            user: adminUser || "Admin System",
            details: `Deleted product: "${product.name}" (ID: ${product._id})`
        });
        await log.save();

        res.json({ success: true, message: "Product Deleted successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Add product review
const addProductReview = async (req, res) => {
    try {
        const { productId, name, rating, comment } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const review = {
            name: name || "Anonymous Scent Enthusiast",
            rating: Number(rating),
            comment,
            date: new Date()
        };

        product.reviews.push(review);
        await product.save();

        res.json({ success: true, message: "Review Added successfully", reviews: product.reviews });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts, singleProduct, editProduct, deleteProduct, addProductReview };
