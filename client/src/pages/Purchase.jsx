import { TicketIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ShowtimeDetails from '../components/ShowtimeDetails';
import { AuthContext } from '../context/AuthContext';
import PaymentForm from '../pages/PaymentForm';

const formatINR = (amount) => {
    return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const calculateSeatPrice = (seat, showtime) => {
    // Handle both string format ("A1") and object format ({row: "A", number: 1})
    const seatStr = typeof seat === 'string' ? seat : `${seat.row}${seat.number}`;
    const rowLetter = seatStr.match(/^[A-Za-z]+/)?.[0]?.toUpperCase();
    
    if (!rowLetter) return 0;
    
    if (!showtime?.theater?.pricing) {
        if (rowLetter >= 'A' && rowLetter <= 'F') return 300;
        if (rowLetter >= 'G' && rowLetter <= 'Q') return 200;
        return 100;
    }

    // Rest of the existing logic...
    if (showtime.theater.pricing.sections) {
        const section = showtime.theater.pricing.sections.find(s => 
            rowLetter >= s.rowRange.start && 
            rowLetter <= s.rowRange.end
        );
        return section ? section.price : showtime.theater.pricing.defaultPrice;
    } else {
        const totalRows = showtime.theater.seatPlan.row.charCodeAt(0) - 64;
        const sectionSize = Math.ceil(totalRows / 3);
        
        if (rowLetter.charCodeAt(0) - 64 <= sectionSize) {
            return showtime.theater.pricing.lowerSection || 300;
        } else if (rowLetter.charCodeAt(0) - 64 <= sectionSize * 2) {
            return showtime.theater.pricing.middleSection || 200;
        } else {
            return showtime.theater.pricing.upperSection || 100;
        }
    }
};

const calculateTotalPrice = (selectedSeats, showtime) => {
    return selectedSeats.reduce((total, seat) => {
        return total + calculateSeatPrice(seat, showtime);
    }, 0);
};

const Purchase = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const location = useLocation();
    const showtime = location.state?.showtime;
    const [selectedSeats, setSelectedSeats] = useState(location.state?.selectedSeats || []);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('creditCard');

    const totalPrice = calculateTotalPrice(selectedSeats, showtime);
    const serviceFee = 40;
    const grandTotal = totalPrice + serviceFee;

    const onPurchase = async () => {
        setIsPurchasing(true);
        try {
            await axios.post(
                `/showtime/${showtime._id}`,
                { seats: selectedSeats },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );
            navigate('/cinema');
            toast.success('Purchase successful!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error processing payment', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            setIsPurchasing(false);
        }
    };

    const handlePaymentSuccess = () => {
        setIsPaymentComplete(true);
        onPurchase();
    };

    if (!showtime) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e]">
                <Navbar />
                <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
                    <h1 className="text-2xl text-white">No showtime selected</h1>
                    <button 
                        onClick={() => navigate('/cinema')}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white rounded-xl shadow-lg hover:shadow-[#ff416c]/30 transition-all"
                    >
                        Back to Cinema
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e]">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="bg-[#222]/90 rounded-2xl shadow-xl border border-[#333] backdrop-blur-sm overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-[#ff416c]/20 to-[#1a1a2e]/70 p-6 border-b border-[#333]">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-shrink-0">
                              
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{showtime.movie.name}</h1>
                                <ShowtimeDetails showtime={showtime} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#222]/90 rounded-2xl shadow-xl border border-[#333] backdrop-blur-sm p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <TicketIcon className="w-6 h-6 text-[#ff416c]" />
                            <span className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                                Your Order
                            </span>
                        </h2>

                        <div className="bg-[#1e1e1e] rounded-xl p-5 mb-6 border border-[#333]">
                            <h3 className="text-lg font-semibold text-white mb-3">Selected Seats</h3>
                            {selectedSeats.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {selectedSeats.map((seat, index) => (
                                        <div 
                                            key={index}
                                            className="flex flex-col items-center p-3 rounded-xl bg-[#222] border border-[#ff416c]/20 hover:border-[#ff416c]/40 transition-colors"
                                        >
                                            <span className="text-white font-medium">{seat}</span>
                                            <span className="text-[#ff416c] text-sm font-bold">
                                                {formatINR(calculateSeatPrice(seat, showtime))}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No seats selected</p>
                            )}
                        </div>

                        <div className="bg-[#1e1e1e] rounded-xl p-5 border border-[#333]">
                            <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal ({selectedSeats.length} seats)</span>
                                    <span className="text-white">{formatINR(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Service Fee</span>
                                    <span className="text-white">{formatINR(serviceFee)}</span>
                                </div>
                                <div className="border-t border-[#333] my-3"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-gray-300">Total</span>
                                    <span className="text-white">{formatINR(grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#222]/90 rounded-2xl shadow-xl border border-[#333] backdrop-blur-sm p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <CreditCardIcon className="w-6 h-6 text-[#ff416c]" />
                            <span className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                                Payment Method
                            </span>
                        </h2>

                        {!isPaymentComplete ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] border border-[#333] text-white focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                                    >
                                        <option value="creditCard" className="bg-[#222]">Credit Card</option>
                                        <option value="debitCard" className="bg-[#222]">Debit Card</option>
                                    </select>
                                </div>

                                <PaymentForm 
                                    onPaymentSuccess={handlePaymentSuccess} 
                                    totalAmount={grandTotal}
                                />

                                <button
                                    onClick={handlePaymentSuccess}
                                    disabled={isPurchasing || selectedSeats.length === 0}
                                    className={`w-full py-4 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                                        isPurchasing || selectedSeats.length === 0
                                            ? 'bg-[#333] text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90 shadow-lg hover:shadow-[#ff416c]/30'
                                    }`}
                                >
                                    {isPurchasing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        `Pay ${formatINR(grandTotal)}`
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">Payment Successful!</h3>
                                <p className="text-gray-400">Your tickets have been booked.</p>
                                <button
                                    onClick={() => navigate('/tickets')}
                                    className="mt-6 px-6 py-3 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white rounded-xl shadow-lg hover:shadow-[#ff416c]/30 transition-all"
                                >
                                    View Tickets
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Purchase;