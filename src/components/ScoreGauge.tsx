import { motion } from 'framer-motion';
import type { Zone } from '@/types/assessment';

interface ScoreGaugeProps {
  score: number;
  zone: Zone;
  size?: number;
}

const ZONE_COLORS: Record<Zone, string> = {
  green: 'hsl(142, 71%, 45%)',
  yellow: 'hsl(32, 95%, 50%)',
  red: 'hsl(4, 90%, 58%)',
};

export function ScoreGauge({ score, zone, size = 160 }: ScoreGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = ZONE_COLORS[zone];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={8} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-4xl font-bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
