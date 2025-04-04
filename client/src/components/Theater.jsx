import { ArrowsRightLeftIcon, ArrowsUpDownIcon, InformationCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-tailwindcss-select';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';
import Showtimes from './Showtimes';

const Theater = ({ theaterId, movies, selectedDate, filterMovie, setSelectedDate }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const { auth } = useContext(AuthContext);
    const [theater, setTheater] = useState({});
    const [isFetchingTheaterDone, setIsFetchingTheaterDone] = useState(false);
    const [isAddingShowtime, setIsAddingShowtime] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

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

    useEffect(() => {
        setValue('autoIncrease', true);
        setValue('rounding5', true);
        setValue('gap', '00:10');
    }, []);

    const onAddShowtime = async (data) => {
        try {
            setIsAddingShowtime(true);
            if (!data.movie) {
                toast.error('Please select a movie.', {
                    position: 'top-center',
                    autoClose: 2000,
                    pauseOnHover: false,
                    theme: 'dark',
                });
                return;
            }

            let showtime = new Date(selectedDate);
            const [hours, minutes] = data.showtime.split(':');
            showtime.setHours(hours, minutes, 0);

            const response = await axios.post(
                '/showtime',
                {
                    movie: data.movie,
                    showtime,
                    theater: theater._id,
                    repeat: data.repeat,
                    isRelease: data.isRelease,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                },
            );

            fetchTheater();

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
                        `${String(roundedHours).padStart(2, '0')}:${String(remainderMinutes).padStart(2, '0')}`,
                    );
                } else {
                    setValue(
                        'showtime',
                        `${String(nextShowtime.getHours()).padStart(2, '0')}:${String(
                            nextShowtime.getMinutes(),
                        ).padStart(2, '0')}`,
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
                theme: 'dark',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to add showtime.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
                theme: 'dark',
            });
        } finally {
            setIsAddingShowtime(false);
        }
    };

    if (!isFetchingTheaterDone) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col rounded-lg bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] shadow-xl">
       
            <div className="flex flex-col rounded-t-lg bg-gradient-to-br from-[#222] to-[#333] p-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center rounded-lg bg-gradient-to-br from-[#111] to-[#222] px-6 py-3 shadow-md">
                        <p className="text-sm text-gray-400">Theater</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                            {theater.number}
                        </p>
                    </div>
                    {auth.role === 'admin' && (
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <div className="flex items-center gap-2 text-gray-300">
                                <ArrowsUpDownIcon className="h-5 w-5" />
                                <p>Row: A - {theater?.seatPlan?.row}</p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <ArrowsRightLeftIcon className="h-5 w-5" />
                                <p>Column: 1 - {theater?.seatPlan?.column}</p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <UserIcon className="h-5 w-5" />
                                <p>{(theater?.seatPlan?.row.charCodeAt(0) - 64) * theater?.seatPlan?.column} Seats</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-6 p-6">
                {auth.role === 'admin' && (
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onAddShowtime)}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <label className="text-lg font-semibold text-white">Movie:</label>
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
                                        menuButton: () =>
                                            'flex w-full rounded-lg border border-gray-700 bg-[#222] p-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:border-gray-600 focus:border-[#ff416c] focus:ring focus:ring-[#ff416c]/20',
                                        menu: 'bg-[#222] border border-gray-700 rounded-lg mt-1',
                                        listItem: ({ isSelected }) =>
                                            `block px-3 py-2 text-sm text-white transition-all duration-200 hover:bg-[#333] ${
                                                isSelected ? 'bg-[#ff416c]' : ''
                                            }`,
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-lg font-semibold text-white">Showtime:</label>
                                <input
                                    type="time"
                                    className="w-full rounded-lg border border-gray-700 bg-[#222] p-3 text-sm font-semibold text-white shadow-sm focus:border-[#ff416c] focus:ring focus:ring-[#ff416c]/20"
                                    required
                                    {...register('showtime', { required: true })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-lg font-semibold text-white">Repeat (Days):</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={31}
                                    className="w-full rounded-lg border border-gray-700 bg-[#222] p-3 text-sm font-semibold text-white shadow-sm focus:border-[#ff416c] focus:ring focus:ring-[#ff416c]/20"
                                    required
                                    {...register('repeat', { required: true })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 text-gray-300">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-700 bg-[#222] text-[#ff416c] focus:ring-[#ff416c]" 
                                    {...register('isRelease')} 
                                />
                                <span className="text-sm font-semibold">Release Now</span>
                            </label>
                            <label className="flex items-center gap-2 text-gray-300">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-700 bg-[#222] text-[#ff416c] focus:ring-[#ff416c]" 
                                    {...register('autoIncrease')} 
                                />
                                <span className="text-sm font-semibold">Auto Increase Showtime</span>
                            </label>
                            <label className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-700 bg-[#222] text-[#ff416c] focus:ring-[#ff416c] disabled:opacity-50"
                                    disabled={!watch('autoIncrease')}
                                    {...register('autoIncreaseDate')}
                                />
                                <span className="text-sm font-semibold">Auto Increase Date</span>
                            </label>
                            <label className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="time"
                                    disabled={!watch('autoIncrease')}
                                    className="rounded-lg border border-gray-700 bg-[#222] p-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                                    {...register('gap')}
                                />
                                <span className="text-sm font-semibold">Gap</span>
                            </label>
                            <label className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-700 bg-[#222] text-[#ff416c] focus:ring-[#ff416c] disabled:opacity-50"
                                    disabled={!watch('autoIncrease')}
                                    {...register('rounding5', {
                                        onChange: () => setValue('rounding10', false),
                                    })}
                                />
                                <span className="text-sm font-semibold">Round to 5 Minutes</span>
                            </label>
                            <label className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-700 bg-[#222] text-[#ff416c] focus:ring-[#ff416c] disabled:opacity-50"
                                    disabled={!watch('autoIncrease')}
                                    {...register('rounding10', {
                                        onChange: () => setValue('rounding5', false),
                                    })}
                                />
                                <span className="text-sm font-semibold">Round to 10 Minutes</span>
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isAddingShowtime}
                            className="w-fit rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90 hover:shadow-[0_0_10px_-2px_rgba(255,75,43,0.5)] disabled:opacity-50"
                        >
                            {isAddingShowtime ? 'Adding...' : 'Add Showtime +'}
                        </button>
                    </form>
                )}
                {filterMovie?.name && (
                    <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] p-4 text-white shadow-md">
                        <InformationCircleIcon className="h-6 w-6" />
                        <p>{`You are viewing the showtimes of "${filterMovie?.name}"`}</p>
                    </div>
                )}
                <Showtimes
                    showtimes={theater.showtimes}
                    movies={movies}
                    selectedDate={selectedDate}
                    filterMovie={filterMovie}
                />
            </div>
        </div>
    );
};

export default Theater;