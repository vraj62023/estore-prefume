import React from 'react'

function Hero() {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-200 bg-[#faf9f6] rounded overflow-hidden shadow-sm mt-5'>
        {/* hero left side */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0 px-6 sm:px-12'>
            <div className='text-gray-800 flex flex-col gap-3'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 h-[1px] bg-[#c5a880]'></p>
                    <p className='font-bold text-[10px] uppercase tracking-widest text-[#c5a880]'>Exquisite Scent Signatures</p>
                </div>
                <h1 className='prata-regular text-4xl lg:text-5xl leading-tight text-gray-900'>The Art of Olfactory Luxury</h1>
                <p className='text-xs text-gray-500 max-w-sm leading-relaxed mt-1'>
                  Discover bespoke perfume formulations and hand-poured botanical extraits tailored to your personal chemistry.
                </p>
                <div className='flex items-center gap-2 mt-4 group cursor-pointer'>
                    <a href="/collection" className='font-bold text-xs uppercase tracking-widest text-gray-900 border-b border-black pb-1 group-hover:text-[#c5a880] group-hover:border-[#c5a880] transition-colors'>SHOP THE LAB</a>
                    <p className='w-8 h-[1px] bg-black group-hover:bg-[#c5a880] transition-colors'></p>
                </div>
            </div>
        </div>
        {/* HERO RIGHT SIDE */}
        <div className='w-full sm:w-1/2 h-64 sm:h-96 overflow-hidden flex items-center justify-center bg-white border-l border-gray-100'>
            <img 
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800" 
              className='w-full h-full object-cover hover:scale-105 transition-transform duration-700' 
              alt="Premium Perfume Bottle" 
            />
        </div>
    </div>
  )
}

export default Hero;