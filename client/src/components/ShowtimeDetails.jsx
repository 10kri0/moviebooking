import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const ShowtimeDetails = ({ showDeleteBtn, showtime, fetchShowtime }) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDeletingShowtimes, setIsDeletingShowtimes] = useState(false);
    const [isReleasingShowtime, setIsReleasingShowtime] = useState(false);
    const [isUnreleasingShowtime, setIsUnreleasingShowtime] = useState(false);

    const handleDelete = () => {
        const confirmed = window.confirm(`Do you want to delete this showtime, including its tickets?`);
        if (confirmed) {
            onDeleteShowtime();
        }
    };

    const onDeleteShowtime = async () => {
        try {
            setIsDeletingShowtimes(true);
            const response = await axios.delete(`/showtime/${showtime._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            navigate('/cinema');
            toast.success('Showtime deleted successfully!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
                theme: 'dark',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete showtime.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
                theme: 'dark',
            });
        } finally {
            setIsDeletingShowtimes(false);
        }
    };

    const handleReleaseShowtime = () => {
        const confirmed = window.confirm(`Do you want to release this showtime?`);
        if (confirmed) {
            onReleaseShowtime();
        }
    };

    const onReleaseShowtime = async () => {
        setIsReleasingShowtime(true);
        try {
            const response = await axios.put(
                `/showtime/${showtime._id}`,
                { isRelease: true },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                },
            );
            await fetchShowtime();
            toast.success('Showtime released successfully!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
                theme: 'dark',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to release showtime.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
                theme: 'dark',
            });
        } finally {
            setIsReleasingShowtime(false);
        }
    };

    const handleUnreleasedShowtime = () => {
        const confirmed = window.confirm(`Do you want to unrelease this showtime?`);
        if (confirmed) {
            onUnreleasedShowtime();
        }
    };

    const onUnreleasedShowtime = async () => {
        setIsUnreleasingShowtime(true);
        try {
            const response = await axios.put(
                `/showtime/${showtime._id}`,
                { isRelease: false },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                },
            );
            await fetchShowtime();
            toast.success('Showtime unreleased successfully!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
                theme: 'dark',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to unrelease showtime.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
                theme: 'dark',
            });
        } finally {
            setIsUnreleasingShowtime(false);
        }
    };

    return (
        <div className="rounded-lg bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] shadow-xl">
            {showDeleteBtn && auth.role === 'admin' && (
                <div className="flex justify-end gap-2 p-4">
                    {!showtime.isRelease && (
                        <button
                            title="Release showtime"
                            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90 hover:shadow-[0_0_10px_-2px_rgba(255,75,43,0.5)] disabled:opacity-50"
                            onClick={handleReleaseShowtime}
                            disabled={isReleasingShowtime}
                        >
                            {isReleasingShowtime ? 'Processing...' : 'Release'}
                            <EyeIcon className="h-5 w-5" />
                        </button>
                    )}
                    {showtime.isRelease && (
                        <button
                            title="Unrelease showtime"
                            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90 hover:shadow-[0_0_10px_-2px_rgba(255,75,43,0.5)] disabled:opacity-50"
                            onClick={handleUnreleasedShowtime}
                            disabled={isUnreleasingShowtime}
                        >
                            {isUnreleasingShowtime ? 'Processing...' : 'Unrelease'}
                            <EyeSlashIcon className="h-5 w-5" />
                        </button>
                    )}
                    <button
                        className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-red-500 hover:to-rose-400 hover:shadow-[0_0_10px_-2px_rgba(239,68,68,0.5)] disabled:opacity-50"
                        onClick={handleDelete}
                        disabled={isDeletingShowtimes}
                    >
                        {isDeletingShowtimes ? 'Processing...' : 'Delete'}
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            )}
            <div className="flex flex-col rounded-lg bg-gradient-to-br from-[#222] to-[#333] p-6 shadow-lg">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center rounded-lg bg-gradient-to-br from-[#111] to-[#222] px-6 py-3 shadow-md">
                        <p className="text-sm text-gray-400">Theater</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                            {showtime?.theater?.number}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-white">{showtime?.theater?.cinema.name}</p>
                        {!showtime?.isRelease && (
                            <EyeSlashIcon className="h-8 w-8 text-[#ff416c]" title="Unreleased showtime" />
                        )}
                    </div>
                </div>
                <div className="mt-6 flex flex-col gap-6 md:flex-row">
                    <div className="flex items-center gap-4">
                        <img
                            src={showtime?.movie?.img}
                            alt={showtime?.movie?.name}
                            className="h-32 w-32 rounded-lg object-cover shadow-md ring-2 ring-[#ff416c]/50"
                        />
                        <div className="flex flex-col">
                            <h4 className="text-2xl font-bold text-white">{showtime?.movie?.name}</h4>
                            <p className="text-lg text-gray-300">
                                Length: {showtime?.movie?.length || '-'} min
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#111] to-[#222] p-4 text-center shadow-md">
                        <p className="text-lg text-gray-300">
                            {showtime?.showtime &&
                                `${new Date(showtime?.showtime).toLocaleString('default', { weekday: 'long' })}`}
                        </p>
                        <p className="text-xl text-white">
                            {showtime?.showtime &&
                                `${new Date(showtime?.showtime).getDate()} ${new Date(
                                    showtime?.showtime,
                                ).toLocaleString('default', { month: 'long' })} ${new Date(
                                    showtime?.showtime,
                                ).getFullYear()}`}
                        </p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                            {showtime?.showtime &&
                                `${new Date(showtime?.showtime).getHours().toString().padStart(2, '0')}:${new Date(
                                    showtime?.showtime,
                                )
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, '0')}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowtimeDetails;