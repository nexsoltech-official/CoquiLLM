import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '../components/ToastContainer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ErrorInfo {
  type: 'network' | 'server' | 'mic_permission' | 'speech_recognition' | 'tts' | 'unknown';
  message: string;
  details?: string;
}

const useAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingAsk, setLoadingAsk] = useState(false);
  const [loadingTTS, setLoadingTTS] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();

  const handleError = useCallback((errorInfo: ErrorInfo) => {
    setError(errorInfo);
    console.error(`Error [${errorInfo.type}]:`, errorInfo.message, errorInfo.details);
    
    // Show appropriate toast notification
    switch (errorInfo.type) {
      case 'network':
        toast.showError('Network Error', 'Please check your internet connection and try again.');
        break;
      case 'server':
        toast.showError('Server Error', 'Our servers are experiencing issues. Please try again later.');
        break;
      case 'mic_permission':
        toast.showError('Microphone Permission', 'Please allow microphone access to use voice features.');
        break;
      case 'speech_recognition':
        toast.showWarning('Speech Recognition', 'Could not understand speech. Please try speaking more clearly.');
        break;
      case 'tts':
        toast.showWarning('Text-to-Speech', 'Could not play audio response. The text is still available.');
        break;
      default:
        toast.showError('Unknown Error', errorInfo.message || 'An unexpected error occurred.');
    }
  }, [toast]);

  const handleRecordingStop = async (transcript: string) => {
    if (!transcript.trim()) {
      handleError({
        type: 'speech_recognition',
        message: 'No speech detected',
        details: 'Empty transcript received'
      });
      return;
    }

    setLoadingAsk(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: transcript }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.answer) {
        throw new Error('Invalid response format');
      }

      const userMessage: Message = {
        id: Date.now().toString() + '-user',
        role: 'user',
        content: transcript,
        timestamp: new Date()
      };

      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.answer,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setLoadingAsk(false);
      
      // Play TTS response
      playAssistantResponse(assistantMessage.content);
      
    } catch (error: any) {
      setLoadingAsk(false);
      
      if (error.name === 'AbortError') {
        handleError({
          type: 'network',
          message: 'Request timeout',
          details: 'The request took too long to complete'
        });
      } else if (error.message.includes('fetch')) {
        handleError({
          type: 'network',
          message: 'Network connection failed',
          details: error.message
        });
      } else if (error.message.includes('HTTP')) {
        handleError({
          type: 'server',
          message: 'Server error',
          details: error.message
        });
      } else {
        handleError({
          type: 'unknown',
          message: 'Failed to get response',
          details: error.message
        });
      }
    }
  };

  const playAssistantResponse = useCallback(async (text: string) => {
    setLoadingTTS(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 450000); // 45 second timeout for TTS

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`TTS HTTP ${response.status}: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      
      if (audioBlob.size === 0) {
        throw new Error('Empty audio response');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Handle audio playback errors
      audio.onerror = () => {
        handleError({
          type: 'tts',
          message: 'Audio playback failed',
          details: 'Could not play the generated audio'
        });
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); // Clean up the blob URL
      };

      await audio.play();
      setLoadingTTS(false);
      
    } catch (error: any) {
      setLoadingTTS(false);
      
      if (error.name === 'AbortError') {
        handleError({
          type: 'tts',
          message: 'Text-to-speech timeout',
          details: 'Audio generation took longer than expected. Longer responses may need more time.'
        });
      } else if (error.message.includes('HTTP')) {
        handleError({
          type: 'tts',
          message: 'Text-to-speech service error',
          details: error.message
        });
      } else {
        handleError({
          type: 'tts',
          message: 'Failed to play audio response',
          details: error.message
        });
      }
    }
  }, [handleError]);

  // Initialize with welcome message on client side only
  useEffect(() => {
    if (!isInitialized) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your voice assistant. Click the microphone to start speaking.",
        timestamp: new Date()
      }]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    // Scroll to the bottom of conversation pane
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return {
    messages,
    loadingAsk,
    loadingTTS,
    error,
    handleRecordingStop,
    conversationEndRef
  };
};

export default useAssistant;

