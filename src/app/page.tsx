'use client';

import { useEffect } from 'react';
import MicButton from '../components/MicButton';
import SpinnerOverlay from '../components/SpinnerOverlay';
import ToastContainer from '../components/ToastContainer';
import useAssistant from '../hooks/useAssistant';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Home() {
  // Use enhanced hooks for better functionality
  const {
    messages,
    loadingAsk,
    loadingTTS,
    error,
    handleRecordingStop,
    conversationEndRef
  } = useAssistant();

  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported,
    start: startRecording,
    stop: stopRecording,
    reset: resetRecording
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    lang: 'en-US'
  });

  const isProcessing = loadingAsk || loadingTTS;
  const hasError = error || speechError;

  const handleMicToggle = (recording: boolean) => {
    if (recording) {
      resetRecording();
      startRecording();
    } else {
      stopRecording();
      // Process the final transcript if available
      if (transcript.trim()) {
        handleRecordingStop(transcript);
        resetRecording();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Loading Spinner Overlay */}
      <SpinnerOverlay isVisible={isProcessing} text="Processing..." />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Mobile: Flex Column Layout */}
      <div className="flex flex-col h-screen md:hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center">
            Voice Assistant
          </h1>
        </header>

        {/* Conversation Panel */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {/* Mutation observer for new messages */}
          <div ref={conversationEndRef} />
        
          {/* Interim Transcript Feedback */}
          {isListening && interimTranscript && (
            <div className="flex justify-center py-2 text-gray-600 dark:text-gray-400">
              <p>{interimTranscript}</p>
            </div>
          )}
        </div>

        {/* Microphone Button */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-6">
          <MicButton onToggle={handleMicToggle} isProcessing={isProcessing} />
        </div>
      </div>
      
      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-1 md:grid-rows-[auto_1fr_auto] h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
            Voice Assistant
          </h1>
        </header>
        
        {/* Conversation Panel */}
        <div className="overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-md lg:max-w-lg px-6 py-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <p className="text-base">{message.content}</p>
                  <p className="text-sm opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {/* Mutation observer for new messages */}
            <div ref={conversationEndRef} />
            
            {/* Interim Transcript Feedback */}
            {isListening && interimTranscript && (
              <div className="flex justify-center py-4 text-gray-600 dark:text-gray-400">
                <p className="text-lg italic">{interimTranscript}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Microphone Button */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <MicButton onToggle={handleMicToggle} isProcessing={isProcessing} />
          </div>
        </div>
      </div>
    </div>
  );
}
