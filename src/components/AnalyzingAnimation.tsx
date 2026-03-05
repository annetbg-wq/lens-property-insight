import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { useEffect, useState } from 'react';

const STEPS = ['analyzing.step1', 'analyzing.step2', 'analyzing.step3', 'analyzing.step4'];

interface AnalyzingAnimationProps {
  onComplete: () => void;
}

export function AnalyzingAnimation({ onComplete }: AnalyzingAnimationProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep(s => {
        if (s >= STEPS.length - 1) {
          clearInterval(stepInterval);
          setTimeout(onComplete, 400);
          return s;
        }
        return s + 1;
      });
    }, 650);
    return () => clearInterval(stepInterval);
  }, [onComplete]);

  useEffect(() => {
    const progInterval = setInterval(() => {
      setProgress(p => Math.min(p + 1.8, 100));
    }, 28);
    return () => clearInterval(progInterval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Cadastral grid background */}
      <div className="absolute inset-0 cadastral-grid opacity-40" />
      <div className="absolute inset-0 overflow-hidden scanline pointer-events-none" />

      {/* Radar sweep */}
      <div className="relative mb-14">
        {/* Outer ring */}
        <div className="h-28 w-28 rounded-full border border-primary/10" />
        {/* Mid ring */}
        <div className="absolute inset-3 rounded-full border border-primary/15" />
        {/* Inner ring */}
        <div className="absolute inset-6 rounded-full border border-primary/20" />
        
        {/* Sweep arm */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute top-1/2 left-1/2 h-14 w-[2px] origin-bottom"
            style={{
              transform: 'translate(-50%, -100%)',
              background: 'linear-gradient(to top, hsl(160 84% 39% / 0.6), transparent)',
            }}
          />
        </motion.div>

        {/* Sweep glow cone */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
            style={{
              background: 'conic-gradient(from 0deg, transparent, hsl(160 84% 39% / 0.06) 30deg, transparent 60deg)',
            }}
          />
        </motion.div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
        </div>

        {/* Glow */}
        <div className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{ background: 'radial-gradient(hsl(160 84% 39%), transparent)' }}
        />

        {/* Floating pings */}
        {[
          { top: '20%', left: '70%', delay: 0.5 },
          { top: '60%', left: '25%', delay: 1.2 },
          { top: '35%', left: '80%', delay: 2.0 },
        ].map((ping, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary"
            style={{ top: ping.top, left: ping.left }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: ping.delay }}
          />
        ))}
      </div>

      <motion.h2
        className="text-base font-semibold mb-1 text-foreground relative z-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {t('analyzing.title')}
      </motion.h2>

      {/* Progress bar */}
      <div className="w-40 h-[2px] rounded-full bg-secondary overflow-hidden mt-3 mb-8 relative z-10">
        <motion.div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>

      {/* Steps */}
      <div className="flex flex-col items-start gap-2 relative z-10">
        {STEPS.map((s, i) => (
          <motion.div
            key={s}
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i <= step ? 1 : 0.15, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
              i < step ? 'bg-primary' : i === step ? 'bg-primary animate-pulse' : 'bg-muted-foreground/20'
            }`} />
            <p className={`text-xs font-mono transition-colors duration-300 ${
              i <= step ? 'text-foreground' : 'text-muted-foreground/30'
            }`}>
              {t(s)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
