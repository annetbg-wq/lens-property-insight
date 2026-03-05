import { useParams } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAssessment, getAgentInfo } from '@/lib/storage';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Phone, Mail, Building2, CheckCircle2, AlertTriangle, Sparkles, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { AssessmentResult, AgentInfo, Zone } from '@/types/assessment';

const zoneStyles: Record<Zone, { bg: string; text: string }> = {
  green: { bg: 'bg-accent/10', text: 'text-accent' },
  yellow: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  red: { bg: 'bg-destructive/10', text: 'text-destructive' },
};

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

  if (!result) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Sparkles className="h-8 w-8 text-muted-foreground/40 animate-pulse" />
    </div>
  );

  const zone = zoneStyles[result.zone];
  const zoneLabel = result.zone === 'green' ? t('result.green') : result.zone === 'yellow' ? t('result.yellow') : t('result.red');

  return (
    <div className="min-h-screen mesh-gradient">
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest">{t('share.assessment_by')}</p>
          <h1 className="mt-3 text-2xl font-black md:text-3xl font-display">{result.displayName}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <ScoreGauge score={result.score} zone={result.zone} size={160} />
          <Badge className={`${zone.bg} ${zone.text} border-0 px-5 py-1.5 text-sm font-semibold`}>{zoneLabel}</Badge>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {(['risk', 'return', 'stability'] as const).map(k => (
            <Card key={k} className="border-0 shadow-[var(--shadow-card)]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-black font-display">{result.subScores[k]}</p>
                <p className="text-xs font-medium text-muted-foreground">{t(`result.${k}`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-10" />

        <p className="text-sm text-muted-foreground leading-relaxed">{result.agentContent.clientSummary}</p>

        {result.redFlags.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 font-bold font-display">
              <AlertTriangle className="h-4 w-4 text-destructive" />{t('result.red_flags')}
            </h3>
            {result.redFlags.slice(0, 2).map((f, i) => (
              <p key={i} className="mb-1.5 text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-destructive mt-1">•</span> {f.title}
              </p>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h3 className="mb-3 flex items-center gap-2 font-bold font-display">
            <CheckCircle2 className="h-4 w-4 text-primary" />{t('result.next_steps')}
          </h3>
          {result.nextSteps.slice(0, 3).map((s, i) => (
            <p key={i} className="mb-1.5 text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-1">•</span> {s.title}
            </p>
          ))}
        </div>

        {agent && (
          <>
            <Separator className="my-10" />
            <Card className="border-0 shadow-[var(--shadow-card)] overflow-hidden">
              <CardContent className="p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t('share.presented_by')}</p>
                <p className="text-lg font-bold">{agent.name}</p>
                {agent.company && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Building2 className="h-3.5 w-3.5" />{agent.company}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {agent.phone && (
                    <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                      <Phone className="h-3.5 w-3.5" />{agent.phone}
                    </Button>
                  )}
                  {agent.email && (
                    <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                      <Mail className="h-3.5 w-3.5" />{agent.email}
                    </Button>
                  )}
                </div>
                <Button className="mt-5 w-full rounded-full gap-2 h-12 shadow-lg shadow-primary/20" size="lg">
                  <CalendarDays className="h-4 w-4" /> {t('share.request_tour')}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-muted/30 p-5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground leading-relaxed">{t('about.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
