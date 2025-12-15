import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VoidBackground } from './components/VoidBackground';
import { TimerDisplay } from './components/TimerDisplay';
import { generateZenScolding } from './services/geminiService';
import { SerenityState } from './types';
import { AlertCircle, MousePointer2, Wind } from 'lucide-react';

const MOVEMENT_THRESHOLD = 5; // pixels needed to trigger movement event
const RESET_DELAY = 2000; // ms before calming down

const App: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [serenity, setSerenity] = useState<SerenityState>(SerenityState.CALM);
  const [zenMessage, setZenMessage] = useState<string>("Embrace the nothingness.");
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  
  // Refs for tracking movement logic without triggering re-renders
  const lastMousePos = useRef({ x: 0, y: 0 });
  const disturbanceScore = useRef(0);
  const calmTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFetchingRef = useRef(false);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (serenity === SerenityState.CALM) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [serenity]);

  // High score logic
  useEffect(() => {
    if (seconds > highScore) {
      setHighScore(seconds);
    }
  }, [seconds, highScore]);

  // Function to fetch AI scolding
  const fetchScolding = useCallback(async (level: number) => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setIsLoadingMessage(true);
    
    try {
      const message = await generateZenScolding(level);
      setZenMessage(message);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMessage(false);
      isFetchingRef.current = false;
      // Cooldown for API
      setTimeout(() => { isFetchingRef.current = false }, 5000); 
    }
  }, []);

  // Handle disturbances
  const handleDisturbance = useCallback(() => {
    // Reset calm timeout
    if (calmTimeout.current) clearTimeout(calmTimeout.current);

    disturbanceScore.current += 10;
    
    // Determine state based on score
    if (disturbanceScore.current > 50) {
      setSerenity(SerenityState.CHAOS);
      // Trigger AI if chaos is high and we aren't already fetching
      if (disturbanceScore.current > 80 && !isFetchingRef.current) {
         fetchScolding(disturbanceScore.current);
         disturbanceScore.current = 20; // Reset slightly to avoid spamming
      }
    } else if (disturbanceScore.current > 10) {
      setSerenity(SerenityState.DISTURBED);
    }

    // Set timeout to return to calm
    calmTimeout.current = setTimeout(() => {
      disturbanceScore.current = 0;
      setSerenity(SerenityState.CALM);
      setZenMessage("Embrace the nothingness.");
    }, RESET_DELAY);

  }, [fetchScolding]);

  const onMouseMove = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - lastMousePos.current.x);
    const dy = Math.abs(e.clientY - lastMousePos.current.y);

    if (dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD) {
      handleDisturbance();
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onClick = () => {
    disturbanceScore.current += 30; // Clicks are very disturbing
    handleDisturbance();
    if (!isFetchingRef.current) {
        fetchScolding(100);
    }
  };

  return (
    <div 
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden cursor-none selection:bg-none"
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
      <VoidBackground state={serenity} />
      
      {/* Main Content */}
      <div className="z-10 flex flex-col items-center justify-center p-8 text-center select-none pointer-events-none">
        
        {/* Status Icon */}
        <div className="mb-12 opacity-80 transition-all duration-300">
           {serenity === SerenityState.CALM && <Wind className="w-12 h-12 text-blue-200 animate-pulse" />}
           {serenity === SerenityState.DISTURBED && <MousePointer2 className="w-12 h-12 text-orange-300 animate-bounce" />}
           {serenity === SerenityState.CHAOS && <AlertCircle className="w-12 h-12 text-red-500 animate-spin" />}
        </div>

        <TimerDisplay seconds={seconds} isBest={seconds > 0 && seconds >= highScore && highScore > 5} />

        <div className="mt-16 h-24 flex items-center justify-center max-w-lg">
          {isLoadingMessage ? (
             <span className="text-slate-500 text-sm animate-pulse">Consulting the void...</span>
          ) : (
            <p className={`text-lg md:text-xl font-medium transition-all duration-500 ${
              serenity === SerenityState.CALM ? 'text-slate-400 opacity-60' : 'text-red-300 opacity-100 scale-105'
            }`}>
              {zenMessage}
            </p>
          )}
        </div>

        <div className="absolute bottom-8 text-slate-600 text-xs tracking-widest opacity-40">
           BEST: {highScore}s OF NOTHING
        </div>
      </div>

      {/* Helper text that fades out */}
      {seconds < 3 && serenity === SerenityState.CALM && (
        <div className="absolute top-8 animate-pulse text-slate-500 text-xs uppercase tracking-widest pointer-events-none">
          Stop moving. Do nothing.
        </div>
      )}

    </div>
  );
};

export default App;