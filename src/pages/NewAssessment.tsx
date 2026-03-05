import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AnalyzingAnimation } from '@/components/AnalyzingAnimation';
import { generateAssessment } from '@/lib/mockGenerator';
import { saveAssessment } from '@/lib/storage';
import { getDemoInput } from '@/lib/demoCases';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { AssessmentInput, Goal, InputMethod } from '@/types/assessment';
import { MapPin, Camera, Link as LinkIcon, PenLine, Sparkles, Crosshair, Loader2, Info } from 'lucide-react';
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

  // Auto-detect GPS on mount
  useEffect(() => {
    if (!geoDetected && navigator.geolocation) {
      geo.detect();
      setGeoDetected(true);
    }
  }, []);

  // Pre-fill coordinates when detected
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
    <div className="min-h-[calc(100vh-4rem)] mesh-gradient">
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-black md:text-4xl font-display">{t('new.title')}</h1>
          <p className="mt-3 text-muted-foreground text-lg">{t('new.subtitle')}</p>
        </motion.div>

        {/* Location detection banner */}
        {geo.latitude !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-accent/5 border border-accent/20 px-4 py-3">
              <Crosshair className="h-4 w-4 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-accent">📍 Location detected</p>
                <p className="text-xs text-muted-foreground">
                  {geo.latitude?.toFixed(4)}, {geo.longitude?.toFixed(4)} — auto-enriching results
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-[var(--shadow-card)] overflow-hidden">
            <CardContent className="p-0">
              <Tabs value={method} onValueChange={v => setMethod(v as InputMethod)}>
                <div className="border-b bg-muted/30 px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
                    {tabItems.map(tab => (
                      <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs data-[state=active]:shadow-sm">
                        <tab.icon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="p-6 space-y-5">
                  <TabsContent value="address" className="mt-0 space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">{t('new.tab_address')}</Label>
                      <Input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('new.address_placeholder')} className="mt-2 h-12 text-base" />
                    </div>
                  </TabsContent>

                  <TabsContent value="photo" className="mt-0 space-y-4">
                    <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div className="text-center">
                        <Camera className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
                        <p className="text-sm font-medium text-muted-foreground">{t('new.photo_desc')}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="coordinates" className="mt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-semibold">Latitude</Label>
                        <Input value={lat} onChange={e => setLat(e.target.value)} placeholder={t('new.lat_placeholder')} className="mt-2 h-12" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Longitude</Label>
                        <Input value={lng} onChange={e => setLng(e.target.value)} placeholder={t('new.lng_placeholder')} className="mt-2 h-12" />
                      </div>
                    </div>
                    <Button
                      variant="outline" size="sm"
                      className="gap-1.5 rounded-full"
                      onClick={() => geo.detect()}
                      disabled={geo.loading}
                    >
                      {geo.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crosshair className="h-3.5 w-3.5" />}
                      {geo.loading ? 'Detecting...' : 'Use My Location'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="url" className="mt-0 space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">{t('new.tab_url')}</Label>
                      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder={t('new.url_placeholder')} className="mt-2 h-12 text-base" />
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
                          className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                            goal === g
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/30 text-muted-foreground'
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
                    <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('new.notes_placeholder')} className="mt-2 resize-none" rows={3} />
                  </div>

                  <Button
                    onClick={handleAnalyze} disabled={!canAnalyze()}
                    className="w-full gap-2.5 rounded-full h-14 text-base shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4" /> {t('new.analyze')}
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">{t('new.load_demo')}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {demos.map(d => (
              <button
                key={d.key}
                onClick={() => loadDemo(d.key)}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5"
              >
                <span className="text-xl">{d.emoji}</span>
                <span className="text-[11px] font-medium text-muted-foreground">{d.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
