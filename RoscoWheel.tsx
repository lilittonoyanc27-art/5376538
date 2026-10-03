import React from 'react';
import { Riddle, RiddleStatus } from './riddles';
import { Check, X, RotateCw } from 'lucide-react';
import { soundManager } from './audio';

interface RoscoWheelProps {
  riddles: Riddle[];
  statuses: Record<number, RiddleStatus>;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  size?: number; // width & height in px
}

export const RoscoWheel: React.FC<RoscoWheelProps> = ({
  riddles,
  statuses,
  currentIndex,
  onSelectIndex,
  size = 500,
}) => {
  const total = riddles.length;
  // Make node diameter comfortably large for 27 items while maintaining clean spacing
  const nodeDiameter = Math.max(38, Math.min(54, Math.round(size * 0.1)));
  const radius = (size - nodeDiameter - 12) / 2;
  const center = size / 2;

  return (
    <div 
      className="relative mx-auto select-none transition-all duration-300"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Background Studio Rings with Subtle Glow */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <radialGradient id="studioRingGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
            <stop offset="85%" stopColor="#1d4ed8" stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Ring Backdrop */}
        <circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="url(#studioRingGlow)"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(96, 165, 250, 0.28)"
          strokeWidth="2.5"
          strokeDasharray="5 7"
        />
        <circle
          cx={center}
          cy={center}
          r={radius - nodeDiameter * 0.75}
          fill="none"
          stroke="rgba(59, 130, 246, 0.12)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Spherical Letter Nodes around the Rosco in Strict A-Z Order */}
      {riddles.map((riddle, idx) => {
        // Starts at exact top (12 o'clock) for idx=0 (Letter A) and rotates clockwise
        const angle = -Math.PI / 2 + (2 * Math.PI * idx) / total;
        const x = center + radius * Math.cos(angle) - nodeDiameter / 2;
        const y = center + radius * Math.sin(angle) - nodeDiameter / 2;

        const status = statuses[riddle.id] || 'pending';
        const isCurrent = idx === currentIndex;

        // Modern 3D glossy gradient themes
        let bgStyle = 'bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-950 border-blue-300/80 text-white shadow-[0_4px_14px_rgba(37,99,235,0.45)]';
        let statusBadge: React.ReactNode = null;

        if (status === 'correct') {
          bgStyle = 'bg-gradient-to-b from-emerald-300 via-emerald-600 to-teal-950 border-emerald-300 text-white shadow-[0_4px_16px_rgba(16,185,129,0.55)]';
          statusBadge = (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-md">
              <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
            </span>
          );
        } else if (status === 'wrong') {
          bgStyle = 'bg-gradient-to-b from-rose-400 via-red-600 to-rose-950 border-rose-300 text-white shadow-[0_4px_16px_rgba(244,63,94,0.55)]';
          statusBadge = (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 border border-white flex items-center justify-center shadow-md">
              <X className="w-2.5 h-2.5 text-white stroke-[3.5]" />
            </span>
          );
        } else if (status === 'passed') {
          bgStyle = 'bg-gradient-to-b from-amber-300 via-amber-500 to-orange-900 border-amber-200 text-white shadow-[0_4px_16px_rgba(245,158,11,0.55)]';
          statusBadge = (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 border border-white flex items-center justify-center shadow-md">
              <RotateCw className="w-2.5 h-2.5 text-slate-950 stroke-[3.5]" />
            </span>
          );
        }

        return (
          <button
            key={riddle.id}
            type="button"
            onClick={() => {
              soundManager.playClick();
              onSelectIndex(idx);
            }}
            title={`Буква [${riddle.letter}] — ${riddle.letterDisplay} (Статус: ${
              status === 'correct' ? 'Верно ✅' : status === 'wrong' ? 'Ошибка ❌' : status === 'passed' ? 'Пасапалабра ⏸' : 'Ожидает ⏳'
            })`}
            style={{
              width: `${nodeDiameter}px`,
              height: `${nodeDiameter}px`,
              left: `${x}px`,
              top: `${y}px`,
            }}
            className={`
              absolute rounded-full flex items-center justify-center
              border-2 sphere-ambient-shadow transition-all duration-200 cursor-pointer
              ${bgStyle}
              ${
                isCurrent
                  ? 'ring-4 ring-yellow-300 scale-125 z-30 animate-pulseGlow shadow-[0_0_28px_rgba(250,204,21,0.9)]'
                  : 'hover:scale-115 hover:z-20 hover:brightness-110 active:scale-105'
              }
            `}
          >
            {/* Top glass highlight reflection for 3D sphere illusion */}
            <span className="absolute top-0.5 left-2 right-2 h-1/2 bg-gradient-to-b from-white/60 via-white/20 to-transparent rounded-t-full pointer-events-none" />

            {/* BIG, BOLD, MODERN LETTER */}
            <span 
              className="relative z-10 font-['Outfit',sans-serif] font-black text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              style={{
                fontSize: `${Math.round(nodeDiameter * 0.52)}px`,
              }}
            >
              {riddle.letter}
            </span>

            {/* Status Check / X / Rotate badge */}
            {statusBadge}
          </button>
        );
      })}
    </div>
  );
};
