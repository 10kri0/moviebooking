import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e]">
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="max-w-2xl mx-auto bg-[#222]/90 p-8 rounded-2xl border border-[#333]">
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-300 mb-8">
                        {state?.seats?.length} tickets for {state?.movie} booked successfully
                    </p>
                    
                    <div className="bg-[#1e1e1e] rounded-xl p-6 mb-8">
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-400">Total Paid:</span>
                            <span className="text-2xl font-bold text-white">
                                ₹{state?.total?.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/tickets')}
                        className="px-8 py-3 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        View Your Tickets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;