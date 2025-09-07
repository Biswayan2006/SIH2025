import { useState } from 'react';

const StarRating = ({ rating, onRate }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <button
            type="button"
            key={index}
            className={`text-2xl ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none transition-colors duration-200`}
            onClick={() => onRate(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${ratingValue} out of 5 stars`}
          >
            ★
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 ? `${rating}/5` : ''}
      </span>
    </div>
  );
};

export default StarRating;