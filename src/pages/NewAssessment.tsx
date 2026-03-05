import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyzingAnimation } from '@/components/AnalyzingAnimation';
import { generateAssessment } from '@/lib/mockGenerator';
import { saveAssessment } from '@/lib/storage';
import { getDemoInput } from '@/lib/demoCases';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { AssessmentInput, Goal, InputMethod } from '@/types/assessment';
import { MapPin, Camera, Link as LinkIcon, PenLine, Activity, Crosshair, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewAssessment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const geo = useGeolocation();
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

  const handleComplete = useCallback(() => {
    if (!pendingInput) return;
    const result = generateAssessment(pendingInput);
    saveAssessment(result);
    setAnalyzing(false);
    navigate(`/result/${result.id}`);
  }, [pendingInput, navigate]);

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
    <div className="min-h-[calc(100vh-3.5rem)] terminal-grid">
      <div className="mx-auto max-w-xl px-4 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold md:text-3xl">{t('new.title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('new.subtitle')}</p>
        </motion.div>

        {/* GPS banner */}
        {geo.latitude !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mb-5"
          >
            <div className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
              <Crosshair className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary">📍 {t('new.location_detected')}</p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {geo.latitude?.toFixed(4)}, {geo.longitude?.toFixed(4)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="border border-border/50 bg-card/80 overflow-hidden">
            <CardContent className="p-0">
              <Tabs value={method} onValueChange={v => setMethod(v as InputMethod)}>
                <div className="border-b border-border/50 px-4 pt-4">
                  <TabsList className="grid w-full grid-cols-4 bg-secondary/30 p-0.5 h-8">
                    {tabItems.map(tab => (
                      <TabsTrigger key={tab.value} value={tab.value} className="gap-1 text-[11px] h-7 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
                        <tab.icon className="h-3 w-3" /><span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="p-4 space-y-4">
                  <TabsContent value="address" className="mt-0 space-y-3">
                    <div>
                      <Label className="text-xs font-semibold">{t('new.tab_address')}</Label>
                      <Input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('new.address_placeholder')} className="mt-1.5 h-10 text-sm bg-secondary/30 border-border/50" />
                    </div>
                  </TabsContent>

                  <TabsContent value="photo" className="mt-0 space-y-3">
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border/50 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                      <div className="text-center">
                        <Camera className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                        <p className="text-xs font-medium text-muted-foreground">{t('new.photo_desc')}</p>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">JPG, PNG до 10MB</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="coordinates" className="mt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs font-semibold font-mono">LAT</Label>
                        <Input value={lat} onChange={e => setLat(e.target.value)} placeholder={t('new.lat_placeholder')} className="mt-1.5 h-10 font-mono text-sm bg-secondary/30 border-border/50" />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold font-mono">LNG</Label>
                        <Input value={lng} onChange={e => setLng(e.target.value)} placeholder={t('new.lng_placeholder')} className="mt-1.5 h-10 font-mono text-sm bg-secondary/30 border-border/50" />
                      </div>
                    </div>
                    <Button
                      variant="outline" size="sm"
                      className="gap-1.5 rounded-lg text-xs h-7 border-border/50"
                      onClick={() => geo.detect()}
                      disabled={geo.loading}
                    >
                      {geo.loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Crosshair className="h-3 w-3" />}
                      {geo.loading ? t('new.detecting') : t('new.use_location')}
                    </Button>
                  </TabsContent>

                  <TabsContent value="url" className="mt-0 space-y-3">
                    <div>
                      <Label className="text-xs font-semibold">{t('new.tab_url')}</Label>
                      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder={t('new.url_placeholder')} className="mt-1.5 h-10 text-sm font-mono bg-secondary/30 border-border/50" />
                    </div>
                  </TabsContent>

                  {/* Goal */}
                  <div>
                    <Label className="text-xs font-semibold">{t('new.goal_label')}</Label>
                    <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                      {(['rent', 'buy', 'invest', 'business'] as Goal[]).map(g => (
                        <button
                          key={g}
                          onClick={() => setGoal(g)}
                          className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                            goal === g
                              ? 'border-primary/40 bg-primary/10 text-primary'
                              : 'border-border/50 hover:border-primary/20 text-muted-foreground'
                          }`}
                        >
                          {t(`new.goal_${g}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label className="text-xs font-semibold">{t('new.notes_label')}</Label>
                    <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('new.notes_placeholder')} className="mt-1.5 resize-none text-sm bg-secondary/30 border-border/50" rows={2} />
                  </div>

                  <Button
                    onClick={handleAnalyze} disabled={!canAnalyze()}
                    className="w-full gap-2 rounded-lg h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-green"
                    size="lg"
                  >
                    <Activity className="h-3.5 w-3.5" /> {t('new.analyze')}
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo cases */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mt-8"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <Info className="h-3 w-3 text-muted-foreground" />
            <p className="text-[11px] font-medium text-muted-foreground">{t('new.load_demo')}</p>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {demos.map(d => (
              <button
                key={d.key}
                onClick={() => loadDemo(d.key)}
                className="flex flex-col items-center gap-1 rounded-lg border border-border/50 bg-card/50 p-2.5 transition-all hover:border-primary/20 hover:bg-primary/5"
              >
                <span className="text-base">{d.emoji}</span>
                <span className="text-[10px] font-medium text-muted-foreground">{d.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
