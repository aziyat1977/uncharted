import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store';
import { GameState } from '../../types';

export const Level3Phrasal: React.FC = () => {
  const { addScore, incrementCombo, loseLife, resetCombo, triggerLevelTransition, adrenalineMode } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(100);
  const [questionIdx, setQuestionIdx] = useState(0);

  const questions = [
    { text: "The plane is taking ___!", options: ["OFF", "UP", "OUT"], correct: "OFF" },
    { text: "We need to ___ out the fire!", options: ["PUT", "GET", "TAKE"], correct: "PUT" },
    { text: "Look ___! A falling crate!", options: ["IN", "OUT", "FOR"], correct: "OUT" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
           clearInterval(timer);
           loseLife();
           resetCombo();
           // In a real game, restart level logic here
           return 100;
        }
        return prev - (adrenalineMode ? 1.5 : 0.5); // Faster timer in adrenaline mode
      });
    }, 50);
    return () => clearInterval(timer);
  }, [adrenalineMode, loseLife, resetCombo]);

  const handleAnswer = (option: string, e: React.MouseEvent) => {
    const currentQ = questions[questionIdx];
    if (option === currentQ.correct) {
       // @ts-ignore
       window.spawnParticles(e.clientX, e.clientY, 'gold');
       addScore(200);
       incrementCombo();
       
       if (questionIdx < questions.length - 1) {
         setQuestionIdx(prev => prev + 1);
         setTimeLeft(100); // Reset timer for next Q
       } else {
         setTimeout(() => triggerLevelTransition(GameState.LEVEL_4_SHIPS), 1000);
       }
    } else {
       loseLife();
       resetCombo();
       // Shake screen
       const body = document.body;
       body.style.transform = "rotate(2deg)";
       setTimeout(() => body.style.transform = "rotate(-2deg)", 50);
       setTimeout(() => body.style.transform = "none", 100);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Wind lines effect */}
      <motion.div 
        animate={{ x: [-2000, 2000] }}
        transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
        className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_100px,rgba(255,255,255,0.1)_100px,rgba(255,255,255,0.1)_200px)] pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-md p-10 rounded-3xl border-2 border-sky-300/30">
        {/* Timer Bar */}
        <div className="w-full h-4 bg-black/40 rounded-full mb-8 overflow-hidden border border-white/20">
          <motion.div 
            className="h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
            style={{ width: `${timeLeft}%` }}
          />
        </div>

        <h2 className="text-5xl font-bold text-white text-center mb-12 drop-shadow-xl font-sans italic">
          "{questions[questionIdx].text}"
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {questions[questionIdx].options.map((opt, idx) => (
            <motion.button
              key={opt}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.9 }}
              // Pulsing animation
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: idx * 0.2 
              }}
              onClick={(e) => handleAnswer(opt, e)}
              className="h-32 bg-sky-900/80 border-2 border-sky-400 rounded-xl text-3xl font-black text-sky-100 shadow-lg hover:shadow-sky-500/50 transition-all uppercase tracking-widest"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};