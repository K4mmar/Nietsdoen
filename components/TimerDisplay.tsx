import React from 'react';

interface TimerDisplayProps {
  seconds: number;
  isBest: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, isBest }) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
        Time spent doing nothing
      </span>
      <div className={`text-6xl md:text-9xl font-light tracking-tighter transition-colors duration-500 ${isBest ? 'text-yellow-100 drop-shadow-[0_0_15px_rgba(255,255,200,0.5)]' : 'text-slate-200'}`}>
        {formatTime(seconds)}
      </div>
    </div>
  );
};
