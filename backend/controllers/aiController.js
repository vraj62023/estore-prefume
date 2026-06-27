import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../models/Product.js";

// Initialize Gemini SDK helper
const getGeminiModel = () => {
    if (!process.env.GEMINI_API_KEY) return null;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// Local recommendation fallback logic
const getLocalRecommendations = (products, budget, gender, occasion, scentFamily) => {
    let matches = products.filter(p => p.price <= Number(budget));
    if (gender && gender !== "Unisex") {
        matches = matches.filter(p => p.category === gender || p.category === "Unisex");
    }
    
    const selected = matches.slice(0, 3);
    return selected.map(p => ({
        productId: p._id,
        reasoning: `Recommended match "${p.name}". Its notes of ${p.notes.top || 'fresh ingredients'} are perfect for a ${occasion || 'special'} occasion, aligning beautifully with your preference for ${scentFamily || 'fine scents'} under your budget limit.`
    }));
};

// Local chatbot fallback logic
const getLocalChatReply = (products, lastMessage) => {
    let reply = "Hello! I am Aria, your L'Arôme fragrance concierge. How may I guide your olfactory journey today?";
    
    if (lastMessage.includes("sauvage") || lastMessage.includes("dior")) {
        reply = "Dior Sauvage is known for its fresh bergamot and dry amberwood (ambroxan). From our catalog, I highly recommend our **Oud Imperial** or **Citrus Infusion**. They feature sparkling citrus openings with warm, masculine base notes that echo that bold, adventurous profile.";
    } else if (lastMessage.includes("aventus") || lastMessage.includes("creed")) {
        reply = "Creed Aventus features a famous opening of pineapple, birch, and oakmoss. I recommend looking at our bestseller **Citrus Infusion**, which opens with bright bergamot and dries down into a rich, sophisticated woody finish.";
    } else if (lastMessage.includes("similar") || lastMessage.includes("recommend") || lastMessage.includes("perfume")) {
        const randomProduct = products[Math.floor(Math.random() * products.length)]?.name || "Oud Noir";
        reply = `For a sophisticated signature scent, I recommend exploring **${randomProduct}**. It is one of our most coveted creations and blends beautiful notes to deliver a memorable sillage.`;
    }
    return reply;
};

// Local smart search fallback logic
const getLocalSearchQuery = (query) => {
    const words = query.split(" ").filter(w => w.length > 2);
    const regexes = words.map(w => new RegExp(w, "i"));
    
    let categoryFilter = null;
    if (/men/i.test(query) && !/women/i.test(query)) categoryFilter = "Men";
    else if (/women/i.test(query)) categoryFilter = "Women";
    else if (/unisex/i.test(query)) categoryFilter = "Unisex";

    const dbQuery = {};
    if (categoryFilter) dbQuery.category = categoryFilter;

    if (regexes.length > 0) {
        dbQuery.$or = regexes.map(rx => ({
            $or: [
                { name: rx },
                { description: rx },
                { "notes.top": rx },
                { "notes.heart": rx },
                { "notes.base": rx }
            ]
        }));
    }
    return dbQuery;
};

// 1. AI Scent Recommendation Engine
const recommendFragrance = async (req, res) => {
    const { scentFamily, occasion, gender, budget, longevity } = req.body;
    try {
        const products = await Product.find({});
        const model = getGeminiModel();

        if (model) {
            try {
                const prompt = `
                You are a luxury perfume sommelier at L'Arôme Parfums. Based on the customer's preferences:
                - Scent Family: ${scentFamily}
                - Occasion: ${occasion}
                - Gender Preference: ${gender}
                - Maximum Budget: Rs. ${budget}
                - Longevity Preference: ${longevity}

                Select the top 3 best matching products from this catalog:
                ${JSON.stringify(products.map(p => ({ _id: p._id, name: p.name, price: p.price, category: p.category, subCategory: p.subCategory, notes: p.notes, description: p.description })))}

                Explain in detail why each product is a match for them (referencing their notes and characteristics).
                Return your response as a valid JSON object matching this schema (do not output any markdown code blocks, just the raw JSON):
                {
                  "recommendations": [
                    {
                      "productId": "string matching the product _id",
                      "reasoning": "Elegant and detailed reason why this matches their preferences."
                    }
                  ]
                }
                `;

                const result = await model.generateContent(prompt);
                const textResponse = result.response.text().trim();
                const cleanJsonText = textResponse.replace(/^```json/, "").replace(/```$/, "").trim();
                const data = JSON.parse(cleanJsonText);
                return res.json({ success: true, recommendations: data.recommendations });
            } catch (geminiError) {
                console.warn("Gemini API call failed, running local recommendation fallback:", geminiError.message);
            }
        }
        
        // Run Fallback if no model or call failed
        const recommendations = getLocalRecommendations(products, budget, gender, occasion, scentFamily);
        res.json({ success: true, recommendations });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 2. AI Fragrance Consultant Chatbot
const chatConsultant = async (req, res) => {
    const { messages } = req.body;
    try {
        const products = await Product.find({});
        const model = getGeminiModel();
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

        if (model) {
            try {
                const prompt = `
                You are 'Aria', the virtual fragrance consultant at L'Arôme Luxury Parfums.
                You are helping a customer choose a scent. Be elegant, poetic, descriptive, and polite.
                Use our active perfume catalog to make recommendations.
                Our product catalog:
                ${JSON.stringify(products.map(p => ({ name: p.name, price: p.price, category: p.category, subCategory: p.subCategory, notes: p.notes, description: p.description })))}

                If the customer asks for something similar to a famous designer fragrance (like Dior Sauvage, Chanel No. 5, Creed Aventus, Bleu de Chanel), figure out its notes and recommend the closest matches from our catalog, explaining the notes similarity.
                
                Here is the conversation history:
                ${JSON.stringify(messages)}

                Respond directly as Aria. Keep the response concise, under 3 short paragraphs.
                `;

                const result = await model.generateContent(prompt);
                return res.json({ success: true, reply: result.response.text() });
            } catch (geminiError) {
                console.warn("Gemini API call failed, running local chatbot fallback:", geminiError.message);
            }
        }
        
        // Run Fallback
        const reply = getLocalChatReply(products, lastMessage);
        res.json({ success: true, reply });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 3. AI Product Description Generator (Admin only)
const generateDescription = async (req, res) => {
    const { name, notes } = req.body;
    try {
        const model = getGeminiModel();
        const fallbackDesc = `An exquisite fragrance masterpiece, ${name} opens with elegant top notes of ${notes?.top || 'fresh ingredients'}, developing into a heart of ${notes?.heart || 'delicate florals'}, and resting on a rich base of ${notes?.base || 'warm amber'} for a long-lasting, sophisticated sensory experience.`;

        if (model) {
            try {
                const prompt = `
                You are a professional luxury copywriter for L'Arôme Parfums. Write a premium, poetic, sensory, and appealing product description for a perfume named '${name}' that has the following notes:
                - Top Notes: ${notes?.top || 'None'}
                - Heart Notes: ${notes?.heart || 'None'}
                - Base Notes: ${notes?.base || 'None'}
                
                Keep it short (2-3 sentences), elegant, and sophisticated, suited for a high-end luxury brand page.
                `;
                const result = await model.generateContent(prompt);
                return res.json({ success: true, description: result.response.text().trim() });
            } catch (geminiError) {
                console.warn("Gemini API call failed, running local description generator fallback:", geminiError.message);
            }
        }
        
        res.json({ success: true, description: fallbackDesc });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 4. AI Smart Search
const smartSearch = async (req, res) => {
    const { query } = req.body;
    try {
        const model = getGeminiModel();

        if (model) {
            try {
                const prompt = `
                You are a database search assistant for a perfume store. We need to convert a user's natural language search query into structural filter parameters for a MongoDB query.
                Here is the user query: '${query}'

                We support these categories: 'Men', 'Women', 'Unisex'
                We support these subCategories (perfume types): 'Eau de Parfum', 'Eau de Toilette', 'Cologne', 'Perfume Oil', 'Body Mist', 'Rollerball'

                Analyze the query and output a JSON object containing the values found. Match this schema exactly (do not output any markdown code blocks, just the raw JSON):
                {
                  "category": "Men"|"Women"|"Unisex"|null,
                  "subCategory": "Eau de Parfum"|...|null,
                  "priceLimit": number|null,
                  "notesMatch": ["string"]|null
                }
                `;
                
                const result = await model.generateContent(prompt);
                const textResponse = result.response.text().trim();
                const cleanJsonText = textResponse.replace(/^```json/, "").replace(/```$/, "").trim();
                const parsed = JSON.parse(cleanJsonText);

                const dbQuery = {};
                if (parsed.category) dbQuery.category = parsed.category;
                if (parsed.subCategory) dbQuery.subCategory = parsed.subCategory;
                if (parsed.priceLimit) dbQuery.price = { $lte: Number(parsed.priceLimit) };
                
                if (parsed.notesMatch && parsed.notesMatch.length > 0) {
                    dbQuery.$or = parsed.notesMatch.map(note => ({
                        $or: [
                            { name: new RegExp(note, 'i') },
                            { description: new RegExp(note, 'i') },
                            { "notes.top": new RegExp(note, 'i') },
                            { "notes.heart": new RegExp(note, 'i') },
                            { "notes.base": new RegExp(note, 'i') }
                        ]
                    }));
                }

                const products = await Product.find(dbQuery);
                return res.json({ success: true, products, parsed });
            } catch (geminiError) {
                console.warn("Gemini API call failed, running local smart search fallback:", geminiError.message);
            }
        }
        
        // Fallback smart search
        const dbQuery = getLocalSearchQuery(query);
        const products = await Product.find(dbQuery);
        res.json({ success: true, products, parsed: { query } });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 5. AI Review Summarizer
const summarizeReviews = async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const reviews = product.reviews || [];
        if (reviews.length === 0) {
            return res.json({ success: true, summary: "No reviews have been written for this fragrance yet. Be the first to share your experience!" });
        }

        const model = getGeminiModel();
        
        // Fallback review summary text builder
        const generateFallbackSummary = () => {
            const ratings = reviews.map(r => r.rating);
            const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
            const highRatings = ratings.filter(r => r >= 4).length;
            const pct = Math.round((highRatings / ratings.length) * 100);
            return `Based on customer feedback, L'Arôme enthusiasts rate this fragrance at ${avgRating} / 5.0 stars. Approximately ${pct}% of customers praised its impressive longevity and rich sillage. Some reviews recommend this scent specifically for evening or cooler weather wear.`;
        };

        if (model) {
            try {
                const prompt = `
                Analyze these customer reviews for our perfume '${product.name}' and write a brief summary:
                ${JSON.stringify(reviews.map(r => ({ rating: r.rating, comment: r.comment })))}

                Summarize the overall customer sentiment (e.g. what percentage praise longevity, projection, scent notes) and mention any minor complaints if any. Write a cohesive, elegant summary in 3-4 sentences.
                `;
                const result = await model.generateContent(prompt);
                return res.json({ success: true, summary: result.response.text().trim() });
            } catch (geminiError) {
                console.warn("Gemini API call failed, running local reviews summarizer fallback:", geminiError.message);
            }
        }
        
        const summary = generateFallbackSummary();
        res.json({ success: true, summary });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { recommendFragrance, chatConsultant, generateDescription, smartSearch, summarizeReviews };
