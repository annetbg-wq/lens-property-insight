import { useParams } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAssessment, getAgentInfo } from '@/lib/storage';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Phone, Mail, Building2, CheckCircle2, AlertTriangle, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { AssessmentResult, AgentInfo, Zone } from '@/types/assessment';

const zoneStyles: Record<Zone, { text: string }> = {
  green: { text: 'score-green' },
  yellow: { text: 'score-amber' },
  red: { text: 'score-red' },
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
      <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>
  );

  const zone = zoneStyles[result.zone];
  const zoneLabel = result.zone === 'green' ? t('result.green') : result.zone === 'yellow' ? t('result.yellow') : t('result.red');

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 ambient-glow-soft" />
      <div className="relative z-10 mx-auto max-w-xl px-5 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">{t('share.assessment_by')}</p>
          <h1 className="text-2xl font-extrabold md:text-3xl">{result.displayName}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-10 rounded-2xl bg-card border border-border/40 p-8 flex flex-col items-center shadow-premium"
        >
          <ScoreGauge score={result.score} zone={result.zone} size={160} />
          <Badge className={`mt-4 bg-secondary ${zone.text} border-0 px-5 py-1.5 text-xs font-semibold rounded-full`}>{zoneLabel}</Badge>

          <div className="mt-6 grid grid-cols-3 gap-3 w-full">
            {(['risk', 'return', 'stability'] as const).map(k => (
              <div key={k} className="rounded-xl bg-secondary/50 py-3.5 text-center">
                <p className="text-xl font-bold">{result.subScores[k]}</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">{t(`result.${k}`)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator className="my-10 bg-border/20" />

        <p className="text-sm text-muted-foreground leading-relaxed">{result.agentContent.clientSummary}</p>

        {result.redFlags.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-4 w-4 text-destructive" />{t('result.red_flags')}
            </h3>
            {result.redFlags.slice(0, 2).map((f, i) => (
              <p key={i} className="mb-2 text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-destructive mt-1 shrink-0">•</span> {f.title}
              </p>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold">
            <CheckCircle2 className="h-4 w-4 text-primary" />{t('result.next_steps')}
          </h3>
          {result.nextSteps.slice(0, 3).map((s, i) => (
            <p key={i} className="mb-2 text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span> {s.title}
            </p>
          ))}
        </div>

        {agent && (
          <>
            <Separator className="my-10 bg-border/20" />
            <div className="rounded-2xl bg-card border border-border/40 p-6 shadow-premium">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{t('share.presented_by')}</p>
              <p className="text-base font-bold">{agent.name}</p>
              {agent.company && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Building2 className="h-3.5 w-3.5" />{agent.company}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {agent.phone && (
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs h-9">
                    <Phone className="h-3.5 w-3.5" />{agent.phone}
                  </Button>
                )}
                {agent.email && (
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs h-9">
                    <Mail className="h-3.5 w-3.5" />{agent.email}
                  </Button>
                )}
              </div>
              <Button className="mt-5 w-full rounded-2xl gap-2 h-12 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" size="lg">
                <CalendarDays className="h-4 w-4" /> {t('share.request_tour')}
              </Button>
            </div>
          </>
        )}

        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-secondary/30 border border-border/30 p-5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground leading-relaxed">{t('about.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
