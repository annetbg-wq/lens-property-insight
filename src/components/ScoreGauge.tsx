import { motion } from 'framer-motion';
import type { Zone } from '@/types/assessment';

interface ScoreGaugeProps {
  score: number;
  zone: Zone;
  size?: number;
  showLabel?: boolean;
}

const ZONE_COLORS: Record<Zone, { main: string; glow: string; ring: string }> = {
  green: { main: '#10B981', glow: 'hsl(160 84% 39% / 0.25)', ring: 'hsl(160 84% 39% / 0.08)' },
  yellow: { main: '#F59E0B', glow: 'hsl(38 92% 50% / 0.25)', ring: 'hsl(38 92% 50% / 0.08)' },
  red: { main: '#EF4444', glow: 'hsl(0 84% 60% / 0.25)', ring: 'hsl(0 84% 60% / 0.08)' },
};

export function ScoreGauge({ score, zone, size = 180, showLabel = true }: ScoreGaugeProps) {
  const strokeWidth = size > 120 ? 4 : 3;
  const radius = (size - strokeWidth * 2 - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { main, glow, ring } = ZONE_COLORS[zone];
  const cx = size / 2;
  const cy = size / 2;

  // Tick marks
  const ticks = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 10 === 0;
    const innerR = radius + (isMajor ? 2 : 4);
    const outerR = radius + (isMajor ? 8 : 6);
    return {
      x1: cx + innerR * Math.cos(rad),
      y1: cy + innerR * Math.sin(rad),
      x2: cx + outerR * Math.cos(rad),
      y2: cy + outerR * Math.sin(rad),
      isMajor,
    };
  });

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          inset: size * 0.15,
          background: `radial-gradient(${main}40, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} className="-rotate-90">
        {/* Outer tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.isMajor ? `${main}40` : `${main}15`}
            strokeWidth={t.isMajor ? 1.5 : 0.5}
          />
        ))}

        {/* Background ring */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none" stroke={ring} strokeWidth={strokeWidth}
        />

        {/* Track ring (darker) */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none" stroke="hsl(217, 33%, 12%)" strokeWidth={strokeWidth}
        />

        {/* Value arc */}
        <motion.circle
          cx={cx} cy={cy} r={radius}
          fill="none" stroke={main} strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          filter={`drop-shadow(0 0 6px ${glow})`}
        />

        {/* Leading dot */}
        <motion.circle
          r={strokeWidth}
          fill={main}
          filter={`drop-shadow(0 0 4px ${main})`}
          initial={{ opacity: 0 }}
          animate={{
            cx: cx + radius * Math.cos(((score / 100) * 360 - 90) * Math.PI / 180),
            cy: cy + radius * Math.sin(((score / 100) * 360 - 90) * Math.PI / 180),
            opacity: 1,
          }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="font-mono font-bold tracking-tighter leading-none"
          style={{ color: main, fontSize: size * 0.3 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
        >
          {score}
        </motion.span>
        {showLabel && (
          <span
            className="font-mono text-muted-foreground tracking-[0.2em] uppercase"
            style={{ fontSize: Math.max(8, size * 0.06) }}
          >
            /100
          </span>
        )}
      </div>
    </div>
  );
}
