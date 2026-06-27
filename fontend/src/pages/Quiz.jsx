import React, { useState, useContext } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import { Sparkles, Sun, Moon, Calendar, Briefcase, Coffee, ShieldAlert, CheckCircle2 } from 'lucide-react';

const quizQuestions = [
  {
    id: 'time',
    question: "When do you plan to wear this fragrance?",
    subtitle: "Select the setting that fits your routine",
    options: [
      { value: 'day', label: 'Daytime Brightness', desc: 'Fresh, airy, energizing scents for work, brunch, or outings.', icon: Sun },
      { value: 'night', label: 'Mysterious Nightfall', desc: 'Deep, rich, alluring notes for evenings, dates, or parties.', icon: Moon }
    ]
  },
  {
    id: 'season',
    question: "Which season represents your climate right now?",
    subtitle: "Temperature plays a massive role in scent evaporation",
    options: [
      { value: 'summer', label: 'Warm Summer / Spring', desc: 'Light, citrus, green, and aquatic profiles that won\'t overwhelm.', icon: Sun },
      { value: 'winter', label: 'Crisp Winter / Autumn', desc: 'Warm spices, woody resins, and gourmand notes that envelope you.', icon: Calendar }
    ]
  },
  {
    id: 'aesthetic',
    question: "What is your main dress code or style setting?",
    subtitle: "A fragrance is an invisible extension of your wardrobe",
    options: [
      { value: 'formal', label: 'Formal & Professional', desc: 'Sophisticated, elegant, clean profiles for office or black-tie.', icon: Briefcase },
      { value: 'casual', label: 'Casual & Relaxed', desc: 'Comfortable, playful, mist-style scent bubbles for daily wear.', icon: Coffee }
    ]
  },
  {
    id: 'intensity',
    question: "What level of projection do you prefer?",
    subtitle: "How close do you want people to get to smell you?",
    options: [
      { value: 'mild', label: 'Subtle & Close-to-Skin', desc: 'Soft whispers of scent for intimate settings or sensitive noses.', icon: CheckCircle2 },
      { value: 'strong', label: 'Bold & Room-Filling (Sillage)', desc: 'High projection. A statement trail that commands attention.', icon: Sparkles }
    ]
  }
];

function Quiz() {
  const { products } = useContext(ShopContext);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    time: '',
    season: '',
    aesthetic: '',
    intensity: ''
  });
  const [result, setResult] = useState(null);

  const handleSelectOption = (key, value) => {
    const updatedAnswers = { ...answers, [key]: value };
    setAnswers(updatedAnswers);

    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      calculateRecommendation(updatedAnswers);
    }
  };

  const calculateRecommendation = (finalAnswers) => {
    let scores = products.map(product => {
      let score = 0;
      const desc = product.description.toLowerCase();
      const name = product.name.toLowerCase();
      const notes = `${product.notes.top} ${product.notes.heart} ${product.notes.base}`.toLowerCase();
      const subCat = product.subCategory.toLowerCase();

      // Time score
      if (finalAnswers.time === 'day') {
        if (notes.includes('citrus') || notes.includes('jasmine') || notes.includes('lavender') || notes.includes('fresh') || notes.includes('mint')) score += 3;
        if (subCat.includes('mist') || subCat.includes('toilette') || subCat.includes('cologne')) score += 2;
      } else { // night
        if (notes.includes('oud') || notes.includes('amber') || notes.includes('leather') || notes.includes('saffron') || notes.includes('cinnamon')) score += 3;
        if (subCat.includes('extrait') || subCat.includes('parfum')) score += 2;
      }

      // Season score
      if (finalAnswers.season === 'summer') {
        if (notes.includes('citrus') || notes.includes('sea') || notes.includes('aquatic') || notes.includes('mint') || notes.includes('grapefruit')) score += 3;
        if (subCat.includes('mist') || subCat.includes('cologne')) score += 2;
      } else { // winter
        if (notes.includes('oud') || notes.includes('amber') || notes.includes('vanilla') || notes.includes('cinnamon') || notes.includes('spicy')) score += 3;
        if (subCat.includes('extrait') || subCat.includes('parfum')) score += 2;
      }

      // Aesthetic score
      if (finalAnswers.aesthetic === 'formal') {
        if (notes.includes('sandalwood') || notes.includes('leather') || notes.includes('rose') || notes.includes('cedarwood')) score += 3;
        if (subCat.includes('parfum') || subCat.includes('extrait')) score += 2;
      } else { // casual
        if (notes.includes('coconut') || notes.includes('marshmallow') || notes.includes('sugar') || notes.includes('grapefruit')) score += 3;
        if (subCat.includes('mist') || subCat.includes('cologne') || subCat.includes('toilette')) score += 2;
      }

      // Intensity score
      if (finalAnswers.intensity === 'mild') {
        if (subCat.includes('mist') || subCat.includes('cologne') || subCat.includes('oil')) score += 3;
        if (notes.includes('musk') || notes.includes('white') || notes.includes('skin')) score += 2;
      } else { // strong
        if (subCat.includes('extrait') || subCat.includes('parfum')) score += 3;
        if (notes.includes('oud') || notes.includes('leather') || notes.includes('ambergris') || notes.includes('saffron')) score += 2;
      }

      return { product, score };
    });

    // Sort by score and take the best 3 matches
    scores.sort((a, b) => b.score - a.score);
    const recommendedList = scores.slice(0, 3).map(s => s.product);

    // Profile Generation Title
    let profileTitle = "The Radiant Botanist";
    let profileDesc = "You appreciate fresh, clean, and breezy scent clouds that project energy and clarity. Citrus notes, light jasmine, and sea salt elements fit your vibrant personality.";

    if (finalAnswers.time === 'night' && finalAnswers.intensity === 'strong') {
      profileTitle = "The Smouldering Nocturne";
      profileDesc = "You possess a bold, magnetic aesthetic. Rich base notes like Cambodian oud, warm leather, spiced amber, and dark roses define your heavy, luxurious projection trail.";
    } else if (finalAnswers.season === 'winter' && finalAnswers.aesthetic === 'formal') {
      profileTitle = "The Cashmere Sophisticate";
      profileDesc = "You exude professional elegance and warmth. Smooth Mysore sandalwood, cedarwood drydowns, cashmere amber, and soft spices are your signature matching elements.";
    } else if (finalAnswers.aesthetic === 'casual' && finalAnswers.intensity === 'mild') {
      profileTitle = "The Intimate Gourmand";
      profileDesc = "You love comforting, sweet, and subtle scent halos. Playful marshmallow, sweet coconut, soft musks, and warm sugar cookies hug your skin without overwhelming.";
    }

    setResult({
      title: profileTitle,
      description: profileDesc,
      matches: recommendedList
    });
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({ time: '', season: '', aesthetic: '', intensity: '' });
    setResult(null);
  };

  return (
    <div className='border-t pt-16 pb-20 min-h-[80vh] flex flex-col items-center justify-center'>
      <div className='text-center mb-10'>
        <div className='text-3xl mb-2'>
          <Title text1={'SCENT'} text2={'DISCOVERY QUIZ'} />
        </div>
        <p className='text-gray-500 text-xs sm:text-sm max-w-lg m-auto'>
          Answer 4 simple questions and let our olfactory algorithm discover your personal signature fragrance profile.
        </p>
      </div>

      {!result ? (
        <div className='w-full max-w-2xl bg-[#faf9f6] border border-gray-200 rounded-lg p-6 sm:p-10 shadow-sm relative overflow-hidden'>
          {/* Progress bar */}
          <div className='absolute top-0 left-0 w-full h-1.5 bg-gray-200'>
            <div 
              className='h-full bg-[#c5a880] transition-all duration-300' 
              style={{ width: `${((step + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          <div className='flex justify-between text-xs text-gray-400 mb-6'>
            <span>Question {step + 1} of {quizQuestions.length}</span>
            <span>{Math.round(((step + 1) / quizQuestions.length) * 100)}% Complete</span>
          </div>

          <h2 className='text-xl sm:text-2xl font-semibold text-gray-800 prata-regular mb-1'>
            {quizQuestions[step].question}
          </h2>
          <p className='text-gray-400 text-xs sm:text-sm mb-8'>
            {quizQuestions[step].subtitle}
          </p>

          <div className='flex flex-col sm:flex-row gap-4'>
            {quizQuestions[step].options.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <div 
                  key={idx} 
                  onClick={() => handleSelectOption(quizQuestions[step].id, opt.value)}
                  className='flex-1 border-2 border-gray-200 hover:border-[#c5a880] hover:bg-white rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col items-center text-center group active:scale-98'
                >
                  <div className='bg-[#faf9f6] group-hover:bg-[#c5a880]/10 p-4 rounded-full mb-4 transition-colors duration-200'>
                    <Icon className='w-8 h-8 text-gray-400 group-hover:text-[#c5a880] stroke-1.5' />
                  </div>
                  <h3 className='font-bold text-gray-800 text-base mb-2'>{opt.label}</h3>
                  <p className='text-gray-500 text-xs leading-relaxed'>{opt.desc}</p>
                </div>
              );
            })}
          </div>

          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)} 
              className='mt-8 text-xs text-gray-400 hover:text-black underline cursor-pointer'
            >
              Previous Question
            </button>
          )}
        </div>
      ) : (
        <div className='w-full max-w-4xl bg-[#faf9f6] border border-gray-200 rounded-lg p-6 sm:p-10 shadow-sm animate-fade-in'>
          <div className='text-center max-w-xl m-auto mb-10'>
            <div className='bg-[#c5a880]/10 w-16 h-16 rounded-full flex items-center justify-center m-auto mb-4 border border-[#c5a880]/20'>
              <Sparkles className='w-8 h-8 text-[#c5a880]' />
            </div>
            <p className='text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1'>Your signature Scent profile</p>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 prata-regular mb-3'>{result.title}</h2>
            <p className='text-gray-600 text-sm leading-relaxed'>{result.description}</p>
          </div>

          <div className='text-lg mb-6 border-b pb-3 font-semibold text-gray-800 prata-regular'>
            Recommended Fragrances for You:
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10'>
            {result.matches.map((item, index) => (
              <div key={index} className='bg-white p-4 border border-gray-100 rounded hover:shadow-md transition-all duration-300'>
                <ProductItem id={item._id} name={item.name} price={item.price} image={item.image} />
                <div className='mt-3 bg-gray-50 p-2 rounded text-[10px] text-gray-500'>
                  <strong>Notes:</strong> {item.notes.top} • {item.notes.heart} • {item.notes.base}
                </div>
              </div>
            ))}
          </div>

          <div className='text-center'>
            <button 
              onClick={handleReset} 
              className='bg-black text-white px-8 py-3 text-xs font-semibold hover:bg-gray-800 transition-colors duration-200 cursor-pointer rounded-sm'
            >
              RETAKE SCENT QUIZ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
