import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GameState } from '../../types';
import useGameStore from '../../store';

export const ParallaxBackground: React.FC = () => {
  const currentState = useGameStore((s) => s.currentState);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Heavier, more cinematic physics
  const springConfig = { damping: 40, stiffness: 90 }; 
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Multiple parallax planes
  const moveXMap = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const moveYMap = useTransform(springY, [-0.5, 0.5], [-25, 25]);
  const moveXBg = useTransform(springX, [-0.5, 0.5], [-45, 45]);
  const moveYBg = useTransform(springY, [-0.5, 0.5], [-45, 45]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Normalize to -0.5 to 0.5
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  // Cinematic Location Mapping
  const bgImages: Record<string, string> = {
    [GameState.MENU]: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=2560&auto=format&fit=crop", // Antique map table / Study
    [GameState.LEVEL_1_AUCTION]: "https://images.unsplash.com/photo-1545562083-c6834db51138?q=80&w=2560&auto=format&fit=crop", // Dark Museum/Auction Hall
    [GameState.LEVEL_2_CRYPT]: "https://images.unsplash.com/photo-1518182170546-07661bf9a526?q=80&w=2560&auto=format&fit=crop", // Stone Catacombs
    [GameState.LEVEL_3_PLANE]: "https://images.unsplash.com/photo-1536514072410-5019a3c69182?q=80&w=2560&auto=format&fit=crop", // High Altitude Clouds
    [GameState.LEVEL_4_SHIPS]: "https://images.unsplash.com/photo-1516912481808-542336639844?q=80&w=2560&auto=format&fit=crop", // Sea Cave / Pirate Water
    [GameState.VICTORY]: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2560&auto=format&fit=crop", // Gold / Sunset
    [GameState.GAME_OVER]: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2560&auto=format&fit=crop", // Dark textured defeat
  };

  // Fallback to menu if state not found
  const activeBg = bgImages[currentState] || bgImages[GameState.MENU];

  // The "Magellan" Style Map Overlay (High Res Public Domain Map)
  const mapOverlay = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/World_Map_1689.JPG/2560px-World_Map_1689.JPG";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black transition-colors duration-1000">
        
        {/* Layer 1: The Deep Background (Location) */}
        <motion.div 
            style={{ x: moveXBg, y: moveYBg, scale: 1.1 }}
            className="absolute inset-0"
        >
             <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
                style={{ 
                    backgroundImage: `url(${activeBg})`, 
                    // Cinematic Dark Grading: Low brightness, slight sepia for "Adventure" feel
                    filter: 'brightness(0.35) sepia(0.25) contrast(1.1) saturate(0.8)' 
                }}
             />
        </motion.div>

        {/* Layer 2: The "Real Map" Overlay */}
        <motion.div 
            style={{ x: moveXMap, y: moveYMap, scale: 1.2 }}
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
        >
             <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${mapOverlay})` }} 
             />
        </motion.div>

        {/* Layer 3: Texture & Vignette */}
        <div className="absolute inset-0 bg-journal-texture opacity-15 mix-blend-multiply pointer-events-none" />
        
        {/* Heavy Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_60%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />
        
        {/* Optional: subtle scanline/dust if desired, but keeping clean for now */}
    </div>
  );
};