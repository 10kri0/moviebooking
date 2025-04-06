import {
    ClockIcon,
    FilmIcon,
    HomeModernIcon,
    MagnifyingGlassIcon,
    TicketIcon,
    UsersIcon,
    VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Aaboutus from './Aaboutus';

const Navbar = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const onLogout = async () => {
        try {
            setIsLoggingOut(true);
            await axios.get('/auth/logout');
            setAuth({ username: null, email: null, role: null, token: null });
            sessionStorage.clear();
            navigate('/');
            toast.success('Logout successful!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Error logging out.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

    const menuLists = () => (
        <div className="flex flex-col lg:flex-row gap-2">
            <NavLink to="/cinema" Icon={HomeModernIcon} text="Cinemas" />
            <NavLink to="/Aaboutus" Icon={HomeModernIcon} text="AboutUs" />
            {auth.role && <NavLink to="/ticket" Icon={TicketIcon} text="My Tickets" />}
            {auth.role === 'admin' && (
                <>
                    <NavLink to="/movie" Icon={VideoCameraIcon} text="Movies" />
                   
                    <NavLink to="/search" Icon={MagnifyingGlassIcon} text="Search" />
                    <NavLink to="/user" Icon={UsersIcon} text="Users" />
                </>
            )}
        </div>
    );

    return (
        <nav className="bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700/50 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        className="flex items-center gap-2 group"
                        onClick={() => navigate('/')}
                    >
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 group-hover:from-red-700 group-hover:to-pink-700 transition-all">
                            <FilmIcon className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                            CineVerse
                        </h1>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        {menuLists()}
                        
                        {/* Authentication */}
                        <div className="flex items-center gap-4 ml-4">
                            {auth.username && (
                                <p className="text-sm font-medium text-gray-300">
                                    Welcome, <span className="text-pink-400">{auth.username}</span>
                                </p>
                            )}
                            {auth.token ? (
                                <button
                                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-70"
                                    onClick={onLogout}
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing out...
                                        </>
                                    ) : (
                                        'Sign Out'
                                    )}
                                </button>
                            ) : (
                                <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-red-700 hover:to-pink-700 transition-all">
                                    <Link to="/login">Sign In</Link>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="lg:hidden p-2 text-gray-300 hover:text-pink-400 transition-colors"
                        onClick={toggleMenu}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`${menuOpen ? 'flex' : 'hidden'} lg:hidden flex-col pb-4 gap-4`}>
                    {menuLists()}
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-700/50">
                        {auth.username && (
                            <p className="text-sm font-medium text-gray-300">
                                Welcome, <span className="text-pink-400">{auth.username}</span>
                            </p>
                        )}
                        {auth.token ? (
                            <button
                                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-70"
                                onClick={onLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing out...
                                    </>
                                ) : (
                                    'Sign Out'
                                )}
                            </button>
                        ) : (
                            <button className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-red-700 hover:to-pink-700 transition-all">
                                <Link to="/login" className="w-full block">Sign In</Link>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Reusable NavLink Component
const NavLink = ({ to, Icon, text }) => {
    const active = window.location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                active
                    ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-pink-400 border border-red-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
        >
            <Icon className={`h-5 w-5 ${active ? 'text-pink-400' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">{text}</span>
        </Link>
    );
};

export default Navbar;