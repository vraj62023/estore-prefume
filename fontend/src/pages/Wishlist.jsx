import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Heart } from 'lucide-react';

function Wishlist() {
  const { wishlist, toggleWishlist, token } = useContext(ShopContext);

  if (!token) {
    return (
      <div className='border-t pt-16 pb-20 min-h-[60vh] text-center'>
        <div className='text-2xl mb-8'>
          <Title text1={'MY'} text2={'WISHLIST'} />
        </div>
        <div className='max-w-md m-auto py-10 px-6 bg-[#faf9f6] border rounded'>
          <p className='text-gray-600 font-semibold text-lg prata-regular'>Login to view your wishlist</p>
          <p className='text-xs text-gray-400 mt-2 mb-6'>Save your favorite L'Arôme fragrances and access them from any device.</p>
          <a href="/login" className='inline-block bg-black text-white px-8 py-3 text-xs font-semibold hover:bg-gray-800 transition-colors duration-200'>
            SIGN IN / SIGN UP
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='border-t pt-16 pb-20 min-h-[70vh]'>
      <div className='text-2xl mb-8'>
        <Title text1={'MY'} text2={'WISHLIST'} />
      </div>

      {wishlist.length === 0 ? (
        <div className='text-center py-16 bg-[#faf9f6] border rounded max-w-lg m-auto'>
          <Heart className='w-12 h-12 text-[#c5a880] m-auto mb-4 stroke-1 animate-pulse' />
          <p className='text-gray-600 font-medium prata-regular'>Your wishlist is empty</p>
          <p className='text-xs text-gray-400 mt-1 mb-6'>Save your favorite perfumes by clicking the heart icon on any product page.</p>
          <a href="/collection" className='inline-block bg-black text-white px-6 py-2.5 text-xs hover:bg-gray-800 transition-colors duration-200'>
            EXPLORE PERFUMES
          </a>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-8'>
          {wishlist.map((item, index) => (
            <div key={index} className='relative group'>
              {/* Product Card */}
              <ProductItem id={item._id} name={item.name} price={item.price} image={item.image} />
              
              {/* Remove button */}
              <button 
                onClick={() => toggleWishlist(item._id)} 
                className='absolute top-2 right-2 bg-white/95 p-1.5 rounded-full shadow-sm text-red-500 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-gray-100'
                title="Remove from wishlist"
              >
                <Heart className='w-4 h-4 fill-red-500' />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
