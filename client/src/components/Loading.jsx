import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-32 bg-gradient-to-b from-black/50 to-transparent rounded-xl">
            <div className="relative w-16 h-16">
                {/* Outer ring - subtle glow */}
                <div className="absolute inset-0 border-4 border-[#ff416c]/20 rounded-full animate-spin"></div>
                
                {/* Middle ring - accent color */}
                <div className="absolute inset-0 border-4 border-t-[#ff416c] rounded-full animate-spin" 
                     style={{ animationDelay: '0.1s' }}></div>
                
                {/* Inner ring - bright accent */}
                <div className="absolute inset-2 border-4 border-b-[#ff4b2b] rounded-full animate-spin" 
                     style={{ animationDelay: '0.2s' }}></div>
                
                {/* Center dot - glowing effect */}
                <div className="absolute inset-4 bg-[#ff416c] rounded-full animate-pulse"></div>
            </div>
        </div>
    );
};

export default Loader;