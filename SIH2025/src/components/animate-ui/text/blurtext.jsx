import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BlurText = ({ 
  text, 
  delay = 0, 
  animateBy = 'letters', 
  direction = 'bottom',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Split text by words or letters
  const items = animateBy === 'words' 
    ? text.split(' ').map(word => word + ' ')
    : text.split('');

  // Define animation variants based on direction
  const getVariants = () => {
    const directions = {
      top: { y: -20 },
      bottom: { y: 20 },
      left: { x: -20 },
      right: { x: 20 }
    };

    const directionValue = directions[direction] || directions.bottom;

    return {
      hidden: {
        opacity: 0,
        ...directionValue,
        filter: 'blur(10px)'
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.5
        }
      }
    };
  };

  const variants = getVariants();

  return (
    <span className={className}>
      {items.map((item, index) => (
        <motion.span
          key={index}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={variants}
          transition={{
            duration: 0.5,
            delay: index * 0.04 + delay / 1000,
            ease: 'easeOut'
          }}
          style={{ display: 'inline-block' }}
        >
          {item}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;