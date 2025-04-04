import axios from 'axios';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import CinemaLists from './CinemaLists';
import DateSelector from './DateSelector';
import Loading from './Loading';
import TheaterShort from './TheaterShort';

const TheaterListsByMovie = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth }) => {
    const [selectedDate, setSelectedDate] = useState(
        sessionStorage.getItem('selectedDate') ? new Date(sessionStorage.getItem('selectedDate')) : new Date(),
    );
    const [theaters, setTheaters] = useState([]);
    const [isFetchingTheatersDone, setIsFetchingTheatersDone] = useState(false);
    const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
        parseInt(sessionStorage.getItem('selectedCinemaIndex')),
    );
    const [cinemas, setCinemas] = useState([]);
    const [isFetchingCinemas, setIsFetchingCinemas] = useState(true);

    const fetchCinemas = async () => {
        try {
            setIsFetchingCinemas(true);
            const response = auth.role === 'admin'
                ? await axios.get('/cinema/unreleased', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                })
                : await axios.get('/cinema');
            setCinemas(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingCinemas(false);
        }
    };

    const fetchTheaters = async () => {
        try {
            setIsFetchingTheatersDone(false);
            const response = auth.role === 'admin'
                ? await axios.get(
                    `/theater/movie/unreleased/${movies[selectedMovieIndex]._id}/${selectedDate.toISOString()}/${new Date().getTimezoneOffset()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    },
                )
                : await axios.get(
                    `/theater/movie/${movies[selectedMovieIndex]._id}/${selectedDate.toISOString()}/${new Date().getTimezoneOffset()}`,
                );
            setTheaters(
                response.data.data.sort((a, b) => {
                    if (a.cinema.name > b.cinema.name) return 1;
                    if (a.cinema.name === b.cinema.name && a.number > b.number) return 1;
                    return -1;
                }),
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingTheatersDone(true);
        }
    };

    useEffect(() => {
        fetchCinemas();
    }, []);

    useEffect(() => {
        fetchTheaters();
    }, [selectedMovieIndex, selectedDate]);

    const filteredTheaters = theaters.filter((theater) => {
        if (selectedCinemaIndex === 0 || !!selectedCinemaIndex) {
            return theater.cinema?.name === cinemas[selectedCinemaIndex]?.name;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] text-white p-4">
            <div className="max-w-6xl mx-auto">
                <CinemaLists
                    cinemas={cinemas}
                    selectedCinemaIndex={selectedCinemaIndex}
                    setSelectedCinemaIndex={setSelectedCinemaIndex}
                    fetchCinemas={fetchCinemas}
                    auth={auth}
                    isFetchingCinemas={isFetchingCinemas}
                />
                
                <div className="mt-6 rounded-xl bg-[#222] bg-opacity-80 backdrop-blur-sm shadow-lg shadow-[#ff416c]/20">
                    <div className="p-6">
                        <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        
                        <div className="mt-6 p-5 rounded-lg bg-[#1e1e1e] border border-[#333]">
                            <div className="flex items-center gap-5">
                                <img
                                    src={movies[selectedMovieIndex].img}
                                    alt={movies[selectedMovieIndex].name}
                                    className="h-28 w-20 sm:h-32 sm:w-24 rounded-lg object-cover shadow-lg border-2 border-[#ff416c]/50"
                                />
                                <div>
                                    <h4 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                                        {movies[selectedMovieIndex].name}
                                    </h4>
                                    <p className="text-gray-400 mt-2">
                                        Length: <span className="text-white">{movies[selectedMovieIndex].length || '-'} min</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isFetchingTheatersDone ? (
                            <div className="mt-8 space-y-8">
                                {filteredTheaters.map((theater, index) => (
                                    <div
                                        key={index}
                                        className={`${index !== 0 &&
                                            filteredTheaters[index - 1]?.cinema.name !== filteredTheaters[index].cinema.name &&
                                            'mt-10'
                                            }`}
                                    >
                                        {filteredTheaters[index - 1]?.cinema.name !== filteredTheaters[index].cinema.name && (
                                            <div className="mb-4 rounded-t-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] p-3 text-center">
                                                <h2 className="text-2xl font-bold text-white">{theater.cinema.name}</h2>
                                            </div>
                                        )}
                                        <TheaterShort
                                            theaterId={theater._id}
                                            movies={movies}
                                            selectedDate={selectedDate}
                                            filterMovie={movies[selectedMovieIndex]}
                                            rounded={
                                                index === filteredTheaters.length - 1 ||
                                                filteredTheaters[index + 1]?.cinema.name !== filteredTheaters[index].cinema.name
                                            }
                                        />
                                    </div>
                                ))}
                                {filteredTheaters.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-xl font-semibold text-gray-400">
                                            There are no showtimes available.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-20">
                                <Loading />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheaterListsByMovie;