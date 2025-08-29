import { useTheme } from '../context/ThemeContext';
import BusAnimation from './BusAnimation';
import { useLoading } from '../context/LoadingContext';

const PageLoader = ({ fullScreen = true }) => {
  const { darkMode } = useTheme();
  const { isInitialLoading } = useLoading();
  
  return (
    <div 
      className={`
        flex flex-col items-center justify-center
        ${fullScreen ? 'fixed inset-0 z-50' : 'w-full h-full min-h-[200px]'}
        ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'}
        backdrop-filter backdrop-blur-sm
        transition-all duration-300
      `}
    >
      <BusAnimation className="mb-4" size={isInitialLoading ? "xl" : "lg"} />
      <div className="text-center">
        <h3 className={`text-xl font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Loading
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;