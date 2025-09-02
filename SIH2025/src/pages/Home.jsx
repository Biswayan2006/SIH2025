import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useScroll } from '../context/ScrollContext';
import { MotionSection, MotionDiv, MotionFadeUpDiv, MotionStaggerContainer, MotionStaggerItem } from '../components/animations/MotionComponents';

// Images
import heroImage from '../assets/bus_1.jpeg';
import searchImage from '../assets/bus_2.jpg';
import mapImage from '../assets/metro_1.jpg';
import featureImage1 from '../assets/bus_1.jpeg';
import featureImage2 from '../assets/metro_1.jpg';
import featureImage3 from '../assets/train_1.webp';

const features = [
  {
    id: 1,
    title: 'Real-time Tracking',
    description: 'Track your public transport in real-time with accurate GPS data.',
    icon: 'location',
    image: featureImage1
  },
  {
    id: 2,
    title: 'Smart Notifications',
    description: 'Get notified about delays, route changes, and arrivals.',
    icon: 'bell',
    image: featureImage2
  },
  {
    id: 3,
    title: 'Accessible Routes',
    description: 'Find accessible routes and stations for all mobility needs.',
    icon: 'accessibility',
    image: featureImage3
  }
];

const stats = [
  { id: 1, value: '10M+', label: 'Users' },
  { id: 2, value: '50+', label: 'Cities' },
  { id: 3, value: '1000+', label: 'Routes' },
  { id: 4, value: '99.9%', label: 'Uptime' }
];

const Home = () => {
  const { translate } = useLanguage();
  const { darkMode } = useTheme();
  const [activeFeature, setActiveFeature] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Get scroll instance
  const { scroll } = useScroll();
  
  const carouselImages = [
    heroImage,
    searchImage,
    mapImage
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="overflow-hidden" data-scroll-container>
      {/* Hero Section */}
      <MotionSection 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-scroll-section
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
          <img 
            src={carouselImages[carouselIndex]} 
            alt="Transit Connect" 
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
        </div>
        
        <MotionDiv className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <MotionFadeUpDiv delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {translate('heroTitle')}
            </h1>
          </MotionFadeUpDiv>
          
          <MotionFadeUpDiv delay={0.4}>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {translate('heroSubtitle')}
            </p>
          </MotionFadeUpDiv>
          
          <MotionFadeUpDiv delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/live-tracking" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 text-lg"
              >
                {translate('liveTracking')}
              </Link>
              <Link 
                to="/search" 
                className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition duration-300 text-lg"
              >
                {translate('planJourney')}
              </Link>
            </div>
          </MotionFadeUpDiv>
        </MotionDiv>
      </MotionSection>

      {/* Features Section */}
      <MotionSection 
        className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
        data-scroll-section
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionFadeUpDiv className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {translate('featuresTitle')}
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              {translate('featuresSubtitle')}
            </p>
          </MotionFadeUpDiv>
          
          <MotionStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <MotionStaggerItem key={feature.id}>
                <div 
                  className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate(feature.title.toLowerCase().replace(/\s+/g, ''))}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {translate(feature.description.toLowerCase().replace(/\s+/g, ''))}
                    </p>
                  </div>
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>
      </MotionSection>

      {/* Search Section */}
      <MotionSection 
        className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        data-scroll-section
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <MotionFadeUpDiv className="lg:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src={searchImage} 
                  alt="Search for routes" 
                  className="w-full h-auto"
                />
              </div>
            </MotionFadeUpDiv>
            
            <MotionFadeUpDiv className="lg:w-1/2" delay={0.2}>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {translate('searchTitle')}
              </h2>
              <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {translate('searchDescription')}
              </p>
              <Link 
                to="/search" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 inline-block text-lg"
              >
                {translate('trySearch')}
              </Link>
            </MotionFadeUpDiv>
          </div>
        </div>
      </MotionSection>

      {/* Stats Section */}
      <MotionSection 
        className={`py-16 ${darkMode ? 'bg-blue-900' : 'bg-blue-600'}`}
        data-scroll-section
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionStaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <MotionStaggerItem key={stat.id}>
                <div className="p-6">
                  <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-xl text-blue-100">{translate(stat.label.toLowerCase())}</p>
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>
      </MotionSection>

      {/* Live Map Preview */}
      <MotionSection 
        className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
        data-scroll-section
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <MotionFadeUpDiv className="lg:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src={mapImage} 
                  alt="Live tracking map" 
                  className="w-full h-auto"
                />
              </div>
            </MotionFadeUpDiv>
            
            <MotionFadeUpDiv className="lg:w-1/2" delay={0.2}>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {translate('liveMapTitle')}
              </h2>
              <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {translate('liveMapDescription')}
              </p>
              <Link 
                to="/live-tracking" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 inline-block text-lg"
              >
                {translate('viewLiveMap')}
              </Link>
            </MotionFadeUpDiv>
          </div>
        </div>
      </MotionSection>

      {/* CTA Section */}
      <MotionSection 
        className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        data-scroll-section
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionFadeUpDiv>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {translate('ctaTitle')}
            </h2>
            <p className={`text-xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {translate('ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 text-lg"
              >
                {translate('getStarted')}
              </Link>
              <Link 
                to="/about" 
                className={`px-8 py-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-900'} font-medium rounded-lg transition duration-300 text-lg`}
              >
                {translate('learnMore')}
              </Link>
            </div>
          </MotionFadeUpDiv>
        </div>
      </MotionSection>
    </div>
  );
};

export default Home;