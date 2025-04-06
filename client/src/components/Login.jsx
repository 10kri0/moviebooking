import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [errorsMessage, setErrorsMessage] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoggingIn(true);
        try {
            const response = await axios.post('/auth/login', data);
            toast.success('Login successful!', { position: 'top-center', autoClose: 2000, pauseOnHover: false });
            setAuth(prev => ({ ...prev, token: response.data.token }));
            navigate('/');
        } catch (error) {
            console.error(error.response.data);
            setErrorsMessage(error.response.data);
            toast.error('Error', { position: 'top-center', autoClose: 2000, pauseOnHover: false });
        } finally {
            setIsLoggingIn(false);
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
                            <h1 className="text-5xl font-bold text-white mb-2">CINEM</h1>
                            <p className="text-xl text-white/80">Join our community of movie enthusiasts</p>
                            <p className="text-lg text-white/80">and unlock a world of cinematic</p>
                        </div>
                    </div>
                </div>
                
                {/* Right side with form */}
                <div className="w-full md:w-1/2 bg-[#222] p-10 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent mb-2">
                            Welcome Back!
                        </h2>
                        <p className="text-gray-400">Please login to your account</p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                                Username
                            </label>
                            <input 
                                type="text" 
                                id="username"
                                placeholder="Enter your username" 
                                {...register('username', { required: true })} 
                                className={`w-full px-4 py-3 bg-[#333] border ${errors.username ? 'border-red-500' : 'border-[#444]'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff416c]`} 
                            />
                            {errors.username && <span className="text-red-500 text-sm mt-1 block">Username is required</span>}
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password" 
                                {...register('password', { required: true })} 
                                className={`w-full px-4 py-3 bg-[#333] border ${errors.password ? 'border-red-500' : 'border-[#444]'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff416c] pr-10`} 
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
                            {errors.password && <span className="text-red-500 text-sm mt-1 block">Password is required</span>}
                        </div>

                        {errorsMessage && <span className="text-red-500 text-sm block">{errorsMessage}</span>}
                        
                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white py-3 rounded-lg shadow-md hover:from-[#ff4b2b] hover:to-[#ff416c] transition-all duration-300 font-semibold"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? 'Processing...' : 'Login'}
                        </button>
                        
                        <p className="text-center text-gray-400">
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:underline"
                            >
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;