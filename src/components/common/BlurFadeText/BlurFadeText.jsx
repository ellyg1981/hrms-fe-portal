import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: ({ stagger, delay }) => ({ transition: { staggerChildren: stagger, delayChildren: delay } }),
};

const wordVariants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 8 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function BlurFadeText({ text, as = 'p', className = '', delay = 0, stagger = 0.08, once = true }) {
  const MotionTag = motion[as] || motion.p;
  const words = text.split(' ');

  return (
    <MotionTag
      className={className}
      aria-label={text}
      variants={containerVariants}
      custom={{ stagger, delay }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
    >
      {words.map((word, i) => (
        <motion.span key={`${word}-${i}`} aria-hidden="true" variants={wordVariants} style={{ display: 'inline-block', willChange: 'filter, opacity, transform' }}>
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </MotionTag>
  );
}

export default BlurFadeText;
