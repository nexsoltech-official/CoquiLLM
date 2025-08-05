'use client';

import { useState } from 'react';

interface MicButtonProps {
  onToggle?: (isRecording: boolean) => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export default function MicButton({ 
  onToggle, 
  disabled = false, 
  isProcessing = false 
}: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const isDisabled = disabled || isProcessing;

  const handleClick = () => {
    if (isDisabled) return;
    
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);
    onToggle?.(newRecordingState);
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (isRecording) return 'Stop recording';
    return 'Start recording';
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing your message';
    if (isRecording) return 'Recording... Click to stop';
    return 'Click to start recording';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={getButtonText()}
        aria-describedby="mic-status"
        className={`
          relative w-16 h-16 md:w-20 md:h-20 rounded-full 
          flex items-center justify-center 
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-offset-2
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50 animate-pulse focus:ring-red-300' 
            : isProcessing
            ? 'bg-gray-500 shadow-lg focus:ring-gray-300'
            : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50 focus:ring-blue-300'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        `}
      >
        {/* Glowing ring effect */}
        <div 
          className={`
            absolute inset-0 rounded-full 
            ${isRecording 
              ? 'bg-red-500 animate-ping opacity-75' 
              : isProcessing
              ? 'bg-gray-500 animate-pulse opacity-50'
              : 'bg-blue-500 animate-pulse opacity-30'
            }
          `}
        />
        
        {/* Icon */}
        {isProcessing ? (
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      
      {/* Status text for accessibility and UX */}
      <p 
        id="mic-status"
        className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs"
        aria-live="polite"
      >
        {getStatusText()}
      </p>
    </div>
  );
}
