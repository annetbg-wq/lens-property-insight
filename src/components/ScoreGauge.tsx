import { motion } from 'framer-motion';
import type { Zone } from '@/types/assessment';

interface ScoreGaugeProps {
  score: number;
  zone: Zone;
  size?: number;
  showLabel?: boolean;
}

const ZONE_COLORS: Record<Zone, { main: string; glow: string }> = {
  green: { main: '#34D399', glow: 'hsl(158 64% 52% / 0.3)' },
  yellow: { main: '#FBBF24', glow: 'hsl(36 80% 56% / 0.3)' },
  red: { main: '#F87171', glow: 'hsl(0 72% 58% / 0.3)' },
};

export function ScoreGauge({ score, zone, size = 200, showLabel = true }: ScoreGaugeProps) {
  const strokeWidth = size > 120 ? 6 : 4;
  const radius = (size - strokeWidth * 2 - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { main, glow } = ZONE_COLORS[zone];
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute rounded-full blur-3xl opacity-40"
        style={{
          inset: size * 0.2,
          background: `radial-gradient(${main}, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="hsl(220, 16%, 14%)"
          strokeWidth={strokeWidth}
          className="opacity-50"
        />

        {/* Value arc */}
        <motion.circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={main}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          filter={`drop-shadow(0 0 8px ${glow})`}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="font-bold tracking-tight leading-none"
          style={{ color: main, fontSize: size * 0.32 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
        >
          {score}
        </motion.span>
        {showLabel && (
          <span
            className="text-muted-foreground tracking-wider uppercase font-medium"
            style={{ fontSize: Math.max(9, size * 0.065) }}
          >
            /100
          </span>
        )}
      </div>
    </div>
  );
}
