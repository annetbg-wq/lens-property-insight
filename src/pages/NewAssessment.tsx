import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyzingAnimation } from '@/components/AnalyzingAnimation';
import { saveAssessment } from '@/lib/storage';
import { getDemoInput } from '@/lib/demoCases';
import { useGeolocation } from '@/hooks/useGeolocation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AssessmentInput, AssessmentResult, Goal, InputMethod } from '@/types/assessment';
import { MapPin, Camera, Link as LinkIcon, PenLine, Crosshair, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewAssessment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const geo = useGeolocation();
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [pendingInput, setPendingInput] = useState<AssessmentInput | null>(null);

  const [method, setMethod] = useState<InputMethod>('address');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [goal, setGoal] = useState<Goal>('buy');
  const [geoDetected, setGeoDetected] = useState(false);

  useEffect(() => {
    if (!geoDetected && navigator.geolocation) {
      geo.detect();
      setGeoDetected(true);
    }
  }, []);

  useEffect(() => {
    if (geo.latitude !== null && geo.longitude !== null) {
      if (!lat && !lng) {
        setLat(geo.latitude.toFixed(6));
        setLng(geo.longitude.toFixed(6));
      }
    }
  }, [geo.latitude, geo.longitude]);

  const canAnalyze = (): boolean => {
    if (method === 'address') return address.trim().length > 3;
    if (method === 'coordinates') return lat.trim() !== '' && lng.trim() !== '';
    if (method === 'url') return url.startsWith('http');
    if (method === 'photo') return true;
    return false;
  };

  const buildInput = (): AssessmentInput => ({
    method,
    address: method === 'address' ? address : undefined,
    latitude: method === 'coordinates' ? parseFloat(lat) : (geo.latitude ?? undefined),
    longitude: method === 'coordinates' ? parseFloat(lng) : (geo.longitude ?? undefined),
    url: method === 'url' ? url : undefined,
    photos: method === 'photo' ? ['uploaded_photo.jpg'] : undefined,
    goal,
    notes: notes || undefined,
  });

  const handleAnalyze = () => {
    const input = buildInput();
    setPendingInput(input);
    setAnalyzing(true);
  };

  const handleComplete = useCallback(async () => {
    if (!pendingInput) return;

    try {
      const { data, error } = await supabase.functions.invoke('assess-property', {
        body: { input: pendingInput },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Assessment failed');

      const assessment = data.assessment;
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

      const result: AssessmentResult = {
        id,
        input: pendingInput,
        score: assessment.score,
        zone: assessment.zone,
        subScores: assessment.subScores,
        reasons: assessment.reasons,
        redFlags: assessment.redFlags || [],
        nextSteps: assessment.nextSteps || [],
        confidence: assessment.confidence || 'medium',
        agentContent: assessment.agentContent,
        createdAt: new Date().toISOString(),
        displayName: assessment.displayName || pendingInput.address || 'Property Assessment',
      };

      saveAssessment(result);
      setAnalyzing(false);
      navigate(`/result/${result.id}`);
    } catch (err: unknown) {
      console.error('AI Assessment failed, using fallback:', err);
      const { generateAssessment } = await import('@/lib/mockGenerator');
      const result = generateAssessment(pendingInput);
      saveAssessment(result);
      setAnalyzing(false);
      toast({
        title: t('new.fallback_title') || 'Using backup analysis',
        description: t('new.fallback_desc') || 'AI service temporarily unavailable. Result generated locally.',
        variant: 'destructive',
      });
      navigate(`/result/${result.id}`);
    }
  }, [pendingInput, navigate, toast, t]);

  const loadDemo = (key: string) => {
    const input = getDemoInput(key);
    if (!input) return;
    setPendingInput(input);
    setAnalyzing(true);
  };

  if (analyzing) {
    return <AnalyzingAnimation onComplete={handleComplete} />;
  }

  const demos = [
    { key: 'apartment', label: t('new.demo_apartment'), emoji: '🏢' },
    { key: 'house', label: t('new.demo_house'), emoji: '🏡' },
    { key: 'land', label: t('new.demo_land'), emoji: '🌍' },
    { key: 'commercial', label: t('new.demo_commercial'), emoji: '🏬' },
    { key: 'view', label: t('new.demo_view'), emoji: '🪟' },
    { key: 'listing', label: t('new.demo_listing'), emoji: '📋' },
  ];

  const tabItems = [
    { value: 'address', icon: PenLine, label: t('new.tab_address') },
    { value: 'photo', icon: Camera, label: t('new.tab_photo') },
    { value: 'coordinates', icon: MapPin, label: t('new.tab_coords') },
    { value: 'url', icon: LinkIcon, label: t('new.tab_url') },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] relative">
      <div className="absolute inset-0 pattern-dots opacity-50" />
      <div className="absolute inset-0 ambient-glow-soft" />

      <div className="relative z-10 mx-auto max-w-xl px-5 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2.5 mb-4 rounded-full bg-primary/5 border border-primary/15 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">AI-Powered Analysis</span>
          </div>
          <h1 className="text-3xl font-extrabold md:text-4xl">{t('new.title')}</h1>
          <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">{t('new.subtitle')}</p>
        </motion.div>

        {/* GPS indicator */}
        {geo.latitude !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-card border border-primary/15 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary">GPS Active</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {geo.latitude?.toFixed(4)}°N, {geo.longitude?.toFixed(4)}°E
                </p>
              </div>
              <Crosshair className="h-4 w-4 text-primary/40" />
            </div>
          </motion.div>
        )}

        {/* Main form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-2xl bg-card border border-border/50 shadow-premium overflow-hidden">
            <Tabs value={method} onValueChange={v => setMethod(v as InputMethod)}>
              <div className="border-b border-border/30 px-5 pt-5">
                <TabsList className="grid w-full grid-cols-4 bg-secondary/50 p-1 h-11 rounded-xl">
                  {tabItems.map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="gap-2 text-xs font-medium h-9 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-6 space-y-5">
                <TabsContent value="address" className="mt-0 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">{t('new.tab_address')}</Label>
                    <Input
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder={t('new.address_placeholder')}
                      className="mt-2 h-12 text-sm bg-secondary/30 border-border/40 rounded-xl"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="photo" className="mt-0 space-y-4">
                  <div className="flex h-36 items-center justify-center rounded-2xl border-2 border-dashed border-border/40 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Camera className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground">{t('new.photo_desc')}</p>
                      <p className="text-xs text-muted-foreground/50 mt-1">JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="coordinates" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-semibold font-mono">LAT</Label>
                      <Input value={lat} onChange={e => setLat(e.target.value)} placeholder={t('new.lat_placeholder')} className="mt-2 h-12 font-mono text-sm bg-secondary/30 border-border/40 rounded-xl" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold font-mono">LNG</Label>
                      <Input value={lng} onChange={e => setLng(e.target.value)} placeholder={t('new.lng_placeholder')} className="mt-2 h-12 font-mono text-sm bg-secondary/30 border-border/40 rounded-xl" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl text-xs h-9"
                    onClick={() => geo.detect()}
                    disabled={geo.loading}
                  >
                    {geo.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crosshair className="h-3.5 w-3.5" />}
                    {geo.loading ? t('new.detecting') : t('new.use_location')}
                  </Button>
                </TabsContent>

                <TabsContent value="url" className="mt-0 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">{t('new.tab_url')}</Label>
                    <Input value={url} onChange={e => setUrl(e.target.value)} placeholder={t('new.url_placeholder')} className="mt-2 h-12 text-sm font-mono bg-secondary/30 border-border/40 rounded-xl" />
                  </div>
                </TabsContent>

                {/* Goal */}
                <div>
                  <Label className="text-sm font-semibold">{t('new.goal_label')}</Label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {(['rent', 'buy', 'invest', 'business'] as Goal[]).map(g => (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                          goal === g
                            ? 'border-primary/30 bg-primary/10 text-primary shadow-sm'
                            : 'border-border/40 hover:border-primary/15 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t(`new.goal_${g}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label className="text-sm font-semibold">{t('new.notes_label')}</Label>
                  <Textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={t('new.notes_placeholder')}
                    className="mt-2 resize-none text-sm bg-secondary/30 border-border/40 rounded-xl"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze()}
                  className="w-full gap-3 rounded-2xl h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all"
                  size="lg"
                >
                  {t('new.analyze')} <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </Tabs>
          </div>
        </motion.div>

        {/* Demo cases */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <p className="text-sm font-medium text-muted-foreground mb-4">{t('new.load_demo')}</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {demos.map(d => (
              <button
                key={d.key}
                onClick={() => loadDemo(d.key)}
                className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border/40 p-4 transition-all hover:border-primary/20 hover:bg-primary/5 hover-lift"
              >
                <span className="text-xl">{d.emoji}</span>
                <span className="text-[10px] font-medium text-muted-foreground">{d.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
