import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, AlertTriangle } from 'lucide-react';
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
    <div className="space-y-2">
      {reasons.map((reason, i) => {
        const isOpen = expanded === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-lg border border-border/40 bg-card/60 overflow-hidden hover-lift"
          >
            {/* Header - always visible */}
            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full flex items-start gap-3 p-4 text-left group"
            >
              <div className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                <FileText className="h-3 w-3 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{reason.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">{reason.description}</p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {reason.evidence.length > 0 && (
                  <Badge variant="secondary" className="text-[9px] h-5 px-2 font-mono rounded-md bg-secondary/80">
                    {reason.evidence.length} {t('result.evidence').toLowerCase()}
                  </Badge>
                )}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </motion.div>
              </div>
            </button>

            {/* Evidence cards - expandable */}
            <AnimatePresence>
              {isOpen && reason.evidence.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border/20">
                    <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.15em] font-mono flex items-center gap-1.5">
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
                        className="rounded-md bg-secondary/30 border border-border/20 p-3 viewfinder"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold">{ev.title}</p>
                          {ev.isExample && (
                            <Badge variant="outline" className="text-[8px] shrink-0 rounded h-4 px-1.5 border-accent/30 text-accent font-mono">
                              {t('result.example_badge')}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed font-mono">{ev.description}</p>
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
