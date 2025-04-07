import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const [errorsMessage, setErrorsMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const onSubmit = async (data) => {
    setIsRegistering(true);
    try {
      const response = await axios.post('/auth/register', data);
      toast.success('Registration successful!', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false,
      });
      navigate('/');
    } catch (error) {
      console.error(error.response?.data);
      setErrorsMessage(error.response?.data?.message || 'An error occurred');
      toast.error(error.response?.data?.message || 'Error', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] p-4">
      <div className="w-full max-w-4xl flex overflow-hidden rounded-2xl shadow-lg shadow-[#ff416c]/30">
        {/* Left side with image */}
        <div className="hidden md:block w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
            alt="Cinema background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">CINEMA</h1>
              <p className="text-xl text-white/80">Join our community of movie enthusiasts</p>
              <p className="text-lg text-white/80">and unlock a world of cinematic</p>
            </div>
          </div>
        </div>
        
        {/* Right side with form */}
        <div className="w-full md:w-1/2 bg-[#222] p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p className="text-gray-400">Start your cinematic journey today</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-5">
              {/* Username Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="username"
                  {...register('username', { 
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    }
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg bg-[#333] border ${errors.username ? 'border-red-500' : 'border-[#444]'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff416c] transition-all`}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg bg-[#333] border ${errors.email ? 'border-red-500' : 'border-[#444]'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff416c] transition-all`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register('password', { 
                    required: 'Password is required', 
                    minLength: { 
                      value: 6, 
                      message: 'Password must be at least 6 characters' 
                    }
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg bg-[#333] border ${errors.password ? 'border-red-500' : 'border-[#444]'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff416c] transition-all pr-10`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              <div className="w-full bg-[#333] rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${watch('password')?.length > 0 ? 
                    watch('password')?.length < 4 ? 'bg-red-500' : 
                    watch('password')?.length < 8 ? 'bg-yellow-500' : 'bg-green-500' 
                    : 'bg-transparent'}`} 
                  style={{ width: `${Math.min(100, (watch('password')?.length || 0) * 10)}%` }}
                ></div>
              </div>
            </div>

            {errorsMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {errorsMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff4b2b] hover:to-[#ff416c] text-white py-3.5 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-70"
            >
              {isRegistering ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  <UserIcon className="h-5 w-5" />
                  Register Now
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:underline"
              >
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
