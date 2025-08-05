'use client';

import LoadingSpinner from './LoadingSpinner';

interface SpinnerOverlayProps {
  isVisible: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  opacity?: 'light' | 'medium' | 'dark';
}

export default function SpinnerOverlay({ 
  isVisible, 
  text = 'Loading...', 
  size = 'lg',
  opacity = 'medium'
}: SpinnerOverlayProps) {
  if (!isVisible) return null;

  const getOpacityClass = () => {
    switch (opacity) {
      case 'light':
        return 'bg-black/20 dark:bg-black/40';
      case 'medium':
        return 'bg-black/40 dark:bg-black/60';
      case 'dark':
        return 'bg-black/60 dark:bg-black/80';
      default:
        return 'bg-black/40 dark:bg-black/60';
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-40 flex items-center justify-center
        ${getOpacityClass()}
        transition-opacity duration-300 ease-in-out
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl max-w-sm mx-4">
        <div className="text-center">
          <LoadingSpinner 
            size={size} 
            color="blue" 
            text=""
          />
          <h2 
            id="loading-title" 
            className="mt-4 text-lg font-medium text-gray-900 dark:text-white"
          >
            {text}
          </h2>
          <p 
            id="loading-description" 
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            Please wait while we process your request
          </p>
        </div>
      </div>
    </div>
  );
}
