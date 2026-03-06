import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n';
import type { Reason } from '@/types/assessment';

interface EvidenceSectionProps {
  reasons: Reason[];
}

export function EvidenceSection({ reasons }: EvidenceSectionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {reasons.map((reason, i) => {
        const isOpen = expanded === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl bg-card border border-border/40 overflow-hidden hover-lift"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full flex items-start gap-4 p-5 text-left group"
            >
              <div className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold group-hover:text-primary transition-colors">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">{reason.description}</p>
              </div>
              <div className="shrink-0 flex items-center gap-2.5">
                {reason.evidence.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] h-6 px-2.5 font-medium rounded-full">
                    {reason.evidence.length} {t('result.evidence').toLowerCase()}
                  </Badge>
                )}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {isOpen && reason.evidence.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-2 space-y-2.5 border-t border-border/20">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <span className="h-px flex-1 bg-border/30" />
                      {t('result.evidence')}
                      <span className="h-px flex-1 bg-border/30" />
                    </p>
                    {reason.evidence.map((ev, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.08 }}
                        className="rounded-xl bg-secondary/40 border border-border/20 p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold">{ev.title}</p>
                          {ev.isExample && (
                            <Badge variant="outline" className="text-[9px] shrink-0 rounded-full h-5 px-2 border-accent/30 text-accent">
                              {t('result.example_badge')}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{ev.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
