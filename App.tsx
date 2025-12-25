import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Zap, PlayCircle } from 'lucide-react';
import useGameStore from './store';
import { GameState } from './types';
import { ParallaxBackground } from './components/ui/ParallaxBackground';
import { ParticleSystem } from './components/ui/Particles';
import { CinematicTransition } from './components/ui/CinematicTransition';
import { TeacherDashboard } from './components/ui/TeacherDashboard';
import { Level1Deduction } from './components/levels/Level1Deduction';
import { Level2Passive } from './components/levels/Level2Passive';
import { Level3Phrasal } from './components/levels/Level3Phrasal';
import { Level4Conditional } from './components/levels/Level4Conditional';

const App: React.FC = () => {
  const { currentState, score, combo, lives, adrenalineMode, setGameState } = useGameStore();

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-slate-100">
      <ParallaxBackground />
      <ParticleSystem />
      <TeacherDashboard />

      {/* Adrenaline Overlay */}
      <AnimatePresence>
        {adrenalineMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-30 ring-inset ring-[20px] ring-adventure-gold/30 mix-blend-screen"
            style={{ boxShadow: "inset 0 0 100px #ffb703" }}
          />
        )}
      </AnimatePresence>

      {/* HUD */}
      {currentState !== GameState.MENU && currentState !== GameState.VICTORY && currentState !== GameState.TRANSITION && (
        <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-start z-40 pointer-events-none">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-2xl font-serif text-adventure-gold drop-shadow-md">
               <Trophy fill="#ffb703" /> {score.toLocaleString()}
            </div>
            {combo > 1 && (
               <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }} 
                 className={`text-sm font-bold px-2 py-1 rounded ${adrenalineMode ? 'bg-adventure-gold text-black' : 'bg-slate-700 text-slate-300'}`}
               >
                 {combo}x COMBO {adrenalineMode && <Zap size={12} className="inline ml-1 animate-pulse" />}
               </motion.div>
            )}
          </div>

          <div className="flex gap-2">
             {[...Array(3)].map((_, i) => (
               <Heart 
                 key={i} 
                 className={`w-8 h-8 transition-colors ${i < lives ? 'fill-red-500 text-red-600' : 'fill-slate-800 text-slate-700'}`} 
               />
             ))}
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="relative z-20 w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentState === GameState.MENU && (
             <motion.div 
               key="menu"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="text-center"
             >
               <h1 className="text-6xl md:text-8xl font-serif text-adventure-gold mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider">
                 UNCHARTED
               </h1>
               <h2 className="text-2xl md:text-3xl font-sans text-adventure-teal mb-12 uppercase tracking-[0.2em]">
                 The Lexicon Expedition
               </h2>
               <button 
                 onClick={() => setGameState(GameState.LEVEL_1_AUCTION)}
                 className="group relative px-12 py-6 bg-slate-900 border-2 border-adventure-gold text-adventure-gold text-2xl font-bold uppercase tracking-widest hover:bg-adventure-gold hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(255,183,3,0.2)]"
               >
                 <span className="flex items-center gap-4">
                   Start Expedition <PlayCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                 </span>
               </button>
             </motion.div>
          )}

          {currentState === GameState.TRANSITION && (
            <motion.div key="transition" className="w-full h-full">
              <CinematicTransition />
            </motion.div>
          )}

          {currentState === GameState.LEVEL_1_AUCTION && (
            <motion.div key="l1" className="w-full h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <Level1Deduction />
            </motion.div>
          )}

          {currentState === GameState.LEVEL_2_CRYPT && (
            <motion.div key="l2" className="w-full h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <Level2Passive />
            </motion.div>
          )}

          {currentState === GameState.LEVEL_3_PLANE && (
             <motion.div key="l3" className="w-full h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
               <Level3Phrasal />
             </motion.div>
          )}

          {currentState === GameState.LEVEL_4_SHIPS && (
             <motion.div key="l4" className="w-full h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
               <Level4Conditional />
             </motion.div>
          )}

          {currentState === GameState.VICTORY && (
            <motion.div 
              key="victory"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-12 bg-black/60 backdrop-blur-xl border border-adventure-gold/50 rounded-2xl"
            >
              <h1 className="text-6xl font-serif text-adventure-gold mb-6">Mission Accomplished!</h1>
              <p className="text-3xl text-white mb-8">Final Score: {score}</p>
              <button 
                 onClick={() => window.location.reload()}
                 className="px-8 py-3 bg-adventure-teal text-white rounded hover:bg-white hover:text-adventure-teal font-bold transition-colors"
               >
                 Play Again
               </button>
            </motion.div>
          )}
          
          {currentState === GameState.GAME_OVER && (
            <motion.div 
              key="gameover"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-12 bg-red-900/80 backdrop-blur-xl border border-red-500 rounded-2xl"
            >
              <h1 className="text-6xl font-serif text-white mb-6">Expedition Failed</h1>
              <p className="text-xl text-red-200 mb-8">The treasure remains lost.</p>
              <button 
                 onClick={() => window.location.reload()}
                 className="px-8 py-3 border-2 border-white text-white rounded hover:bg-white hover:text-red-900 font-bold transition-colors"
               >
                 Try Again
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;