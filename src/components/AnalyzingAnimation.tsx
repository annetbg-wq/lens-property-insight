import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const STEPS = ['analyzing.step1', 'analyzing.step2', 'analyzing.step3', 'analyzing.step4'];

interface AnalyzingAnimationProps {
  onComplete: () => void;
}

export function AnalyzingAnimation({ onComplete }: AnalyzingAnimationProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => {
        if (s >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return s;
        }
        return s + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
      <h2 className="text-xl font-semibold mb-4">{t('analyzing.title')}</h2>
      <div className="flex flex-col items-center gap-2">
        {STEPS.map((s, i) => (
          <motion.p
            key={s}
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: i <= step ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            {i <= step ? '✓' : '○'} {t(s)}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
