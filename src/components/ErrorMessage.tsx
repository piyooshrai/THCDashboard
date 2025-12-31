import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  fullScreen?: boolean;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Error',
  fullScreen = true,
  onRetry
}) => {
  const containerClass = fullScreen
    ? 'flex items-center justify-center min-h-screen bg-[#f8f6f3]'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="bg-white border border-red-200 p-6 rounded-[20px] shadow-lg max-w-md w-full">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full h-[48px] bg-[#0F2052] text-white rounded-[12px] font-semibold hover:bg-[#1a2b5c] transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
