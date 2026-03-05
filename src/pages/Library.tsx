import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAllAssessmentsList, deleteAssessment } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Trash2, ArrowLeftRight, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AssessmentResult, Goal, Zone } from '@/types/assessment';

const zoneColors: Record<Zone, string> = {
  green: 'bg-accent',
  yellow: 'bg-amber-500',
  red: 'bg-destructive',
};

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
    navigate(`/compare?ids=${Array.from(selected).join(',')}`);
  };

  const goals: (Goal | 'all')[] = ['all', 'rent', 'buy', 'invest', 'business'];
  const goalLabels: Record<string, string> = { all: t('library.all'), rent: t('new.goal_rent'), buy: t('new.goal_buy'), invest: t('new.goal_invest'), business: t('new.goal_business') };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] mesh-gradient flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <FileText className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <h1 className="text-2xl font-bold font-display">{t('library.empty')}</h1>
          <p className="mt-2 text-muted-foreground max-w-sm">{t('library.empty_desc')}</p>
          <Link to="/new">
            <Button className="mt-6 rounded-full gap-1.5 shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4" /> {t('nav.new')}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] mesh-gradient">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black font-display">{t('library.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('library.subtitle')}</p>
          </div>
          {selected.size >= 2 && (
            <Button size="sm" className="gap-1.5 rounded-full" onClick={handleCompare}>
              <ArrowLeftRight className="h-3.5 w-3.5" /> {t('library.compare_selected')}
            </Button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('library.search_placeholder')} className="pl-9 h-11" />
          </div>
          <div className="flex gap-1.5">
            {goals.map(g => (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === g
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {goalLabels[g]}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-6 space-y-2">
          {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">{t('library.no_results')}</p>}
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="border-0 shadow-[var(--shadow-card)] hover-lift">
                <CardContent className="flex items-center gap-4 p-4">
                  <Checkbox checked={selected.has(item.id)} onCheckedChange={() => toggle(item.id)} />
                  <div className={`h-3 w-3 shrink-0 rounded-full ${zoneColors[item.zone]}`} />
                  <Link to={`/result/${item.id}`} className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('library.saved_on')} {new Date(item.createdAt).toLocaleDateString()} · Score: <span className="font-bold">{item.score}</span>
                    </p>
                  </Link>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
