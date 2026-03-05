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
import { Bookmark, Share2, ArrowLeftRight, AlertTriangle, ArrowRight, Shield, CheckCircle2, Info, Sparkles, Copy, Check } from 'lucide-react';
import type { AssessmentResult, Zone } from '@/types/assessment';

const zoneStyles: Record<Zone, { bg: string; text: string; border: string }> = {
  green: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20' },
  yellow: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  red: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

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
      <div className="text-center">
        <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
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
    <div className="min-h-screen mesh-gradient">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
        >
          <div>
            <h1 className="text-2xl font-black md:text-3xl font-display">{result.displayName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{new Date(result.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full glass px-4 py-2">
            <Label htmlFor="view-toggle" className="text-xs cursor-pointer font-medium">{t('result.client_view')}</Label>
            <Switch id="view-toggle" checked={agentView} onCheckedChange={setAgentView} />
            <Label htmlFor="view-toggle" className="text-xs cursor-pointer font-medium">{t('result.agent_view')}</Label>
          </div>
        </motion.div>

        {/* Score hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="mt-10 flex flex-col items-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-150" />
            <ScoreGauge score={result.score} zone={result.zone} />
          </div>
          <Badge className={`mt-4 ${zone.bg} ${zone.text} border ${zone.border} px-5 py-1.5 text-sm font-semibold`}>
            {zoneLabel}
          </Badge>
          <p className="mt-2 text-sm text-muted-foreground">{t('result.decision_score')}</p>
        </motion.div>

        {/* Sub-scores */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-3 gap-3"
        >
          {(['risk', 'return', 'stability'] as const).map(key => (
            <Card key={key} className="border-0 shadow-[var(--shadow-card)] overflow-hidden">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-black font-display">{result.subScores[key]}</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">{t(`result.${key}`)}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.25 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          <Button
            variant={saved ? 'secondary' : 'default'}
            size="sm" className="gap-1.5 rounded-full"
            onClick={handleSave} disabled={saved}
          >
            <Bookmark className="h-3.5 w-3.5" /> {saved ? t('result.saved') : t('result.save')}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={handleShare}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? t('share.link_copied') : t('result.share')}
          </Button>
          <Link to="/compare">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
              <ArrowLeftRight className="h-3.5 w-3.5" /> {t('result.compare')}
            </Button>
          </Link>
        </motion.div>

        <Separator className="my-10" />

        {/* Why */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="mb-5 text-xl font-bold font-display">{t('result.why')}</h2>
          <div className="space-y-4">
            {result.reasons.map((r, i) => (
              <Card key={i} className="border-0 shadow-[var(--shadow-card)] hover-lift">
                <CardContent className="p-6">
                  <h3 className="font-bold text-base">{r.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                  {r.evidence.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('result.evidence')}</p>
                      {r.evidence.map((e, j) => (
                        <div key={j} className="rounded-xl bg-muted/40 p-3.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold">{e.title}</p>
                            {e.isExample && <Badge variant="secondary" className="text-[10px] shrink-0 rounded-full">{t('result.example_badge')}</Badge>}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{e.description}</p>
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
          <motion.section className="mt-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold font-display">
              <AlertTriangle className="h-5 w-5 text-destructive" /> {t('result.red_flags')}
            </h2>
            <div className="space-y-3">
              {result.redFlags.map((f, i) => (
                <Card key={i} className="border-0 border-l-4 border-l-destructive/40 shadow-[var(--shadow-card)]">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold">{f.title}</h3>
                      <Badge variant={f.severity === 'high' ? 'destructive' : 'secondary'} className="text-[10px] rounded-full">{f.severity}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Next Steps */}
        <motion.section className="mt-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold font-display">
            <ArrowRight className="h-5 w-5 text-primary" /> {t('result.next_steps')}
          </h2>
          <div className="space-y-3">
            {result.nextSteps.map((s, i) => (
              <Card key={i} className="border-0 shadow-[var(--shadow-card)]">
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{s.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Confidence */}
        <div className="mt-10 flex items-center gap-3 rounded-2xl glass p-5">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm"><span className="font-bold">{t('result.confidence')}:</span> <span className="text-muted-foreground">{confLabel}</span></p>
        </div>

        {/* Agent View Extras */}
        {agentView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 space-y-4">
            <Separator />
            <div className="flex items-center gap-2 mt-6 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold text-primary uppercase tracking-wider">Agent Tools</p>
            </div>
            <Card className="border border-primary/20 shadow-[var(--shadow-card)]">
              <CardHeader className="pb-2"><CardTitle className="text-base font-bold">{t('result.client_summary')}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{result.agentContent.clientSummary}</p></CardContent>
            </Card>
            <Card className="border-0 shadow-[var(--shadow-card)]">
              <CardHeader className="pb-2"><CardTitle className="text-base font-bold">{t('result.objection_killer')}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{result.agentContent.objectionKiller}</p></CardContent>
            </Card>
            <Card className="border-0 shadow-[var(--shadow-card)]">
              <CardHeader className="pb-2"><CardTitle className="text-base font-bold">{t('result.seller_questions')}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {result.agentContent.questionsForSeller.map((q, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-muted/30 p-5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground leading-relaxed">{t('about.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
