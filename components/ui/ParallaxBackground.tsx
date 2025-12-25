import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GameState } from '../../types';
import useGameStore from '../../store';

export const ParallaxBackground: React.FC = () => {
  const currentState = useGameStore((s) => s.currentState);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const moveX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const moveY = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  const moveXLayer2 = useTransform(springX, [-0.5, 0.5], [-50, 50]);
  const moveYLayer2 = useTransform(springY, [-0.5, 0.5], [-50, 50]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Normalize to -0.5 to 0.5
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  let bgClass = "bg-slate-900";
  let Elements = null;

  switch (currentState) {
    case GameState.LEVEL_1_AUCTION:
      bgClass = "bg-[#0f1014]"; // Dark Museum
      Elements = (
        <>
           {/* Spotlights */}
           <motion.div style={{ x: moveX, y: moveY }} className="absolute top-0 left-1/4 w-[200px] h-[600px] bg-yellow-100/5 blur-[100px] rotate-12" />
           <motion.div style={{ x: moveX, y: moveY }} className="absolute top-0 right-1/4 w-[200px] h-[600px] bg-yellow-100/5 blur-[100px] -rotate-12" />
        </>
      );
      break;
    case GameState.LEVEL_2_CRYPT:
      bgClass = "bg-[#1a1410]"; // Dark Brown Crypt
      Elements = (
        <>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stone-wall.png')] opacity-20" />
            <motion.div style={{ x: moveXLayer2, y: moveYLayer2 }} className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
             {/* Dust motes would go here in a complex particle system */}
        </>
      );
      break;
    case GameState.LEVEL_3_PLANE:
        bgClass = "bg-sky-400";
        Elements = (
            <>
                <motion.div 
                    animate={{ x: [-1000, 1000] }} 
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute top-1/2 left-0 w-[200vw] h-[400px] bg-white/30 blur-[60px]" 
                />
                <motion.div style={{ x: moveX, y: moveY }} className="absolute inset-0 bg-gradient-to-b from-sky-600 to-sky-200 opacity-90" />
            </>
        )
        break;
     case GameState.LEVEL_4_SHIPS:
        bgClass = "bg-indigo-900";
        Elements = (
            <>
                <motion.div style={{ x: moveXLayer2 }} className="absolute bottom-0 w-full h-[30vh] bg-blue-800/50 blur-xl" />
                <motion.div 
                    animate={{ y: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" 
                />
            </>
        )
        break;
    default:
      // Menu
      bgClass = "bg-[#0b0c10]";
      Elements = (
          <motion.div style={{ x: moveX, y: moveY }} className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-adventure-gold/20 via-transparent to-transparent" />
          </motion.div>
      );
  }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000 ${bgClass}`}>
        {Elements}
        <div className="absolute inset-0 pointer-events-none bg-journal-texture opacity-10 mix-blend-overlay" />
    </div>
  );
};
