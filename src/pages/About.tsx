import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lightbulb, Workflow, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const { t } = useTranslation();

  const sections = [
    { icon: Lightbulb, title: t('about.what_title'), desc: t('about.what_desc'), gradient: 'from-primary/10 to-primary/5' },
    { icon: Workflow, title: t('about.how_title'), desc: t('about.how_desc'), gradient: 'from-accent/10 to-accent/5' },
    { icon: Shield, title: t('about.trust_title'), desc: t('about.disclaimer'), gradient: 'from-amber-500/10 to-amber-500/5' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] mesh-gradient">
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/20 px-4 py-1.5 text-sm text-primary mb-4">
            <Globe className="h-3.5 w-3.5" /> About
          </div>
          <h1 className="text-3xl font-black md:text-5xl font-display">{t('about.title')}</h1>
        </motion.div>

        <div className="space-y-5">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-[var(--shadow-card)] hover-lift">
                <CardContent className="p-7">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient}`}>
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold font-display">{s.title}</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
