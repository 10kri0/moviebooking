import { CheckIcon } from '@heroicons/react/24/outline';
import { memo, useState } from 'react';

const Seat = ({ seat, setSelectedSeats, selectable, isAvailable }) => {
    const [isSelected, setIsSelected] = useState(false);

    const getPriceByRow = (row) => {
        if (!row) return 0;
        const firstLetter = row.charAt(0).toUpperCase();
        if (firstLetter >= 'A' && firstLetter <= 'F') return 300;
        if (firstLetter >= 'G' && firstLetter <= 'Q') return 200;
        return 100;
    };

    const price = getPriceByRow(seat?.row);

    const handleSeatClick = () => {
        if (selectable && isAvailable) {
            setIsSelected(!isSelected);
            setSelectedSeats((prev) => {
                const seatId = `${seat.row}${seat.number}`;
                return isSelected 
                    ? prev.filter(id => id !== seatId)
                    : [...prev, seatId];
            });
        }
    };

    return (
        <div className="relative inline-block">
            <button
                title={`${seat.row}${seat.number}`}
                className={`relative flex h-10 w-10 items-center justify-center ${
                    !isAvailable || !selectable ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                } transition-transform duration-200`}
                onClick={handleSeatClick}
                disabled={!isAvailable || !selectable}
            >
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-md shadow-md transition-all duration-300 ${
                        !isAvailable
                            ? 'bg-gray-700'
                            : isSelected
                            ? 'bg-gradient-to-br from-[#ff416c] to-[#ff4b2b] shadow-[0_0_8px_-2px_rgba(255,75,43,0.5)]'
                            : 'bg-[#333] hover:bg-[#444]'
                    }`}
                >
                    {isSelected && (
                        <CheckIcon className="h-5 w-5 stroke-[3] text-white" />
                    )}
                </div>
            </button>
            
            {isSelected && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                        ₹{price}
                    </span>
                </div>
            )}
            
            {!isAvailable && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                    <span className="text-[10px] text-gray-500">
                        {seat.row}{seat.number}
                    </span>
                </div>
            )}
        </div>
    );
};

export default memo(Seat);