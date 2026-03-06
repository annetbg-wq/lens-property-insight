import { useTranslation } from '@/lib/i18n';
import { Shield, Zap, Layers, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import cityImg from '@/assets/city-skyline.jpg';

export default function About() {
  const { t } = useTranslation();

  const sections = [
    { icon: Zap, title: t('about.what_title'), text: t('about.what_desc') },
    { icon: Eye, title: t('about.how_title'), text: t('about.how_desc') },
    { icon: Shield, title: t('about.trust_title'), text: t('about.disclaimer') },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={cityImg} alt="City" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-3xl px-5 md:px-8 pb-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">About</p>
              <h1 className="text-3xl font-extrabold md:text-4xl">{t('about.title')}</h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
        <div className="space-y-5">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-card border border-border/40 p-7"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold">{s.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 rounded-2xl bg-card border border-border/40 p-7"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Layers className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold">Intelligence Layers</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Cadastral', desc: 'Plot boundaries, dimensions, easements' },
              { label: 'Zoning & FAR', desc: 'Building permissions, height limits' },
              { label: 'Environment', desc: 'Noise, air quality, flood zones' },
              { label: 'Infrastructure', desc: 'Transport, schools, developments' },
            ].map((layer, i) => (
              <div key={i} className="rounded-xl bg-secondary/40 border border-border/30 p-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{layer.label}</p>
                <p className="text-sm text-muted-foreground">{layer.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
