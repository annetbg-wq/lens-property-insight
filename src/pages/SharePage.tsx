import { useParams } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAssessment, getAgentInfo } from '@/lib/storage';
import { ScoreGauge } from '@/components/ScoreGauge';
import { MapBackground } from '@/components/MapBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Phone, Mail, Building2, CheckCircle2, AlertTriangle, Activity, CalendarDays, Map } from 'lucide-react';
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
      <Activity className="h-6 w-6 text-muted-foreground/20 animate-pulse" />
    </div>
  );

  const zone = zoneStyles[result.zone];
  const zoneLabel = result.zone === 'green' ? t('result.green') : result.zone === 'yellow' ? t('result.yellow') : t('result.red');

  return (
    <MapBackground className="min-h-screen">
      <div className="mx-auto max-w-xl px-4 py-10 md:py-16">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Map className="h-3.5 w-3.5 text-primary" />
            <p className="text-[10px] font-mono text-primary uppercase tracking-wider">{t('share.assessment_by')}</p>
          </div>
          <h1 className="mt-2 text-xl font-bold md:text-2xl">{result.displayName}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 glass rounded-lg viewfinder viewfinder-bottom p-6 flex flex-col items-center"
        >
          <ScoreGauge score={result.score} zone={result.zone} size={150} />
          <Badge className={`mt-3 bg-secondary/50 ${zone.text} border-0 px-4 py-1 text-xs font-mono`}>{zoneLabel}</Badge>

          <div className="mt-5 grid grid-cols-3 gap-2 w-full">
            {(['risk', 'return', 'stability'] as const).map(k => (
              <div key={k} className="rounded-md bg-secondary/30 border border-border/20 p-3 text-center">
                <p className="text-lg font-bold font-mono">{result.subScores[k]}</p>
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{t(`result.${k}`)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator className="my-8 bg-border/15" />

        <p className="text-xs text-muted-foreground leading-relaxed">{result.agentContent.clientSummary}</p>

        {result.redFlags.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />{t('result.red_flags')}
            </h3>
            {result.redFlags.slice(0, 2).map((f, i) => (
              <p key={i} className="mb-1 text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-destructive mt-0.5">•</span> {f.title}
              </p>
            ))}
          </div>
        )}

        <div className="mt-6">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />{t('result.next_steps')}
          </h3>
          {result.nextSteps.slice(0, 3).map((s, i) => (
            <p key={i} className="mb-1 text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span> {s.title}
            </p>
          ))}
        </div>

        {agent && (
          <>
            <Separator className="my-8 bg-border/15" />
            <div className="glass rounded-lg p-5 border border-border/30">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] font-mono mb-2">{t('share.presented_by')}</p>
              <p className="text-sm font-bold">{agent.name}</p>
              {agent.company && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Building2 className="h-3 w-3" />{agent.company}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {agent.phone && (
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-xs h-8 border-border/30">
                    <Phone className="h-3 w-3" />{agent.phone}
                  </Button>
                )}
                {agent.email && (
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-xs h-8 border-border/30">
                    <Mail className="h-3 w-3" />{agent.email}
                  </Button>
                )}
              </div>
              <Button className="mt-4 w-full rounded-lg gap-2 h-11 bg-primary text-primary-foreground glow-green font-bold" size="lg">
                <CalendarDays className="h-4 w-4" /> {t('share.request_tour')}
              </Button>
            </div>
          </>
        )}

        <div className="mt-8 flex items-start gap-2.5 rounded-lg bg-secondary/15 border border-border/15 p-4">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">{t('about.disclaimer')}</p>
        </div>
      </div>
    </MapBackground>
  );
}
