import React, { useState, useContext } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Sparkles, BrainCircuit, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

function Recommend() {
  const { backendUrl, products, currency } = useContext(ShopContext);

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const [formData, setFormData] = useState({
    scentFamily: 'Woody',
    occasion: 'Office',
    gender: 'Unisex',
    budget: '5000',
    longevity: 'Moderate (4-8 hours)'
  });

  const onChangeHandler = (event) => {
    setFormData(data => ({ ...data, [event.target.name]: event.target.value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setRecommendations(null);

    try {
      const response = await axios.post(`${backendUrl}/api/ai/recommend`, formData);
      if (response.data.success) {
        // Map recommendation data from backend to actual products
        const mapped = response.data.recommendations.map(rec => {
          const product = products.find(p => p._id.toString() === rec.productId.toString());
          return {
            product,
            reasoning: rec.reasoning
          };
        }).filter(item => item.product !== undefined); // Filter out any unfound products

        setRecommendations(mapped);
        toast.success("AI Fragrance Recommendation Generated!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='border-t pt-16 pb-20 min-h-[85vh]'>
      <div className='text-center mb-10'>
        <div className='text-3xl mb-2 flex items-center justify-center gap-2'>
          <Title text1={'AI FRAGRANCE'} text2={'SOMMELIER'} />
        </div>
        <p className='text-gray-500 text-xs sm:text-sm max-w-lg m-auto'>
          Harness the power of Gemini AI. Describe your profile and allow the AI sommelier to recommend the perfect luxury perfume matching your chemistry.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-10 items-start mt-10'>
        {/* Left Side: Form */}
        <form onSubmit={onSubmitHandler} className='w-full lg:max-w-[400px] bg-[#faf9f6] border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-5'>
          <div className='flex items-center gap-2 border-b pb-3'>
            <BrainCircuit className='w-5 h-5 text-[#c5a880]' />
            <h3 className='font-bold text-gray-800 text-base prata-regular'>Preference Profile</h3>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Scent Family</label>
            <select name="scentFamily" value={formData.scentFamily} onChange={onChangeHandler} className='border rounded p-2 bg-white text-sm focus:outline-none focus:border-[#c5a880]'>
              <option value="Woody">Woody & Smoky (Oud, Sandalwood, Cedar)</option>
              <option value="Floral">Floral & Sweet (Jasmine, Rose, Peony)</option>
              <option value="Citrus">Citrus & Fresh (Bergamot, Lime, Grapefruit)</option>
              <option value="Oriental">Oriental & Spicy (Cinnamon, Amber, Musk)</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Occasion</label>
            <select name="occasion" value={formData.occasion} onChange={onChangeHandler} className='border rounded p-2 bg-white text-sm focus:outline-none focus:border-[#c5a880]'>
              <option value="Office">Office & Daily Work</option>
              <option value="Date Night">Date Night & Intimate Gatherings</option>
              <option value="Casual Outing">Casual Outing & Weekend</option>
              <option value="Wedding / Formal">Wedding & Formal Celebrations</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Gender Preference</label>
            <select name="gender" value={formData.gender} onChange={onChangeHandler} className='border rounded p-2 bg-white text-sm focus:outline-none focus:border-[#c5a880]'>
              <option value="Unisex">Unisex (For Everyone)</option>
              <option value="Men">Men (Masculine)</option>
              <option value="Women">Women (Feminine)</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Max Budget Limit</label>
            <select name="budget" value={formData.budget} onChange={onChangeHandler} className='border rounded p-2 bg-white text-sm focus:outline-none focus:border-[#c5a880]'>
              <option value="2500">Under Rs. 2,500</option>
              <option value="4000">Under Rs. 4,000</option>
              <option value="5000">Under Rs. 5,000</option>
              <option value="10000">No Limit (Ultra Luxury)</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Longevity Preference</label>
            <select name="longevity" value={formData.longevity} onChange={onChangeHandler} className='border rounded p-2 bg-white text-sm focus:outline-none focus:border-[#c5a880]'>
              <option value="Subtle (2-4 hours)">Subtle Skin Scent (2-4 hours)</option>
              <option value="Moderate (4-8 hours)">Moderate Sillage (4-8 hours)</option>
              <option value="Eternal (8+ hours)">Eternal Projection (8+ hours)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className='bg-black text-white py-3 rounded text-sm font-semibold hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:bg-gray-400'
          >
            <Sparkles className='w-4 h-4 text-[#c5a880] fill-[#c5a880]' />
            {loading ? "Generating Scent Matches..." : "Consult AI Sommelier"}
          </button>
        </form>

        {/* Right Side: Results */}
        <div className='flex-1 w-full'>
          {loading && (
            <div className='text-center py-20 bg-[#faf9f6] border rounded-lg animate-pulse flex flex-col items-center justify-center gap-4'>
              <div className='w-12 h-12 border-4 border-[#c5a880] border-t-transparent rounded-full animate-spin'></div>
              <p className='text-gray-600 font-semibold prata-regular'>Aria is compiling fragrance profiles...</p>
              <p className='text-xs text-gray-400 max-w-xs'>Comparing notes matching: {formData.scentFamily} scent families under Rs. {formData.budget}</p>
            </div>
          )}

          {!loading && !recommendations && (
            <div className='text-center py-24 bg-[#faf9f6] border border-dashed rounded-lg flex flex-col items-center justify-center gap-3'>
              <HeartHandshake className='w-10 h-10 text-[#c5a880] stroke-1' />
              <h3 className='text-gray-600 font-bold prata-regular text-lg'>AI Recommendations Await</h3>
              <p className='text-xs text-gray-400 max-w-xs m-auto'>Configure your fragrance parameters on the left and click Consult to generate bespoke matches.</p>
            </div>
          )}

          {recommendations && (
            <div className='flex flex-col gap-6 animate-fade-in'>
              <div className='border-b pb-2 font-semibold text-gray-800 text-lg prata-regular'>
                Top AI Scent Recommendations:
              </div>

              {recommendations.length === 0 ? (
                <p className='text-gray-500 text-sm'>No exact matches found matching your budget limits. Try expanding your budget selector.</p>
              ) : (
                recommendations.map((item, idx) => (
                  <div key={idx} className='bg-[#faf9f6] border border-gray-100 hover:border-gray-200 p-6 rounded-lg flex flex-col sm:flex-row gap-6 items-start hover:shadow-md transition-all duration-300'>
                    <img src={item.product.image[0]} className='w-24 sm:w-28 rounded object-cover border' alt="" />
                    <div className='flex-1'>
                      <div className='flex justify-between items-start gap-2'>
                        <div>
                          <h4 className='font-bold text-gray-900 text-lg prata-regular'>{item.product.name}</h4>
                          <p className='text-xs text-gray-400 mt-0.5'>{item.product.category} • {item.product.subCategory}</p>
                        </div>
                        <span className='font-semibold text-[#c5a880] text-lg'>{currency}{item.product.price}</span>
                      </div>
                      
                      {/* Scent notes tag list */}
                      <div className='flex gap-1.5 flex-wrap mt-2.5'>
                        <span className='bg-white border px-2 py-0.5 rounded text-[10px] text-gray-500'>Top: {item.product.notes.top}</span>
                        <span className='bg-white border px-2 py-0.5 rounded text-[10px] text-gray-500'>Heart: {item.product.notes.heart}</span>
                        <span className='bg-white border px-2 py-0.5 rounded text-[10px] text-gray-500'>Base: {item.product.notes.base}</span>
                      </div>

                      {/* AI Reasoning */}
                      <div className='mt-4 p-3 bg-white border border-[#e5e5e5] rounded text-xs text-gray-600 leading-relaxed border-l-4 border-l-[#c5a880]'>
                        <p className='font-semibold text-gray-800 mb-1 flex items-center gap-1'>
                          <Sparkles className='w-3.5 h-3.5 text-[#c5a880] fill-[#c5a880]' />
                          Why Aria recommends this:
                        </p>
                        {item.reasoning}
                      </div>

                      <div className='mt-4 flex gap-4'>
                        <Link to={`/product/${item.product._id}`} className='bg-black text-white px-5 py-2 text-xs font-semibold hover:bg-gray-800 transition-colors duration-200 rounded-sm'>
                          View Scent Page
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recommend;
