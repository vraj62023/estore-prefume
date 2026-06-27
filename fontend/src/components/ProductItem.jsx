import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Heart } from 'lucide-react';

function ProductItem({id,image,name,price}) {
    const { currency, toggleWishlist, wishlist } = useContext(ShopContext);
    
    const isFavorited = wishlist && wishlist.length > 0 && wishlist.some(p => p && p._id && p._id.toString() === id.toString());
    
    const handleHeartClick = (e) => {
        e.preventDefault(); // Prevent navigating to product detail
        e.stopPropagation();
        toggleWishlist(id);
    };

    return (
       <div className='relative group border border-gray-100 p-3 rounded bg-white hover:shadow-md transition-shadow duration-300'>
           <Link className='text-gray-700 cursor-pointer flex flex-col' to={`/product/${id}`}>
                <div className='overflow-hidden rounded bg-[#faf9f6] aspect-square flex items-center justify-center mb-2'>
                    <img className='hover:scale-105 transition ease-in-out duration-500 max-h-full max-w-full object-contain' src={image[0]} alt="" />
                </div>
                <p className='pt-1 pb-0.5 text-xs sm:text-sm font-semibold text-gray-900 truncate'>{name}</p>
                <p className='text-xs sm:text-sm font-bold text-[#c5a880]'>{currency}{price}</p>
           </Link>
           
           {/* Wishlist Heart Button Overlay */}
           <button 
             onClick={handleHeartClick}
             className='absolute top-5 right-5 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-gray-150/40 md:opacity-0 md:group-hover:opacity-100'
             title="Add to Wishlist"
           >
             <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
           </button>
       </div>
    )
}

export default ProductItem;