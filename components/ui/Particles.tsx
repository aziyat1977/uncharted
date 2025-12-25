import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleProps {
  x: number;
  y: number;
  color: string;
}

export const ParticleSystem: React.FC = () => {
  const [particles, setParticles] = useState<{id: number, x: number, y: number, color: string}[]>([]);

  // Function exposed to window for global triggering (hack for simplicity in this structure)
  useEffect(() => {
    // @ts-ignore
    window.spawnParticles = (x: number, y: number, type: 'gold' | 'dust') => {
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x,
        y,
        color: type === 'gold' ? '#ffb703' : '#94a3b8',
      }));
      setParticles(prev => [...prev, ...newParticles]);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
            animate={{
              x: p.x + (Math.random() - 0.5) * 200,
              y: p.y + (Math.random() - 0.5) * 200,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => {
              setParticles(prev => prev.filter(particle => particle.id !== p.id));
            }}
            className="absolute h-3 w-3 rounded-full shadow-lg"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
