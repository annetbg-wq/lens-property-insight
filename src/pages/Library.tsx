import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAllAssessmentsList, deleteAssessment } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Trash2, ArrowLeftRight, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AssessmentResult, Goal, Zone } from '@/types/assessment';

const zoneColors: Record<Zone, string> = {
  green: 'bg-score-green',
  yellow: 'bg-score-amber',
  red: 'bg-score-red',
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
      <div className="min-h-[calc(100vh-3.5rem)] terminal-grid flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary border border-border/50">
            <FileText className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <h1 className="text-lg font-bold">{t('library.empty')}</h1>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-xs">{t('library.empty_desc')}</p>
          <Link to="/new">
            <Button className="mt-5 rounded-lg gap-1.5 bg-primary text-primary-foreground text-xs h-8">
              <Activity className="h-3 w-3" /> {t('nav.new')}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] terminal-grid">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{t('library.title')}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">{t('library.subtitle')}</p>
          </div>
          {selected.size >= 2 && (
            <Button size="sm" className="gap-1.5 rounded-lg text-xs h-7 bg-primary text-primary-foreground" onClick={handleCompare}>
              <ArrowLeftRight className="h-3 w-3" /> {t('library.compare_selected')}
            </Button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('library.search_placeholder')} className="pl-8 h-8 text-xs bg-secondary/30 border-border/50" />
          </div>
          <div className="flex gap-1">
            {goals.map(g => (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                  filter === g
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-secondary/30 text-muted-foreground border border-transparent hover:border-border/50'
                }`}
              >
                {goalLabels[g]}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-5 space-y-1.5">
          {filtered.length === 0 && <p className="py-10 text-center text-xs text-muted-foreground">{t('library.no_results')}</p>}
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Card className="border border-border/50 bg-card/80 hover-lift">
                <CardContent className="flex items-center gap-3 p-3">
                  <Checkbox checked={selected.has(item.id)} onCheckedChange={() => toggle(item.id)} />
                  <div className={`h-2 w-2 shrink-0 rounded-full ${zoneColors[item.zone]}`} />
                  <Link to={`/result/${item.id}`} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.displayName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {new Date(item.createdAt).toLocaleDateString()} · <span className="font-semibold">{item.score}</span>/100
                    </p>
                  </Link>
                  <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
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
