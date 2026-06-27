import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, setRole, setName, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [nameInput, setNameInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Log test credentials quietly to developer console
  useEffect(() => {
    console.log(
      "%c🔑 L'Arôme Developer Notice:\nUse admin@larome.com / admin123 for full Admin Dashboard access.",
      "color: #c5a880; font-family: serif; font-size: 13px; font-weight: bold;"
    );
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name: nameInput,
          email,
          password
        });
        if (response.data.success) {
          setToken(response.data.token);
          setRole(response.data.role);
          setName(response.data.name);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('name', response.data.name);
          toast.success("Account created successfully!");
          if (response.data.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });
        if (response.data.success) {
          setToken(response.data.token);
          setRole(response.data.role);
          setName(response.data.name);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('name', response.data.name);
          toast.success("Welcome back!");
          if (response.data.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-24 gap-4 text-gray-800 pb-20'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-[#c5a880]' />
      </div>
      
      {currentState === 'Login' ? null : (
        <input 
          onChange={(e) => setNameInput(e.target.value)} 
          value={nameInput} 
          type="text" 
          className='w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#c5a880]' 
          placeholder="Name" 
          required 
        />
      )}
      
      <input 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
        type="email" 
        className='w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#c5a880]' 
        placeholder="Email Address" 
        required 
      />
      
      <input 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
        type="password" 
        className='w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#c5a880]' 
        placeholder="Password" 
        required 
      />
      
      <div className='w-full flex justify-between text-xs text-gray-500 mt-[-8px]'>
        <p className='cursor-pointer hover:text-black'>Forgot your password?</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-black underline'>Create account</p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-black underline'>Login here</p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className='w-full bg-black text-white px-8 py-3 text-sm mt-4 active:bg-gray-800 disabled:bg-gray-400 cursor-pointer transition-colors duration-200'
      >
        {loading ? 'Processing...' : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  );
}

export default Login;