import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { useViewMode } from '@/contexts/ViewModeContext';
import { useGeoProperties } from '@/hooks/useGeoProperties';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, MapPin, DollarSign, Euro, Loader2, Share2, BarChart3, Eye, CheckCircle2, Zap, Shield, TrendingUp, ArrowUpRight } from 'lucide-react';
import { ScoreGauge } from '@/components/ScoreGauge';
import heroImg from '@/assets/hero-building.jpg';
import interiorImg from '@/assets/interior-living.jpg';
import cityImg from '@/assets/city-skyline.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function Home() {
  const { t } = useTranslation();
  const { isClient } = useViewMode();
  const { properties, regionName, loading } = useGeoProperties();

  const benefits = [
    { icon: Zap, title: t('home.benefit_instant'), desc: t('home.benefit_instant_desc') },
    { icon: Share2, title: t('home.benefit_share'), desc: t('home.benefit_share_desc') },
    { icon: BarChart3, title: t('home.benefit_compare'), desc: t('home.benefit_compare_desc') },
  ];

  const features = [
    { icon: Shield, title: t('home.feature1_title'), desc: t('home.feature1_desc') },
    { icon: TrendingUp, title: t('home.feature2_title'), desc: t('home.feature2_desc') },
    { icon: Eye, title: t('home.feature3_title'), desc: t('home.feature3_desc') },
  ];

  return (
    <div className="flex flex-col">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroImg} alt="Premium real estate" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm"
            >
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary tracking-wide">{t('home.status_badge')}</span>
            </motion.div>

            <motion.h1
              className="text-[3.2rem] font-extrabold tracking-tight leading-[1.05] md:text-[4.5rem] lg:text-[5.5rem]"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {t('home.hero_title').split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'gradient-text' : ''}>
                  {line}{i === 0 && <br />}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {t('home.hero_subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <Link to="/new">
                <Button size="lg" className="h-14 gap-3 rounded-2xl px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/30">
                  {t('home.cta')} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="lg" className="h-14 gap-2 rounded-2xl px-6 text-base text-muted-foreground hover:text-foreground">
                  {t('nav.about')} <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="mt-16 flex gap-10 md:gap-14"
            >
              {[
                { value: '30s', label: t('home.stat_speed') },
                { value: '0–100', label: t('home.stat_score') },
                { value: '24/7', label: t('home.stat_available') },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── NEARBY PROPERTIES ─── */}
      <section className="relative py-24 md:py-32 border-t border-border/30">
        <div className="absolute inset-0 ambient-glow-soft" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {loading ? t('home.detecting_location') : `${t('home.near_you')} · ${regionName}`}
            </span>
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {properties.map(({ result, priceUSD, priceEUR, dealType, emoji }, idx) => {
              const zoneClass = result.zone === 'green' ? 'border-primary/15 hover:border-primary/30' : result.zone === 'yellow' ? 'border-accent/15 hover:border-accent/30' : 'border-destructive/15 hover:border-destructive/30';
              const scoreColor = result.zone === 'green' ? 'score-green' : result.zone === 'yellow' ? 'score-amber' : 'score-red';
              return (
                <motion.div
                  key={result.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to="/new">
                    <div className={`group rounded-2xl bg-card border ${zoneClass} p-6 hover-lift cursor-pointer transition-all`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-2xl">{emoji}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{result.displayName.split(',')[0]}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{dealType}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className={`text-3xl font-bold ${scoreColor}`}>{result.score}</span>
                          <p className="text-[10px] text-muted-foreground font-mono">/100</p>
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="flex items-center gap-4 mb-4 py-2.5 px-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-semibold">
                            {priceUSD >= 10000 ? `${(priceUSD / 1000).toFixed(0)}K` : priceUSD.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-1.5">
                          <Euro className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-semibold">
                            {priceEUR >= 10000 ? `${(priceEUR / 1000).toFixed(0)}K` : priceEUR.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="space-y-2">
                        {result.reasons.slice(0, 2).map((r, i) => (
                          <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                              result.zone === 'green' ? 'bg-primary' : result.zone === 'yellow' ? 'bg-accent' : 'bg-destructive'
                            }`} />
                            <span className="line-clamp-1">{r.title}</span>
                          </p>
                        ))}
                      </div>

                      {/* Sub-scores */}
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        {(['risk', 'return', 'stability'] as const).map(k => (
                          <div key={k} className="rounded-xl bg-secondary/40 py-2 text-center">
                            <p className="text-sm font-bold">{result.subScores[k]}</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{t(`result.${k}`)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-end">
                        <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          {t('home.cta')} <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative py-24 md:py-32 border-t border-border/30">
        <div className="absolute inset-0 pattern-dots" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-premium-lg"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={interiorImg} alt="Modern interior" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              {/* Floating score card */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card/90 backdrop-blur-lg border border-border/50 p-4 shadow-premium-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex items-center gap-4">
                  <ScoreGauge score={87} zone="green" size={64} showLabel={false} />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{t('home.step2_title')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('home.step2_desc')}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Steps */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">{t('home.workflow_label')}</span>
                <h2 className="mt-3 text-3xl font-extrabold md:text-5xl leading-[1.1]">{t('home.how_title')}</h2>
              </motion.div>

              <div className="mt-12 space-y-8">
                {[
                  { num: '01', title: t('home.step1_title'), desc: t('home.step1_desc') },
                  { num: '02', title: t('home.step2_title'), desc: t('home.step2_desc') },
                  { num: '03', title: t('home.step3_title'), desc: t('home.step3_desc') },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="flex gap-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border/50 text-lg font-bold text-muted-foreground">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{step.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOR AGENTS ─── */}
      <section className="relative py-24 md:py-32 border-t border-border/30">
        <div className="absolute inset-0 ambient-glow" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">{t('home.for_agents_label')}</span>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl leading-[1.1]">{t('home.agents_title')}</h2>
            <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">{t('home.agents_desc')}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-card border border-border/50 p-8 hover-lift transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-5 transition-colors group-hover:bg-primary/15">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="relative py-24 md:py-32 border-t border-border/30">
        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Intelligence</span>
                <h2 className="mt-3 text-3xl font-extrabold md:text-5xl leading-[1.1]">{t('home.feature1_title')}</h2>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">{t('home.feature1_desc')}</p>
              </motion.div>

              <div className="mt-10 space-y-5">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border/50">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{f.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image */}
            <motion.div
              className="relative rounded-3xl overflow-hidden aspect-square shadow-premium-lg"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={cityImg} alt="City skyline" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-32 border-t border-border/30">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img src={interiorImg} alt="Premium interior" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
            <div className="relative z-10 text-center py-20 px-8 md:py-28 md:px-16">
              <h2 className="text-3xl font-extrabold md:text-5xl leading-[1.1]">{t('home.cta_title')}</h2>
              <p className="mt-4 text-base text-muted-foreground max-w-md mx-auto leading-relaxed">{t('home.cta_subtitle')}</p>
              <Link to="/new">
                <Button size="lg" className="mt-10 h-14 gap-3 rounded-2xl px-10 text-base font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/25">
                  {t('home.cta')} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/30 py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Propa AI. {t('home.footer_rights')}</p>
          <p className="text-primary/60 font-medium">{t('home.footer_tagline')}</p>
        </div>
      </footer>
    </div>
  );
}
