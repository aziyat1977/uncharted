import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sword, Gem, AlertCircle } from 'lucide-react';
import useGameStore from '../../store';
import { GameState } from '../../types';

export const Level1Deduction: React.FC = () => {
  const { addScore, incrementCombo, loseLife, resetCombo, triggerLevelTransition } = useGameStore();
  const [hint, setHint] = useState<string | null>(null);

  const artifacts = [
    { id: 'crown', icon: <Crown size={64} />, name: "King's Crown", correct: false, reason: "The thief left fingerprints, so they weren't wearing gloves. The crown is behind glass." },
    { id: 'sword', icon: <Sword size={64} />, name: "Rusty Cutlass", correct: true, reason: "" },
    { id: 'gem', icon: <Gem size={64} />, name: "Sapphire Eye", correct: false, reason: "The thief is strong. The gem is too light." },
  ];

  const clues = [
    "Clue 1: The item stolen must be heavy.",
    "Clue 2: It can't be something protected by glass.",
    "Clue 3: It might be a weapon."
  ];

  const handleChoice = (isCorrect: boolean, e: React.MouseEvent) => {
    // @ts-ignore
    window.spawnParticles(e.clientX, e.clientY, isCorrect ? 'gold' : 'dust');

    if (isCorrect) {
      addScore(100);
      incrementCombo();
      setTimeout(() => triggerLevelTransition(GameState.LEVEL_2_CRYPT), 1000);
    } else {
      resetCombo();
      loseLife();
      setHint("Think about the clues! 'Must be heavy' means...");
      
      // Shake effect
      const body = document.body;
      body.style.transform = "translateX(10px)";
      setTimeout(() => body.style.transform = "translateX(-10px)", 50);
      setTimeout(() => body.style.transform = "none", 100);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-adventure-gold/30 mb-8 w-full text-center"
      >
        <h2 className="text-3xl text-adventure-gold font-serif mb-4">The Auction Heist</h2>
        <div className="space-y-2 text-xl text-white font-sans">
          {clues.map((clue, idx) => (
            <p key={idx} className="opacity-90">{clue}</p>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-8 justify-center items-center w-full">
        {artifacts.map((item, idx) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 183, 3, 0.4)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            onClick={(e) => handleChoice(item.correct, e)}
            className="relative group bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 hover:border-adventure-gold p-8 rounded-2xl w-64 h-80 flex flex-col items-center justify-center gap-6 transition-all duration-300"
          >
             <div className="text-adventure-teal group-hover:text-adventure-gold transition-colors duration-300 drop-shadow-[0_0_10px_rgba(33,158,188,0.5)]">
                {item.icon}
             </div>
             <span className="text-xl font-serif text-slate-300 group-hover:text-white">{item.name}</span>
          </motion.button>
        ))}
      </div>

      {hint && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-center gap-2 text-adventure-cream bg-red-900/50 px-6 py-3 rounded-full border border-red-400/50"
        >
          <AlertCircle size={20} />
          <span>Nate: "{hint}"</span>
        </motion.div>
      )}
    </div>
  );
};