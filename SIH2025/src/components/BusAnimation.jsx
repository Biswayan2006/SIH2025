import { useTheme } from '../context/ThemeContext';

const BusAnimation = ({ className = '' }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`bus-animation-container relative w-32 h-20 ${className}`}>
      {/* Bus body */}
      <div className={`bus-body absolute w-28 h-12 rounded-md ${darkMode ? 'bg-blue-600' : 'bg-yellow-500'} bottom-2 left-0 animate-bus-move`}>
        {/* Windows */}
        <div className="windows flex justify-around absolute top-2 left-4 right-4">
          <div className={`window w-3 h-3 rounded-sm ${darkMode ? 'bg-blue-200' : 'bg-blue-100'}`}></div>
          <div className={`window w-3 h-3 rounded-sm ${darkMode ? 'bg-blue-200' : 'bg-blue-100'}`}></div>
          <div className={`window w-3 h-3 rounded-sm ${darkMode ? 'bg-blue-200' : 'bg-blue-100'}`}></div>
        </div>
        
        {/* Headlight */}
        <div className={`headlight absolute w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-yellow-300' : 'bg-yellow-200'} right-0 bottom-2`}></div>
        
        {/* Driver's window */}
        <div className={`driver-window absolute w-4 h-4 rounded-sm ${darkMode ? 'bg-blue-200' : 'bg-blue-100'} left-1 top-2`}></div>
      </div>
      
      {/* Wheels */}
      <div className="wheels absolute bottom-0 left-4 right-4 flex justify-between">
        <div className={`wheel w-5 h-5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-700'} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-500'} animate-wheel-spin`}></div>
        <div className={`wheel w-5 h-5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-700'} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-500'} animate-wheel-spin`}></div>
      </div>
      
      {/* Road */}
      <div className={`road absolute bottom-0 left-0 right-0 h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
      
      {/* Smoke */}
      <div className="smoke-container absolute -left-2 bottom-3">
        <div className={`smoke smoke-1 absolute w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400/70' : 'bg-gray-300/70'} animate-smoke-1`}></div>
        <div className={`smoke smoke-2 absolute w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-gray-400/60' : 'bg-gray-300/60'} animate-smoke-2`}></div>
        <div className={`smoke smoke-3 absolute w-1 h-1 rounded-full ${darkMode ? 'bg-gray-400/50' : 'bg-gray-300/50'} animate-smoke-3`}></div>
      </div>
    </div>
  );
};

export default BusAnimation;