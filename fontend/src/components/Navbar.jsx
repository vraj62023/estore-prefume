import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import { Heart, User, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { 
    setShowSearch, getCartCount, token, setToken, 
    role, setRole, name, setName, wishlist 
  } = useContext(ShopContext);

  const logout = () => {
    setToken('');
    setRole('customer');
    setName('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    toast.info("Logged out successfully");
    navigate('/login');
  };

  // Helper toggle to make testing admin panel effortless
  const toggleTestAdminRole = () => {
    if (!token) {
      toast.warn("Please sign in first to switch roles");
      navigate('/login');
      return;
    }
    const newRole = role === 'admin' ? 'customer' : 'admin';
    setRole(newRole);
    localStorage.setItem('role', newRole);
    toast.success(`Role switched to ${newRole.toUpperCase()} for testing!`);
    if (newRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className='flex items-center justify-between py-5 font-medium border-b border-gray-100 bg-white sticky top-0 z-40'>
      
      {/* Brand Text Logo */}
      <Link to='/' className='flex flex-col items-center'>
        <span className='prata-regular text-2xl tracking-widest text-gray-900'>L'ARÔME</span>
        <span className='text-[8px] uppercase tracking-[0.3em] text-[#c5a880] mt-0.5 font-bold'>Luxury Parfums</span>
      </Link>

      {/* Navigation Links */}
      <ul className='hidden md:flex gap-6 text-xs tracking-widest font-semibold text-gray-600 uppercase'>
        <NavLink to='/' className="flex flex-col items-center gap-1 hover:text-black">
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-[#c5a880] hidden' />
        </NavLink>
        <NavLink to='/collection' className="flex flex-col items-center gap-1 hover:text-black">
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-[#c5a880] hidden' />
        </NavLink>
        <NavLink to='/quiz' className="flex flex-col items-center gap-1 hover:text-black text-[#c5a880] flex items-center gap-0.5">
          <p className='flex items-center gap-1'><Sparkles className='w-3 h-3 fill-[#c5a880]' /> SCENT QUIZ</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-black hidden' />
        </NavLink>
        <NavLink to='/recommend' className="flex flex-col items-center gap-1 hover:text-black">
          <p>AI SOMMELIER</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-[#c5a880] hidden' />
        </NavLink>
        <NavLink to='/about' className="flex flex-col items-center gap-1 hover:text-black">
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-[#c5a880] hidden' />
        </NavLink>
        <NavLink to='/contact' className="flex flex-col items-center gap-1 hover:text-black">
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-[#c5a880] hidden' />
        </NavLink>
        {role === 'admin' && (
          <NavLink to='/admin' className="flex flex-col items-center gap-1 text-[#c5a880] hover:text-[#b09b70] font-bold">
            <p className='flex items-center gap-1'>🛡️ ADMIN</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-[#c5a880] hidden' />
          </NavLink>
        )}
      </ul>

      {/* Icon Menu */}
      <div className='flex items-center gap-5'>
        {/* Search */}
        <img onClick={() => { setShowSearch(true); navigate('/collection'); }} src={assets.search_icon} alt="" className='w-4.5 cursor-pointer hover:scale-105 transition-transform' />
        
        {/* Profile Dropdown */}
        <div className='group relative'>
          <div className='flex items-center gap-1 cursor-pointer'>
            <User className={`w-4.5 h-4.5 text-gray-700 group-hover:text-black transition-colors ${role === 'admin' ? 'text-[#c5a880]' : ''}`} />
          </div>
          
          <div className='group-hover:block hidden absolute right-0 pt-4 z-50'>
            <div className='flex flex-col gap-2.5 w-44 py-3.5 px-4 bg-white border text-xs text-gray-600 rounded-lg shadow-xl'>
              {token ? (
                <>
                  <p className='font-bold text-gray-900 border-b pb-1.5 truncate'>Hi, {name || 'Customer'}</p>
                  <Link to='/order' className='cursor-pointer hover:text-black transition-colors'>My Orders</Link>
                  <Link to='/wishlist' className='cursor-pointer hover:text-black transition-colors flex justify-between items-center'>
                    <span>My Wishlist</span>
                    {wishlist.length > 0 && <span className='bg-red-100 text-red-500 text-[9px] px-1.5 py-0.5 rounded-full font-bold'>{wishlist.length}</span>}
                  </Link>
                  
                  {role === 'admin' && (
                    <Link to='/admin' className='cursor-pointer text-[#c5a880] font-bold hover:text-[#b09b70] transition-colors flex items-center gap-1'>
                      🛡️ Admin Console
                    </Link>
                  )}
                  
                  {/* Test Toggle Button */}
                  <button 
                    onClick={toggleTestAdminRole} 
                    className='text-[9px] font-bold text-left border border-gray-200 px-2 py-1 rounded bg-gray-50 hover:bg-gray-150 transition-colors text-gray-400 cursor-pointer'
                  >
                    Switch to {role === 'admin' ? 'Customer' : 'Admin'} (Dev)
                  </button>

                  <p onClick={logout} className='cursor-pointer hover:text-black text-red-500 border-t pt-1.5 font-semibold transition-colors mt-1'>Logout</p>
                </>
              ) : (
                <>
                  <Link to='/login' className='cursor-pointer hover:text-black font-semibold transition-colors'>Sign In</Link>
                  <Link to='/login' className='cursor-pointer hover:text-black transition-colors'>Create Account</Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wishlist Icon */}
        <Link to='/wishlist' className='relative hidden sm:block'>
          <Heart className='w-4.5 h-4.5 text-gray-700 hover:text-red-500 transition-colors' />
          {wishlist.length > 0 && (
            <span className='absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white flex items-center justify-center rounded-full text-[7px] font-bold'>
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart Icon */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} alt="" className='w-4.5 min-w-4.5 hover:scale-105 transition-transform' />
          <p className='absolute right-[-5px] bottom-[-5px] w-3.5 text-center leading-3 bg-black text-white aspect-square rounded-full text-[8px] font-bold'>{getCartCount()}</p>
        </Link>

        {/* Mobile menu trigger */}
        <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="" className='w-4.5 cursor-pointer md:hidden' />
      </div>

      {/* Sidebar menu for small screen */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 shadow-2xl ${visible ? 'w-full h-screen' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600 text-sm'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-4 border-b border-gray-100 cursor-pointer'>
            <img src={assets.dropdown_icon} alt="" className='h-4 rotate-180' />
            <p className='font-bold uppercase text-xs tracking-wider'>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} to='/' className='py-3 pl-6 border-b hover:bg-gray-50'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/collection' className='py-3 pl-6 border-b hover:bg-gray-50'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/quiz' className='py-3 pl-6 border-b text-[#c5a880] hover:bg-gray-50 font-bold'>✨ SCENT DISCOVERY QUIZ</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/recommend' className='py-3 pl-6 border-b hover:bg-gray-50'>AI SOMMELIER</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/wishlist' className='py-3 pl-6 border-b hover:bg-gray-50'>MY WISHLIST</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/about' className='py-3 pl-6 border-b hover:bg-gray-50'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/contact' className='py-3 pl-6 border-b hover:bg-gray-50'>CONTACT</NavLink>
          {role === 'admin' && (
            <NavLink onClick={() => setVisible(false)} to='/admin' className='py-3 pl-6 border-b text-[#c5a880] hover:bg-gray-50 font-bold'>🛡️ ADMIN PANEL</NavLink>
          )}
        </div>
      </div>

    </div>
  );
}

export default Navbar;