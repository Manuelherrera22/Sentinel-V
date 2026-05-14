"use client";

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function useIdleTimeout(timeoutMinutes = 2) {
  const logout = useAuthStore((state) => state.logout);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      console.log('User idle timeout reached. Logging out for security.');
      logout();
      // In a real app, redirect to login page
      // window.location.href = '/login';
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleEvent = () => resetTimeout();

    // Set initial timeout
    resetTimeout();

    // Attach event listeners
    events.forEach((event) => window.addEventListener(event, handleEvent));

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleEvent));
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);
}
