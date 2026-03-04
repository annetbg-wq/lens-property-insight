import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAllAssessmentsList, deleteAssessment } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Trash2, ArrowLeftRight, FileText } from 'lucide-react';
import type { AssessmentResult, Goal, Zone } from '@/types/assessment';

const zoneDot: Record<Zone, string> = { green: 'bg-emerald-500', yellow: 'bg-amber-500', red: 'bg-red-500' };

export default function Library() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getAllAssessmentsList());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Goal | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== 'all') list = list.filter(i => i.input.goal === filter);
    if (search.trim()) list = list.filter(i => i.displayName.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [items, search, filter]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.size < 3 && next.add(id);
      return next;
    });
  };

  const handleDelete = (id: string) => {
    deleteAssessment(id);
    setItems(getAllAssessmentsList());
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleCompare = () => {
    const ids = Array.from(selected).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  const goals: (Goal | 'all')[] = ['all', 'rent', 'buy', 'invest', 'business'];
  const goalLabels: Record<string, string> = { all: t('library.all'), rent: t('new.goal_rent'), buy: t('new.goal_buy'), invest: t('new.goal_invest'), business: t('new.goal_business') };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
        <h1 className="text-xl font-semibold">{t('library.empty')}</h1>
        <p className="mt-2 text-muted-foreground">{t('library.empty_desc')}</p>
        <Link to="/new"><Button className="mt-6 rounded-full">{t('nav.new')}</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('library.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('library.subtitle')}</p>
        </div>
        {selected.size >= 2 && (
          <Button size="sm" className="gap-1.5" onClick={handleCompare}>
            <ArrowLeftRight className="h-3.5 w-3.5" /> {t('library.compare_selected')}
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('library.search_placeholder')} className="pl-9" />
        </div>
        <div className="flex gap-1.5">
          {goals.map(g => (
            <Badge key={g} variant={filter === g ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilter(g)}>
              {goalLabels[g]}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && <p className="py-8 text-center text-muted-foreground">{t('library.no_results')}</p>}
        {filtered.map(item => (
          <Card key={item.id} className="border-0 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <Checkbox checked={selected.has(item.id)} onCheckedChange={() => toggle(item.id)} />
              <div className={`h-3 w-3 shrink-0 rounded-full ${zoneDot[item.zone]}`} />
              <Link to={`/result/${item.id}`} className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.displayName}</p>
                <p className="text-xs text-muted-foreground">{t('library.saved_on')} {new Date(item.createdAt).toLocaleDateString()} · Score: {item.score}</p>
              </Link>
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
