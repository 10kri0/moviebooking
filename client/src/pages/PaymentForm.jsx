import React, { useState, useContext } from 'react';
import { CreditCardIcon, CalendarIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const PaymentForm = ({ onPaymentSuccess, totalAmount }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardType, setCardType] = useState('');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (!/^[0-9\s]+$/.test(e.target.value)) return;
        
        let formattedValue = value;
        if (value.length > 4) formattedValue = value.match(/.{1,4}/g).join(' ');
        if (value.length > 16) return;
        
        if (/^4/.test(value)) {
            setCardType('visa');
        } else if (/^5[1-5]/.test(value)) {
            setCardType('mastercard');
        } else if (/^3[47]/.test(value)) {
            setCardType('amex');
        } else {
            setCardType('');
        }
        
        setCardNumber(formattedValue);
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length === 2 && !value.includes('/')) {
            value = value + '/';
        }
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        if (value.length > 5) return;
        setExpiryDate(value);
    };

   
    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const response = await axios.post('/payment/create-phonepe-session', {
                totalAmount: totalAmount,
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            
            // Redirect to PhonePe payment page
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. Please try again.', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handlePayment} className="space-y-6">
            <div className="relative">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-3">
                    Card Number
                </label>
                <div className="relative">
                    <CreditCardIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                    <input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                    />
                    {cardType && (
                        <div className="absolute right-3 top-3.5">
                            {cardType === 'visa' && (
                                <span className="text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">VISA</span>
                            )}
                            {cardType === 'mastercard' && (
                                <span className="text-xs font-medium bg-red-500/20 text-red-400 px-2 py-1 rounded-md">MASTERCARD</span>
                            )}
                            {cardType === 'amex' && (
                                <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-md">AMEX</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="relative">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-3">
                        Expiry Date
                    </label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                        <input
                            id="expiryDate"
                            type="text"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            required
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-3">
                        CVV
                    </label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                        <input
                            id="cvv"
                            type="text"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            required
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* <button
                type="submit"
                disabled={isProcessing || !cardNumber || !expiryDate || !cvv}
                className={`w-full py-4 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                    isProcessing || !cardNumber || !expiryDate || !cvv
                        ? 'bg-[#333] text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90 shadow-lg hover:shadow-[#ff416c]/30'
                }`}
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <CreditCardIcon className="h-5 w-5" />
                        Confirm Payment
                    </>
                )}
            </button> */}

            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mt-6">
                <LockClosedIcon className="h-5 w-5 text-[#ff416c]" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>
        </form>
    );
};

export default PaymentForm;