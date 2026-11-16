const EASE_OUT = [0.22, 1, 0.36, 1];

export function cardMotion(index = 0, { hover = true, tap = false } = {}) {
  return {
    initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
    whileInView: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: EASE_OUT, delay: Math.min(index * 0.06, 0.36) },
    },
    viewport: { once: true, amount: 0.15 },
    transition: { type: 'spring', stiffness: 380, damping: 26 },
    ...(hover && { whileHover: { scale: 1.02 } }),
    ...(tap && { whileTap: { scale: 0.98 } }),
  };
}
