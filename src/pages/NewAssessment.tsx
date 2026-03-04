import { useState, useCallback } from 'react';
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
import type { AssessmentInput, Goal, InputMethod } from '@/types/assessment';
import { MapPin, Camera, Link as LinkIcon, PenLine, Sparkles } from 'lucide-react';

export default function NewAssessment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [pendingInput, setPendingInput] = useState<AssessmentInput | null>(null);

  const [method, setMethod] = useState<InputMethod>('address');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [goal, setGoal] = useState<Goal>('buy');

  const canAnalyze = (): boolean => {
    if (method === 'address') return address.trim().length > 3;
    if (method === 'coordinates') return lat.trim() !== '' && lng.trim() !== '';
    if (method === 'url') return url.startsWith('http');
    if (method === 'photo') return true; // simplified for MVP
    return false;
  };

  const buildInput = (): AssessmentInput => ({
    method,
    address: method === 'address' ? address : undefined,
    latitude: method === 'coordinates' ? parseFloat(lat) : undefined,
    longitude: method === 'coordinates' ? parseFloat(lng) : undefined,
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
    { key: 'apartment', label: t('new.demo_apartment') },
    { key: 'house', label: t('new.demo_house') },
    { key: 'land', label: t('new.demo_land') },
    { key: 'commercial', label: t('new.demo_commercial') },
    { key: 'view', label: t('new.demo_view') },
    { key: 'listing', label: t('new.demo_listing') },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold md:text-3xl">{t('new.title')}</h1>
      <p className="mt-2 text-muted-foreground">{t('new.subtitle')}</p>

      <Card className="mt-8 border-0 shadow-sm">
        <CardContent className="p-6">
          <Tabs value={method} onValueChange={v => setMethod(v as InputMethod)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="address" className="gap-1.5 text-xs"><PenLine className="h-3.5 w-3.5" />{t('new.tab_address')}</TabsTrigger>
              <TabsTrigger value="photo" className="gap-1.5 text-xs"><Camera className="h-3.5 w-3.5" />{t('new.tab_photo')}</TabsTrigger>
              <TabsTrigger value="coordinates" className="gap-1.5 text-xs"><MapPin className="h-3.5 w-3.5" />{t('new.tab_coords')}</TabsTrigger>
              <TabsTrigger value="url" className="gap-1.5 text-xs"><LinkIcon className="h-3.5 w-3.5" />{t('new.tab_url')}</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              <TabsContent value="address" className="mt-0 space-y-4">
                <div>
                  <Label>{t('new.tab_address')}</Label>
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('new.address_placeholder')} className="mt-1.5" />
                </div>
              </TabsContent>
              <TabsContent value="photo" className="mt-0 space-y-4">
                <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                  <div className="text-center text-sm text-muted-foreground">
                    <Camera className="mx-auto mb-2 h-6 w-6" />
                    {t('new.photo_desc')}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="coordinates" className="mt-0 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t('new.tab_coords')}</Label>
                    <Input value={lat} onChange={e => setLat(e.target.value)} placeholder={t('new.lat_placeholder')} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>&nbsp;</Label>
                    <Input value={lng} onChange={e => setLng(e.target.value)} placeholder={t('new.lng_placeholder')} className="mt-1.5" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="url" className="mt-0 space-y-4">
                <div>
                  <Label>{t('new.tab_url')}</Label>
                  <Input value={url} onChange={e => setUrl(e.target.value)} placeholder={t('new.url_placeholder')} className="mt-1.5" />
                </div>
              </TabsContent>

              {/* Goal */}
              <div>
                <Label>{t('new.goal_label')}</Label>
                <Select value={goal} onValueChange={v => setGoal(v as Goal)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">{t('new.goal_rent')}</SelectItem>
                    <SelectItem value="buy">{t('new.goal_buy')}</SelectItem>
                    <SelectItem value="invest">{t('new.goal_invest')}</SelectItem>
                    <SelectItem value="business">{t('new.goal_business')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <Label>{t('new.notes_label')}</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('new.notes_placeholder')} className="mt-1.5" rows={3} />
              </div>

              <Button onClick={handleAnalyze} disabled={!canAnalyze()} className="w-full gap-2 rounded-full" size="lg">
                <Sparkles className="h-4 w-4" /> {t('new.analyze')}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Demo cases */}
      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-muted-foreground">{t('new.load_demo')}</p>
        <div className="flex flex-wrap gap-2">
          {demos.map(d => (
            <Badge key={d.key} variant="outline" className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-primary hover:text-primary-foreground" onClick={() => loadDemo(d.key)}>
              {d.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
