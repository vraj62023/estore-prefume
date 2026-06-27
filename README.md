# L'ARÔME Luxury Parfums - MERN Stack E-commerce Application 
[🚀 Live Demo](https://estore-prefume-1.onrender.com)

L'ARÔME is a production-grade, premium MERN (MongoDB, Express, React, Node.js) stack e-commerce web application designed for a luxury perfume boutique. 

It features an advanced **AI Curation & Consultation Suite** powered by Google's Gemini API, **Real-time Inventory Stock Management**, **SMTP transactional email notifications**, **Interactive Recharts sales analytics**, and a **Dynamic Coupon Control Center** for administrators.

---

## 🌟 Key Features

### 1. Customer Shopping Portal
* **Visual Olfactory Note Pyramid**: Renders an interactive CSS evaporation pyramid illustrating Top, Heart, and Base notes timelines with explanatory hover tooltips.
* **Wishlist Card Overlays**: Toggle favorite products directly from the main store catalog cards with dynamic heart indicators.
* **Recently Viewed Carousel**: Track and view recently explored fragrances using localStorage caching.
* **Printable Invoice PDF**: Click-to-open invoice sheets showing billing summaries, item details, shipping costs, and grand totals, styled with print-media CSS overrides.
* **Dynamic Cart Totals**: Standard e-commerce cart calculation displaying unit summaries, applied discounts, and shipping surcharges.
* **Volume Pricing Offsets**: Change pricing dynamically based on volume sizing (50ml, 100ml, 200ml).
* **Customer Review Submissions**: Shoppers can write reviews, submit star ratings, and read sentiments left by others.

### 2. Advanced AI Curation (Gemini API Integration)
* **AI Fragrance Recommendation Engine**: Recommends the top 3 matching perfumes with detailed explanations based on scent family, occasion, gender, budget, and longevity.
* **AI Fragrance Chatbot (Aria)**: A floating RAG-based virtual consultant comparing scent profiles (e.g., matching designer equivalents like Dior Sauvage).
* **Virtual Discovery Quiz**: 4-step wizard card selector returning custom Scent Signature Profiles and products.
* **AI Product Description Generator**: Assists the admin by drafting elegant copy based on notes.
* **AI Review Summarizer**: Condenses customer feedback arrays into brief sentiment bullet highlights.
* **AI Smart Search**: Parsers natural search queries (e.g. *"fresh under Rs. 3000"*) directly into database queries.
* *Note: If no Gemini key is set, the system uses a smart local rules matching engine so features remain fully functional.*

### 3. Executive Admin Console (`/admin`)
* **Sales Analytics & Recharts**: Visualizes daily sales curves, monthly revenue bars, category share distributions, and cart conversion statistics.
* **Catalog Management**: CRUD operations supporting multi-image uploads and **Real-time Inventory Stock counts**.
* **Discount Coupons Tab**: Create promo codes, toggle their active/inactive status, or delete them dynamically.
* **Order Management**: List orders and update fulfillment statuses (Pending $\rightarrow$ Shipped $\rightarrow$ Delivered) which triggers automated customer emails.
* **Activity Logs**: Audits product and coupon actions in a vertical timeline.

### 4. Backend Infrastructure
* **Multer & Cloudinary CDN**: Optimizes uploaded product images on the fly with CDN transformations (`f_auto,q_auto`). Falls back to a local storage file server in development.
* **Nodemailer SMTP**: Triggers styled HTML transactional emails when orders are placed, shipped, or delivered.
* **Database Auto-Seeding**: Registers a default administrator account (`admin@larome.com` / `admin123`) and inserts 8 default fragrances with initial stock values upon first startup.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Recharts (Charts), Lucide React (Icons), React-Toastify (Alerts).
* **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT (Authentication), Multer & Cloudinary (Uploads), Nodemailer (Emails), Google Gen AI SDK (Gemini).

---

## 📂 Project Structure

```
estore/
├── backend/
│   ├── config/             # DB, Cloudinary, SMTP connections
│   ├── controllers/        # Express handlers (AI, Products, Orders, Coupons)
│   ├── middleware/         # Token validation and Multer setups
│   ├── models/             # Mongoose Schemas (User, Product, Order, AdminLog, Coupon)
│   ├── routes/             # Router mappings
│   ├── uploads/            # Local static uploads folder
│   ├── .env.example        # Environment template
│   └── server.js           # Server startup and seeding entrypoint
├── fontend/
│   ├── src/
│   │   ├── components/     # UI components (Chatbot, Pyramid, Charts)
│   │   ├── context/        # ShopContext global state and API hooks
│   │   ├── pages/          # Front pages (Home, Cart, AdminDashboard, Orders)
│   │   └── App.jsx         # Routes, alerts, and admin banner prompts
│   └── vite.config.js
└── README.md
```

---

## 🚀 Local Installation & Setup

### Prerequisite
Ensure you have **Node.js** and **MongoDB** (local or Atlas) installed.

### 1. Configure the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your values:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_token_secret
   GEMINI_API_KEY=your_google_ai_studio_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your_mailtrap_smtp_username
   SMTP_PASS=your_mailtrap_smtp_password
   SMTP_FROM="L'Arôme Parfums" <noreply@larome.com>
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *The server will start at `http://localhost:4000` and seed default database values.*

### 2. Configure the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../fontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The storefront will open at `http://localhost:5173`.*

---

## ⚡ Development & Testing Tips

* **Default Admin Account**: To log into the Admin Dashboard, use:
  * **Email**: `admin@larome.com`
  * **Password**: `admin123`
* **Test Role Toggle**: When logged into any account, open the profile icon dropdown menu (top right) and click the **"Switch to Admin/Customer (Dev)"** toggle. This instantly switches roles, opening up administrative permissions and dashboard tabs for easy testing!
* **Mail Sandbox**: All transactional emails triggered by changing order statuses inside `/admin` will arrive in your configured **Mailtrap** Inbox dashboard.

---

## ☁️ Deployment Instructions

### 1. Backend (e.g. Render Web Service)
* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `node server.js`
* Set all environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.) inside the hosting portal.

### 2. Frontend (e.g. Render Static Site)
* Root Directory: `fontend`
* Build Command: `npm run build`
* Publish Directory: `dist`
* Add one environment variable:
  * Key: `VITE_BACKEND_URL`
  * Value: `https://your-deployed-backend-url.onrender.com`
