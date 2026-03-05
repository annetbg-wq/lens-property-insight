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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background mesh-gradient"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Animated orb */}
      <div className="relative mb-10">
        <motion.div
          className="h-28 w-28 rounded-full"
          style={{ background: 'var(--gradient-primary)', filter: 'blur(0px)' }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full opacity-40"
          style={{ background: 'var(--gradient-primary)' }}
          animate={{ scale: [1, 1.8, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.h2
        className="text-2xl font-bold font-display mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t('analyzing.title')}
      </motion.h2>

      {/* Progress bar */}
      <div className="w-64 h-1 rounded-full bg-muted overflow-hidden mt-4 mb-6">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--gradient-primary)', width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col items-center gap-2.5">
        {STEPS.map((s, i) => (
          <motion.div
            key={s}
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.25, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className={`h-2 w-2 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            <p className={`text-sm transition-colors ${i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {t(s)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
