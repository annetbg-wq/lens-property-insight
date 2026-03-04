import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAssessment, saveAssessment, deleteAssessment } from '@/lib/storage';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, Share2, ArrowLeftRight, AlertTriangle, ArrowRight, Shield, CheckCircle2, Info } from 'lucide-react';
import type { AssessmentResult, Zone } from '@/types/assessment';

const zoneBg: Record<Zone, string> = { green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', yellow: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300', red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' };

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [agentView, setAgentView] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    const r = getAssessment(id);
    if (r) { setResult(r); setSaved(true); }
  }, [id]);

  if (!result) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">{t('common.loading')}</div>;

  const handleSave = () => { saveAssessment(result); setSaved(true); };
  const handleShare = () => {
    const url = `${window.location.origin}/share/${result.id}`;
    navigator.clipboard.writeText(url);
  };

  const confLabel = result.confidence === 'high' ? t('result.high_conf') : result.confidence === 'medium' ? t('result.med_conf') : t('result.low_conf');
  const zoneLabel = result.zone === 'green' ? t('result.green') : result.zone === 'yellow' ? t('result.yellow') : t('result.red');

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Top bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">{result.displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{new Date(result.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
            <Label htmlFor="view-toggle" className="text-xs cursor-pointer">{t('result.client_view')}</Label>
            <Switch id="view-toggle" checked={agentView} onCheckedChange={setAgentView} />
            <Label htmlFor="view-toggle" className="text-xs cursor-pointer">{t('result.agent_view')}</Label>
          </div>
        </div>
      </div>

      {/* Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-4">
        <ScoreGauge score={result.score} zone={result.zone} />
        <Badge className={`${zoneBg[result.zone]} border-0 px-4 py-1 text-sm font-medium`}>{zoneLabel}</Badge>
        <p className="text-sm text-muted-foreground">{t('result.decision_score')}</p>
      </motion.div>

      {/* Sub-scores */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {(['risk', 'return', 'stability'] as const).map(key => (
          <Card key={key} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{result.subScores[key]}</p>
              <p className="text-xs text-muted-foreground">{t(`result.${key}`)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant={saved ? 'secondary' : 'default'} size="sm" className="gap-1.5" onClick={handleSave} disabled={saved}>
          <Bookmark className="h-3.5 w-3.5" /> {saved ? t('result.saved') : t('result.save')}
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShare}>
          <Share2 className="h-3.5 w-3.5" /> {t('result.share')}
        </Button>
        <Link to="/compare">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeftRight className="h-3.5 w-3.5" /> {t('result.compare')}
          </Button>
        </Link>
      </div>

      <Separator className="my-8" />

      {/* Why */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">{t('result.why')}</h2>
        <div className="space-y-4">
          {result.reasons.map((r, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="font-medium">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                {r.evidence.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{t('result.evidence')}</p>
                    {r.evidence.map((e, j) => (
                      <div key={j} className="rounded-lg bg-muted/50 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{e.title}</p>
                          {e.isExample && <Badge variant="secondary" className="text-[10px] shrink-0">{t('result.example_badge')}</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{e.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Red Flags */}
      {result.redFlags.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-destructive" /> {t('result.red_flags')}
          </h2>
          <div className="space-y-3">
            {result.redFlags.map((f, i) => (
              <Card key={i} className="border-0 border-l-4 border-l-destructive/50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium">{f.title}</h3>
                    <Badge variant={f.severity === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">{f.severity}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Next Steps */}
      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ArrowRight className="h-5 w-5 text-primary" /> {t('result.next_steps')}
        </h2>
        <div className="space-y-3">
          {result.nextSteps.map((s, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="flex gap-3 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Confidence */}
      <div className="mt-8 flex items-center gap-2 rounded-xl bg-muted/50 p-4">
        <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground"><span className="font-medium">{t('result.confidence')}:</span> {confLabel}</p>
      </div>

      {/* Agent View Extras */}
      {agentView && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-4">
          <Separator />
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base">{t('result.client_summary')}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{result.agentContent.clientSummary}</p></CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base">{t('result.objection_killer')}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{result.agentContent.objectionKiller}</p></CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base">{t('result.seller_questions')}</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.agentContent.questionsForSeller.map((q, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="shrink-0 font-medium text-foreground">{i + 1}.</span> {q}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 flex items-start gap-2 rounded-xl bg-muted/30 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{t('about.disclaimer')}</p>
      </div>
    </div>
  );
}
