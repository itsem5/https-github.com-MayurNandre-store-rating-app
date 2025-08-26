import React from 'react';
import { Loader } from 'lucide-react';

const Loading = ({ message = 'Loading...', size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <Loader className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`} />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Loading;