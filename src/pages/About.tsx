import { useTranslation } from '@/lib/i18n';
import { MapBackground } from '@/components/MapBackground';
import { Shield, Activity, Layers, Radar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const { t } = useTranslation();

  const sections = [
    { icon: Activity, title: t('about.what_title'), text: t('about.what_desc') },
    { icon: Radar, title: t('about.how_title'), text: t('about.how_desc') },
    { icon: Shield, title: t('about.trust_title'), text: t('about.disclaimer') },
  ];

  return (
    <MapBackground className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Radar className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono text-primary uppercase tracking-wider">System Info</span>
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">{t('about.title')}</h1>
        </motion.div>

        <div className="mt-10 space-y-4">
          {sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass rounded-lg border border-border/30 p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-base font-bold">{s.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="mt-8 glass rounded-lg border border-border/30 p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <Layers className="h-4 w-4 text-accent" />
            </div>
            <h2 className="text-base font-bold">Intelligence Layers</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Cadastral', desc: 'Границы участков, размеры, сервитуты' },
              { label: 'Zoning & FAR', desc: 'Что можно строить, ограничения высоты' },
              { label: 'Environment', desc: 'Шум, качество воздуха, зоны подтопления' },
              { label: 'Infrastructure', desc: 'Транспорт, школы, строящиеся объекты' },
            ].map((layer, i) => (
              <div key={i} className="rounded-md bg-secondary/20 border border-border/20 p-3">
                <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-0.5">{layer.label}</p>
                <p className="text-xs text-muted-foreground">{layer.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </MapBackground>
  );
}
