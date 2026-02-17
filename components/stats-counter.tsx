'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CounterProps {
  end: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function StatsCounter({ end, label, suffix = '', duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startValue = 0;
    const increment = end / (duration * 60); // 60fps

    const interval = setInterval(() => {
      startValue += increment;
      if (startValue >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(startValue));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [hasStarted, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <p className="text-white/50 text-sm font-medium mb-2">{label}</p>
      <p className="text-4xl md:text-5xl font-bold gradient-text">
        {count}{suffix}
      </p>
    </motion.div>
  );
}
