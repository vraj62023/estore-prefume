import React from 'react'
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='border-t border-gray-100 mt-28'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-xs'>
            
            {/* Logo and desc */}
            <div>
                <div className='flex flex-col mb-5'>
                  <span className='prata-regular text-2xl tracking-widest text-gray-900'>L'ARÔME</span>
                  <span className='text-[8px] uppercase tracking-[0.3em] text-[#c5a880] mt-0.5 font-bold'>Luxury Parfums</span>
                </div>
                <p className='w-full md:w-2/3 text-gray-500 leading-relaxed' >
                  We craft bespoke perfume formulations and hand-poured botanical extraits tailored to your personal chemistry, blending natural raw raw materials with clean molecular chemistry.
                </p>
            </div>

            {/* Navigation links */}
            <div>
                <p className='text-sm font-semibold text-gray-800 prata-regular mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-500 uppercase tracking-wider font-semibold text-[10px]'>
                    <li><Link to="/" className='hover:text-black'>Home</Link></li>
                    <li><Link to="/about" className='hover:text-black'>About Us</Link></li>
                    <li><Link to="/contact" className='hover:text-black'>Contact Concierge</Link></li>
                    <li><Link to="/collection" className='hover:text-black'>Scent Collection</Link></li>
                </ul>
            </div>

            {/* Scent Concierge touch */}
            <div>
                <p className='text-sm font-semibold text-gray-800 prata-regular mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-500 font-semibold'>
                    <li>+91-11-5555-8888</li>
                    <li>concierge@larome.com</li>
                </ul>
            </div>

        </div>
        
        <div>
            <hr className='border-gray-100' />
            <p className='py-5 text-[10px] text-center text-gray-400'>Copyright 2026 @ larome.com - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer;