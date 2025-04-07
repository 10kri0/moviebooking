import { useState, useImperativeHandle, forwardRef } from 'react';
import { toast } from 'react-toastify';

const PaymentForm = forwardRef(({ onPaymentSuccess, totalAmount }, ref) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Cardholder name is required';
        }

        if (!cardNumber.match(/^\d{16}$/)) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }

        if (!expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
            newErrors.expiryDate = 'Expiry must be in MM/YY format';
        }

        if (!cvv.match(/^\d{3}$/)) {
            newErrors.cvv = 'CVV must be 3 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
        validate,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix form errors before proceeding.", {
                position: 'top-center',
                autoClose: 2000,
            });
            return;
        }

        toast.success("Payment Validated!", {
            position: 'top-center',
            autoClose: 1000,
        });

        setTimeout(() => {
            onPaymentSuccess();
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name on Card</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] border border-[#333] text-white focus:ring-2 focus:ring-[#ff416c] focus:border-transparent"
                    placeholder="John Doe"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
                <input
                    type="text"
                    value={cardNumber}
                    maxLength="16"
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] border border-[#333] text-white focus:ring-2 focus:ring-[#ff416c] focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="flex gap-4">
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Expiry (MM/YY)</label>
                    <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] border border-[#333] text-white focus:ring-2 focus:ring-[#ff416c] focus:border-transparent"
                    />
                    {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                    <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength="3"
                        className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] border border-[#333] text-white focus:ring-2 focus:ring-[#ff416c] focus:border-transparent"
                        placeholder="123"
                    />
                    {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                </div>
            </div>

            <button type="submit" className="hidden">
                Submit
            </button>
        </form>
    );
});

export default PaymentForm;
