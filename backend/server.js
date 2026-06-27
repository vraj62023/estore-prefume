import express from "express";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { connectMail } from "./config/nodemailer.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import aiRouter from "./routes/aiRoute.js";
import adminRouter from "./routes/adminRoute.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Coupon from "./models/Coupon.js";
import couponRouter from "./routes/couponRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to services
connectDB();
connectCloudinary();
connectMail();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Seeding Default Perfumes & Admin User
const seedDatabase = async () => {
    try {
        // 1. Seed Admin User
        const adminEmail = "admin@larome.com";
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            console.log("Admin user not found. Seeding default admin user...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);
            
            const adminUser = new User({
                name: "Admin L'Arôme",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                cartData: {}
            });
            await adminUser.save();
            console.log("Successfully seeded admin user (admin@larome.com / admin123)!");
        }

        // 2. Seed Products
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log("Database is empty. Seeding default premium perfumes...");
            const defaultPerfumes = [
                {
                    name: "Oud Imperial",
                    description: "A rich, smoky, and majestic blend of rare Cambodian oud, dark leather, and warm amberwood. Designed for sophisticated evening wear and cold winter nights.",
                    price: 4500,
                    image: ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600"],
                    category: "Men",
                    subCategory: "Eau de Parfum",
                    sizes: ["50ml", "100ml", "200ml"],
                    bestseller: true,
                    date: Date.now(),
                    stock: 45,
                    notes: {
                        top: "Saffron, Cardamom",
                        heart: "Damask Rose, Leather",
                        base: "Cambodian Oud, Amber, Sandalwood"
                    },
                    reviews: [
                        { name: "Rajiv Sharma", rating: 5, comment: "Incredible projection and longevity. Smells very royal and gets tons of compliments." },
                        { name: "Vikram K.", rating: 4, comment: "Very bold and intense. A bit heavy for office use, but perfect for winter nights." }
                    ]
                },
                {
                    name: "Jasmine Nectar",
                    description: "A delicate floral escape blending sweet blooming jasmine petals, wild honeysuckle, and warm white musk. Sparkling, light, and refreshing for daytime spring outings.",
                    price: 3200,
                    image: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600"],
                    category: "Women",
                    subCategory: "Eau de Parfum",
                    sizes: ["50ml", "100ml"],
                    bestseller: true,
                    date: Date.now(),
                    stock: 60,
                    notes: {
                        top: "Neroli, Pear Blossom",
                        heart: "Grandiflorum Jasmine, Honeysuckle",
                        base: "White Musk, Vanilla Bean"
                    },
                    reviews: [
                        { name: "Priya Patel", rating: 5, comment: "Smells like a fresh garden in bloom. Super elegant and lasts all day." }
                    ]
                },
                {
                    name: "Citrus Infusion",
                    description: "A sparkling, energizing explosion of ripe Sicilian bergamot, fresh grapefruit, and cool ocean breezes. An ultra-fresh signature perfect for summer office wear.",
                    price: 2800,
                    image: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600"],
                    category: "Unisex",
                    subCategory: "Eau de Toilette",
                    sizes: ["50ml", "100ml", "200ml"],
                    bestseller: true,
                    date: Date.now(),
                    stock: 80,
                    notes: {
                        top: "Bergamot, Grapefruit, Lime",
                        heart: "Sea Salt, Lavender, Mint",
                        base: "Cedarwood, Vetiver, Ambroxan"
                    },
                    reviews: [
                        { name: "Amit G.", rating: 4, comment: "Tons of compliments, extremely fresh. Excellent office scent." },
                        { name: "Ramesh Sen", rating: 5, comment: "My daily driver. Very clean, citrusy, and refreshing." }
                    ]
                },
                {
                    name: "Amber Signature",
                    description: "A warm, voluptuous amber scent kissed with powdery vanilla, spicy cinnamon, and cream benzoin. Gives a comforting, luxurious cashmere-like sillage.",
                    price: 4900,
                    image: ["https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=600"],
                    category: "Unisex",
                    subCategory: "Extrait de Parfum",
                    sizes: ["50ml", "100ml"],
                    bestseller: false,
                    date: Date.now(),
                    stock: 25,
                    notes: {
                        top: "Cinnamon, Nutmeg",
                        heart: "Benzoin, Labdanum",
                        base: "Ambergris, Vanilla, Patchouli"
                    },
                    reviews: []
                },
                {
                    name: "Rose Absolute",
                    description: "A gorgeous, deep crimson rose infusion combined with velvet peony and dry patchouli. The absolute expression of romance and feminine charm.",
                    price: 3600,
                    image: ["https://images.unsplash.com/photo-1528740564065-f3782d13394a?q=80&w=600"],
                    category: "Women",
                    subCategory: "Eau de Parfum",
                    sizes: ["50ml", "100ml"],
                    bestseller: false,
                    date: Date.now(),
                    stock: 35,
                    notes: {
                        top: "Pink Pepper, Peony",
                        heart: "Damask Rose, Turkish Rose",
                        base: "Patchouli, Amber, Musk"
                    },
                    reviews: [
                        { name: "Sarah John", rating: 5, comment: "Absolutely gorgeous rose scent. Feels very luxurious and classic." }
                    ]
                },
                {
                    name: "Oceanic Drift",
                    description: "A cool, aquatic breeze mixing salty sea air, crushing waves, sage, and driftwood. Energizing, aromatic, and deeply liberating.",
                    price: 2400,
                    image: ["https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600"],
                    category: "Men",
                    subCategory: "Cologne",
                    sizes: ["100ml", "200ml"],
                    bestseller: false,
                    date: Date.now(),
                    stock: 50,
                    notes: {
                        top: "Sea Notes, Grapefruit",
                        heart: "Bay Leaf, Jasmine",
                        base: "Guaiac Wood, Oakmoss, Ambergris"
                    },
                    reviews: []
                },
                {
                    name: "Sandalwood Silk",
                    description: "An elegant, woody scent featuring smooth Australian Mysore sandalwood, creamy milk notes, and dry papyrus. A subtle skin scent with cozy sophistication.",
                    price: 3900,
                    image: ["https://images.unsplash.com/photo-1615396899839-c99c121888b0?q=80&w=600"],
                    category: "Unisex",
                    subCategory: "Perfume Oil",
                    sizes: ["20ml", "50ml"],
                    bestseller: false,
                    date: Date.now(),
                    stock: 30,
                    notes: {
                        top: "Cardamom, Papyrus",
                        heart: "Iris, Violet, Leather",
                        base: "Sandalwood, Cedarwood, Amber"
                    },
                    reviews: []
                },
                {
                    name: "Vanilla Mist",
                    description: "A delightful gourmand mist combining warm sugar cookie vanilla, toasted coconut, and clean marshmallow. Sweet, playful, and irresistible.",
                    price: 1900,
                    image: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&mist=true"],
                    category: "Women",
                    subCategory: "Body Mist",
                    sizes: ["100ml", "200ml"],
                    bestseller: false,
                    date: Date.now(),
                    stock: 90,
                    notes: {
                        top: "Toasted Coconut, Whipped Cream",
                        heart: "Vanilla Orchid, Marshmallow",
                        base: "Warm Sugar, Musk"
                    },
                    reviews: []
                }
            ];

            await Product.insertMany(defaultPerfumes);
            console.log("Successfully seeded 8 premium fragrances!");
        }

        // 3. Seed Coupons
        const couponCount = await Coupon.countDocuments();
        if (couponCount === 0) {
            console.log("Seeding default discount coupons...");
            await Coupon.insertMany([
                { code: "WELCOME10", discountPercent: 10, isActive: true },
                { code: "SCENT20", discountPercent: 20, isActive: true },
                { code: "GOLDEN30", discountPercent: 30, isActive: true }
            ]);
            console.log("Successfully seeded default coupons!");
        }
    } catch (error) {
        console.error("Failed to seed database:", error);
    }
};

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRouter);
app.use("/api/coupon", couponRouter);

app.get("/", (req, res) => {
    res.send("L'ARÔME Perfumes API Server is running successfully.");
});

// Start Server
app.listen(port, async () => {
    console.log(`Server is running on port: ${port}`);
    await seedDatabase();
});
