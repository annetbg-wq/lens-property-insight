import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAllAssessmentsList, getAssessment } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { ScoreGauge } from '@/components/ScoreGauge';
import { FutureSlider } from '@/components/FutureSlider';
import { MapBackground } from '@/components/MapBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Trophy, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AssessmentResult, Zone } from '@/types/assessment';

const zoneLabel: Record<Zone, string> = { green: 'result.green', yellow: 'result.yellow', red: 'result.red' };

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
      <MapBackground className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg glass border border-border/40">
            <ArrowLeftRight className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h1 className="text-lg font-bold">{t('compare.title')}</h1>
          <p className="mt-1.5 text-xs text-muted-foreground">{t('compare.no_items')}</p>
          <Link to="/library"><Button className="mt-5 rounded-lg text-xs h-8" variant="outline">{t('nav.library')}</Button></Link>
        </motion.div>
      </MapBackground>
    );
  }

  // Find winners per metric
  const metrics = ['risk', 'return', 'stability'] as const;
  const winners: Record<string, string> = {};
  const losers: Record<string, string> = {};
  if (items.length >= 2) {
    for (const m of metrics) {
      const sorted = [...items].sort((a, b) => {
        if (m === 'risk') return a.subScores[m] - b.subScores[m]; // lower risk = winner
        return b.subScores[m] - a.subScores[m]; // higher return/stability = winner
      });
      winners[m] = sorted[0].id;
      losers[m] = sorted[sorted.length - 1].id;
    }
    const bestOverall = [...items].sort((a, b) => b.score - a.score);
    winners['overall'] = bestOverall[0].id;
    losers['overall'] = bestOverall[bestOverall.length - 1].id;
  }

  return (
    <MapBackground className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono text-primary uppercase tracking-wider">Battle Mode</span>
          </div>
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
          <>
            {/* Property Cards */}
            <div className="mt-8 grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
              {items.map((item, i) => {
                const isOverallWinner = winners['overall'] === item.id;
                const zoneColor = item.zone === 'green' ? 'border-primary/25' : item.zone === 'yellow' ? 'border-accent/25' : 'border-destructive/25';
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`glass rounded-lg viewfinder viewfinder-bottom border ${zoneColor} overflow-hidden h-full ${isOverallWinner ? 'ring-1 ring-primary/30' : ''}`}>
                      {/* Winner badge */}
                      {isOverallWinner && (
                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 border-b border-primary/15">
                          <Trophy className="h-3 w-3 text-primary" />
                          <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-wider">Leader</span>
                        </div>
                      )}

                      <div className="flex flex-col items-center p-5">
                        <Link to={`/result/${item.id}`} className="text-center mb-4 hover:text-primary transition-colors">
                          <p className="text-xs font-semibold truncate max-w-full">{item.displayName.split(',')[0]}</p>
                          <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{item.input.goal}</p>
                        </Link>

                        <ScoreGauge score={item.score} zone={item.zone} size={100} />
                        <Badge variant="secondary" className={`mt-3 border-0 text-[9px] font-mono ${
                          item.zone === 'green' ? 'bg-primary/10 score-green' : item.zone === 'yellow' ? 'bg-accent/10 score-amber' : 'bg-destructive/10 score-red'
                        }`}>
                          {t(zoneLabel[item.zone])}
                        </Badge>

                        {/* Metrics with winner/loser highlighting */}
                        <div className="mt-5 w-full space-y-2">
                          {metrics.map(k => {
                            const isWinner = winners[k] === item.id;
                            const isLoser = losers[k] === item.id && items.length > 2;
                            return (
                              <div key={k} className={`flex items-center justify-between text-xs rounded-md px-2.5 py-1.5 transition-colors ${
                                isWinner ? 'bg-primary/8 border border-primary/15' : isLoser ? 'bg-destructive/5 border border-destructive/10' : 'bg-secondary/30 border border-transparent'
                              }`}>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground">{t(`result.${k}`)}</span>
                                  {isWinner && <TrendingUp className="h-3 w-3 text-primary" />}
                                  {isLoser && <TrendingDown className="h-3 w-3 text-destructive" />}
                                </div>
                                <span className={`font-bold font-mono ${isWinner ? 'score-green' : isLoser ? 'score-red' : ''}`}>
                                  {item.subScores[k]}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Top risks */}
                        <div className="mt-4 w-full">
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground font-mono flex items-center gap-1">
                            <AlertTriangle className="h-2.5 w-2.5" /> {t('compare.risks')}
                          </p>
                          {item.redFlags.slice(0, 2).map((f, j) => (
                            <p key={j} className="text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1.5 mb-0.5">
                              <span className="text-destructive mt-0.5 shrink-0">•</span> {f.title}
                            </p>
                          ))}
                          {item.redFlags.length === 0 && <p className="text-[10px] text-muted-foreground italic">—</p>}
                        </div>

                        {/* Top upsides */}
                        <div className="mt-3 w-full">
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground font-mono flex items-center gap-1">
                            <TrendingUp className="h-2.5 w-2.5" /> {t('compare.upsides')}
                          </p>
                          {item.reasons.slice(0, 2).map((r, j) => (
                            <p key={j} className="text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1.5 mb-0.5">
                              <span className="text-primary mt-0.5 shrink-0">•</span> {r.title}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Future Simulation Slider */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <FutureSlider items={items} />
            </motion.div>
          </>
        )}
      </div>
    </MapBackground>
  );
}
