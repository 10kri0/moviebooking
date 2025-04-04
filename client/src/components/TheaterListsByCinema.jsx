import {
    ArrowsRightLeftIcon,
    ArrowsUpDownIcon,
    CheckIcon,
    PencilSquareIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateSelector from './DateSelector';
import { PlusIcon } from '@heroicons/react/24/outline';
import Theater from './Theater';

const TheaterListsByCinema = ({
    cinemas,
    selectedCinemaIndex,
    setSelectedCinemaIndex,
    fetchCinemas,
    auth,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {
        register: registerName,
        handleSubmit: handleSubmitName,
        setValue: setValueName,
        formState: { errors: errorsName },
    } = useForm();

    const [movies, setMovies] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        sessionStorage.getItem('selectedDate')
            ? new Date(sessionStorage.getItem('selectedDate'))
            : new Date(),
    );
    const [isIncreasing, setIsIncreasing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDecreasing, setIsDecreasing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('/movie');
            setMovies(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        setIsEditing(false);
        setValueName('name', cinemas[selectedCinemaIndex].name);
    }, [cinemas[selectedCinemaIndex].name]);

    const handleDelete = (cinema) => {
        const confirmed = window.confirm(
            `Do you want to delete cinema ${cinema.name}, including its theaters, showtimes, and tickets?`,
        );
        if (confirmed) {
            onDeleteCinema(cinema._id);
        }
    };

    const onDeleteCinema = async (id) => {
        try {
            setIsDeleting(true);
            const response = await axios.delete(`/cinema/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setSelectedCinemaIndex(null);
            fetchCinemas();
            toast.success('Cinema deleted successfully!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete cinema.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const onIncreaseTheater = async (data) => {
        try {
            setIsIncreasing(true);
            const response = await axios.post(
                `/theater`,
                {
                    cinema: cinemas[selectedCinemaIndex]._id,
                    number: cinemas[selectedCinemaIndex].theaters.length + 1,
                    row: data.row.toUpperCase(),
                    column: data.column,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                },
            );
            fetchCinemas();
            toast.success('Theater added successfully!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to add theater.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            setIsIncreasing(false);
        }
    };

    const handleDecreaseTheater = () => {
        const confirmed = window.confirm(
            `Do you want to delete the last theater, including its showtimes and tickets?`,
        );
        if (confirmed) {
            onDecreaseTheater();
        }
    };

    const onDecreaseTheater = async () => {
        try {
            setIsDecreasing(true);
            const response = await axios.delete(
                `/theater/${cinemas[selectedCinemaIndex].theaters.slice(-1)[0]._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                },
            );
            fetchCinemas();
            toast.success('Theater deleted successfully!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete theater.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            setIsDecreasing(false);
        }
    };

    const onEditCinema = async (data) => {
        try {
            const response = await axios.put(
                `/cinema/${cinemas[selectedCinemaIndex]._id}`,
                { name: data.name },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                },
            );
            fetchCinemas(data.name);
            toast.success('Cinema name updated successfully!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to update cinema name.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };

    
    return (
        <div className="mx-4 rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl shadow-[#ff416c]/20 sm:mx-8">
            {/* Cinema Header Section */}
            <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700">
                {isEditing ? (
                    <input
                        type="text"
                        required
                        autoFocus
                        className={`flex-grow rounded-xl border-2 border-gray-600 bg-gray-800 px-4 py-3 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#ff416c] ${
                            errorsName.name && 'border-red-500'
                        }`}
                        {...registerName('name', { required: true })}
                    />
                ) : (
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                        {cinemas[selectedCinemaIndex]?.name}
                    </h2>
                )}
                {auth.role === 'admin' && (
                    <div className="flex gap-3">
                        {isEditing ? (
                            <button
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-4 py-2.5 font-medium text-white hover:shadow-[0_0_20px_rgb(255,75,43,0.5)] transition-all duration-300"
                                onClick={handleSubmitName(onEditCinema)}
                            >
                                <CheckIcon className="h-5 w-5" />
                                Save
                            </button>
                        ) : (
                            <button
                                className="flex items-center gap-2 rounded-xl bg-gray-700 px-4 py-2.5 font-medium text-white hover:bg-gray-600 transition-all duration-300 border border-gray-600"
                                onClick={() => setIsEditing(true)}
                            >
                                <PencilSquareIcon className="h-5 w-5 text-[#ff416c]" />
                                Edit
                            </button>
                        )}
                        <button
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-4 py-2.5 font-medium text-white hover:shadow-[0_0_20px_rgb(255,75,43,0.5)] transition-all duration-300"
                            onClick={() => handleDelete(cinemas[selectedCinemaIndex])}
                            disabled={isDeleting}
                        >
                            <TrashIcon className="h-5 w-5" />
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-6 p-6">
                <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                {/* Enhanced Theater Configuration Section */}
                {auth.role === 'admin' && (
                    <div className="rounded-xl bg-gray-800 p-6 border border-gray-700 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-[#ff416c] flex items-center gap-2">
                                <ArrowsUpDownIcon className="h-6 w-6" />
                                Theater Configuration
                            </h3>
                            <div className="text-sm text-gray-300">
                                Theaters: {cinemas[selectedCinemaIndex].theaters.length}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onIncreaseTheater)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Row Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Row Letters (A-Z)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            {...register('row', {
                                                required: 'Row letters are required',
                                                pattern: {
                                                    value: /^([A-Za-z]{1,2})$/,
                                                    message: 'Invalid row format (A-ZZ)'
                                                }
                                            })}
                                            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff416c] text-gray-100 placeholder-gray-400"
                                            placeholder="Example: B"
                                        />
                                        {errors.row && (
                                            <p className="text-xs text-red-400 mt-1">
                                                {errors.row.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Column Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Seats Per Row Minimum 50
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            {...register('column', {
                                                required: 'Number of seats is required',
                                                min: { value: 1, message: 'Minimum 1 seat' },
                                                max: { value: 50, message: 'Maximum 50 seats' }
                                            })}
                                            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff416c] text-gray-100 placeholder-gray-400"
                                            placeholder="Example: 20"
                                        />
                                        {errors.column && (
                                            <p className="text-xs text-red-400 mt-1">
                                                {errors.column.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-between border-t border-gray-700 pt-6">
                                <button
                                    type="submit"
                                    disabled={isIncreasing}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#ff416c] hover:bg-[#ff4b2b] text-white rounded-full transition-all duration-300 font-medium"
                                >
                                    {isIncreasing ? (
                                        <span className="animate-pulse">Adding...</span>
                                    ) : (
                                        <>
                                            <PlusIcon className="h-5 w-5" />
                                            Add New Theater
                                        </>
                                    )}
                                </button>

                                {cinemas[selectedCinemaIndex].theaters.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleDecreaseTheater}
                                        disabled={isDecreasing}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-all duration-300 font-medium"
                                    >
                                        {isDecreasing ? (
                                            <span className="animate-pulse">Removing...</span>
                                        ) : (
                                            <>
                                                <TrashIcon className="h-5 w-5" />
                                                Remove Last Theater
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>

                       
                    </div>
                )}

                {/* Screening Rooms Section */}
                <div className="rounded-xl bg-gray-800 p-6 border border-gray-700">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent mb-6">
                        Screening Rooms
                    </h3>
                    <div className="grid gap-6">
                        {cinemas[selectedCinemaIndex].theaters.map((theater, index) => (
                            <Theater
                                key={index}
                                theaterId={theater._id}
                                movies={movies}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                auth={auth}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheaterListsByCinema;
