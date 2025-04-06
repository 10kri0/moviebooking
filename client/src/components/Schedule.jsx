import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-tailwindcss-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CinemaLists from '../components/CinemaLists';
import DateSelector from '../components/DateSelector';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import ScheduleTable from '../components/ScheduleTable';
import { AuthContext } from '../context/AuthContext';

const Schedule = () => {
    const { auth } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const [selectedDate, setSelectedDate] = useState(
        (sessionStorage.getItem('selectedDate') && new Date(sessionStorage.getItem('selectedDate'))) || new Date()
    );
    const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
        parseInt(sessionStorage.getItem('selectedCinemaIndex')) || 0
    );
    const [cinemas, setCinemas] = useState([]);
    const [isFetchingCinemas, setIsFetchingCinemas] = useState(true);
    const [movies, setMovies] = useState([]);
    const [isAddingShowtime, setIsAddingShowtime] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const fetchCinemas = async () => {
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
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingCinemas(false);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await axios.get('/movie');
            setMovies(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCinemas();
        fetchMovies();
    }, []);

    useEffect(() => {
        setValue('autoIncrease', true);
        setValue('rounding5', true);
        setValue('gap', '00:10');
    }, []);

    const onAddShowtime = async (data) => {
        try {
            setIsAddingShowtime(true);
            if (!data.movie) {
                toast.error('Please select a movie', {
                    position: 'top-center',
                    autoClose: 2000,
                    pauseOnHover: false,
                });
                return;
            }
            let showtime = new Date(selectedDate);
            const [hours, minutes] = data.showtime.split(':');
            showtime.setHours(hours, minutes, 0);
            await axios.post(
                '/showtime',
                { movie: data.movie, showtime, theater: data.theater, repeat: data.repeat, isRelease: data.isRelease },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );
            fetchCinemas();
            if (data.autoIncrease) {
                const movieLength = movies.find((movie) => movie._id === data.movie).length;
                const [gapHours, gapMinutes] = data.gap.split(':').map(Number);
                const nextShowtime = new Date(showtime.getTime() + (movieLength + gapHours * 60 + gapMinutes) * 60000);
                if (data.rounding5 || data.rounding10) {
                    const totalMinutes = nextShowtime.getHours() * 60 + nextShowtime.getMinutes();
                    const roundedMinutes = data.rounding5
                        ? Math.ceil(totalMinutes / 5) * 5
                        : Math.ceil(totalMinutes / 10) * 10;
                    let roundedHours = Math.floor(roundedMinutes / 60);
                    const remainderMinutes = roundedMinutes % 60;
                    if (roundedHours === 24) {
                        nextShowtime.setDate(nextShowtime.getDate() + 1);
                        roundedHours = 0;
                    }
                    setValue(
                        'showtime',
                        `${String(roundedHours).padStart(2, '0')}:${String(remainderMinutes).padStart(2, '0')}`
                    );
                } else {
                    setValue(
                        'showtime',
                        `${String(nextShowtime.getHours()).padStart(2, '0')}:${String(
                            nextShowtime.getMinutes()
                        ).padStart(2, '0')}`
                    );
                }
                if (data.autoIncreaseDate) {
                    setSelectedDate(nextShowtime);
                    sessionStorage.setItem('selectedDate', nextShowtime);
                }
            }
            toast.success('Showtime added successfully!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Error adding showtime', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            setIsAddingShowtime(false);
        }
    };

    const props = {
        cinemas,
        selectedCinemaIndex,
        setSelectedCinemaIndex,
        fetchCinemas,
        auth,
        isFetchingCinemas,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] text-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                    Schedule Showtimes
                </h1>
                <div className="bg-[#222] rounded-xl shadow-xl p-6 border border-gray-800">
                    <CinemaLists {...props} />
                    {selectedCinemaIndex !== null && cinemas[selectedCinemaIndex]?.theaters?.length ? (
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Theater Schedule</h2>
                            <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                            {auth.role === 'admin' && (
                                <form
                                    onSubmit={handleSubmit(onAddShowtime)}
                                    className="mt-6 bg-[#2a2a2a] rounded-xl p-6 border border-gray-700"
                                >
                                    <h3 className="text-xl font-semibold text-white mb-4">Add New Showtime</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Theater</label>
                                            <select
                                                {...register('theater', { required: true })}
                                                className="mt-1 block w-full bg-[#333] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff416c] focus:border-transparent"
                                            >
                                                <option value="" className="bg-[#333]">Choose a theater</option>
                                                {cinemas[selectedCinemaIndex].theaters?.map((theater, index) => (
                                                    <option key={index} value={theater._id} className="bg-[#333]">
                                                        {theater.number}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Movie</label>
                                            <Select
                                                value={selectedMovie}
                                                options={movies?.map((movie) => ({
                                                    value: movie._id,
                                                    label: movie.name,
                                                }))}
                                                onChange={(value) => {
                                                    setValue('movie', value.value);
                                                    setSelectedMovie(value);
                                                }}
                                                isSearchable={true}
                                                primaryColor="indigo"
                                                classNames={{
                                                    menuButton: ({ isDisabled }) =>
                                                        `flex text-sm bg-[#333] border border-gray-600 rounded-lg px-4 py-2 transition-all duration-300 focus:outline-none ${
                                                            isDisabled
                                                                ? 'bg-gray-700'
                                                                : 'hover:border-gray-500 focus:border-[#ff416c] focus:ring-2 focus:ring-[#ff416c]/50'
                                                        }`,
                                                    menu: 'absolute z-10 w-full bg-[#333] border border-gray-600 rounded-lg mt-1 py-1 shadow-lg',
                                                    listItem: ({ isSelected }) =>
                                                        `block px-4 py-2 text-white transition-all ${
                                                            isSelected
                                                                ? 'bg-[#ff416c]'
                                                                : 'hover:bg-[#3a3a3a]'
                                                        }`,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Showtime</label>
                                            <input
                                                type="time"
                                                {...register('showtime', { required: true })}
                                                className="mt-1 block w-full bg-[#333] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff416c] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Repeat (Days)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                defaultValue={1}
                                                max={31}
                                                {...register('repeat', { required: true })}
                                                className="mt-1 block w-full bg-[#333] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff416c] focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mt-6">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        {...register('isRelease')}
                                                        className="h-5 w-5 rounded border-gray-600 bg-[#333] text-[#ff416c] focus:ring-[#ff416c]"
                                                    />
                                                    <span className="ml-2 text-gray-300">Release Now</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Gap</label>
                                            <input
                                                type="time"
                                                {...register('gap')}
                                                className="mt-1 block w-full bg-[#333] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff416c] focus:border-transparent disabled:opacity-50"
                                                disabled={!watch('autoIncrease')}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                {...register('autoIncrease')}
                                                className="h-4 w-4 rounded border-gray-600 bg-[#333] text-[#ff416c] focus:ring-[#ff416c]"
                                            />
                                            <span className="ml-2 text-sm text-gray-300">Auto-increase time</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                {...register('rounding5')}
                                                className="h-4 w-4 rounded border-gray-600 bg-[#333] text-[#ff416c] focus:ring-[#ff416c]"
                                            />
                                            <span className="ml-2 text-sm text-gray-300">Round to 5 minutes</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isAddingShowtime}
                                        className="mt-8 w-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#ff416c]/30"
                                    >
                                        {isAddingShowtime ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Adding...
                                            </span>
                                        ) : 'Add Showtime'}
                                    </button>
                                </form>
                            )}
                            {isFetchingCinemas ? (
                                <Loading />
                            ) : (
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold text-white mb-4">Showtimes</h2>
                                    {cinemas[selectedCinemaIndex]?._id && (
                                        <ScheduleTable
                                            cinema={cinemas[selectedCinemaIndex]}
                                            selectedDate={selectedDate}
                                            auth={auth}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-6 text-center text-gray-400">No theaters available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Schedule;