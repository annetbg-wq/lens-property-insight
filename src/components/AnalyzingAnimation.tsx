import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { useEffect, useState, useRef } from 'react';

const STEPS = ['analyzing.step1', 'analyzing.step2', 'analyzing.step3', 'analyzing.step4', 'analyzing.step5'];

interface AnalyzingAnimationProps {
  onComplete: () => void;
}

export function AnalyzingAnimation({ onComplete }: AnalyzingAnimationProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep(s => (s + 1) % STEPS.length);
    }, 1200);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const progInterval = setInterval(() => {
      setProgress(p => p >= 95 ? 95 : p + 0.5);
    }, 60);
    return () => clearInterval(progInterval);
  }, []);

  const fallbacks: Record<string, string> = {
    'analyzing.step1': 'Scanning cadastral records...',
    'analyzing.step2': 'Analyzing zoning & FAR...',
    'analyzing.step3': 'Evaluating infrastructure...',
    'analyzing.step4': 'Calculating market trends...',
    'analyzing.step5': 'Generating AI verdict...',
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 ambient-glow" />

      {/* Animated ring */}
      <div className="relative mb-16">
        <motion.div
          className="h-32 w-32 rounded-full border-2 border-primary/10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="absolute inset-4 rounded-full border border-primary/15" />
        <div className="absolute inset-8 rounded-full border border-primary/20" />

        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse-slow" />
        </div>
      </div>

      <motion.h2
        className="text-xl font-bold mb-2 relative z-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {t('analyzing.title')}
      </motion.h2>

      <p className="text-sm text-primary mb-6 relative z-10 animate-pulse font-medium">
        AI analyzing property...
      </p>

      {/* Progress bar */}
      <div className="w-48 h-1 rounded-full bg-secondary overflow-hidden mb-10 relative z-10">
        <motion.div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col items-start gap-3 relative z-10">
        {STEPS.map((s, i) => {
          const text = t(s) !== s ? t(s) : fallbacks[s] || s;
          return (
            <motion.div
              key={s}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i <= step ? 1 : 0.2, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <div className={`h-2 w-2 rounded-full transition-all duration-500 ${
                i < step ? 'bg-primary' : i === step ? 'bg-primary animate-pulse' : 'bg-muted-foreground/20'
              }`} />
              <p className={`text-sm transition-colors duration-300 ${
                i <= step ? 'text-foreground' : 'text-muted-foreground/30'
              }`}>
                {text}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
