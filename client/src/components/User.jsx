import {
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    MagnifyingGlassIcon,
    TicketIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ShowtimeDetails from '../components/ShowtimeDetails';
import { AuthContext } from '../context/AuthContext';

const User = () => {
    const { auth } = useContext(AuthContext);
    const [users, setUsers] = useState(null);
    const [ticketsUser, setTicketsUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register,
        watch,
    } = useForm();

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/auth/user', {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setUsers(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch users', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onUpdateUser = async (data) => {
        try {
            setIsUpdating(true);
            const response = await axios.put(`/auth/user/${data.id}`, data, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            fetchUsers();
            toast.success(`Updated ${response.data.data.username} to ${response.data.data.role}!`, {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Error updating user.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = (data) => {
        const confirmed = window.confirm(`Are you sure you want to delete ${data.username}? This action cannot be undone.`);
        if (confirmed) {
            onDeleteUser(data);
        }
    };

    const onDeleteUser = async (data) => {
        try {
            setIsDeleting(true);
            await axios.delete(`/auth/user/${data.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            fetchUsers();
            toast.success(`Deleted ${data.username} successfully!`, {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Error deleting user.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] pb-8">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white md:text-4xl">User Management</h1>
                    <p className="text-gray-400 mt-2">Manage all registered users and their permissions</p>
                </div>

                {/* Search and User List */}
                <div className="rounded-xl bg-[#222]/50 p-6 backdrop-blur-sm border border-gray-800 shadow-lg">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            className="block w-full rounded-lg border border-gray-700 bg-[#333] p-3 pl-10 text-white placeholder-gray-400 focus:border-[#ff416c] focus:ring-2 focus:ring-[#ff416c]/50"
                            placeholder="Search by username or email..."
                            {...register('search')}
                        />
                    </div>

                    {/* Users Table */}
                    <div className="overflow-hidden rounded-lg border border-gray-800">
                        <table className="min-w-full divide-y divide-gray-800">
                            <thead className="bg-[#333]">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Tickets
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#222] divide-y divide-gray-800">
                                {users?.filter((user) => 
                                    user.username?.toLowerCase().includes(watch('search')?.toLowerCase() || '') ||
                                    user.email?.toLowerCase().includes(watch('search')?.toLowerCase() || '')
                                ).map((user, index) => (
                                    <tr key={index} className="hover:bg-[#333]/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#ff416c]/10 flex items-center justify-center">
                                                    <span className="text-[#ff416c] font-medium">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' 
                                                    ? 'bg-purple-900/50 text-purple-300' 
                                                    : 'bg-blue-900/50 text-blue-300'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium ${
                                                    user.tickets.length > 0
                                                        ? 'bg-[#ff416c]/10 text-[#ff416c] hover:bg-[#ff416c]/20'
                                                        : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                                                }`}
                                                onClick={() => {
                                                    setTickets(user.tickets);
                                                    setTicketsUser(user.username);
                                                }}
                                                disabled={user.tickets.length === 0}
                                            >
                                                {user.tickets.length} tickets
                                                <TicketIcon className="h-4 w-4" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {user.role === 'user' ? (
                                                    <button
                                                        onClick={() => onUpdateUser({ id: user._id, role: 'admin' })}
                                                        disabled={isUpdating}
                                                        className="inline-flex items-center gap-1 rounded-md bg-green-900/50 px-3 py-1 text-sm font-medium text-green-300 hover:bg-green-900/70 transition-colors"
                                                    >
                                                        Promote
                                                        <ChevronDoubleUpIcon className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onUpdateUser({ id: user._id, role: 'user' })}
                                                        disabled={isUpdating}
                                                        className="inline-flex items-center gap-1 rounded-md bg-yellow-900/50 px-3 py-1 text-sm font-medium text-yellow-300 hover:bg-yellow-900/70 transition-colors"
                                                    >
                                                        Demote
                                                        <ChevronDoubleDownIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete({ id: user._id, username: user.username })}
                                                    disabled={isDeleting}
                                                    className="inline-flex items-center gap-1 rounded-md bg-red-900/50 px-3 py-1 text-sm font-medium text-red-300 hover:bg-red-900/70 transition-colors"
                                                >
                                                    Delete
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Tickets Section */}
                {ticketsUser && (
                    <div className="mt-8 rounded-xl bg-[#222]/50 p-6 backdrop-blur-sm border border-gray-800 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {ticketsUser}'s Tickets
                                </h2>
                                <p className="text-gray-400">
                                    {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} found
                                </p>
                            </div>
                            <button
                                onClick={() => setTicketsUser(null)}
                                className="rounded-md bg-gray-700/50 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>

                        {tickets.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400">No tickets found for this user.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tickets.map((ticket, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl bg-[#222] border border-gray-800 overflow-hidden hover:shadow-[#ff416c]/10 hover:shadow-lg transition-all"
                                    >
                                        <div className="p-5">
                                            <ShowtimeDetails showtime={ticket.showtime} compact={true} />
                                        </div>
                                        <div className="border-t border-gray-800 p-4 bg-[#333]/50">
                                            <h4 className="text-sm font-medium text-gray-300 mb-2">Seats</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {ticket.seats.map((seat, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="rounded-md bg-[#ff416c]/10 px-2 py-1 text-xs font-medium text-[#ff416c]"
                                                    >
                                                        {seat.row}{seat.number}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default User;