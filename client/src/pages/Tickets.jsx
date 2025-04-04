import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import ShowtimeDetails from '../components/ShowtimeDetails';
import { AuthContext } from '../context/AuthContext';
import { TicketIcon } from '@heroicons/react/24/outline';

const Tickets = () => {
    const { auth } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [isFetchingticketsDone, setIsFetchingticketsDone] = useState(false);

    const fetchTickets = async () => {
        try {
            setIsFetchingticketsDone(false);
            const response = await axios.get('/auth/tickets', {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setTickets(
                response.data.data.tickets?.sort((a, b) => {
                    if (a.showtime.showtime > b.showtime.showtime) {
                        return 1;
                    }
                    return -1;
                }),
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingticketsDone(true);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] pb-8">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] p-3">
                            <TicketIcon className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white md:text-4xl">My Tickets</h1>
                    </div>
                </div>

                {/* Tickets Content */}
                <div className="rounded-xl bg-[#222]/50 p-6 backdrop-blur-sm border border-gray-800 shadow-lg">
                    {isFetchingticketsDone ? (
                        <>
                            {tickets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-6 rounded-full bg-[#222] p-6">
                                        <TicketIcon className="h-12 w-12 text-gray-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                        No Tickets Found
                                    </h3>
                                    <p className="text-gray-500 max-w-md">
                                        You haven't purchased any tickets yet. Browse movies and book your next cinematic experience!
                                    </p>
                                    <a 
                                        href="/cinema" 
                                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-3 font-medium text-white hover:shadow-lg hover:shadow-[#ff416c]/30 transition-all"
                                    >
                                        Explore Movies
                                    </a>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {tickets.map((ticket, index) => (
                                        <div
                                            className="group relative overflow-hidden rounded-xl bg-[#222] shadow-lg transition-all duration-300 hover:shadow-[#ff416c]/20"
                                            key={index}
                                        >
                                            {/* Ribbon for upcoming/past */}
                                            <div className={`absolute -right-8 top-4 w-32 rotate-45 transform py-1 text-center text-xs font-bold ${new Date(ticket.showtime.showtime) > new Date() ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                                {new Date(ticket.showtime.showtime) > new Date() ? 'UPCOMING' : 'EXPIRED'}
                                            </div>

                                            {/* Ticket Content */}
                                            <div className="p-5">
                                                <ShowtimeDetails 
                                                    showtime={ticket.showtime} 
                                                    compact={true} 
                                                />
                                                
                                                <div className="mt-4 border-t border-gray-700 pt-4">
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <h4 className="font-medium text-gray-300">Seats</h4>
                                                        <span className="rounded-full bg-[#ff416c]/10 px-3 py-1 text-xs font-medium text-[#ff416c]">
                                                            {ticket.seats.length} {ticket.seats.length === 1 ? 'seat' : 'seats'}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-2">
                                                        {ticket.seats.map((seat, idx) => (
                                                            <span 
                                                                key={idx}
                                                                className="rounded-md bg-gray-800 px-3 py-1 text-sm font-medium text-white"
                                                            >
                                                                {seat.row}{seat.number}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="border-t border-gray-800 bg-[#333]/50 p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-400">
                                                        Purchased on: {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </span>
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-64 items-center justify-center">
                            <Loading />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tickets;