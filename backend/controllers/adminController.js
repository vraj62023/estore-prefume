import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const getAdminAnalytics = async (req, res) => {
    try {
        const orders = await Order.find({});
        const products = await Product.find({});
        const users = await User.find({ role: 'customer' });
        
        // 1. Total revenue & counts
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const totalCustomers = users.length;
        
        // 2. Daily revenue analytics (last 7 days)
        const dailyRevenue = {};
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();
        
        last7Days.forEach(date => {
            dailyRevenue[date] = 0;
        });
        
        orders.forEach(order => {
            const dateStr = new Date(order.date).toISOString().split('T')[0];
            if (dailyRevenue[dateStr] !== undefined) {
                dailyRevenue[dateStr] += order.amount;
            }
        });
        
        const dailyRevenueData = Object.keys(dailyRevenue).map(date => ({
            date: date.substring(5), // MM-DD
            revenue: dailyRevenue[date]
        }));
        
        // 3. Monthly revenue analytics (past 6 months)
        const monthlyRevenue = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        
        for (let i = 5; i >= 0; i--) {
            const m = (currentMonth - i + 12) % 12;
            monthlyRevenue[months[m]] = 0;
        }
        
        orders.forEach(order => {
            const d = new Date(order.date);
            const mName = months[d.getMonth()];
            if (monthlyRevenue[mName] !== undefined) {
                monthlyRevenue[mName] += order.amount;
            }
        });
        
        const monthlyRevenueData = Object.keys(monthlyRevenue).map(month => ({
            month,
            revenue: monthlyRevenue[month]
        }));
        
        // 4. Category share (pie chart)
        const categoryShare = {};
        products.forEach(p => {
            categoryShare[p.category] = 0;
        });
        
        orders.forEach(order => {
            order.items.forEach(item => {
                const prod = products.find(p => p._id.toString() === item._id.toString());
                const cat = prod ? prod.category : "Unisex";
                if (categoryShare[cat] === undefined) {
                    categoryShare[cat] = 0;
                }
                const qty = item.quantity || 1;
                const price = item.price || (prod ? prod.price : 1000);
                categoryShare[cat] += price * qty;
            });
        });
        
        const categoryData = Object.keys(categoryShare).map(cat => ({
            name: cat,
            value: categoryShare[cat]
        }));
        
        // 5. Top selling products
        const topSellersMap = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const prodId = item._id.toString();
                if (!topSellersMap[prodId]) {
                    topSellersMap[prodId] = { name: item.name, quantity: 0, revenue: 0 };
                }
                topSellersMap[prodId].quantity += item.quantity;
                topSellersMap[prodId].revenue += item.price * item.quantity;
            });
        });
        
        const topSellingProducts = Object.values(topSellersMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
            
        // 6. Customer analytics (Repeat customer rate)
        const customerOrderCounts = {};
        orders.forEach(order => {
            customerOrderCounts[order.userId] = (customerOrderCounts[order.userId] || 0) + 1;
        });
        
        const totalUniqueCustomersWhoOrdered = Object.keys(customerOrderCounts).length;
        const repeatCustomersCount = Object.values(customerOrderCounts).filter(count => count >= 2).length;
        const repeatCustomerRate = totalUniqueCustomersWhoOrdered > 0 
            ? Math.round((repeatCustomersCount / totalUniqueCustomersWhoOrdered) * 100) 
            : 0;
            
        // Mock views and conversions based on real products
        const highestViewedProducts = products.slice(0, 5).map(p => {
            const sales = orders.reduce((sum, o) => sum + o.items.filter(item => item._id.toString() === p._id.toString()).reduce((a, b) => a + b.quantity, 0), 0);
            const views = sales + Math.floor(Math.random() * 50) + 20; // Ensure views > sales
            return {
                name: p.name,
                views,
                sales,
                conversion: views > 0 ? ((sales / views) * 100).toFixed(1) : 0
            };
        }).sort((a, b) => b.views - a.views);

        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                repeatCustomerRate,
                dailyRevenueData,
                monthlyRevenueData,
                categoryData,
                topSellingProducts,
                highestViewedProducts
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { getAdminAnalytics };
