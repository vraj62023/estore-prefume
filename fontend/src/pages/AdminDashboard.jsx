import React, { useState, useEffect, useContext } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Sparkles, Plus, Edit2, Trash2, ShieldAlert, Package, 
  TrendingUp, Users, ShoppingBag, Database, History, RefreshCw, Gift
} from 'lucide-react';

const COLORS = ['#c5a880', '#111111', '#8c8c8c', '#d5d5d5', '#b09b70'];

function AdminDashboard() {
  const { token, backendUrl, currency, products, fetchProducts } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, products, orders, logs

  // Analytics State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Products CRUD State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Product Form Input State
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Unisex',
    subCategory: 'Eau de Parfum',
    sizes: '["50ml", "100ml"]',
    bestseller: 'false',
    stock: '50',
    topNotes: '',
    heartNotes: '',
    baseNotes: ''
  });
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Logs State
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '' });

  // Fetch Coupons
  const fetchCoupons = async () => {
    if (!token) return;
    setCouponsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/coupon/list`, {
        headers: { token }
      });
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCouponsLoading(false);
    }
  };

  // Add Coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/coupon/add`, couponForm, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setCouponForm({ code: '', discountPercent: '' });
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Toggle Coupon Active Status
  const handleToggleCoupon = async (couponId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/coupon/toggle`, { couponId }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const response = await axios.post(`${backendUrl}/api/coupon/delete`, { couponId }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Fetch Admin Analytics
  const fetchAnalytics = async () => {
    if (!token) return;
    setStatsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/admin/analytics`, {}, {
        headers: { token }
      });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch All Orders
  const fetchAllOrders = async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: { token }
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Admin Activity Logs
  const fetchLogs = async () => {
    if (!token) return;
    setLogsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/admin/logs`, {}, {
        headers: { token }
      });
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLogsLoading(false);
    }
  };

  // Trigger loading based on active tab
  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'orders') fetchAllOrders();
    if (activeTab === 'logs') fetchLogs();
    if (activeTab === 'coupons') fetchCoupons();
  }, [activeTab, token]);

  // AI Description Generator
  const handleGenerateDescription = async () => {
    if (!productForm.name) {
      toast.warn("Please enter a product name first");
      return;
    }
    
    setGenLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/generate-description`, {
        name: productForm.name,
        notes: {
          top: productForm.topNotes,
          heart: productForm.heartNotes,
          base: productForm.baseNotes
        }
      }, {
        headers: { token }
      });

      if (response.data.success) {
        setProductForm(prev => ({ ...prev, description: response.data.description }));
        toast.success("AI Luxury Description Generated!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setGenLoading(false);
    }
  };

  // Handle Product CRUD submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("price", productForm.price);
      formData.append("category", productForm.category);
      formData.append("subCategory", productForm.subCategory);
      formData.append("sizes", productForm.sizes);
      formData.append("bestseller", productForm.bestseller);
      formData.append("stock", productForm.stock || '50');
      formData.append("topNotes", productForm.topNotes);
      formData.append("heartNotes", productForm.heartNotes);
      formData.append("baseNotes", productForm.baseNotes);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      let response;
      if (editProductId) {
        formData.append("productId", editProductId);
        response = await axios.post(`${backendUrl}/api/product/edit`, formData, {
          headers: { token }
        });
      } else {
        response = await axios.post(`${backendUrl}/api/product/add`, formData, {
          headers: { token }
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowAddForm(false);
        setEditProductId(null);
        
        // Reset file inputs
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        
        // Reset text inputs
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: 'Unisex',
          subCategory: 'Eau de Parfum',
          sizes: '["50ml", "100ml"]',
          bestseller: 'false',
          stock: '50',
          topNotes: '',
          heartNotes: '',
          baseNotes: ''
        });

        fetchProducts(); // Refresh Catalog
        if (activeTab === 'analytics') fetchAnalytics();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Edit Product setup
  const startEditProduct = (prod) => {
    setEditProductId(prod._id);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      category: prod.category,
      subCategory: prod.subCategory,
      sizes: JSON.stringify(prod.sizes),
      bestseller: prod.bestseller ? "true" : "false",
      stock: (prod.stock || 50).toString(),
      topNotes: prod.notes?.top || '',
      heartNotes: prod.notes?.heart || '',
      baseNotes: prod.notes?.base || ''
    });
    setShowAddForm(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this perfume?")) return;

    try {
      const response = await axios.post(`${backendUrl}/api/product/delete`, { productId: id }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Change Order Status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, {
        orderId,
        status: newStatus
      }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success("Order status updated!");
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='border-t pt-10 pb-20 min-h-[90vh] flex flex-col md:flex-row gap-8'>
      
      {/* Sidebar Navigation */}
      <div className='w-full md:w-56 shrink-0 flex flex-col gap-2'>
        <div className='mb-4 px-2'>
          <h2 className='text-gray-900 font-bold text-xl prata-regular tracking-wide'>Admin Console</h2>
          <p className='text-gray-400 text-[10px] uppercase font-semibold'>Control Center</p>
        </div>
        <button 
          onClick={() => { setActiveTab('analytics'); setShowAddForm(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors duration-150 text-left ${activeTab === 'analytics' ? 'bg-[#c5a880] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <TrendingUp className='w-4 h-4' />
          Overview & Charts
        </button>
        <button 
          onClick={() => { setActiveTab('products'); }}
          className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors duration-150 text-left ${activeTab === 'products' ? 'bg-[#c5a880] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <Package className='w-4 h-4' />
          Products Catalog
        </button>
        <button 
          onClick={() => { setActiveTab('orders'); setShowAddForm(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors duration-150 text-left ${activeTab === 'orders' ? 'bg-[#c5a880] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <ShoppingBag className='w-4 h-4' />
          Orders Dashboard
        </button>
        <button 
          onClick={() => { setActiveTab('logs'); setShowAddForm(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors duration-150 text-left ${activeTab === 'logs' ? 'bg-[#c5a880] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <History className='w-4 h-4' />
          Admin Activity Logs
        </button>
        <button 
          onClick={() => { setActiveTab('coupons'); setShowAddForm(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors duration-150 text-left ${activeTab === 'coupons' ? 'bg-[#c5a880] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <Gift className='w-4 h-4' />
          Discount Coupons
        </button>
      </div>

      {/* Main Workspace Area */}
      <div className='flex-1 min-w-0 bg-[#faf9f6]/40 p-6 rounded-lg border border-gray-100'>
        
        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className='flex flex-col gap-8'>
            <div className='flex justify-between items-center border-b pb-3'>
              <h3 className='text-lg font-bold text-gray-800 prata-regular uppercase tracking-wider'>Executive Summary</h3>
              <button onClick={fetchAnalytics} className='p-2 hover:bg-gray-100 rounded text-gray-400' title="Reload Analytics">
                <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {statsLoading ? (
              <p className='text-gray-400 text-sm animate-pulse'>Compiling financial and sales metrics...</p>
            ) : !stats ? (
              <p className='text-gray-500 text-sm'>No analytical aggregates found. Place some orders to generate statistics.</p>
            ) : (
              <div className='flex flex-col gap-8'>
                {/* Metrics top bar */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-1'>
                    <span className='text-[10px] text-gray-400 font-semibold uppercase'>Total Sales Revenue</span>
                    <b className='text-2xl font-bold text-gray-900'>{currency}{stats.totalRevenue.toLocaleString()}</b>
                  </div>
                  <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-1'>
                    <span className='text-[10px] text-gray-400 font-semibold uppercase'>Total Invoices</span>
                    <b className='text-2xl font-bold text-gray-900'>{stats.totalOrders} Orders</b>
                  </div>
                  <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-1'>
                    <span className='text-[10px] text-gray-400 font-semibold uppercase'>Active Fragrances</span>
                    <b className='text-2xl font-bold text-gray-900'>{stats.totalProducts} Items</b>
                  </div>
                  <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-1'>
                    <span className='text-[10px] text-gray-400 font-semibold uppercase'>Repeat Customer Rate</span>
                    <b className='text-2xl font-bold text-gray-900'>{stats.repeatCustomerRate}% Rate</b>
                  </div>
                </div>

                {/* Charts section */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Daily Sales Chart */}
                  <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-2'>
                    <span className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>Daily Sales Revenue (Last 7 Days)</span>
                    <div className='h-60 w-full mt-2'>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.dailyRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value) => `${currency}${value}`} />
                          <Area type="monotone" dataKey="revenue" stroke="#c5a880" fill="#faf9f6" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Sales Chart */}
                  <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-2'>
                    <span className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>Monthly Revenue</span>
                    <div className='h-60 w-full mt-2'>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.monthlyRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => `${currency}${value}`} />
                          <Bar dataKey="revenue" fill="#111111" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category Share Pie Chart */}
                  <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-2'>
                    <span className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>Sales Distribution by Scent Profile</span>
                    <div className='h-60 w-full mt-2 flex items-center justify-center'>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${currency}${value}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Selling Products */}
                  <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-2 overflow-y-auto max-h-[300px]'>
                    <span className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>Top 5 Selling Fragrances</span>
                    <table className='w-full text-left text-xs border-collapse mt-2'>
                      <thead>
                        <tr className='border-b bg-gray-50 text-gray-500 uppercase font-semibold'>
                          <th className='p-2'>Perfume Name</th>
                          <th className='p-2 text-center'>Qty Sold</th>
                          <th className='p-2 text-right'>Revenue Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topSellingProducts.map((item, i) => (
                          <tr key={i} className='border-b hover:bg-gray-50'>
                            <td className='p-2 font-semibold text-gray-900'>{item.name}</td>
                            <td className='p-2 text-center text-gray-600'>{item.quantity}</td>
                            <td className='p-2 text-right font-bold text-gray-900'>{currency}{item.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Conversion Table */}
                <div className='bg-white p-4 border rounded shadow-sm flex flex-col gap-2'>
                  <span className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>Scent Impressions & Conversion Rates</span>
                  <table className='w-full text-left text-xs border-collapse mt-2'>
                    <thead>
                      <tr className='border-b bg-gray-50 text-gray-400 font-semibold uppercase'>
                        <th className='p-2.5'>Product Signature</th>
                        <th className='p-2.5 text-center'>Mock Page Views</th>
                        <th className='p-2.5 text-center'>Orders Confirmed</th>
                        <th className='p-2.5 text-right'>Cart Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.highestViewedProducts.map((item, i) => (
                        <tr key={i} className='border-b hover:bg-gray-50'>
                          <td className='p-2.5 font-bold text-gray-800'>{item.name}</td>
                          <td className='p-2.5 text-center text-gray-600'>{item.views}</td>
                          <td className='p-2.5 text-center text-gray-600'>{item.sales}</td>
                          <td className='p-2.5 text-right font-bold text-[#c5a880]'>{item.conversion}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className='flex flex-col gap-6'>
            {!showAddForm ? (
              <>
                <div className='flex justify-between items-center border-b pb-3'>
                  <h3 className='text-lg font-bold text-gray-800 prata-regular uppercase tracking-wider'>Fragrances Catalog ({products.length})</h3>
                  <button 
                    onClick={() => { setEditProductId(null); setShowAddForm(true); }}
                    className='bg-black text-white px-4 py-2 rounded text-xs font-semibold hover:bg-gray-800 transition-all flex items-center gap-1.5 cursor-pointer'
                  >
                    <Plus className='w-4 h-4' /> Add Perfume
                  </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {products.map((item, idx) => (
                    <div key={idx} className='bg-white p-4 border rounded shadow-sm hover:shadow transition-shadow flex gap-4 items-center relative group'>
                      <img src={item.image[0]} className='w-16 h-16 object-cover rounded border' alt="" />
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-bold text-gray-900 text-sm truncate'>{item.name}</h4>
                        <p className='text-[10px] text-gray-400'>{item.category} • {item.subCategory}</p>
                        <p className='text-sm font-semibold text-[#c5a880] mt-1'>{currency}{item.price}</p>
                        <p className='text-[10px] text-gray-500 mt-0.5'>Stock: <span className={`font-semibold ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{item.stock || 0} units</span></p>
                        
                        <div className='flex gap-1.5 mt-2'>
                          <button onClick={() => startEditProduct(item)} className='text-gray-400 hover:text-black p-1 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer'>
                            <Edit2 className='w-3.5 h-3.5' />
                          </button>
                          <button onClick={() => handleDeleteProduct(item._id)} className='text-gray-400 hover:text-red-500 p-1 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer'>
                            <Trash2 className='w-3.5 h-3.5' />
                          </button>
                        </div>
                      </div>
                      
                      {item.bestseller && (
                        <span className='absolute top-2 right-2 bg-[#c5a880]/15 text-[#c5a880] text-[9px] font-bold px-1.5 py-0.5 rounded'>Bestseller</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Add/Edit Perfume Form
              <form onSubmit={handleProductSubmit} className='flex flex-col gap-4 max-w-2xl bg-white p-6 border rounded shadow-sm'>
                <div className='flex justify-between items-center border-b pb-3 mb-2'>
                  <h4 className='font-bold text-base text-gray-800 prata-regular'>{editProductId ? "Modify Perfume Formula" : "Introduce New Perfume"}</h4>
                  <button type="button" onClick={() => setShowAddForm(false)} className='text-xs text-gray-400 hover:text-black underline cursor-pointer'>Cancel</button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-semibold uppercase text-gray-500'>Perfume Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Amber Signature"
                      value={productForm.name} 
                      onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-gray-50/50' 
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-semibold uppercase text-gray-500'>Price (Rs.)</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="e.g. 4500"
                      value={productForm.price} 
                      onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-gray-50/50' 
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-semibold uppercase text-gray-500'>Stock Quantity</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="e.g. 50"
                      value={productForm.stock} 
                      onChange={(e) => setProductForm(p => ({ ...p, stock: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-gray-50/50' 
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-semibold uppercase text-gray-500'>Category</label>
                    <select 
                      value={productForm.category} 
                      onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-white'
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-semibold uppercase text-gray-500'>Concentration Type</label>
                    <select 
                      value={productForm.subCategory} 
                      onChange={(e) => setProductForm(p => ({ ...p, subCategory: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-white'
                    >
                      <option value="Eau de Parfum">Eau de Parfum</option>
                      <option value="Eau de Toilette">Eau de Toilette</option>
                      <option value="Extrait de Parfum">Extrait de Parfum</option>
                      <option value="Cologne">Cologne</option>
                      <option value="Perfume Oil">Perfume Oil</option>
                      <option value="Body Mist">Body Mist</option>
                      <option value="Rollerball">Rollerball</option>
                    </select>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-semibold uppercase text-gray-500'>Sizing Options (JSON Array)</label>
                    <input 
                      required 
                      type="text" 
                      placeholder='e.g. ["50ml", "100ml"]'
                      value={productForm.sizes} 
                      onChange={(e) => setProductForm(p => ({ ...p, sizes: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-gray-50/50' 
                    />
                  </div>
                </div>

                {/* Scent notes */}
                <div className='bg-[#faf9f6] p-4 rounded border grid grid-cols-1 sm:grid-cols-3 gap-3'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-bold uppercase text-[#c5a880]'>Top Notes</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bergamot, Saffron"
                      value={productForm.topNotes} 
                      onChange={(e) => setProductForm(p => ({ ...p, topNotes: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-white' 
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-bold uppercase text-[#c5a880]'>Heart Notes</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rose, Cinnamon"
                      value={productForm.heartNotes} 
                      onChange={(e) => setProductForm(p => ({ ...p, heartNotes: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-white' 
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-bold uppercase text-[#c5a880]'>Base Notes</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ambergris, Oud"
                      value={productForm.baseNotes} 
                      onChange={(e) => setProductForm(p => ({ ...p, baseNotes: e.target.value }))}
                      className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-white' 
                    />
                  </div>
                </div>

                {/* Product Description with AI writing triggers */}
                <div className='flex flex-col gap-1.5'>
                  <div className='flex justify-between items-center'>
                    <label className='text-[10px] font-semibold uppercase text-gray-500'>Scent Copywriter Description</label>
                    <button 
                      type="button" 
                      onClick={handleGenerateDescription}
                      disabled={genLoading}
                      className='text-[10px] font-bold text-[#c5a880] hover:text-[#b09b70] disabled:text-gray-400 flex items-center gap-1 cursor-pointer'
                    >
                      <Sparkles className='w-3 h-3 fill-[#c5a880]' />
                      {genLoading ? "Aria is writing..." : "Draft Description with AI"}
                    </button>
                  </div>
                  <textarea 
                    required 
                    rows={3}
                    placeholder="Describe the fragrance profile, projection, and wear..."
                    value={productForm.description} 
                    onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                    className='border p-2.5 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-gray-50/50 resize-none' 
                  />
                </div>

                {/* Image Files Uploads */}
                <div className='flex flex-col gap-2'>
                  <label className='text-[10px] font-semibold uppercase text-gray-500'>Upload Product Images (Up to 4)</label>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                    <input type="file" onChange={(e) => setImage1(e.target.files[0])} className='text-xs border p-1 rounded' />
                    <input type="file" onChange={(e) => setImage2(e.target.files[0])} className='text-xs border p-1 rounded' />
                    <input type="file" onChange={(e) => setImage3(e.target.files[0])} className='text-xs border p-1 rounded' />
                    <input type="file" onChange={(e) => setImage4(e.target.files[0])} className='text-xs border p-1 rounded' />
                  </div>
                  <p className='text-[9px] text-gray-400'>(Leave blank to keep current images or use default luxury bottle mockup URLs)</p>
                </div>

                <div className='flex items-center gap-2.5 mt-2'>
                  <input 
                    type="checkbox" 
                    id="bestseller-chk"
                    checked={productForm.bestseller === "true"}
                    onChange={(e) => setProductForm(p => ({ ...p, bestseller: e.target.checked ? "true" : "false" }))}
                    className='w-3.5 h-3.5 accent-[#c5a880]'
                  />
                  <label htmlFor="bestseller-chk" className='text-xs font-semibold text-gray-700 cursor-pointer'>Feature as Brand Bestseller</label>
                </div>

                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className='bg-black text-white py-3 rounded text-sm font-semibold hover:bg-gray-800 transition-all cursor-pointer disabled:bg-gray-400 mt-2'
                >
                  {submitLoading ? "Publishing Scent Formula..." : (editProductId ? "Save Formula Changes" : "Release Fragrance")}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS DASHBOARD */}
        {activeTab === 'orders' && (
          <div className='flex flex-col gap-6'>
            <div className='flex justify-between items-center border-b pb-3'>
              <h3 className='text-lg font-bold text-gray-800 prata-regular uppercase tracking-wider'>Customer Orders ({orders.length})</h3>
              <button onClick={fetchAllOrders} className='p-2 hover:bg-gray-100 rounded text-gray-400'>
                <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {ordersLoading ? (
              <p className='text-gray-400 text-sm animate-pulse'>Fetching current customer invoices...</p>
            ) : orders.length === 0 ? (
              <p className='text-gray-500 text-sm'>No customer orders found.</p>
            ) : (
              <div className='flex flex-col gap-4'>
                {orders.map((order, idx) => (
                  <div key={idx} className='bg-white border rounded p-5 shadow-sm text-xs text-gray-700 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between'>
                    
                    {/* Items List */}
                    <div className='flex-1 flex gap-3 items-start min-w-[240px]'>
                      <div className='bg-[#faf9f6] p-2.5 rounded border flex-shrink-0'>
                        <Package className='w-8 h-8 text-[#c5a880] stroke-1' />
                      </div>
                      <div>
                        <div className='font-bold text-gray-900 text-sm'>
                          {order.items.map((item, i) => `${item.name} (${item.size}) x ${item.quantity}`).join(', ')}
                        </div>
                        <p className='text-gray-500 mt-1.5'>
                          <strong>Buyer:</strong> {order.address.firstName} {order.address.lastName} <br />
                          <strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}
                        </p>
                        <p className='text-[10px] text-gray-400 mt-1'>ID: {order._id} • Date: {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Stats & Totals */}
                    <div className='flex flex-col gap-1 w-32 shrink-0'>
                      <span className='font-bold text-gray-900 text-sm'>{currency}{order.amount}</span>
                      <span className='text-gray-500'>Method: {order.paymentMethod}</span>
                      <span className={`font-semibold ${order.payment ? 'text-green-600' : 'text-red-500'}`}>
                        {order.payment ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <div className='w-44 shrink-0 flex flex-col gap-1'>
                      <label className='text-[9px] uppercase font-semibold text-gray-400'>Fulfillment Status</label>
                      <select 
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                        className='border p-1.5 text-xs bg-white focus:outline-none focus:border-[#c5a880] rounded font-semibold text-gray-800'
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACTIVITY LOGS TIMELINE */}
        {activeTab === 'logs' && (
          <div className='flex flex-col gap-6'>
            <div className='flex justify-between items-center border-b pb-3'>
              <h3 className='text-lg font-bold text-gray-800 prata-regular uppercase tracking-wider'>Admin Activity Logs</h3>
              <button onClick={fetchLogs} className='p-2 hover:bg-gray-100 rounded text-gray-400'>
                <RefreshCw className={`w-4 h-4 ${logsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {logsLoading ? (
              <p className='text-gray-400 text-sm animate-pulse'>Loading timeline records...</p>
            ) : logs.length === 0 ? (
              <p className='text-gray-500 text-sm'>No admin activity has been logged yet.</p>
            ) : (
              <div className='flex flex-col border-l-2 border-[#c5a880]/30 pl-4 ml-2 gap-6 py-2'>
                {logs.map((log, index) => (
                  <div key={index} className='relative flex flex-col gap-1 text-xs text-gray-700 bg-white p-4 border rounded shadow-sm hover:shadow-md transition-all duration-150'>
                    {/* Bullet marker */}
                    <div className='absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full border-2 border-[#c5a880] bg-white'></div>
                    
                    <div className='flex justify-between items-center'>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        log.action === 'CREATE_PRODUCT' ? 'bg-green-500/10 text-green-700' :
                        log.action === 'EDIT_PRODUCT' ? 'bg-blue-500/10 text-blue-700' :
                        'bg-red-500/10 text-red-700'
                      }`}>
                        {log.action}
                      </span>
                      <span className='text-[10px] text-gray-400'>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    
                    <p className='mt-1.5 font-medium text-gray-800'>{log.details}</p>
                    <p className='text-[10px] text-gray-400 mt-1'><strong>Triggered By:</strong> {log.user}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* TAB 5: DISCOUNT COUPONS */}
        {activeTab === 'coupons' && (
          <div className='flex flex-col gap-6'>
            <div className='flex justify-between items-center border-b pb-3'>
              <h3 className='text-lg font-bold text-gray-800 prata-regular uppercase tracking-wider'>Discount Coupons Management</h3>
              <button onClick={fetchCoupons} className='p-2 hover:bg-gray-100 rounded text-gray-400' title="Reload Coupons">
                <RefreshCw className={`w-4 h-4 ${couponsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
              {/* Add Coupon Form */}
              <form onSubmit={handleAddCoupon} className='bg-white p-5 border rounded-lg shadow-sm flex flex-col gap-4'>
                <h4 className='text-xs font-bold text-gray-800 uppercase tracking-widest border-b pb-2'>Create New Coupon</h4>
                <div className='flex flex-col gap-1'>
                  <label className='text-[10px] font-semibold uppercase text-gray-500'>Coupon Code</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. SCENT50"
                    value={couponForm.code} 
                    onChange={(e) => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-gray-50/50 uppercase font-semibold' 
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className='text-[10px] font-semibold uppercase text-gray-500'>Discount Percentage (%)</label>
                  <input 
                    required 
                    type="number" 
                    min="1"
                    max="100"
                    placeholder="e.g. 20"
                    value={couponForm.discountPercent} 
                    onChange={(e) => setCouponForm(p => ({ ...p, discountPercent: e.target.value }))}
                    className='border p-2 text-xs focus:outline-none focus:border-[#c5a880] rounded bg-gray-50/50' 
                  />
                </div>
                <button 
                  type="submit"
                  disabled={submitLoading}
                  className='bg-black text-white py-2.5 rounded text-xs font-bold hover:bg-gray-800 transition-all uppercase tracking-wider mt-2 cursor-pointer'
                >
                  {submitLoading ? 'Creating...' : 'Create Coupon'}
                </button>
              </form>

              {/* Coupons List Table */}
              <div className='lg:col-span-2 bg-white border rounded-lg shadow-sm p-5 flex flex-col gap-4 overflow-x-auto'>
                <h4 className='text-xs font-bold text-gray-800 uppercase tracking-widest border-b pb-2'>Active Promo Codes</h4>
                {couponsLoading ? (
                  <p className='text-gray-400 text-xs animate-pulse'>Fetching coupons from database...</p>
                ) : coupons.length === 0 ? (
                  <p className='text-gray-450 text-xs italic'>No coupon codes found in database.</p>
                ) : (
                  <table className='w-full text-left text-xs border-collapse'>
                    <thead>
                      <tr className='border-b bg-gray-50 text-gray-500 font-bold uppercase'>
                        <th className='p-3'>Promo Code</th>
                        <th className='p-3 text-center'>Discount</th>
                        <th className='p-3 text-center'>Status</th>
                        <th className='p-3 text-center'>Actions</th>
                        <th className='p-3 text-right'>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon, i) => (
                        <tr key={i} className='border-b hover:bg-gray-50'>
                          <td className='p-3 font-bold text-gray-900 tracking-wider'>{coupon.code}</td>
                          <td className='p-3 text-center font-semibold text-gray-700'>{coupon.discountPercent}% OFF</td>
                          <td className='p-3 text-center'>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              coupon.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td className='p-3 text-center'>
                            <button 
                              onClick={() => handleToggleCoupon(coupon._id)}
                              className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors duration-150 ${
                                coupon.isActive 
                                  ? 'border border-red-200 text-red-600 hover:bg-red-50 animate-fade-in' 
                                  : 'border border-green-200 text-green-600 hover:bg-green-50 animate-fade-in'
                              }`}
                            >
                              {coupon.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                          <td className='p-3 text-right'>
                            <button 
                              onClick={() => handleDeleteCoupon(coupon._id)}
                              className='text-gray-400 hover:text-red-600 p-1 hover:bg-gray-50 rounded cursor-pointer transition-colors'
                              title="Delete Coupon"
                            >
                              <Trash2 className='w-4 h-4 inline' />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
