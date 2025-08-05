import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '../components/ToastContainer';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const {
    continuous = true,
    interimResults = true,
    lang = 'en-US',
    onError
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSupported = useRef(false);
  const toast = useToast();

  // Check if Speech Recognition is supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      isSupported.current = !!SpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;
        recognitionRef.current.lang = lang;
      }
    }
  }, [continuous, interimResults, lang]);

  // Set up event listeners
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const handleResult = (event: SpeechRecognitionEvent) => {
      let interimTranscriptText = '';
      let finalTranscriptText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
          finalTranscriptText += transcriptText;
        } else {
          interimTranscriptText += transcriptText;
        }
      }

      setInterimTranscript(interimTranscriptText);
      
      if (finalTranscriptText) {
        setFinalTranscript(prev => prev + finalTranscriptText);
        setTranscript(prev => prev + finalTranscriptText);
      }

      // Update the combined transcript
      const currentFinal = finalTranscript + finalTranscriptText;
      const combined = currentFinal + interimTranscriptText;
      if (combined !== transcript && !finalTranscriptText) {
        setTranscript(currentFinal + interimTranscriptText);
      }
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      
      let errorMessage = '';
      let shouldShowToast = true;
      
      // Handle specific error cases
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          // Don't show toast for no-speech as it's common and not critical
          shouldShowToast = false;
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture failed. Please check your microphone.';
          toast.showError('Microphone Error', 'Could not access your microphone. Please check your permissions and hardware.');
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access was denied. Please allow microphone access.';
          toast.showError('Permission Denied', 'Please allow microphone access to use voice features.');
          break;
        case 'network':
          errorMessage = 'Network error occurred during recognition.';
          toast.showError('Network Error', 'Speech recognition failed due to network issues.');
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed.';
          toast.showError('Service Error', 'Speech recognition service is not available.');
          break;
        case 'bad-grammar':
          errorMessage = 'Speech recognition grammar error.';
          toast.showWarning('Recognition Error', 'Could not understand the speech pattern.');
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
          toast.showError('Speech Recognition Error', errorMessage);
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
    };

    const handleStart = () => {
      setIsListening(true);
      setError(null);
    };

    const handleEnd = () => {
      setIsListening(false);
    };

    const handleSpeechStart = () => {
      setError(null);
    };

    const handleSpeechEnd = () => {
      // Speech has ended, but recognition might still be processing
    };

    // Add event listeners
    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('start', handleStart);
    recognition.addEventListener('end', handleEnd);
    recognition.addEventListener('speechstart', handleSpeechStart);
    recognition.addEventListener('speechend', handleSpeechEnd);

    // Cleanup function
    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('error', handleError);
      recognition.removeEventListener('start', handleStart);
      recognition.removeEventListener('end', handleEnd);
      recognition.removeEventListener('speechstart', handleSpeechStart);
      recognition.removeEventListener('speechend', handleSpeechEnd);
    };
  }, [finalTranscript, transcript]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !isSupported.current) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      return; // Already listening
    }

    try {
      setError(null);
      recognition.start();
    } catch (err) {
      setError('Failed to start speech recognition.');
      console.error('Speech recognition start error:', err);
    }
  }, [isListening]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !isListening) {
      return;
    }

    try {
      recognition.stop();
    } catch (err) {
      console.error('Speech recognition stop error:', err);
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
    
    // Stop recognition if it's currently running
    if (isListening) {
      stop();
    }
  }, [isListening, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    finalTranscript,
    error,
    isSupported: isSupported.current,
    start,
    stop,
    reset
  };
};

export default useSpeechRecognition;
