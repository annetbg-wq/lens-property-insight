import { useParams } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAssessment, getAgentInfo } from '@/lib/storage';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Phone, Mail, Building2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AssessmentResult, AgentInfo, Zone } from '@/types/assessment';

const zoneBg: Record<Zone, string> = { green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', yellow: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300', red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' };

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [agent, setAgent] = useState<AgentInfo | null>(null);

  useEffect(() => {
    if (!id) return;
    const r = getAssessment(id);
    if (r) setResult(r);
    const a = getAgentInfo();
    if (a.showOnShare && a.name) setAgent(a);
  }, [id]);

  if (!result) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">{t('common.loading')}</div>;

  const zoneLabel = result.zone === 'green' ? t('result.green') : result.zone === 'yellow' ? t('result.yellow') : t('result.red');

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-medium text-primary">{t('share.assessment_by')}</p>
        <h1 className="mt-2 text-xl font-bold md:text-2xl">{result.displayName}</h1>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <ScoreGauge score={result.score} zone={result.zone} size={140} />
        <Badge className={`${zoneBg[result.zone]} border-0 px-4 py-1`}>{zoneLabel}</Badge>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {(['risk', 'return', 'stability'] as const).map(k => (
          <Card key={k} className="border-0 shadow-sm"><CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{result.subScores[k]}</p>
            <p className="text-xs text-muted-foreground">{t(`result.${k}`)}</p>
          </CardContent></Card>
        ))}
      </div>

      <Separator className="my-8" />

      <p className="text-sm text-muted-foreground">{result.agentContent.clientSummary}</p>

      {result.redFlags.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-destructive" />{t('result.red_flags')}</h3>
          {result.redFlags.slice(0, 2).map((f, i) => (
            <p key={i} className="mb-1 text-sm text-muted-foreground">• {f.title}</p>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4 text-primary" />{t('result.next_steps')}</h3>
        {result.nextSteps.slice(0, 3).map((s, i) => (
          <p key={i} className="mb-1 text-sm text-muted-foreground">• {s.title}</p>
        ))}
      </div>

      {agent && (
        <>
          <Separator className="my-8" />
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-muted-foreground mb-2">{t('share.presented_by')}</p>
              <p className="font-semibold">{agent.name}</p>
              {agent.company && <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1"><Building2 className="h-3.5 w-3.5" />{agent.company}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {agent.phone && <Button variant="outline" size="sm" className="gap-1.5"><Phone className="h-3.5 w-3.5" />{agent.phone}</Button>}
                {agent.email && <Button variant="outline" size="sm" className="gap-1.5"><Mail className="h-3.5 w-3.5" />{agent.email}</Button>}
              </div>
              <Button className="mt-4 w-full rounded-full" size="lg">{t('share.request_tour')}</Button>
            </CardContent>
          </Card>
        </>
      )}

      <div className="mt-8 flex items-start gap-2 rounded-xl bg-muted/30 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{t('about.disclaimer')}</p>
      </div>
    </div>
  );
}
