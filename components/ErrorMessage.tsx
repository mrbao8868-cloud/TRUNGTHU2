import React from 'react';

const QuotaErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const GenericErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);


interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    const isQuotaError = message.includes("giới hạn sử dụng");

    if (isQuotaError) {
        return (
            <div className="w-full text-center bg-yellow-900/40 border-2 border-yellow-700/80 p-6 rounded-2xl mb-4 glassmorphism animate-fade-in">
                <div className="flex flex-col items-center justify-center">
                    <QuotaErrorIcon />
                    <h3 className="mt-3 text-xl font-bold text-yellow-300">Đã hết lượt sử dụng trong ngày</h3>
                    <p className="mt-2 text-sm text-gray-300 max-w-md">{message.replace("Rất tiếc, bạn đã đạt giới hạn sử dụng trong ngày. ", "")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full text-center bg-red-900/50 border border-red-700 p-3 rounded-lg mb-4 flex items-center justify-center gap-3 animate-fade-in">
            <div className="flex-shrink-0">
                <GenericErrorIcon />
            </div>
            <p className="text-red-300 text-sm">{message}</p>
        </div>
    );
};

export default ErrorMessage;