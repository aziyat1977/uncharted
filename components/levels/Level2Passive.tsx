import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import useGameStore from '../../store';
import { GameState } from '../../types';

export const Level2Passive: React.FC = () => {
  const { addScore, incrementCombo, triggerLevelTransition } = useGameStore();
  
  // Sentence: "The golden cross was stolen in 1522"
  const correctOrder = ["The golden cross", "was stolen", "in 1522"];
  const [items, setItems] = useState(["was stolen", "in 1522", "The golden cross"]);
  const [isChecking, setIsChecking] = useState(false);

  // Auto check logic
  useEffect(() => {
    const isCorrect = items.every((val, index) => val === correctOrder[index]);
    if (isCorrect && !isChecking) {
       setIsChecking(true);
       setTimeout(() => {
         // @ts-ignore
         window.spawnParticles(window.innerWidth/2, window.innerHeight/2, 'gold');
         addScore(150);
         incrementCombo();
         setTimeout(() => triggerLevelTransition(GameState.LEVEL_3_PLANE), 1500);
       }, 500);
    }
  }, [items, isChecking, correctOrder, addScore, incrementCombo, triggerLevelTransition]);


  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <h2 className="text-4xl text-adventure-gold font-serif mb-12 drop-shadow-lg">The Crypt Puzzle</h2>
      <p className="text-xl text-adventure-cream mb-8 font-sans bg-black/50 px-4 py-2 rounded">Arrrange the stones: Passive Voice</p>
      
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-6">
        {items.map((item) => (
          <Reorder.Item key={item} value={item} className="cursor-grab active:cursor-grabbing">
            <motion.div
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-[400px] h-[80px] bg-[#3d342b] border-2 border-[#5c4d3c] rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden group"
            >
              {/* Stone Texture Effect */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-30 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-black/30" />
              
              <span className="text-2xl font-serif text-[#d6cbb8] z-10 drop-shadow-md group-hover:text-white transition-colors">
                {item}
              </span>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="mt-12 text-center text-slate-400 text-sm">
        Drag the stones to form a correct sentence.
      </div>
    </div>
  );
};