import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Users, Share2, Upload, Zap, Shield, TrendingUp, Eye, Sparkles, ChevronRight } from 'lucide-react';
import { getDemoResult } from '@/lib/demoCases';
import { ScoreGauge } from '@/components/ScoreGauge';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  const { t } = useTranslation();

  const steps = [
    { icon: Upload, title: t('home.step1_title'), desc: t('home.step1_desc'), num: '01' },
    { icon: Zap, title: t('home.step2_title'), desc: t('home.step2_desc'), num: '02' },
    { icon: BarChart3, title: t('home.step3_title'), desc: t('home.step3_desc'), num: '03' },
  ];

  const features = [
    { icon: BarChart3, title: t('home.feature1_title'), desc: t('home.feature1_desc'), gradient: 'from-primary/10 to-primary/5' },
    { icon: Eye, title: t('home.feature2_title'), desc: t('home.feature2_desc'), gradient: 'from-accent/10 to-accent/5' },
    { icon: Share2, title: t('home.feature3_title'), desc: t('home.feature3_desc'), gradient: 'from-primary/10 to-accent/5' },
  ];

  const demoCards = [
    { key: 'apartment', emoji: '🏢' },
    { key: 'house', emoji: '🏡' },
    { key: 'commercial', emoji: '🏬' },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-20 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px] animate-float" />
        <div className="absolute bottom-20 left-1/4 h-60 w-60 rounded-full bg-accent/10 blur-[100px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:py-32">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Property Intelligence
            </motion.div>

            <motion.h1
              className="text-5xl font-black tracking-tight leading-[1.1] md:text-7xl lg:text-8xl"
              variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }}
            >
              {t('home.hero_title').split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'gradient-text' : ''}>
                  {line}{i === 0 && <br />}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
              variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7, delay: 0.15 }}
            >
              {t('home.hero_subtitle')}
            </motion.p>

            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link to="/new">
                <Button size="lg" className="h-14 gap-2.5 rounded-full px-8 text-base shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90">
                  {t('home.cta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="lg" className="h-14 gap-2 rounded-full px-8 text-base text-muted-foreground">
                  {t('nav.about')} <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Demo score cards preview */}
          <motion.div
            className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            {demoCards.map(({ key, emoji }) => {
              const result = getDemoResult(key);
              if (!result) return null;
              return (
                <motion.div key={key} variants={fadeUp}>
                  <Card className="border-0 shadow-[var(--shadow-card)] hover-lift overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{emoji}</span>
                          <div>
                            <p className="text-sm font-semibold truncate max-w-[160px]">{result.displayName.split(',')[0]}</p>
                            <p className="text-xs text-muted-foreground capitalize">{result.input.goal}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-2xl font-black font-display ${
                            result.zone === 'green' ? 'text-accent' : result.zone === 'yellow' ? 'text-amber-500' : 'text-destructive'
                          }`}>{result.score}</span>
                          <span className="text-[10px] text-muted-foreground">/100</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {(['risk', 'return', 'stability'] as const).map(k => (
                          <div key={k} className="flex-1 rounded-lg bg-muted/50 p-2 text-center">
                            <p className="text-xs font-bold">{result.subScores[k]}</p>
                            <p className="text-[10px] text-muted-foreground">{t(`result.${k}`)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">{t('home.how_title')}</span>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">{t('home.how_title')}</h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group relative"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 transition-transform group-hover:scale-110">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-6xl font-black text-muted/50 dark:text-muted/30 absolute -top-2 right-0 font-display">{s.num}</span>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Features</span>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">{t('home.features_title')}</h2>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              >
                <Card className="h-full border-0 shadow-[var(--shadow-card)] hover-lift overflow-hidden">
                  <CardContent className="p-7">
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient}`}>
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">{f.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Agents */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">For Professionals</span>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">{t('home.agents_title')}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-lg">{t('home.agents_desc')}</p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: TrendingUp, text: 'Instant client-ready reports' },
                  { icon: Share2, text: 'Branded shareable links' },
                  { icon: Shield, text: 'Professional credibility boost' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                      <item.icon className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/new" className="mt-8 inline-block">
                <Button size="lg" className="gap-2 rounded-full px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25">
                  {t('home.cta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 blur-xl" />
                <Card className="relative border-0 shadow-[var(--shadow-card)] overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold">350 West 42nd Street</p>
                        <p className="text-xs text-muted-foreground">New York, NY</p>
                      </div>
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center justify-center py-4">
                      <ScoreGauge score={78} zone="green" size={120} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        { label: 'Risk', value: '24', color: 'text-accent' },
                        { label: 'Return', value: '82', color: 'text-primary' },
                        { label: 'Stability', value: '71', color: 'text-amber-500' },
                      ].map(s => (
                        <div key={s.label} className="rounded-xl bg-muted/50 p-3 text-center">
                          <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                          <p className="text-[10px] text-muted-foreground">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-16"
          >
            <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
            <div className="absolute inset-0 mesh-gradient opacity-40" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white md:text-5xl">Ready to Decide Smarter?</h2>
              <p className="mt-4 text-lg text-white/70">Start your first property assessment — free, instant, no signup.</p>
              <Link to="/new">
                <Button size="lg" className="mt-8 h-14 gap-2.5 rounded-full px-10 text-base bg-white text-foreground hover:bg-white/90 shadow-xl">
                  {t('home.cta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
