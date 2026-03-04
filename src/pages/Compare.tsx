import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAllAssessmentsList, getAssessment } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, FileText } from 'lucide-react';
import type { AssessmentResult, Zone } from '@/types/assessment';

const zoneLabel: Record<Zone, string> = { green: 'result.green', yellow: 'result.yellow', red: 'result.red' };
const zoneBg: Record<Zone, string> = { green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', yellow: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300', red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' };

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
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ArrowLeftRight className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
        <h1 className="text-xl font-semibold">{t('compare.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('compare.no_items')}</p>
        <Link to="/library"><Button className="mt-6 rounded-full" variant="outline">{t('nav.library')}</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold">{t('compare.title')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('compare.subtitle')}</p>

      {items.length < 2 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">{t('compare.no_items')}</p>
          <Link to="/library"><Button className="mt-4 rounded-full" variant="outline">{t('nav.library')}</Button></Link>
        </div>
      )}

      {items.length >= 2 && (
        <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map(item => (
            <Card key={item.id} className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center p-5">
                <Link to={`/result/${item.id}`} className="text-center">
                  <p className="mb-4 truncate text-sm font-medium">{item.displayName}</p>
                </Link>
                <ScoreGauge score={item.score} zone={item.zone} size={110} />
                <Badge className={`mt-3 border-0 ${zoneBg[item.zone]}`}>{t(zoneLabel[item.zone])}</Badge>

                <div className="mt-4 w-full space-y-2">
                  {(['risk', 'return', 'stability'] as const).map(k => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t(`result.${k}`)}</span>
                      <span className="font-medium">{item.subScores[k]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 w-full">
                  <p className="mb-1 text-xs font-medium">{t('compare.risks')}</p>
                  {item.redFlags.slice(0, 2).map((f, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {f.title}</p>
                  ))}
                  {item.redFlags.length === 0 && <p className="text-xs text-muted-foreground italic">—</p>}
                </div>

                <div className="mt-3 w-full">
                  <p className="mb-1 text-xs font-medium">{t('compare.upsides')}</p>
                  {item.reasons.slice(0, 2).map((r, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {r.title}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
