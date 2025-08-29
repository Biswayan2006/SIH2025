import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const { darkMode } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4 border',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size] || sizeClasses.md} 
          rounded-full 
          animate-spin 
          border-gray-300 
          dark:border-gray-600 
          border-t-emerald-500 
          dark:border-t-emerald-400
          shadow-sm
        `}
      ></div>
    </div>
  );
};

export default LoadingSpinner;