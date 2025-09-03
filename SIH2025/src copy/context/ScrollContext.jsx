import { createContext, useContext, useState } from 'react';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  
  const updateScroll = (position) => {
    setScrollY(position);
  };

  return (
    <ScrollContext.Provider value={{ scrollY, updateScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};