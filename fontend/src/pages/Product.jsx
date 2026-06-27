import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import { assets } from '../assets/assets.js';
import RelatedProducts from '../components/RelatedProducts.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Sparkles, Heart, Eye } from 'lucide-react';

function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token, toggleWishlist, wishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  // Scent features
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'desc'
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchProductData = async () => {
    const item = products.find(p => p._id.toString() === productId.toString());
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
      if (item.sizes && item.sizes.length > 0) {
        setSize(item.sizes[0]);
      }
      
      // Register View locally for Recently Viewed
      registerView(item._id);
    }
  };

  const registerView = (id) => {
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    viewed = viewed.filter(vId => vId !== id); // Remove duplicates
    viewed.unshift(id); // Add to beginning
    const sliced = viewed.slice(0, 5); // Keep last 5
    localStorage.setItem('recentlyViewed', JSON.stringify(sliced));
    
    // Map IDs to actual product objects
    const mapped = sliced
      .map(vId => products.find(p => p._id.toString() === vId.toString()))
      .filter(Boolean);
    setRecentlyViewed(mapped);
  };

  // Fetch AI Review Summary
  const fetchAiSummary = async () => {
    setAiLoading(true);
    setAiSummary('');
    try {
      const response = await axios.post(`${backendUrl}/api/ai/summarize-reviews`, { productId });
      if (response.data.success) {
        setAiSummary(response.data.summary);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment) {
      toast.warn("Please write your comment review first");
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/product/review`, {
        productId,
        name: reviewName,
        rating: Number(reviewRating),
        comment: reviewComment
      });

      if (response.data.success) {
        toast.success("Thank you for sharing your scent feedback!");
        setReviewComment('');
        setReviewName('');
        
        // Refresh product reviews locally
        if (productData) {
          const updated = { ...productData, reviews: response.data.reviews };
          setProductData(updated);
        }
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

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // Fetch AI Summary once product reviews are loaded
  useEffect(() => {
    if (productData && productData.reviews && productData.reviews.length > 0) {
      fetchAiSummary();
    }
  }, [productData?.reviews?.length, productId]);

  const isFavorited = wishlist && wishlist.length > 0 && wishlist.some(p => p && p._id && p._id.toString() === productId.toString());

  return productData ? (
    <div className='border-t-2 pt-10 pb-20 transition-opacity ease-in duration-500 opacity-100'>
      
      {/* Product Details */}
      <div className='flex gap-12 flex-col md:flex-row'>
        {/* Left Side: Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 md:flex-row'>
          <div className='flex md:flex-col overflow-x-auto justify-between md:justify-normal md:w-[18.7%] w-full gap-2'>
            {productData.image.map((item, index) => (
              <img 
                onClick={() => setImage(item)} 
                src={item} 
                key={index} 
                className='w-[20%] cursor-pointer md:w-full md:mb-3 flex-shrink-0 border hover:border-[#c5a880] transition-colors rounded' 
                alt="" 
              />
            ))}
          </div>
          <div className='flex-1 border rounded overflow-hidden max-h-[500px] flex items-center justify-center bg-white'>
            <img src={image} alt="" className='w-auto max-h-full max-w-full object-contain' />
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className='flex-1'>
          <div className='flex justify-between items-start gap-4'>
            <h1 className='font-bold text-3xl text-gray-900 prata-regular'>{productData.name}</h1>
            <button 
              onClick={() => toggleWishlist(productData._id)}
              className='p-2 rounded-full border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all text-gray-400 hover:text-red-500 cursor-pointer'
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          <div className='flex items-center gap-1 mt-2 text-xs text-[#c5a880]'>
            {Array.from({ length: 5 }).map((_, idx) => (
              <img 
                key={idx} 
                src={idx < Math.round(productData.reviews.reduce((a, b) => a + b.rating, 0) / (productData.reviews.length || 1)) ? assets.star_icon : assets.star_dull_icon} 
                alt="" 
                className='w-3.5 h-3.5' 
              />
            ))}
            <p className='pl-2 text-gray-500'>({productData.reviews.length} reviews)</p>
          </div>

          <p className='mt-5 text-3xl font-semibold text-[#c5a880]'>{currency} {productData.price}</p>
          <p className='text-[10px] text-gray-400 mt-0.5'>{productData.category} • {productData.subCategory}</p>

          <p className='mt-5 text-gray-600 text-sm leading-relaxed'>{productData.description}</p>

          {/* Scent Notes / Description Tabs */}
          <div className='mt-8 border rounded overflow-hidden bg-[#faf9f6] border-gray-200'>
            <div className='flex border-b border-gray-200 text-xs font-semibold'>
              <button 
                onClick={() => setActiveTab('notes')} 
                className={`flex-1 py-3 text-center transition-all ${activeTab === 'notes' ? 'bg-white border-b-2 border-b-[#c5a880] text-black' : 'text-gray-500'}`}
              >
                FRAGRANCE PROFILE
              </button>
              <button 
                onClick={() => setActiveTab('details')} 
                className={`flex-1 py-3 text-center transition-all ${activeTab === 'details' ? 'bg-white border-b-2 border-b-[#c5a880] text-black' : 'text-gray-500'}`}
              >
                OLFACTORY NOTES
              </button>
            </div>
            
            <div className='p-4 text-xs text-gray-600 leading-relaxed'>
              {activeTab === 'notes' ? (
                <div className='flex flex-col gap-2.5'>
                  <div className='flex justify-between border-b pb-1'>
                    <span className='font-bold text-gray-700'>Scent Family:</span>
                    <span>{productData.category} / {productData.subCategory}</span>
                  </div>
                  <div className='flex justify-between border-b pb-1'>
                    <span className='font-bold text-gray-700'>Concentration:</span>
                    <span>{productData.subCategory}</span>
                  </div>
                  <div className='flex justify-between border-b pb-1'>
                    <span className='font-bold text-gray-700'>Longevity Sillage:</span>
                    <span>High / Eternal</span>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col items-center bg-white p-6 rounded border border-gray-150/40 shadow-inner w-full'>
                  <p className='text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-widest'>The Olfactory Evaporation Pyramid</p>
                  
                  <div className='flex flex-col items-center gap-1 w-full'>
                    {/* Top Notes (Triangle) */}
                    <div 
                      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                      className='w-48 h-14 bg-[#dfd3c3] hover:bg-[#c5a880] transition-colors duration-300 flex flex-col justify-end pb-2.5 items-center text-center cursor-help shadow-sm'
                      title="Top Notes (Evaporates in 15 mins): Immediate sparkling opening impression."
                    >
                      <span className='text-[8px] uppercase tracking-wider text-gray-700 font-bold opacity-80'>Top Notes</span>
                      <span className='text-xs font-bold text-gray-900 truncate max-w-[110px]'>{productData.notes?.top || "Fresh Notes"}</span>
                    </div>
                    
                    {/* Heart Notes (Trapezoid) */}
                    <div 
                      style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' }}
                      className='w-64 h-14 bg-[#c7b198] hover:bg-[#b09a81] transition-colors duration-300 flex flex-col justify-center items-center text-center cursor-help shadow-sm'
                      title="Heart Notes (Lasts 2-4 hours): The main signature core of the fragrance."
                    >
                      <span className='text-[8px] uppercase tracking-wider text-gray-800 font-bold opacity-80'>Heart Notes</span>
                      <span className='text-xs font-bold text-gray-900 truncate max-w-[150px]'>{productData.notes?.heart || "Floral Core"}</span>
                    </div>
                    
                    {/* Base Notes (Trapezoid) */}
                    <div 
                      style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
                      className='w-80 h-14 bg-[#a68b6d] hover:bg-[#8f7457] transition-colors duration-300 flex flex-col justify-center items-center text-center cursor-help shadow-sm'
                      title="Base Notes (Lasts 6-8+ hours): Deep, persistent fixatives that ground the scent."
                    >
                      <span className='text-[8px] uppercase tracking-wider text-white font-bold opacity-90'>Base Notes</span>
                      <span className='text-xs font-bold text-white truncate max-w-[190px]'>{productData.notes?.base || "Woody Base"}</span>
                    </div>
                  </div>

                  <p className='text-[9px] text-gray-400 mt-4 text-center italic'>Hover over each tier of the pyramid to explore details on sillage evaporation rates.</p>
                </div>
              )}
            </div>
          </div>

          {/* Volume selector */}
          <div className='flex flex-col gap-4 my-8'>
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>Select Volume</p>
            <div className='flex gap-3'>
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  key={index} 
                  className={`border py-2 px-6 text-xs bg-gray-50 hover:bg-gray-100 transition-all font-semibold rounded cursor-pointer ${item === size ? 'border-[#c5a880] bg-[#faf9f6] scale-105' : 'border-gray-200'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Indicator */}
          <div className='flex items-center gap-4 my-4 text-xs'>
            {productData.stock > 0 ? (
              <p className='text-green-600 font-semibold'>● In Stock ({productData.stock} units available)</p>
            ) : (
              <p className='text-red-500 font-bold'>● Out of Stock</p>
            )}
          </div>

          <button 
            onClick={() => productData.stock > 0 ? addToCart(productData._id, size) : null} 
            disabled={productData.stock <= 0}
            className={`px-10 py-3.5 text-xs font-bold transition-colors duration-200 cursor-pointer rounded-sm ${
              productData.stock > 0 
                ? 'bg-black text-white active:bg-gray-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {productData.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
          
          <hr className='mt-8 border-gray-200' />
          <div className='text-xs text-gray-500 mt-5 flex flex-col gap-1.5 leading-relaxed'>
            <p>🛡️ 100% Original Scent Formulation</p>
            <p>📦 Premium Silk Gift Wrapping included</p>
            <p>🔄 Easy Exchange & Return concierge service</p>
          </div>
        </div>
      </div>

      {/* AI Review Summary (if reviews exist) */}
      {productData.reviews && productData.reviews.length > 0 && (
        <div className='mt-16 bg-[#faf9f6] border border-[#c5a880]/30 rounded-lg p-6 border-l-4 border-l-[#c5a880]'>
          <h3 className='font-bold text-lg text-gray-800 prata-regular flex items-center gap-2 mb-2'>
            <Sparkles className='w-5 h-5 text-[#c5a880] fill-[#c5a880]' />
            Aria's Review Summary
          </h3>
          {aiLoading ? (
            <p className='text-xs text-gray-400 animate-pulse'>Aria is compiling customer reviews...</p>
          ) : (
            <p className='text-sm text-gray-600 leading-relaxed'>{aiSummary || "Customer feedbacks praise the projection and drydown of this scent signature."}</p>
          )}
        </div>
      )}

      {/* Reviews Section */}
      <div className='mt-16 border-t pt-10'>
        <h3 className='text-xl font-bold text-gray-900 prata-regular mb-6'>Customer Reviews ({productData.reviews.length})</h3>
        
        <div className='flex flex-col lg:flex-row gap-10 items-start'>
          {/* Review List */}
          <div className='flex-1 w-full flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2'>
            {productData.reviews.length === 0 ? (
              <p className='text-gray-500 text-sm'>No reviews yet. Be the first to share your scent impression!</p>
            ) : (
              productData.reviews.map((rev, index) => (
                <div key={index} className='p-4 border rounded bg-white text-xs flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <span className='font-bold text-gray-800'>{rev.name}</span>
                    <span className='text-[10px] text-gray-400'>{new Date(rev.date).toLocaleDateString()}</span>
                  </div>
                  <div className='flex gap-0.5'>
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <img 
                        key={sIdx} 
                        src={sIdx < rev.rating ? assets.star_icon : assets.star_dull_icon} 
                        className='w-3 h-3' 
                        alt="" 
                      />
                    ))}
                  </div>
                  <p className='text-gray-600 leading-relaxed mt-1'>{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <form onSubmit={handleReviewSubmit} className='w-full lg:max-w-[360px] p-5 border rounded bg-[#faf9f6] flex flex-col gap-3.5'>
            <h4 className='font-bold text-sm text-gray-800 uppercase tracking-widest border-b pb-2'>Leave a Scent Review</h4>
            <div className='flex flex-col gap-1'>
              <label className='text-[10px] font-semibold text-gray-500 uppercase'>Your Name</label>
              <input 
                value={reviewName} 
                onChange={(e) => setReviewName(e.target.value)} 
                type="text" 
                placeholder="Anonymous Enthusiast" 
                className='border p-2 bg-white text-xs focus:outline-none focus:border-[#c5a880] rounded' 
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[10px] font-semibold text-gray-500 uppercase'>Rating</label>
              <select 
                value={reviewRating} 
                onChange={(e) => setReviewRating(Number(e.target.value))} 
                className='border p-2 bg-white text-xs focus:outline-none focus:border-[#c5a880] rounded'
              >
                <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                <option value={3}>⭐⭐⭐ (Average)</option>
                <option value={2}>⭐⭐ (Poor)</option>
                <option value={1}>⭐ (Terrible)</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[10px] font-semibold text-gray-500 uppercase'>Comment</label>
              <textarea 
                value={reviewComment} 
                onChange={(e) => setReviewComment(e.target.value)} 
                rows={3} 
                required 
                placeholder="How is the longevity? What notes stand out?" 
                className='border p-2 bg-white text-xs focus:outline-none focus:border-[#c5a880] rounded resize-none'
              />
            </div>
            <button 
              type="submit" 
              disabled={submitLoading} 
              className='bg-black text-white py-2 text-xs font-semibold hover:bg-gray-800 transition-colors duration-200 cursor-pointer rounded-sm disabled:bg-gray-400'
            >
              {submitLoading ? "Submitting..." : "Submit Scent Review"}
            </button>
          </form>
        </div>
      </div>

      {/* Recently Viewed Carousel */}
      {recentlyViewed.length > 1 && (
        <div className='mt-20 border-t pt-10'>
          <h3 className='text-xl font-bold text-gray-900 prata-regular mb-6 flex items-center gap-2'>
            <Eye className='w-5 h-5 text-gray-400' />
            Recently Viewed Scents
          </h3>
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-6'>
            {recentlyViewed
              .filter(item => item._id !== productId) // Hide current product
              .map((item, index) => (
                <div key={index} className='border p-3 bg-white rounded hover:shadow transition-shadow'>
                  <Link to={`/product/${item._id}`} className='text-gray-700 cursor-pointer'>
                    <div className='overflow-hidden rounded aspect-square flex items-center justify-center bg-gray-50'>
                      <img className='hover:scale-105 transition ease-in-out max-h-full max-w-full object-contain' src={item.image[0]} alt="" />
                    </div>
                    <p className='pt-2 text-xs font-semibold text-gray-900 truncate'>{item.name}</p>
                    <p className='text-xs text-[#c5a880] mt-0.5'>{currency}{item.price}</p>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Related products */}
      <div className='mt-20'>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>

    </div>
  ) : <div className='opacity-0'></div>;
}

export default Product;