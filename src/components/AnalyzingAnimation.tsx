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
          setTimeout(onComplete, 500);
          return s;
        }
        return s + 1;
      });
    }, 700);
    return () => clearInterval(stepInterval);
  }, [onComplete]);

  useEffect(() => {
    const progInterval = setInterval(() => {
      setProgress(p => Math.min(p + 1.5, 100));
    }, 30);
    return () => clearInterval(progInterval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background terminal-grid"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Scanning ring */}
      <div className="relative mb-12">
        <motion.div
          className="h-24 w-24 rounded-full border-2 border-primary/30"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-t-2 border-primary"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse-slow" />
        </div>
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-20"
          style={{ background: 'radial-gradient(hsl(160 84% 39%), transparent)' }}
        />
      </div>

      <motion.h2
        className="text-lg font-semibold mb-1 text-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t('analyzing.title')}
      </motion.h2>

      {/* Progress bar */}
      <div className="w-48 h-0.5 rounded-full bg-secondary overflow-hidden mt-4 mb-8">
        <motion.div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        {STEPS.map((s, i) => (
          <motion.div
            key={s}
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.2, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            <p className={`text-xs font-mono transition-colors ${i <= step ? 'text-foreground' : 'text-muted-foreground/50'}`}>
              {t(s)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
