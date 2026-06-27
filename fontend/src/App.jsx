import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ShopContext } from './context/ShopContext'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Wishlist from './pages/Wishlist'
import Quiz from './pages/Quiz'
import Recommend from './pages/Recommend'
import AdminDashboard from './pages/AdminDashboard'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Chatbot from './components/Chatbot'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const { role } = useContext(ShopContext);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-white min-h-screen flex flex-col relative'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      
      {role === 'admin' && (
        <div className='bg-[#c5a880]/15 border border-[#c5a880]/30 py-2.5 px-4 text-xs flex flex-col sm:flex-row justify-between items-center text-gray-800 rounded gap-2 mb-4'>
          <p className='font-bold flex items-center gap-1.5'>🛡️ Administrative Mode Active: You have access to catalog edits and analytics dashboards.</p>
          <a href="/admin" className='bg-black text-white px-4 py-1.5 rounded text-[10px] hover:bg-gray-800 font-bold transition-all uppercase tracking-wider'>GO TO ADMIN PANEL</a>
        </div>
      )}

      <SearchBar />
      
      <div className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/order' element={<Orders />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/quiz' element={<Quiz />} />
          <Route path='/recommend' element={<Recommend />} />
          <Route path='/admin' element={<AdminDashboard />} />
        </Routes>
      </div>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default App