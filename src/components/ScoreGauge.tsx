import { motion } from 'framer-motion';
import type { Zone } from '@/types/assessment';

interface ScoreGaugeProps {
  score: number;
  zone: Zone;
  size?: number;
}

const ZONE_GRADIENTS: Record<Zone, [string, string]> = {
  green: ['hsl(168, 80%, 42%)', 'hsl(142, 71%, 45%)'],
  yellow: ['hsl(32, 95%, 50%)', 'hsl(45, 93%, 47%)'],
  red: ['hsl(4, 90%, 58%)', 'hsl(350, 80%, 50%)'],
};

export function ScoreGauge({ score, zone, size = 180 }: ScoreGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const [c1, c2] = ZONE_GRADIENTS[zone];
  const gradientId = `gauge-${zone}-${size}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow */}
      <div
        className="absolute inset-4 rounded-full blur-2xl opacity-30"
        style={{ background: `radial-gradient(${c1}, transparent)` }}
      />

      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="hsl(var(--muted))" strokeWidth={6} opacity={0.5}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={`url(#${gradientId})`} strokeWidth={8}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-5xl font-black tracking-tight font-display"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          style={{ color: c1 }}
        >
          {score}
        </motion.span>
        <span className="text-xs font-medium text-muted-foreground mt-0.5">/100</span>
      </div>
    </div>
  );
}
