import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Showtimes = ({ showtimes, movies, selectedDate, filterMovie, showMovieDetail = true }) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const sortedShowtimes = showtimes?.reduce((result, showtime) => {
        const { movie, showtime: showDateTime, seats, _id, isRelease } = showtime;

        if (filterMovie && filterMovie._id !== movie) {
            return result; // skip
        }

        if (
            new Date(showDateTime).getDate() === selectedDate.getDate() &&
            new Date(showDateTime).getMonth() === selectedDate.getMonth() &&
            new Date(showDateTime).getFullYear() === selectedDate.getFullYear()
        ) {
            if (!result[movie]) {
                result[movie] = [];
            }
            result[movie].push({ showtime: showDateTime, seats, _id, isRelease });
        }
        return result;
    }, {});

    // Sort the showtimes array for each movie by showtime
    sortedShowtimes &&
        Object.values(sortedShowtimes).forEach((movie) => {
            movie.sort((a, b) => new Date(a.showtime) - new Date(b.showtime));
        });

    const isPast = (date) => {
        return date < new Date();
    };

    if (Object.keys(sortedShowtimes).length === 0) {
        return <p className="text-center text-gray-400 py-8">There are no showtimes available.</p>;
    }

    return (
        <div className="space-y-6 bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
            {movies?.map((movie, index) => {
                return (
                    sortedShowtimes &&
                    sortedShowtimes[movie._id] && (
                        <div 
                            key={index} 
                            className="flex flex-col md:flex-row items-start gap-6 rounded-xl bg-gray-800 p-6 shadow-lg hover:shadow-[0_8px_30px_rgb(255,65,108,0.2)] transition-all duration-300 border border-gray-700 group"
                        >
                            {showMovieDetail && (
                                <div className="w-full md:w-32 flex-shrink-0 overflow-hidden rounded-lg shadow-xl">
                                    <img
                                        src={movie.img}
                                        alt={movie.name}
                                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="flex-1 w-full">
                                {showMovieDetail && (
                                    <div className="mb-6">
                                        <h4 className="text-2xl font-bold text-white mb-1">{movie.name}</h4>
                                        <div className="flex items-center gap-4 text-gray-400">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {movie.length || '-'} min
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {movie.rating || 'NR'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h5 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Available Showtimes</h5>
                                    <div className="flex flex-wrap gap-3">
                                        {sortedShowtimes[movie._id]?.map((showtime, index) => (
                                            <button
                                                key={index}
                                                title={`${new Date(showtime.showtime)
                                                    .getHours()
                                                    .toString()
                                                    .padStart(2, '0')}:${new Date(showtime.showtime)
                                                    .getMinutes()
                                                    .toString()
                                                    .padStart(2, '0')} - ${new Date(
                                                    new Date(showtime.showtime).getTime() + movie.length * 60000,
                                                )
                                                    .getHours()
                                                    .toString()
                                                    .padStart(2, '0')}:${new Date(
                                                    new Date(showtime.showtime).getTime() + movie.length * 60000,
                                                )
                                                    .getMinutes()
                                                    .toString()
                                                    .padStart(2, '0')}`}
                                                className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-all duration-300 ${
                                                    isPast(new Date(showtime.showtime))
                                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                        : new Date(showtime.showtime).getTime() ===
                                                          new Date(
                                                                sortedShowtimes[movie._id].find(
                                                                    (s) => new Date(s.showtime) > new Date(),
                                                                ).showtime,
                                                          ).getTime()
                                                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40'
                                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                                }`}
                                                onClick={() => {
                                                    if (!isPast(new Date(showtime.showtime)) || auth.role === 'admin') {
                                                        navigate(`/showtime/${showtime._id}`);
                                                    }
                                                }}
                                            >
                                                {!showtime.isRelease && (
                                                    <EyeSlashIcon className="h-4 w-4 text-gray-300" title="Unreleased showtime" />
                                                )}
                                                <span className="font-semibold">
                                                    {`${new Date(showtime.showtime)
                                                        .getHours()
                                                        .toString()
                                                        .padStart(2, '0')}:${new Date(showtime.showtime)
                                                        .getMinutes()
                                                        .toString()
                                                        .padStart(2, '0')}`}
                                                </span>
                                                {!isPast(new Date(showtime.showtime)) && (
                                                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-gray-800"></span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                );
            })}
        </div>
    );
};

export default Showtimes;