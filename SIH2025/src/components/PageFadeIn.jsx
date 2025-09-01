// components/pagefadein.jsx
import { motion } from "framer-motion";

const PageFadeIn = ({ children, delay = 0, y = 30 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

export default PageFadeIn;
