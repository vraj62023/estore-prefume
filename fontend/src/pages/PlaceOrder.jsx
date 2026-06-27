import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {
  const { products, cartItems, token, backendUrl, getCartAmount, delivery_fee, setCartItems, discount, setDiscount, setAppliedCoupon } = useContext(ShopContext);
  const navigate = useNavigate();

  const [method, setMethod] = useState('cod'); // 'cod' or 'card'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }

    if (getCartAmount() === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = products.find(product => product._id.toString() === items.toString());
            if (itemInfo) {
              const itemClone = structuredClone(itemInfo);
              itemClone.size = item;
              itemClone.quantity = cartItems[items][item];
              orderItems.push(itemClone);
            }
          }
        }
      }

      const subtotal = getCartAmount();
      const discountAmount = subtotal * discount;
      const finalAmount = subtotal - discountAmount + delivery_fee;

      const orderData = {
        address: formData,
        items: orderItems,
        amount: finalAmount
      };

      let response;
      if (method === 'cod') {
        response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
          headers: { token }
        });
      } else {
        response = await axios.post(`${backendUrl}/api/order/place-card`, orderData, {
          headers: { token }
        });
      }

      if (response.data.success) {
        setCartItems({});
        setDiscount(0);
        setAppliedCoupon('');
        toast.success("Order Placed Successfully!");
        navigate('/order');
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t pb-20'>
      {/* Left Side (Shipping info) */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input 
            required 
            onChange={onChangeHandler} 
            name='firstName' 
            value={formData.firstName} 
            type="text" 
            placeholder='First name' 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
          />
          <input 
            required 
            onChange={onChangeHandler} 
            name='lastName' 
            value={formData.lastName} 
            type="text" 
            placeholder='Last name' 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
          />
        </div>
        <input 
          required 
          onChange={onChangeHandler} 
          name='email' 
          value={formData.email} 
          type="email" 
          placeholder='Email address' 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
        />
        <input 
          required 
          onChange={onChangeHandler} 
          name='street' 
          value={formData.street} 
          type="text" 
          placeholder='Street address' 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
        />
        <div className='flex gap-3'>
          <input 
            required 
            onChange={onChangeHandler} 
            name='city' 
            value={formData.city} 
            type="text" 
            placeholder='City' 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
          />
          <input 
            required 
            onChange={onChangeHandler} 
            name='state' 
            value={formData.state} 
            type="text" 
            placeholder='State' 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
          />
        </div>
        <div className='flex gap-3'>
          <input 
            required 
            onChange={onChangeHandler} 
            name='zipcode' 
            value={formData.zipcode} 
            type="number" 
            placeholder='Zipcode' 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
          />
          <input 
            required 
            onChange={onChangeHandler} 
            name='country' 
            value={formData.country} 
            type="text" 
            placeholder='Country' 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
          />
        </div>
        <input 
          required 
          onChange={onChangeHandler} 
          name='phone' 
          value={formData.phone} 
          type="number" 
          placeholder='Phone number' 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-[#c5a880]' 
        />
      </div>

      {/* Right Side (Payment & Cart) */}
      <div className='mt-8 sm:mt-0 flex-1 sm:max-w-[480px]'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          
          <div className='flex flex-col lg:flex-row gap-3 mt-4'>
            {/* Card Mock Option */}
            <div 
              onClick={() => setMethod('card')} 
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded w-full justify-between transition-all duration-200 ${method === 'card' ? 'border-[#c5a880] bg-[#faf9f6]' : 'border-gray-200'}`}
            >
              <div className='flex items-center gap-3'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'card' ? 'bg-[#c5a880]' : ''}`}></p>
                <p className='text-gray-500 text-sm font-medium'>Credit / Debit Card</p>
              </div>
              <span className='text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded'>Mock Sandbox</span>
            </div>

            {/* COD Option */}
            <div 
              onClick={() => setMethod('cod')} 
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded w-full justify-between transition-all duration-200 ${method === 'cod' ? 'border-[#c5a880] bg-[#faf9f6]' : 'border-gray-200'}`}
            >
              <div className='flex items-center gap-3'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-[#c5a880]' : ''}`}></p>
                <p className='text-gray-500 text-sm font-medium'>Cash on Delivery</p>
              </div>
              <span className='text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded'>COD</span>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm active:bg-gray-800 transition-colors duration-200 cursor-pointer'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;