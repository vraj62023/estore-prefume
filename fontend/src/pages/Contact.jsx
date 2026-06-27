import React, { useState } from 'react'
import Title from '../components/Title'
import { Sparkles, Briefcase, MapPin, Clock } from 'lucide-react'

function Contact() {
  const [showCareers, setShowCareers] = useState(false);

  const careerOpenings = [
    { title: "Senior Scent Chemist", location: "Grasse Lab, France", type: "Full-Time", desc: "Formulate next-generation extraits and supervise botanical maceration." },
    { title: "MERN Stack AI Developer", location: "Remote / New Delhi", type: "Full-Time", desc: "Build advanced AI fragrance consultant models and full-stack MERN portals." },
    { title: "Creative Fragrance Director", location: "New Delhi HQ", type: "Full-Time", desc: "Design scent themes, packaging aesthetics, and direct brand marketing." },
    { title: "Luxury Scent Consultant", location: "Mumbai Boutique", type: "Part-Time", desc: "Guide boutique clients on custom notes profiling and sensory selection." }
  ];

  return (
    <div className='pb-20 border-t pt-10 min-h-[80vh]'>
      <div className='text-center text-2xl'>
        <Title text1={'CONTACT'} text2={'L\'ARÔME'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-20 mt-10 items-center'>
        <img 
          className='w-full md:max-w-[480px] rounded shadow-sm' 
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600" 
          alt="Contact Luxury Scent" 
        />
        <div className='flex flex-col justify-center items-start gap-6 md:w-1/3 text-gray-600 text-sm'>
          <p className='font-semibold text-lg text-gray-800 prata-regular'>L'Arôme Headquarters</p>
          <p className='text-gray-500 leading-relaxed'>
            500 Luxury Way, Suite 100 <br />
            New Delhi, India - 110001
          </p>
          <p className='text-gray-500'>
            Tel: +91-11-5555-8888 <br />
            Email: concierge@larome.com
          </p>
          
          <p className='font-semibold text-lg text-gray-800 prata-regular border-t pt-4 w-full'>Careers at L'Arôme</p>
          <p className='text-gray-500 leading-relaxed'>
            Learn more about our fragrance lab openings and molecular chemistry director positions.
          </p>
          <button 
            onClick={() => setShowCareers(!showCareers)}
            className='border border-black px-8 py-3.5 text-xs font-semibold hover:bg-black hover:text-white transition-all duration-300 rounded-sm cursor-pointer w-full md:w-auto text-center'
          >
            {showCareers ? "Hide Openings" : "Explore Openings"}
          </button>
        </div>
      </div>

      {/* Career Openings Section */}
      {showCareers && (
        <div className='max-w-4xl m-auto bg-[#faf9f6] border rounded-lg p-6 sm:p-8 animate-fade-in mb-20'>
          <div className='flex items-center gap-2 border-b pb-3 mb-6'>
            <Briefcase className='w-5 h-5 text-[#c5a880]' />
            <h3 className='font-bold text-gray-800 text-base prata-regular'>Current Scent Lab Openings</h3>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {careerOpenings.map((job, index) => (
              <div key={index} className='bg-white border p-5 rounded hover:shadow transition-shadow duration-200'>
                <div className='flex justify-between items-start gap-2'>
                  <h4 className='font-bold text-gray-900 text-sm'>{job.title}</h4>
                  <span className='bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded'>{job.type}</span>
                </div>
                
                <div className='flex items-center gap-4 text-[10px] text-gray-400 mt-2 font-semibold uppercase'>
                  <span className='flex items-center gap-1'><MapPin className='w-3 h-3 text-[#c5a880]' /> {job.location}</span>
                  <span className='flex items-center gap-1'><Clock className='w-3 h-3' /> Immediate</span>
                </div>
                
                <p className='text-gray-500 text-xs mt-3 leading-relaxed'>{job.desc}</p>
                
                <button 
                  onClick={() => alert(`To apply for ${job.title}, please send your MERN/Scent resume to careers@larome.com.`)}
                  className='mt-4 text-[10px] font-bold text-[#c5a880] hover:text-[#b09b70] cursor-pointer flex items-center gap-0.5 uppercase tracking-wider'
                >
                  Apply Now <Sparkles className='w-3 h-3 fill-[#c5a880]' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Contact;