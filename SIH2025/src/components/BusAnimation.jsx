import { useTheme } from '../context/ThemeContext';

const BusAnimation = ({ className = '' }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4cc9f0] via-[#4361ee] to-[#3a0ca3] opacity-70"></div>
      
      {/* Road */}
      <div className={`absolute bottom-0 w-full h-[20%] ${darkMode ? 'bg-gray-800' : 'bg-gray-700'}`}>
        {/* Road markings */}
        <div className="absolute top-0 w-full h-[5px] bg-[#444]"></div>
        <div className="absolute top-1/2 w-full h-[5px] flex">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="h-full w-[50px] bg-yellow-400 mx-[50px] animate-[slideInRight_3s_linear_infinite]"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
      
      {/* Multiple buses */}
      {[...Array(3)].map((_, index) => {
        const lane = index % 3;
        const speed = 8 + (lane * 2);
        const delay = index * 2;
        const busColors = ['#4361ee', '#3a0ca3', '#4cc9f0'];
        
        return (
          <div 
            key={index}
            className="bus-animation-container absolute animate-bus-move"
            style={{
              bottom: `${10 + (lane * 10)}%`,
              left: `-20%`,
              transform: 'scale(2)',
              zIndex: 10 - lane,
              animationDuration: `${speed}s`,
              animationDelay: `${delay}s`,
              animationIterationCount: 'infinite'
            }}
          >
            {/* Bus body */}
            <div className={`bus-body absolute w-28 h-12 rounded-md ${darkMode ? 'bg-blue-600' : 'bg-yellow-500'} bottom-2 left-0`}
                style={{ backgroundColor: busColors[lane % busColors.length] }}>
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
            
            {/* Smoke */}
            <div className="smoke-container absolute -left-2 bottom-3">
              <div className={`smoke smoke-1 absolute w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400/70' : 'bg-gray-300/70'} animate-smoke-1`}></div>
              <div className={`smoke smoke-2 absolute w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-gray-400/60' : 'bg-gray-300/60'} animate-smoke-2`}></div>
              <div className={`smoke smoke-3 absolute w-1 h-1 rounded-full ${darkMode ? 'bg-gray-400/50' : 'bg-gray-300/50'} animate-smoke-3`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BusAnimation;