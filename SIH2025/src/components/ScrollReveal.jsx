import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const ScrollReveal = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" }); // start earlier
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },    // smaller offset (30px instead of 75px)
        visible: { opacity: 1, y: 0 }     // fades in + moves up
      }}
      transition={{ duration: 0.8, ease: "easeOut" }} // smoother + slower
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
