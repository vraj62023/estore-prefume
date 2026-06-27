import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true }, // Array of image URLs from Cloudinary
    category: { type: String, required: true }, // Men, Women, Unisex
    subCategory: { type: String, required: true }, // Eau de Parfum, Eau de Toilette, Cologne, Perfume Oil, Body Mist, Rollerball
    sizes: { type: Array, required: true }, // 50ml, 100ml, 200ml
    bestseller: { type: Boolean, default: false },
    date: { type: Number, required: true },
    stock: { type: Number, required: true, default: 50 }, // Track stock quantity
    notes: {
        top: { type: String, default: "" },
        heart: { type: String, default: "" },
        base: { type: String, default: "" }
    },
    reviews: [
        {
            name: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
