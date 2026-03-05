import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAssessment, saveAssessment } from '@/lib/storage';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, Share2, ArrowLeftRight, AlertTriangle, ArrowRight, Shield, CheckCircle2, Info, Activity, Copy, Check } from 'lucide-react';
import type { AssessmentResult, Zone } from '@/types/assessment';

const zoneStyles: Record<Zone, { bg: string; text: string; border: string; glow: string }> = {
  green: { bg: 'bg-primary/10', text: 'score-green', border: 'border-score-green', glow: 'glow-green' },
  yellow: { bg: 'bg-accent/10', text: 'score-amber', border: 'border-score-amber', glow: 'glow-amber' },
  red: { bg: 'bg-destructive/10', text: 'score-red', border: 'border-score-red', glow: 'glow-red' },
};

const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [agentView, setAgentView] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const r = getAssessment(id);
    if (r) { setResult(r); setSaved(true); }
  }, [id]);

  if (!result) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Activity className="h-6 w-6 text-muted-foreground/30 animate-pulse" />
    </div>
  );

  const handleSave = () => { saveAssessment(result); setSaved(true); };
  const handleShare = () => {
    const url = `${window.location.origin}/share/${result.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const zone = zoneStyles[result.zone];
  const confLabel = result.confidence === 'high' ? t('result.high_conf') : result.confidence === 'medium' ? t('result.med_conf') : t('result.low_conf');
  const zoneLabel = result.zone === 'green' ? t('result.green') : result.zone === 'yellow' ? t('result.yellow') : t('result.red');

  return (
    <div className="min-h-screen terminal-grid">
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-14">
        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        >
          <div>
            <h1 className="text-xl font-bold md:text-2xl">{result.displayName}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground font-mono">{new Date(result.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg glass px-3 py-1.5">
            <Label htmlFor="view-toggle" className="text-[11px] cursor-pointer font-medium text-muted-foreground">{t('result.client_view')}</Label>
            <Switch id="view-toggle" checked={agentView} onCheckedChange={setAgentView} />
            <Label htmlFor="view-toggle" className="text-[11px] cursor-pointer font-medium text-muted-foreground">{t('result.agent_view')}</Label>
          </div>
        </motion.div>

        {/* Score hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="mt-8 flex flex-col items-center"
        >
          <ScoreGauge score={result.score} zone={result.zone} size={160} />
          <Badge className={`mt-3 ${zone.bg} ${zone.text} border ${zone.border} px-4 py-1 text-xs font-semibold font-mono`}>
            {zoneLabel}
          </Badge>
          <p className="mt-1.5 text-xs text-muted-foreground">{t('result.decision_score')}</p>
        </motion.div>

        {/* Sub-scores */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-3 gap-2"
        >
          {(['risk', 'return', 'stability'] as const).map(key => (
            <Card key={key} className="border border-border/50 bg-card/80">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold font-mono">{result.subScores[key]}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{t(`result.${key}`)}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.25 }}
          className="mt-5 flex flex-wrap gap-1.5"
        >
          <Button
            variant={saved ? 'secondary' : 'default'}
            size="sm" className="gap-1.5 rounded-lg text-xs h-7"
            onClick={handleSave} disabled={saved}
          >
            <Bookmark className="h-3 w-3" /> {saved ? t('result.saved') : t('result.save')}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-xs h-7 border-border/50" onClick={handleShare}>
            {copied ? <Check className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
            {copied ? t('share.link_copied') : t('result.share')}
          </Button>
          <Link to="/compare">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-xs h-7 border-border/50">
              <ArrowLeftRight className="h-3 w-3" /> {t('result.compare')}
            </Button>
          </Link>
        </motion.div>

        <Separator className="my-8 bg-border/30" />

        {/* Why */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="mb-4 text-base font-bold">{t('result.why')}</h2>
          <div className="space-y-3">
            {result.reasons.map((r, i) => (
              <Card key={i} className="border border-border/50 bg-card/80 hover-lift">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm">{r.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                  {r.evidence.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">{t('result.evidence')}</p>
                      {r.evidence.map((e, j) => (
                        <div key={j} className="rounded-md bg-secondary/30 p-2.5 border border-border/30">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold">{e.title}</p>
                            {e.isExample && <Badge variant="secondary" className="text-[9px] shrink-0 rounded-md h-4 px-1.5">{t('result.example_badge')}</Badge>}
                          </div>
                          <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed font-mono">{e.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Red Flags */}
        {result.redFlags.length > 0 && (
          <motion.section className="mt-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-4 w-4 text-destructive" /> {t('result.red_flags')}
            </h2>
            <div className="space-y-2">
              {result.redFlags.map((f, i) => (
                <Card key={i} className="border border-border/50 bg-card/80 border-l-2 border-l-destructive/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm">{f.title}</h3>
                      <Badge variant={f.severity === 'high' ? 'destructive' : 'secondary'} className="text-[9px] rounded-md h-4 px-1.5">{f.severity}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Next Steps */}
        <motion.section className="mt-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
            <ArrowRight className="h-4 w-4 text-primary" /> {t('result.next_steps')}
          </h2>
          <div className="space-y-2">
            {result.nextSteps.map((s, i) => (
              <Card key={i} className="border border-border/50 bg-card/80">
                <CardContent className="flex gap-3 p-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{s.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Confidence */}
        <div className="mt-8 flex items-center gap-2.5 rounded-lg glass p-3.5">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs"><span className="font-semibold">{t('result.confidence')}:</span> <span className="text-muted-foreground font-mono">{confLabel}</span></p>
        </div>

        {/* Agent View Extras */}
        {agentView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-3">
            <Separator className="bg-border/30" />
            <div className="flex items-center gap-2 mt-5 mb-3">
              <Activity className="h-3.5 w-3.5 text-accent" />
              <p className="text-[11px] font-semibold text-accent uppercase tracking-wider font-mono">Agent Tools</p>
            </div>
            <Card className="border border-accent/20 bg-card/80">
              <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-sm font-bold">{t('result.client_summary')}</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4"><p className="text-xs text-muted-foreground leading-relaxed">{result.agentContent.clientSummary}</p></CardContent>
            </Card>
            <Card className="border border-border/50 bg-card/80">
              <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-sm font-bold">{t('result.objection_killer')}</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4"><p className="text-xs text-muted-foreground leading-relaxed">{result.agentContent.objectionKiller}</p></CardContent>
            </Card>
            <Card className="border border-border/50 bg-card/80">
              <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-sm font-bold">{t('result.seller_questions')}</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <ul className="space-y-2">
                  {result.agentContent.questionsForSeller.map((q, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-muted-foreground">
                      <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-md bg-accent/10 text-[9px] font-bold text-accent font-mono">{i + 1}</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-2.5 rounded-lg bg-secondary/30 border border-border/30 p-3.5">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">{t('about.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
