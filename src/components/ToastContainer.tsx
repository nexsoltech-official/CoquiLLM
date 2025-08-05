'use client';

import { useState, useCallback } from 'react';
import Toast, { ToastProps } from './Toast';

export interface ToastData {
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContainerProps {
  onToastShow?: (toast: ToastData) => void;
}

export interface ToastManager {
  showToast: (toast: ToastData) => void;
  showError: (title: string, message?: string) => void;
  showSuccess: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

let globalToastManager: ToastManager | null = null;

// Provide a no-op implementation as fallback
const noOpToastManager: ToastManager = {
  showToast: () => {},
  showError: () => {},
  showSuccess: () => {},
  showWarning: () => {},
  showInfo: () => {},
};

export function useToast(): ToastManager {
  return globalToastManager || noOpToastManager;
}

export default function ToastContainer({ onToastShow }: ToastContainerProps) {
  const [toasts, setToasts] = useState<(ToastData & { id: string })[]>([]);

  const showToast = useCallback((toast: ToastData) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    onToastShow?.(toast);
  }, [onToastShow]);

  const showError = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Set global toast manager
  globalToastManager = {
    showToast,
    showError,
    showSuccess,
    showWarning,
    showInfo
  };

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </>
  );
}
