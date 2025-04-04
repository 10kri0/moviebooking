import { ArrowsRightLeftIcon, ArrowsUpDownIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';
import Showtimes from './Showtimes';

const TheaterShort = ({ theaterId, movies, selectedDate, filterMovie, rounded = false }) => {
    const { auth } = useContext(AuthContext);
    const [theater, setTheater] = useState({});
    const [isFetchingTheaterDone, setIsFetchingTheaterDone] = useState(false);

    const fetchTheater = async () => {
        try {
            setIsFetchingTheaterDone(false);
            const response = auth.role === 'admin'
                ? await axios.get(`/theater/unreleased/${theaterId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                })
                : await axios.get(`/theater/${theaterId}`);
            setTheater(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingTheaterDone(true);
        }
    };

    useEffect(() => {
        fetchTheater();
    }, [theaterId]);

    const rowToNumber = (column) => {
        let result = 0;
        for (let i = 0; i < column.length; i++) {
            const charCode = column.charCodeAt(i) - 64; // Convert character to ASCII and adjust to 1-based index
            result = result * 26 + charCode;
        }
        return result;
    };

    if (!isFetchingTheaterDone) {
        return <Loading />;
    }

    return (
        <div
            className={`flex flex-col bg-gradient-to-b from-[#222] to-[#111] shadow-lg shadow-[#ff416c]/10 ${
                rounded ? 'rounded-xl' : ''
            } border border-[#333] overflow-hidden`}
        >
            <div className="flex flex-col sm:flex-row">
                <div
                    className={`flex min-w-[120px] flex-row items-center justify-center gap-x-2 bg-gradient-to-br from-[#ff416c] to-[#ff4b2b] p-4 text-white sm:flex-col ${
                        rounded ? 'sm:rounded-tl-xl' : ''
                    }`}
                >
                    <p className="text-sm font-medium">THEATER</p>
                    <p className="text-4xl font-bold tracking-tight">{theater.number}</p>
                </div>
                
                {auth.role === 'admin' && (
                    <div
                        className={`flex w-full flex-row flex-wrap justify-center gap-x-6 gap-y-3 bg-[#222] p-4 text-sm font-medium text-gray-300 sm:w-auto sm:flex-nowrap sm:items-center sm:gap-6`}
                    >
                        <div className="flex items-center gap-2">
                            <ArrowsUpDownIcon className="h-5 w-5 text-[#ff416c]" />
                            <p>Row: <span className="text-white">A - {theater?.seatPlan?.row}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowsRightLeftIcon className="h-5 w-5 text-[#ff416c]" />
                            <p>Column: <span className="text-white">1 - {theater?.seatPlan?.column}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-[#ff416c]" />
                            <p>Seats: <span className="text-white">{(rowToNumber(theater.seatPlan.row) * theater.seatPlan.column).toLocaleString()}</span></p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-[#1a1a1a] border-t border-[#333]">
                <Showtimes
                    showtimes={theater.showtimes}
                    movies={movies}
                    selectedDate={selectedDate}
                    filterMovie={filterMovie}
                    showMovieDetail={false}
                />
            </div>
        </div>
    );
};

export default TheaterShort;