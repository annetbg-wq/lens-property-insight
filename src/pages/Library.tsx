import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { getAllAssessmentsList, deleteAssessment } from '@/lib/storage';
import { MapBackground } from '@/components/MapBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Search, Trash2, ArrowLeftRight, BookOpen } from 'lucide-react';
import type { Goal } from '@/types/assessment';

const goalColors: Record<Goal, string> = {
  rent: 'bg-primary/10 text-primary',
  buy: 'bg-accent/10 text-accent',
  invest: 'bg-primary/10 text-primary',
  business: 'bg-accent/10 text-accent',
};

export default function Library() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [rev, forceUpdate] = useState(0);

  const all = useMemo(() => getAllAssessmentsList(), [rev]);

  const filtered = useMemo(() => {
    let items = all;
    if (goalFilter !== 'all') items = items.filter(i => i.input.goal === goalFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => i.displayName.toLowerCase().includes(q));
    }
    return items;
  }, [all, search, goalFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = (id: string) => {
    deleteAssessment(id);
    forceUpdate(n => n + 1);
  };

  const goals = [
    { key: 'all', label: t('library.all') },
    { key: 'rent', label: t('new.goal_rent') },
    { key: 'buy', label: t('new.goal_buy') },
    { key: 'invest', label: t('new.goal_invest') },
    { key: 'business', label: t('new.goal_business') },
  ];

  if (all.length === 0) {
    return (
      <MapBackground className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg glass border border-border/30">
            <BookOpen className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h1 className="text-lg font-bold">{t('library.empty')}</h1>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-xs mx-auto">{t('library.empty_desc')}</p>
          <Link to="/new"><Button className="mt-5 rounded-lg gap-2 h-9 text-xs font-bold bg-primary text-primary-foreground">{t('nav.new')}</Button></Link>
        </motion.div>
      </MapBackground>
    );
  }

  return (
    <MapBackground className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono text-primary uppercase tracking-wider">Database</span>
          </div>
          <h1 className="text-xl font-bold">{t('library.title')}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('library.subtitle')}</p>
        </motion.div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('library.search_placeholder')} className="pl-9 h-9 text-sm bg-secondary/20 border-border/30" />
          </div>
          <div className="flex gap-1">
            {goals.map(g => (
              <button key={g.key} onClick={() => setGoalFilter(g.key)} className={`rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all ${goalFilter === g.key ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground border border-transparent'}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {selectedIds.size >= 2 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <Link to={`/compare?ids=${Array.from(selectedIds).join(',')}`}>
              <Button size="sm" className="gap-1.5 rounded-lg text-xs h-8 bg-primary text-primary-foreground">
                <ArrowLeftRight className="h-3 w-3" /> {t('library.compare_selected')} ({selectedIds.size})
              </Button>
            </Link>
          </motion.div>
        )}

        <div className="mt-6 space-y-2">
          {filtered.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">{t('library.no_results')}</p>}
          {filtered.map((item, i) => {
            const selected = selectedIds.has(item.id);
            const scoreColor = item.zone === 'green' ? 'score-green' : item.zone === 'yellow' ? 'score-amber' : 'score-red';
            const borderColor = item.zone === 'green' ? 'border-primary/15' : item.zone === 'yellow' ? 'border-accent/15' : 'border-destructive/15';
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`glass rounded-lg border ${borderColor} p-4 hover-lift transition-all ${selected ? 'ring-1 ring-primary/30' : ''}`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleSelect(item.id)} className={`h-4 w-4 shrink-0 rounded border transition-all ${selected ? 'bg-primary border-primary' : 'border-border/50'}`} />
                  <Link to={`/result/${item.id}`} className="flex-1 min-w-0 hover:text-primary transition-colors">
                    <p className="text-sm font-semibold truncate">{item.displayName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={`text-[9px] h-4 px-1.5 border-0 rounded font-mono ${goalColors[item.input.goal]}`}>{item.input.goal}</Badge>
                      <span className="text-[9px] text-muted-foreground font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                  <div className="text-right">
                    <span className={`text-xl font-bold font-mono ${scoreColor}`}>{item.score}</span>
                    <p className="text-[8px] text-muted-foreground font-mono">/100</p>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MapBackground>
  );
}
