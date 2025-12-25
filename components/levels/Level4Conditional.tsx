import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import useGameStore from '../../store';
import { GameState } from '../../types';

export const Level4Conditional: React.FC = () => {
  const { addScore, incrementCombo, setGameState } = useGameStore();
  const [input, setInput] = useState("");
  const [isFired, setIsFired] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const correct = "had"; // "If I ___ (have) the map..."

  const handleFire = () => {
    if (input.toLowerCase().trim() === correct) {
      setIsFired(true);
      // @ts-ignore
      window.spawnParticles(window.innerWidth/2, window.innerHeight/2, 'gold');
      addScore(500);
      incrementCombo();
      setTimeout(() => setGameState(GameState.VICTORY), 2000);
    } else {
        // Shake logic could go here
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Basic cleanup
      const cleanTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
      setInput(cleanTranscript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-[#2c1a12] p-12 rounded-lg border-4 border-[#8b5e3c] shadow-2xl max-w-3xl w-full text-center"
      >
        <motion.div
           animate={{ y: [0, -5, 0] }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
            <h2 className="text-3xl text-[#d4a373] font-serif mb-2">Second Conditional Cannon</h2>
            <p className="text-[#a68a64] mb-8 italic">Fill the breach to fire! (Type or Speak)</p>

            <div className="text-4xl text-white font-serif leading-relaxed mb-10">
            "If I 
            <div className="inline-block relative mx-2">
                <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-black/30 border-b-2 border-adventure-gold text-adventure-gold w-48 text-center focus:outline-none focus:bg-black/50 transition-colors pr-10"
                autoFocus
                />
                <button
                onClick={toggleListening}
                className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all duration-200 ${isListening ? 'bg-red-500/80 text-white animate-pulse' : 'text-adventure-gold/60 hover:text-adventure-gold hover:bg-white/5'}`}
                title="Speak Answer"
                >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
            </div>
            (have) the map, we would be safe!"
            </div>

            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFire}
            disabled={isFired}
            className={`px-12 py-4 rounded-full text-2xl font-bold uppercase tracking-widest transition-all ${isFired ? 'bg-green-600 text-white' : 'bg-red-700 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]'}`}
            >
            {isFired ? "TARGET HIT!" : "FIRE CANNON"}
            </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};