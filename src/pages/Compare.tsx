import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAllAssessmentsList, getAssessment } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AssessmentResult, Zone } from '@/types/assessment';

const zoneLabel: Record<Zone, string> = { green: 'result.green', yellow: 'result.yellow', red: 'result.red' };
const zoneStyles: Record<Zone, string> = {
  green: 'bg-accent/10 text-accent',
  yellow: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  red: 'bg-destructive/10 text-destructive',
};

export default function Compare() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const ids = params.get('ids')?.split(',').filter(Boolean) ?? [];
  const all = useMemo(() => getAllAssessmentsList(), []);

  const items: AssessmentResult[] = useMemo(() => {
    if (ids.length > 0) return ids.map(id => getAssessment(id)).filter(Boolean) as AssessmentResult[];
    return all.slice(0, 3);
  }, [ids, all]);

  if (all.length < 2) {
    return (
      <div className="min-h-[calc(100vh-4rem)] mesh-gradient flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <ArrowLeftRight className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <h1 className="text-2xl font-bold font-display">{t('compare.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('compare.no_items')}</p>
          <Link to="/library"><Button className="mt-6 rounded-full" variant="outline">{t('nav.library')}</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] mesh-gradient">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black font-display">{t('compare.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('compare.subtitle')}</p>
        </motion.div>

        {items.length < 2 && (
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">{t('compare.no_items')}</p>
            <Link to="/library"><Button className="mt-4 rounded-full" variant="outline">{t('nav.library')}</Button></Link>
          </div>
        )}

        {items.length >= 2 && (
          <div className="mt-10 grid gap-5" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-[var(--shadow-card)] hover-lift overflow-hidden h-full">
                  <CardContent className="flex flex-col items-center p-6">
                    <Link to={`/result/${item.id}`} className="text-center mb-5">
                      <p className="text-sm font-bold truncate max-w-full">{item.displayName}</p>
                    </Link>
                    <ScoreGauge score={item.score} zone={item.zone} size={110} />
                    <Badge className={`mt-4 border-0 ${zoneStyles[item.zone]} font-semibold`}>{t(zoneLabel[item.zone])}</Badge>

                    <div className="mt-5 w-full space-y-2.5">
                      {(['risk', 'return', 'stability'] as const).map(k => (
                        <div key={k} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t(`result.${k}`)}</span>
                          <span className="font-bold">{item.subScores[k]}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 w-full">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('compare.risks')}</p>
                      {item.redFlags.slice(0, 2).map((f, i) => (
                        <p key={i} className="text-xs text-muted-foreground leading-relaxed">• {f.title}</p>
                      ))}
                      {item.redFlags.length === 0 && <p className="text-xs text-muted-foreground italic">—</p>}
                    </div>

                    <div className="mt-4 w-full">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('compare.upsides')}</p>
                      {item.reasons.slice(0, 2).map((r, i) => (
                        <p key={i} className="text-xs text-muted-foreground leading-relaxed">• {r.title}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
