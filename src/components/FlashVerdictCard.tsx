import { motion } from 'framer-motion';
import { ScoreGauge } from './ScoreGauge';
import type { AssessmentResult, Zone } from '@/types/assessment';
import { useTranslation } from '@/lib/i18n';

interface FlashVerdictCardProps {
  result: AssessmentResult;
  compact?: boolean;
}

const zoneBorder: Record<Zone, string> = {
  green: 'border-primary/20',
  yellow: 'border-accent/20',
  red: 'border-destructive/20',
};

export function FlashVerdictCard({ result, compact = false }: FlashVerdictCardProps) {
  const { t } = useTranslation();
  const gaugeSize = compact ? 100 : 200;
  const punchyPoints = result.reasons.slice(0, 3).map(r => r.title);

  const zoneLabel = result.zone === 'green' ? t('result.green')
    : result.zone === 'yellow' ? t('result.yellow')
    : t('result.red');

  const zoneColor = result.zone === 'green' ? 'score-green'
    : result.zone === 'yellow' ? 'score-amber' : 'score-red';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', damping: 22 }}
      className={`rounded-2xl bg-card border ${zoneBorder[result.zone]} shadow-premium ${compact ? 'p-5' : 'p-8 md:p-10'}`}
    >
      <div className={`flex ${compact ? 'flex-col items-center gap-5' : 'flex-col md:flex-row items-center gap-10'}`}>
        {/* Score gauge */}
        <div className="shrink-0">
          <ScoreGauge score={result.score} zone={result.zone} size={gaugeSize} />
        </div>

        {/* Verdict info */}
        <div className={`flex-1 ${compact ? 'text-center' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-sm font-bold ${zoneColor} uppercase tracking-wider`}>
              {zoneLabel}
            </span>
            <span className="text-xs text-muted-foreground">
              • {t('result.confidence')}: {result.confidence}
            </span>
          </div>

          {/* Key findings */}
          <div className="space-y-3">
            {punchyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-start gap-3"
              >
                <span className={`mt-2 h-2 w-2 rounded-full shrink-0 ${
                  result.zone === 'green' ? 'bg-primary' : result.zone === 'yellow' ? 'bg-accent' : 'bg-destructive'
                }`} />
                <span className="text-sm text-foreground/90 leading-relaxed">{point}</span>
              </motion.div>
            ))}
          </div>

          {/* Sub-scores */}
          {!compact && (
            <div className="mt-8 flex gap-3">
              {(['risk', 'return', 'stability'] as const).map(key => (
                <div key={key} className="rounded-xl bg-secondary/50 border border-border/30 px-5 py-3 text-center min-w-[80px]">
                  <p className="text-xl font-bold">{result.subScores[key]}</p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">{t(`result.${key}`)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
