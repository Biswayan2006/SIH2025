import { useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4"
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">
          {error.status || '404'}
        </h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {error.statusText || 'Page Not Found'}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error.message || 'The page you are looking for might have been removed or is temporarily unavailable.'}
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Return Home
        </a>
      </div>
    </motion.div>
  );
};

export default ErrorBoundary;