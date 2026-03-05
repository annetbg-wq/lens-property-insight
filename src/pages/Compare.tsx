import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAllAssessmentsList, getAssessment } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AssessmentResult, Zone } from '@/types/assessment';

const zoneLabel: Record<Zone, string> = { green: 'result.green', yellow: 'result.yellow', red: 'result.red' };
const zoneStyles: Record<Zone, string> = {
  green: 'bg-primary/10 score-green',
  yellow: 'bg-accent/10 score-amber',
  red: 'bg-destructive/10 score-red',
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
      <div className="min-h-[calc(100vh-3.5rem)] terminal-grid flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary border border-border/50">
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <h1 className="text-lg font-bold">{t('compare.title')}</h1>
          <p className="mt-1.5 text-xs text-muted-foreground">{t('compare.no_items')}</p>
          <Link to="/library"><Button className="mt-5 rounded-lg text-xs h-8" variant="outline">{t('nav.library')}</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] terminal-grid">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold">{t('compare.title')}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('compare.subtitle')}</p>
        </motion.div>

        {items.length < 2 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">{t('compare.no_items')}</p>
            <Link to="/library"><Button className="mt-3 rounded-lg text-xs h-7" variant="outline">{t('nav.library')}</Button></Link>
          </div>
        )}

        {items.length >= 2 && (
          <div className="mt-8 grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border border-border/50 bg-card/80 hover-lift overflow-hidden h-full">
                  <CardContent className="flex flex-col items-center p-4">
                    <Link to={`/result/${item.id}`} className="text-center mb-4">
                      <p className="text-xs font-semibold truncate max-w-full">{item.displayName}</p>
                    </Link>
                    <ScoreGauge score={item.score} zone={item.zone} size={90} />
                    <Badge className={`mt-3 border-0 text-[10px] font-mono ${zoneStyles[item.zone]}`}>{t(zoneLabel[item.zone])}</Badge>

                    <div className="mt-4 w-full space-y-2">
                      {(['risk', 'return', 'stability'] as const).map(k => (
                        <div key={k} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{t(`result.${k}`)}</span>
                          <span className="font-bold font-mono">{item.subScores[k]}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 w-full">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">{t('compare.risks')}</p>
                      {item.redFlags.slice(0, 2).map((f, j) => (
                        <p key={j} className="text-[10px] text-muted-foreground leading-relaxed">• {f.title}</p>
                      ))}
                      {item.redFlags.length === 0 && <p className="text-[10px] text-muted-foreground italic">—</p>}
                    </div>

                    <div className="mt-3 w-full">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">{t('compare.upsides')}</p>
                      {item.reasons.slice(0, 2).map((r, j) => (
                        <p key={j} className="text-[10px] text-muted-foreground leading-relaxed">• {r.title}</p>
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
