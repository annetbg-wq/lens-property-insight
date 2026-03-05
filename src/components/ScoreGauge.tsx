import { motion } from 'framer-motion';
import type { Zone } from '@/types/assessment';

interface ScoreGaugeProps {
  score: number;
  zone: Zone;
  size?: number;
}

const ZONE_COLORS: Record<Zone, { main: string; glow: string }> = {
  green: { main: '#10B981', glow: 'hsl(160 84% 39% / 0.3)' },
  yellow: { main: '#F59E0B', glow: 'hsl(38 92% 50% / 0.3)' },
  red: { main: '#EF4444', glow: 'hsl(0 84% 60% / 0.3)' },
};

export function ScoreGauge({ score, zone, size = 180 }: ScoreGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { main, glow } = ZONE_COLORS[zone];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow */}
      <div
        className="absolute inset-6 rounded-full blur-2xl opacity-40"
        style={{ background: `radial-gradient(${main}, transparent)` }}
      />

      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="hsl(217, 33%, 20%)" strokeWidth={3}
        />
        {/* Value */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={main} strokeWidth={4}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <motion.span
          className="font-mono font-bold tracking-tighter"
          style={{ color: main, fontSize: size * 0.28 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-mono text-muted-foreground tracking-wider">/100</span>
      </div>
    </div>
  );
}
