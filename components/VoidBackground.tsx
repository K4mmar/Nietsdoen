import React from 'react';
import { SerenityState } from '../types';

interface VoidBackgroundProps {
  state: SerenityState;
}

export const VoidBackground: React.FC<VoidBackgroundProps> = ({ state }) => {
  let gradientClasses = "";

  switch (state) {
    case SerenityState.CALM:
      gradientClasses = "bg-gradient-to-br from-slate-900 via-purple-950 to-black duration-[3000ms]";
      break;
    case SerenityState.DISTURBED:
      gradientClasses = "bg-gradient-to-tr from-slate-800 via-red-950 to-black duration-700";
      break;
    case SerenityState.CHAOS:
      gradientClasses = "bg-gradient-to-r from-red-900 via-orange-900 to-black duration-100 animate-pulse";
      break;
  }

  return (
    <div className={`absolute inset-0 -z-10 transition-all ease-in-out ${gradientClasses}`}>
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
    </div>
  );
};
