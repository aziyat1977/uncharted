import React, { useState } from 'react';
import useGameStore from '../../store';
import { GameState } from '../../types';
import { Settings, RefreshCw, Shield, Map } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { setGameState, resetGame, toggleGodMode, godMode } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = () => {
    setTapCount(prev => prev + 1);
    setTimeout(() => setTapCount(0), 1000); // Reset if not tapped fast enough
    
    if (tapCount >= 2) {
      setIsOpen(true);
      setTapCount(0);
    }
  };

  if (!isOpen) {
    return (
      <div 
        onClick={handleTap}
        className="fixed top-0 right-0 w-24 h-24 z-50 cursor-default" // Invisible hit area
        title="Teacher Menu (Triple Tap)"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-2xl border-2 border-adventure-gold max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-adventure-gold flex items-center gap-2">
            <Settings className="w-6 h-6" /> Teacher Dashboard
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-red-400"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Map className="w-4 h-4"/> Level Select</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setGameState(GameState.LEVEL_1_AUCTION); setIsOpen(false); }} className="btn-secondary text-sm">Level 1: Auction</button>
              <button onClick={() => { setGameState(GameState.LEVEL_2_CRYPT); setIsOpen(false); }} className="btn-secondary text-sm">Level 2: Crypt</button>
              <button onClick={() => { setGameState(GameState.LEVEL_3_PLANE); setIsOpen(false); }} className="btn-secondary text-sm">Level 3: Plane</button>
              <button onClick={() => { setGameState(GameState.LEVEL_4_SHIPS); setIsOpen(false); }} className="btn-secondary text-sm">Level 4: Ships</button>
            </div>
          </div>

          <button 
            onClick={toggleGodMode}
            className={`w-full p-4 rounded-lg flex items-center justify-between font-bold transition-all ${godMode ? 'bg-adventure-teal text-white' : 'bg-slate-700 text-gray-400'}`}
          >
            <span className="flex items-center gap-2"><Shield className="w-5 h-5"/> God Mode (No Life Loss)</span>
            <span>{godMode ? 'ON' : 'OFF'}</span>
          </button>

          <button 
            onClick={() => { resetGame(); setIsOpen(false); }}
            className="w-full p-4 rounded-lg bg-red-900/50 border border-red-500 text-red-100 hover:bg-red-900 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5"/> Reset Class Progress
          </button>
        </div>
      </div>
    </div>
  );
};
