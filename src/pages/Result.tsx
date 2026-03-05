import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAssessment, saveAssessment } from '@/lib/storage';
import { FlashVerdictCard } from '@/components/FlashVerdictCard';
import { EvidenceSection } from '@/components/EvidenceSection';
import { PropertyMap } from '@/components/PropertyMap';
import { MapBackground } from '@/components/MapBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, Share2, ArrowLeftRight, AlertTriangle, ArrowRight, Shield, CheckCircle2, Info, Activity, Check, Map } from 'lucide-react';
import type { AssessmentResult, Zone } from '@/types/assessment';

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

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
      <Activity className="h-6 w-6 text-muted-foreground/20 animate-pulse" />
    </div>
  );

  const handleSave = () => { saveAssessment(result); setSaved(true); };
  const handleShare = () => {
    const url = `${window.location.origin}/share/${result.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confLabel = result.confidence === 'high' ? t('result.high_conf') : result.confidence === 'medium' ? t('result.med_conf') : t('result.low_conf');

  return (
    <MapBackground className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-14">
        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-mono text-primary uppercase tracking-wider">Property Assessment</p>
            </div>
            <h1 className="text-xl font-bold md:text-2xl">{result.displayName}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground font-mono">{new Date(result.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg glass px-3 py-2">
            <Label htmlFor="view-toggle" className="text-[10px] cursor-pointer font-mono text-muted-foreground uppercase tracking-wider">{t('result.client_view')}</Label>
            <Switch id="view-toggle" checked={agentView} onCheckedChange={setAgentView} />
            <Label htmlFor="view-toggle" className="text-[10px] cursor-pointer font-mono text-muted-foreground uppercase tracking-wider">{t('result.agent_view')}</Label>
          </div>
        </motion.div>

        {/* Flash-Verdict Card */}
        <div className="mt-8">
          <FlashVerdictCard result={result} />
        </div>

        {/* Actions */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
          className="mt-5 flex flex-wrap gap-1.5"
        >
          <Button
            variant={saved ? 'secondary' : 'default'}
            size="sm" className="gap-1.5 rounded-lg text-xs h-8"
            onClick={handleSave} disabled={saved}
          >
            <Bookmark className="h-3 w-3" /> {saved ? t('result.saved') : t('result.save')}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-xs h-8 border-border/40" onClick={handleShare}>
            {copied ? <Check className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
            {copied ? t('share.link_copied') : t('result.share')}
          </Button>
          <Link to="/compare">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-xs h-8 border-border/40">
              <ArrowLeftRight className="h-3 w-3" /> {t('result.compare')}
            </Button>
          </Link>
        </motion.div>

        <Separator className="my-8 bg-border/20" />

        {/* Why — Evidence Section with Progressive Disclosure */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold">{t('result.why')}</h2>
            <span className="text-[9px] font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
              {result.reasons.length} factors
            </span>
          </div>
          <EvidenceSection reasons={result.reasons} />
        </motion.section>

        {/* Red Flags */}
        {result.redFlags.length > 0 && (
          <motion.section className="mt-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-4 w-4 text-destructive" /> {t('result.red_flags')}
            </h2>
            <div className="space-y-2">
              {result.redFlags.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-lg border border-border/40 bg-card/60 border-l-2 border-l-destructive/50 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{f.title}</h3>
                    <Badge
                      variant={f.severity === 'high' ? 'destructive' : 'secondary'}
                      className="text-[8px] rounded h-4 px-1.5 font-mono uppercase"
                    >
                      {f.severity}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Next Steps — Interactive Checklist */}
        <motion.section className="mt-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
            <ArrowRight className="h-4 w-4 text-primary" /> {t('result.next_steps')}
          </h2>
          <div className="space-y-2">
            {result.nextSteps.map((s, i) => (
              <NextStepItem key={i} step={s} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Confidence */}
        <div className="mt-8 flex items-center gap-2.5 rounded-lg glass p-4">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-semibold">{t('result.confidence')}</p>
            <p className="text-[11px] text-muted-foreground font-mono">{confLabel}</p>
          </div>
        </div>

        {/* Agent View Extras */}
        {agentView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-3">
            <Separator className="bg-border/20" />
            <div className="flex items-center gap-2 mt-5 mb-3">
              <Activity className="h-3.5 w-3.5 text-accent" />
              <p className="text-[10px] font-bold text-accent uppercase tracking-[0.15em] font-mono">Agent Intelligence</p>
            </div>
            <Card className="border border-accent/15 bg-card/60">
              <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-sm font-bold">{t('result.client_summary')}</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4"><p className="text-xs text-muted-foreground leading-relaxed">{result.agentContent.clientSummary}</p></CardContent>
            </Card>
            <Card className="border border-border/40 bg-card/60">
              <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-sm font-bold">{t('result.objection_killer')}</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4"><p className="text-xs text-muted-foreground leading-relaxed">{result.agentContent.objectionKiller}</p></CardContent>
            </Card>
            <Card className="border border-border/40 bg-card/60">
              <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-sm font-bold">{t('result.seller_questions')}</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <ul className="space-y-2">
                  {result.agentContent.questionsForSeller.map((q, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-muted-foreground">
                      <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded bg-accent/10 text-[9px] font-bold text-accent font-mono">{i + 1}</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-2.5 rounded-lg bg-secondary/20 border border-border/20 p-4">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">{t('about.disclaimer')}</p>
        </div>
      </div>
    </MapBackground>
  );
}

// Interactive Next Step item
function NextStepItem({ step, index }: { step: { title: string; description: string }; index: number }) {
  const [checked, setChecked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-lg border border-border/40 bg-card/60 p-4 cursor-pointer transition-all ${checked ? 'opacity-60' : 'hover-lift'}`}
      onClick={() => setChecked(!checked)}
    >
      <div className="flex gap-3">
        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all mt-0.5 ${
          checked ? 'bg-primary border-primary' : 'border-border/50 bg-secondary/30'
        }`}>
          {checked && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
        </div>
        <div>
          <h3 className={`font-semibold text-sm transition-all ${checked ? 'line-through text-muted-foreground' : ''}`}>{step.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{step.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
