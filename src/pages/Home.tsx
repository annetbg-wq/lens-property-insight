import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Users, Share2, Upload, MapPin, Zap } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  const { t } = useTranslation();

  const steps = [
    { icon: Upload, title: t('home.step1_title'), desc: t('home.step1_desc') },
    { icon: Zap, title: t('home.step2_title'), desc: t('home.step2_desc') },
    { icon: BarChart3, title: t('home.step3_title'), desc: t('home.step3_desc') },
  ];

  const features = [
    { icon: BarChart3, title: t('home.feature1_title'), desc: t('home.feature1_desc') },
    { icon: Users, title: t('home.feature2_title'), desc: t('home.feature2_desc') },
    { icon: Share2, title: t('home.feature3_title'), desc: t('home.feature3_desc') },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-24 md:py-36">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.h1
            className="whitespace-pre-line text-4xl font-bold tracking-tight md:text-6xl"
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6 }}
          >
            {t('home.hero_title')}
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.15 }}
          >
            {t('home.hero_subtitle')}
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Link to="/new">
              <Button size="lg" className="gap-2 rounded-full px-8 text-base">
                {t('home.cta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold md:text-3xl">{t('home.how_title')}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={i} className="text-center"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">0{i + 1}</div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold md:text-3xl">{t('home.features_title')}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Agents */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <MapPin className="mx-auto mb-4 h-8 w-8 text-primary" />
          <h2 className="text-2xl font-semibold md:text-3xl">{t('home.agents_title')}</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t('home.agents_desc')}</p>
          <Link to="/new" className="mt-8 inline-block">
            <Button variant="outline" size="lg" className="gap-2 rounded-full">
              {t('home.cta')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
