import React, { useEffect, useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
import Title from '../components/Title.jsx';
import { assets } from '../assets/assets.js';
import CartTotal from '../components/CartTotal.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Cart() {
  const { products, currency, cartItems, updateQuantity, applyCouponCode, discount, appliedCoupon } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const handleCheckout = () => {
    if (cartData.length === 0) {
      toast.warn("Your cart is empty");
      return;
    }
    
    // Check stock availability before checking out
    for (const item of cartData) {
      const prod = products.find(p => p._id.toString() === item._id.toString());
      if (prod && prod.stock < item.quantity) {
        toast.error(`Only ${prod.stock} units of ${prod.name} are available in stock. Please adjust quantities.`);
        return;
      }
    }

    navigate('/place-order');
  };

  return (
    <div className='border-t pt-14 pb-20 min-h-[80vh]'>
      <div className='text-2xl mb-5'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className='text-center py-16 bg-[#faf9f6] border rounded max-w-lg m-auto'>
          <p className='text-gray-500 font-semibold prata-regular text-lg'>Your cart is empty</p>
          <p className='text-xs text-gray-400 mt-1 mb-6'>Find your favorite fragrances and add them to your cart!</p>
          <button 
            onClick={() => navigate('/collection')} 
            className='bg-black text-white px-8 py-3 text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer rounded-sm'
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <div>
          {/* Cart Items List */}
          <div className='flex flex-col gap-1'>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id.toString() === item._id.toString());
              if (!productData) return null;
              
              return (
                <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 bg-white px-2 hover:bg-gray-50/50 rounded'>
                  <div className='flex items-start gap-6'>
                    <img src={productData.image[0]} alt="" className='w-16 sm:w-20 rounded border bg-[#faf9f6] object-contain' />
                    <div>
                      <h1 className='font-bold text-gray-800 text-sm sm:text-base'>{productData.name}</h1>
                      <div className='flex items-center gap-5 mt-2 text-xs sm:text-sm text-gray-600'>
                        <p className='font-semibold text-gray-900'>{currency}{productData.price}</p>
                        <p className='px-2 py-0.5 border bg-[#faf9f6] rounded text-[10px]'>{item.size}</p>
                        {productData.stock < item.quantity && (
                          <span className='text-red-500 font-semibold text-[10px] animate-pulse'>Exceeds Stock ({productData.stock} units left)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <input 
                    onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} 
                    type="number" 
                    className='border max-w-12 sm:max-w-20 px-1.5 py-1 text-center text-xs focus:outline-none focus:border-[#c5a880] rounded' 
                    min={1} 
                    max={productData.stock}
                    defaultValue={item.quantity} 
                  />
                  
                  <img 
                    onClick={() => updateQuantity(item._id, item.size, 0)} 
                    className='w-4 sm:w-5 cursor-pointer hover:scale-105 transition-transform' 
                    src={assets.bin_icon} 
                    alt="" 
                  />
                </div>
              );
            })}
          </div>

          {/* Cart Totals & Checkout Button */}
          <div className='flex flex-col sm:flex-row justify-between gap-8 my-20 items-start'>
            {/* Promo Code Input Box */}
            <div className='w-full sm:w-[350px] bg-white p-5 border rounded-lg shadow-sm flex flex-col gap-3'>
              <h4 className='text-xs font-bold text-gray-800 uppercase tracking-wider'>Apply Promo Code</h4>
              <p className='text-[10px] text-gray-400'>Try "WELCOME10" (10% Off) or "SCENT20" (20% Off) on your order!</p>
              <div className='flex gap-2 mt-1'>
                <input 
                  type="text" 
                  placeholder="Enter code" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className='border px-3 py-2 text-xs focus:outline-none focus:border-[#c5a880] rounded flex-1 uppercase font-semibold'
                />
                <button 
                  onClick={async () => {
                    const result = await applyCouponCode(couponInput);
                    if (result.success) {
                      toast.success(result.message);
                      setCouponInput('');
                    } else {
                      toast.error(result.message);
                    }
                  }}
                  className='bg-black text-white px-4 py-2 text-xs font-semibold hover:bg-gray-800 rounded transition-colors cursor-pointer'
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className='text-[10px] text-green-600 font-semibold mt-1'>✓ Active Discount: {appliedCoupon}</p>
              )}
            </div>

            <div className='w-full sm:w-[450px] flex flex-col gap-4 bg-[#faf9f6] p-6 border rounded-lg shadow-sm'>
              <CartTotal />
              <div className='w-full text-end mt-4'>
                <button 
                  onClick={handleCheckout} 
                  className='bg-black text-white px-10 py-3 text-xs font-bold active:bg-gray-800 transition-colors cursor-pointer rounded-sm w-full'
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;