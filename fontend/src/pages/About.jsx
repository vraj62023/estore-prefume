import React from 'react'
import Title from '../components/Title'

function About() {
  return (
    <div className='pb-20'>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'L\'ARÔME'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
        <img 
          className='w-full md:max-w-[450px] rounded' 
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600" 
          alt="Luxury Perfume" 
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 text-sm leading-relaxed'>
          <p>
            Welcome to <strong>L'Arôme Luxury Parfums</strong>, where the ancient art of fragrance meets modern molecular design. Founded with a vision to create unforgettable sensory signatures, our perfumes are meticulously curated by leading master perfumers who source the finest, ethically-harvested raw materials from Grasse to Cambodia.
          </p>
          <p>
            We believe that a fragrance is more than just a scent—it is an invisible signature, an emotional memory, and an extension of your identity. Each bottle is hand-poured, matured to absolute perfection, and housed in hand-finished crystal jars reflecting the timeless spirit of luxury.
          </p>
          <b className='text-gray-800 text-base font-semibold prata-regular'>Our Philosophy</b>
          <p>
            Scent represents the ultimate intersection of nature and science. Our formulas utilize the best organic botanicals alongside high-grade safe synthetics (such as ISO-E Super and Ambroxan) to guarantee incredible projection, sillage, and longevity, while remaining strictly cruelty-free and vegan.
          </p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-4 mt-6'>
        <div className='border px-10 md:px-16 py-8 md:py-16 flex flex-col gap-5 rounded bg-[#faf9f6] border-gray-100 hover:shadow-sm transition-all duration-200'>
          <b className='text-gray-800 font-semibold text-base prata-regular'>Artisanal Blends</b>
          <p className='text-gray-600'>Every L'Arôme scent is formulated in micro-batches with unmatched attention to maceration and filtration quality control.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 md:py-16 flex flex-col gap-5 rounded bg-[#faf9f6] border-gray-100 hover:shadow-sm transition-all duration-200'>
          <b className='text-gray-800 font-semibold text-base prata-regular'>AI Scent Concierge</b>
          <p className='text-gray-600'>Use our state-of-the-art Generative Fragrance engines to discover, quiz, and tailor perfumes matching your direct mood.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 md:py-16 flex flex-col gap-5 rounded bg-[#faf9f6] border-gray-100 hover:shadow-sm transition-all duration-200'>
          <b className='text-gray-800 font-semibold text-base prata-regular'>Sustainable Luxury</b>
          <p className='text-gray-600'>All raw materials are certified clean, sourced through fair-trade farmers, and delivered in 100% recyclable packaging.</p>
        </div>
      </div>
    </div>
  )
}

export default About;