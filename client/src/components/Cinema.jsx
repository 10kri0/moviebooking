import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import CinemaLists from '../components/CinemaLists';
import Navbar from '../components/Navbar';
import TheaterListsByCinema from '../components/TheaterListsByCinema';
import { AuthContext } from '../context/AuthContext';
import { BuildingStorefrontIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Cinema = () => {
    const { auth } = useContext(AuthContext);
    const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
        parseInt(sessionStorage.getItem('selectedCinemaIndex')) || 0
    );
    const [cinemas, setCinemas] = useState([]);
    const [isFetchingCinemas, setIsFetchingCinemas] = useState(true);

    const fetchCinemas = async (newSelectedCinema) => {
        try {
            setIsFetchingCinemas(true);
            let response;
            if (auth.role === 'admin') {
                response = await axios.get('/cinema/unreleased', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
            } else {
                response = await axios.get('/cinema');
            }
            setCinemas(response.data.data);
            if (newSelectedCinema) {
                response.data.data.forEach((cinema, index) => {
                    if (cinema.name === newSelectedCinema) {
                        setSelectedCinemaIndex(index);
                        sessionStorage.setItem('selectedCinemaIndex', index);
                    }
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingCinemas(false);
        }
    };

    useEffect(() => {
        fetchCinemas();
    }, []);

    const props = {
        cinemas,
        selectedCinemaIndex,
        setSelectedCinemaIndex,
        fetchCinemas,
        auth,
        isFetchingCinemas,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e]">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#ff416c] to-[#ff4b2b] mb-6 shadow-lg shadow-[#ff416c]/30">
                        <BuildingStorefrontIcon className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] mb-3">
                        Our Cinemas
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Discover premium movie experiences at our state-of-the-art locations
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-[#222]/90 rounded-2xl shadow-2xl shadow-[#ff416c]/10 border border-[#333] backdrop-blur-sm overflow-hidden">
                    {/* Cinema Selection */}
                    <div className="p-6 border-b border-[#333]">
                        <CinemaLists {...props} />
                    </div>

                    {/* Theater List */}
                    <div className="p-6">
                        {cinemas[selectedCinemaIndex]?.name ? (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#ff416c]/10 rounded-full">
                                        <MapPinIcon className="w-6 h-6 text-[#ff416c]" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                                        {cinemas[selectedCinemaIndex].name}
                                    </h2>
                                </div>
                                <TheaterListsByCinema {...props} />
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-gray-400 flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-5 text-[#ff416c]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xl font-medium text-gray-300">No theaters available</p>
                                    
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cinema;