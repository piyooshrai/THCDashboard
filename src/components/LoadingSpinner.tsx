import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  fullScreen = true
}) => {
  const containerClass = fullScreen
    ? 'flex items-center justify-center min-h-screen bg-[#f8f6f3]'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2052]"></div>
        {message && <p className="text-gray-600 text-sm">{message}</p>}
      </div>
    </div>
  );
};
