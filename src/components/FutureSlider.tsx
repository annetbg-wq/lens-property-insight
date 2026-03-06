import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import type { AssessmentResult } from '@/types/assessment';

interface FutureSliderProps {
  items: AssessmentResult[];
}

function projectScore(score: number, years: number, zone: string): number {
  const growth = zone === 'green' ? 0.03 : zone === 'yellow' ? 0.005 : -0.02;
  return Math.round(Math.min(100, Math.max(0, score * (1 + growth * years))));
}

export function FutureSlider({ items }: FutureSliderProps) {
  const { t } = useTranslation();
  const [years, setYears] = useState(0);

  return (
    <div className="rounded-2xl bg-card border border-border/40 p-6 shadow-premium">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold">{t('compare.future') || 'Forecast'}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {years === 0 ? 'Current' : `+${years} year${years > 1 ? 's' : ''}`}
          </p>
        </div>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
          {years}Y
        </span>
      </div>

      <Slider
        value={[years]}
        onValueChange={([v]) => setYears(v)}
        max={5}
        step={1}
        className="mb-6"
      />

      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => {
          const projected = projectScore(item.score, years, item.zone);
          const delta = projected - item.score;
          const deltaColor = delta > 0 ? 'text-primary' : delta < 0 ? 'text-destructive' : 'text-muted-foreground';

          return (
            <motion.div
              key={item.id}
              className="rounded-xl bg-secondary/40 border border-border/30 p-4 text-center"
              layout
            >
              <p className="text-xs text-muted-foreground truncate mb-2">{item.displayName.split(',')[0]}</p>
              <motion.p
                className="text-3xl font-bold"
                key={projected}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {projected}
              </motion.p>
              {years > 0 && (
                <p className={`text-xs font-bold ${deltaColor} mt-1`}>
                  {delta > 0 ? '+' : ''}{delta}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
