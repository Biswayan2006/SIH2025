import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import BusAnimation from './BusAnimation';

const PageLoader = ({ fullScreen = true }) => {
  const { darkMode } = useTheme();
  const { translate } = useLanguage();
  
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
      <BusAnimation className="mb-4" />
      <div className="text-center">
        <h3 className={`text-xl font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {translate('loading')}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          {translate('pleaseWait')}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;