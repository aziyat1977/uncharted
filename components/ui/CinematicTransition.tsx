import React, { useEffect, useRef } from 'react';
import useGameStore from '../../store';
import { GameState } from '../../types';

declare global {
  interface Window {
    gsap: any;
    spawnParticles: any;
  }
}

const LEVEL_NAMES: Record<string, string> = {
  [GameState.LEVEL_2_CRYPT]: "THE CRYPT",
  [GameState.LEVEL_3_PLANE]: "CARGO PLANE",
  [GameState.LEVEL_4_SHIPS]: "PIRATE FLEET",
  [GameState.VICTORY]: "FINAL EXTRACTION",
};

export const CinematicTransition: React.FC = () => {
  const { completeTransition, nextGameState } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barTopRef = useRef<HTMLDivElement>(null);
  const barBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = window.gsap.timeline({
      onComplete: () => {
        completeTransition();
      }
    });

    const destination = nextGameState && LEVEL_NAMES[nextGameState] ? LEVEL_NAMES[nextGameState] : "UNKNOWN LOCATION";

    // Initial Setup
    window.gsap.set([barTopRef.current, barBottomRef.current], { height: 0 });
    window.gsap.set(textRef.current, { opacity: 0, scale: 0.8 });

    // Cinematic Sequence
    tl.to([barTopRef.current, barBottomRef.current], {
      height: "50vh",
      duration: 0.8,
      ease: "power3.inOut"
    })
    .call(() => {
        // Burst particles when bars close
        if (window.spawnParticles) {
            window.spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 'gold');
        }
    })
    .to(textRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    })
    .to(textRef.current, {
        letterSpacing: "0.5em",
        duration: 1.5,
        ease: "power1.inOut"
    }, "<") // Run concurrently
    .to(textRef.current, {
      opacity: 0,
      scale: 1.2,
      blur: 10,
      duration: 0.4,
      delay: 0.5
    })
    .to([barTopRef.current, barBottomRef.current], {
      height: 0,
      duration: 0.8,
      ease: "power3.inOut"
    });

    return () => {
      tl.kill();
    };
  }, [completeTransition, nextGameState]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] pointer-events-none flex flex-col justify-between overflow-hidden">
      <div 
        ref={barTopRef} 
        className="w-full bg-[#0b0c10] bg-journal-texture border-b-4 border-adventure-gold shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50" 
      />
      
      <div ref={textRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-40">
        <div className="text-adventure-teal text-sm font-sans tracking-[0.5em] mb-4 uppercase">Traveling to</div>
        <h2 className="text-4xl md:text-7xl font-serif text-adventure-gold drop-shadow-[0_0_15px_rgba(255,183,3,0.5)] whitespace-nowrap">
           {nextGameState && LEVEL_NAMES[nextGameState] ? LEVEL_NAMES[nextGameState] : "NEXT LOCATION"}
        </h2>
      </div>

      <div 
        ref={barBottomRef} 
        className="w-full bg-[#0b0c10] bg-journal-texture border-t-4 border-adventure-gold shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50" 
      />
    </div>
  );
};
