import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg">
        <style>
            {`
            .lantern {
                animation: sway 5s ease-in-out infinite;
                transform-origin: top center;
            }
            .lantern-light {
                animation: flicker 3s ease-in-out infinite;
            }
            @keyframes sway {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
            }
            @keyframes flicker {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }
            `}
        </style>
        <svg className="lantern" width="100" height="150" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="0" x2="50" y2="20" stroke="#a16207" strokeWidth="2"/>
            <rect x="20" y="20" width="60" height="10" rx="3" fill="#ca8a04"/>
            <rect x="20" y="110" width="60" height="10" rx="3" fill="#ca8a04"/>
            <path d="M25 30 C 20 70, 80 70, 75 30 Z" fill="#fef9c3"/>
            <path d="M25 30 C 25 90, 75 90, 75 30" stroke="#f59e0b" strokeWidth="2" fill="none"/>
            <path d="M50 30 C 40 90, 60 90, 50 30" stroke="#f59e0b" strokeWidth="2" fill="none"/>
            <path d="M37 30 C 37 90, 63 90, 63 30" stroke="#f59e0b" strokeWidth="2" fill="none"/>
            <defs>
                <radialGradient id="lightGradient">
                    <stop offset="0%" stopColor="rgba(252, 211, 77, 1)"/>
                    <stop offset="100%" stopColor="rgba(252, 211, 77, 0)"/>
                </radialGradient>
            </defs>
            <circle cx="50" cy="70" r="30" fill="url(#lightGradient)" className="lantern-light"/>
            <path d="M40 120 L40 135 M60 120 L60 135 M50 120 L50 140" stroke="#a16207" strokeWidth="2"/>
            <rect x="45" y="140" width="10" height="10" fill="#dc2626"/>
        </svg>

        <p className="text-white text-lg mt-4 font-semibold">AI đang vẽ bức tranh của bạn...</p>
        <p className="text-gray-400 text-sm">Quá trình này có thể mất một chút thời gian.</p>
    </div>
  );
};

export default Loader;