import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lightbulb, Workflow, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const { t } = useTranslation();

  const sections = [
    { icon: Lightbulb, title: t('about.what_title'), desc: t('about.what_desc') },
    { icon: Workflow, title: t('about.how_title'), desc: t('about.how_desc') },
    { icon: Shield, title: t('about.trust_title'), desc: t('about.disclaimer') },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] terminal-grid">
      <div className="mx-auto max-w-xl px-4 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/5 border border-primary/20 px-3 py-1 text-[10px] font-mono text-primary mb-3">
            <Globe className="h-3 w-3" /> About
          </div>
          <h1 className="text-2xl font-bold md:text-4xl">{t('about.title')}</h1>
        </motion.div>

        <div className="space-y-3">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="border border-border/50 bg-card/80 hover-lift">
                <CardContent className="p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-sm font-bold">{s.title}</h2>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
