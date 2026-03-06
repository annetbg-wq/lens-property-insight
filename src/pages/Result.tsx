import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { useViewMode } from '@/contexts/ViewModeContext';
import { getAssessment, saveAssessment } from '@/lib/storage';
import { FlashVerdictCard } from '@/components/FlashVerdictCard';
import { EvidenceSection } from '@/components/EvidenceSection';
import { PropertyMap } from '@/components/PropertyMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, Share2, ArrowLeftRight, AlertTriangle, ArrowRight, Shield, CheckCircle2, Info, Activity, Check } from 'lucide-react';
import type { AssessmentResult } from '@/types/assessment';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { viewMode } = useViewMode();
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const r = getAssessment(id);
    if (r) { setResult(r); setSaved(true); }
  }, [id]);

  if (!result) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
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
  const agentView = viewMode === 'agent';

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 ambient-glow-soft" />
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-10 md:py-16">
        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        >
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">Property Assessment</p>
            <h1 className="text-2xl font-extrabold md:text-3xl">{result.displayName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{new Date(result.createdAt).toLocaleDateString()}</p>
          </div>
        </motion.div>

        {/* Flash-Verdict Card */}
        <div className="mt-10">
          <FlashVerdictCard result={result} />
        </div>

        {/* Property Map */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="mt-6">
          <PropertyMap
            latitude={result.input.latitude}
            longitude={result.input.longitude}
            address={result.input.address}
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          <Button
            variant={saved ? 'secondary' : 'default'}
            size="sm"
            className="gap-2 rounded-xl text-xs h-10 px-5"
            onClick={handleSave}
            disabled={saved}
          >
            <Bookmark className="h-3.5 w-3.5" /> {saved ? t('result.saved') : t('result.save')}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs h-10 px-5" onClick={handleShare}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? t('share.link_copied') : t('result.share')}
          </Button>
          <Link to="/compare">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs h-10 px-5">
              <ArrowLeftRight className="h-3.5 w-3.5" /> {t('result.compare')}
            </Button>
          </Link>
        </motion.div>

        <Separator className="my-10 bg-border/30" />

        {/* Evidence */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-extrabold">{t('result.why')}</h2>
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {result.reasons.length} factors
            </span>
          </div>
          <EvidenceSection reasons={result.reasons} />
        </motion.section>

        {/* Red Flags */}
        {result.redFlags.length > 0 && (
          <motion.section className="mt-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold">
              <AlertTriangle className="h-5 w-5 text-destructive" /> {t('result.red_flags')}
            </h2>
            <div className="space-y-3">
              {result.redFlags.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl bg-card border border-border/40 border-l-4 border-l-destructive/40 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-sm">{f.title}</h3>
                    <Badge
                      variant={f.severity === 'high' ? 'destructive' : 'secondary'}
                      className="text-[10px] rounded-full h-5 px-2.5 font-semibold uppercase shrink-0"
                    >
                      {f.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Next Steps */}
        <motion.section className="mt-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold">
            <ArrowRight className="h-5 w-5 text-primary" /> {t('result.next_steps')}
          </h2>
          <div className="space-y-3">
            {result.nextSteps.map((s, i) => (
              <NextStepItem key={i} step={s} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Confidence */}
        <div className="mt-10 flex items-center gap-3 rounded-2xl bg-card border border-border/40 p-5">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-bold">{t('result.confidence')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{confLabel}</p>
          </div>
        </div>

        {/* Agent View Extras */}
        {agentView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 space-y-4">
            <Separator className="bg-border/30" />
            <div className="flex items-center gap-2 mt-6 mb-4">
              <Activity className="h-4 w-4 text-accent" />
              <p className="text-xs font-bold text-accent uppercase tracking-[0.15em]">Agent Intelligence</p>
            </div>
            <Card className="border border-accent/15 bg-card rounded-2xl">
              <CardHeader className="pb-2 pt-5 px-6"><CardTitle className="text-base font-bold">{t('result.client_summary')}</CardTitle></CardHeader>
              <CardContent className="px-6 pb-5"><p className="text-sm text-muted-foreground leading-relaxed">{result.agentContent.clientSummary}</p></CardContent>
            </Card>
            <Card className="border border-border/40 bg-card rounded-2xl">
              <CardHeader className="pb-2 pt-5 px-6"><CardTitle className="text-base font-bold">{t('result.objection_killer')}</CardTitle></CardHeader>
              <CardContent className="px-6 pb-5"><p className="text-sm text-muted-foreground leading-relaxed">{result.agentContent.objectionKiller}</p></CardContent>
            </Card>
            <Card className="border border-border/40 bg-card rounded-2xl">
              <CardHeader className="pb-2 pt-5 px-6"><CardTitle className="text-base font-bold">{t('result.seller_questions')}</CardTitle></CardHeader>
              <CardContent className="px-6 pb-5">
                <ul className="space-y-3">
                  {result.agentContent.questionsForSeller.map((q, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-lg bg-accent/10 text-[10px] font-bold text-accent">{i + 1}</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-secondary/30 border border-border/30 p-5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground leading-relaxed">{t('about.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}

function NextStepItem({ step, index }: { step: { title: string; description: string }; index: number }) {
  const [checked, setChecked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl bg-card border border-border/40 p-5 cursor-pointer transition-all ${checked ? 'opacity-50' : 'hover-lift'}`}
      onClick={() => setChecked(!checked)}
    >
      <div className="flex gap-4">
        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all mt-0.5 ${
          checked ? 'bg-primary border-primary' : 'border-border/60'
        }`}>
          {checked && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
        </div>
        <div className="min-w-0">
          <h3 className={`font-bold text-sm transition-all ${checked ? 'line-through text-muted-foreground' : ''}`}>{step.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
