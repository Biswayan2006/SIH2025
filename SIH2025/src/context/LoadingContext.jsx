import { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageLoader from '../components/PageLoader';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const location = useLocation();

  // Handle initial page load
  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500); // 1.5 seconds for initial load

    return () => clearTimeout(timer);
  }, []);

  // Handle route changes
  useEffect(() => {
    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    // Don't show loading on initial render
    if (isInitialLoading) return;

    // Start a timer to detect if navigation takes longer than expected
    let navigationStartTime = Date.now();
    let loadingTimer = null;
    let showLoadingTimer = null;
    
    // Only show loading if navigation takes more than 300ms
    showLoadingTimer = setTimeout(() => {
      setIsRouteChanging(true);
      
      // Once we show loading, ensure it stays visible for at least 800ms
      // for a better user experience
      loadingTimer = setTimeout(() => {
        setIsRouteChanging(false);
      }, 800);
      
      setLoadingTimeout(loadingTimer);
    }, 300);
    
    // Cleanup function
    return () => {
      clearTimeout(showLoadingTimer);
      if (loadingTimer) clearTimeout(loadingTimer);
    };
  }, [location.pathname]);

  // Determine if we should show the loader
  const isLoading = isInitialLoading || isRouteChanging;
  
  // Expose additional information about the loading state
  const loadingState = {
    isLoading,
    isInitialLoading,
    isRouteChanging
  };

  return (
    <LoadingContext.Provider value={loadingState}>
      {isLoading && <PageLoader />}
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}