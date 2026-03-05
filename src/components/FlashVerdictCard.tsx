import { motion } from 'framer-motion';
import { ScoreGauge } from './ScoreGauge';
import type { AssessmentResult, Zone } from '@/types/assessment';
import { useTranslation } from '@/lib/i18n';

interface FlashVerdictCardProps {
  result: AssessmentResult;
  compact?: boolean;
}

const zoneBg: Record<Zone, string> = {
  green: 'border-primary/20',
  yellow: 'border-accent/20',
  red: 'border-destructive/20',
};

export function FlashVerdictCard({ result, compact = false }: FlashVerdictCardProps) {
  const { t } = useTranslation();
  const gaugeSize = compact ? 100 : 180;

  // 3 punchy summary points from reasons
  const punchyPoints = result.reasons.slice(0, 3).map(r => r.title);

  const zoneLabel = result.zone === 'green' ? t('result.green')
    : result.zone === 'yellow' ? t('result.yellow')
    : t('result.red');

  const zoneColor = result.zone === 'green' ? 'score-green'
    : result.zone === 'yellow' ? 'score-amber' : 'score-red';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', damping: 20 }}
      className={`glass viewfinder viewfinder-bottom rounded-lg p-6 ${zoneBg[result.zone]} ${compact ? 'p-4' : 'p-6 md:p-8'}`}
    >
      <div className={`flex ${compact ? 'flex-col items-center gap-4' : 'flex-col md:flex-row items-center gap-8'}`}>
        {/* Score gauge */}
        <div className="shrink-0">
          <ScoreGauge score={result.score} zone={result.zone} size={gaugeSize} />
        </div>

        {/* Verdict info */}
        <div className={`flex-1 ${compact ? 'text-center' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-mono font-bold ${zoneColor} uppercase tracking-wider`}>
              {zoneLabel}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              • {t('result.confidence')}: {result.confidence}
            </span>
          </div>

          {/* Punchy points */}
          <div className="space-y-2">
            {punchyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-start gap-2"
              >
                <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                  result.zone === 'green' ? 'bg-primary' : result.zone === 'yellow' ? 'bg-accent' : 'bg-destructive'
                }`} />
                <span className="text-sm text-foreground/90 leading-snug">{point}</span>
              </motion.div>
            ))}
          </div>

          {/* Sub-scores inline */}
          {!compact && (
            <div className="mt-5 flex gap-3">
              {(['risk', 'return', 'stability'] as const).map(key => (
                <div key={key} className="rounded-md bg-secondary/50 border border-border/30 px-3 py-2 text-center min-w-[70px]">
                  <p className="text-lg font-bold font-mono">{result.subScores[key]}</p>
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{t(`result.${key}`)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
