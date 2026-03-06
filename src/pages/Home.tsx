import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { useViewMode } from '@/contexts/ViewModeContext';
import { useGeoProperties } from '@/hooks/useGeoProperties';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, ChevronRight, Crosshair, Layers, Map, Shield, Radar, MapPin, DollarSign, Euro, Loader2, Share2, BarChart3, Eye, CheckCircle2 } from 'lucide-react';
import { ScoreGauge } from '@/components/ScoreGauge';
import { MapBackground } from '@/components/MapBackground';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  const { t } = useTranslation();
  const { isClient } = useViewMode();
  const { properties, regionName, loading } = useGeoProperties();

  const layers = [
    { icon: Map, label: t('home.feature1_title'), desc: t('home.feature1_desc'), color: 'text-primary' },
    { icon: Layers, label: t('home.feature2_title'), desc: t('home.feature2_desc'), color: 'text-accent' },
    { icon: Shield, label: t('home.feature3_title'), desc: t('home.feature3_desc'), color: 'text-destructive' },
    { icon: Radar, label: t('home.agents_title'), desc: t('home.agents_desc'), color: 'text-primary' },
  ];

  const agentBenefits = [
    { icon: Eye, title: t('home.benefit_instant'), desc: t('home.benefit_instant_desc') },
    { icon: Share2, title: t('home.benefit_share'), desc: t('home.benefit_share_desc') },
    { icon: BarChart3, title: t('home.benefit_compare'), desc: t('home.benefit_compare_desc') },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <MapBackground variant="hero" className="min-h-[90vh] flex items-center justify-center">
        <div className="mx-auto max-w-5xl px-4 py-20 md:py-28">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-primary tracking-wider uppercase">{t('home.status_badge')}</span>
            </motion.div>

            <motion.h1
              className="text-4xl font-extrabold tracking-tight leading-[1.05] md:text-6xl lg:text-7xl"
              variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6 }}
            >
              {t('home.hero_title').split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'gradient-text' : ''}>
                  {line}{i === 0 && <br />}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground md:text-base leading-relaxed"
              variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }}
            >
              {t('home.hero_subtitle')}
            </motion.p>

            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Link to="/new">
                <Button size="lg" className="h-12 gap-2 rounded-lg px-8 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground glow-green">
                  <Crosshair className="h-4 w-4" /> {t('home.cta')}
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="lg" className="h-12 gap-1.5 rounded-lg px-6 text-sm text-muted-foreground hover:text-foreground">
                  {t('nav.about')} <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}
              className="mt-10 grid grid-cols-3 gap-6 sm:gap-10"
            >
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-primary">30s</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('home.stat_speed')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-primary">0–100</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('home.stat_score')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-primary">24/7</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('home.stat_available')}</p>
              </div>
            </motion.div>
          </div>

          {/* Geo-based demo cards */}
          <motion.div
            className="mt-20"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-5">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {loading ? t('home.detecting_location') : `${t('home.near_you')} • ${regionName}`}
              </span>
              {loading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            </motion.div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {properties.map(({ result, priceUSD, priceEUR, dealType, emoji }) => {
                const zoneClass = result.zone === 'green' ? 'border-primary/20' : result.zone === 'yellow' ? 'border-accent/20' : 'border-destructive/20';
                const scoreColor = result.zone === 'green' ? 'score-green' : result.zone === 'yellow' ? 'score-amber' : 'score-red';
                return (
                  <motion.div key={result.id} variants={fadeUp}>
                    <Link to="/new">
                      <div className={`glass rounded-lg viewfinder viewfinder-bottom p-4 hover-lift cursor-pointer border ${zoneClass}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-lg shrink-0">{emoji}</span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{result.displayName.split(',')[0]}</p>
                              <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">{dealType}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <span className={`text-2xl font-bold font-mono ${scoreColor}`}>{result.score}</span>
                            <p className="text-[8px] text-muted-foreground font-mono">/100</p>
                          </div>
                        </div>
                        
                        {/* Prices */}
                        <div className="flex items-center gap-3 mb-2 py-1.5 px-2 rounded bg-secondary/30 border border-border/15">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-2.5 w-2.5 text-muted-foreground" />
                            <span className="text-[10px] font-mono font-semibold text-foreground">
                              {priceUSD >= 10000 ? `${(priceUSD / 1000).toFixed(0)}K` : priceUSD.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-3 w-px bg-border/30" />
                          <div className="flex items-center gap-1">
                            <Euro className="h-2.5 w-2.5 text-muted-foreground" />
                            <span className="text-[10px] font-mono font-semibold text-foreground">
                              {priceEUR >= 10000 ? `${(priceEUR / 1000).toFixed(0)}K` : priceEUR.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Punchy points */}
                        <div className="space-y-1">
                          {result.reasons.slice(0, 2).map((r, i) => (
                            <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                              <span className={`mt-1 h-1 w-1 rounded-full shrink-0 ${
                                result.zone === 'green' ? 'bg-primary' : result.zone === 'yellow' ? 'bg-accent' : 'bg-destructive'
                              }`} />
                              <span className="line-clamp-1">{r.title}</span>
                            </p>
                          ))}
                        </div>
                        {/* Sub-scores */}
                        <div className="mt-3 flex gap-1.5">
                          {(['risk', 'return', 'stability'] as const).map(k => (
                            <div key={k} className="flex-1 rounded bg-secondary/40 border border-border/20 p-1.5 text-center">
                              <p className="text-xs font-bold font-mono">{result.subScores[k]}</p>
                              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{t(`result.${k}`)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </MapBackground>

      {/* How It Works */}
      <section className="relative py-20 md:py-28 border-t border-border/20">
        <div className="absolute inset-0 terminal-grid opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">{t('home.workflow_label')}</span>
            <h2 className="mt-2 text-2xl font-bold md:text-4xl">{t('home.how_title')}</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { num: '01', title: t('home.step1_title'), desc: t('home.step1_desc'), icon: Crosshair },
              { num: '02', title: t('home.step2_title'), desc: t('home.step2_desc'), icon: Radar },
              { num: '03', title: t('home.step3_title'), desc: t('home.step3_desc'), icon: Activity },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <span className="text-5xl font-bold text-secondary/50 font-mono absolute -top-2 right-0">{step.num}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4">
                  <step.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-base font-bold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Agents — Value Props */}
      <section className="relative py-20 md:py-28 border-t border-border/20">
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">{t('home.for_agents_label')}</span>
            <h2 className="mt-2 text-2xl font-bold md:text-4xl">{t('home.agents_title')}</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">{t('home.agents_desc')}</p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {agentBenefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass rounded-lg p-5 hover-lift border border-border/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-3">
                  <b.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold">{b.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Agent demo card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <div className="glass rounded-lg viewfinder viewfinder-bottom p-5 border border-accent/15 max-w-sm mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold">ул. Тверская 15, кв. 42</p>
                  <p className="text-[10px] text-muted-foreground font-mono">55.7558°N 37.6173°E</p>
                </div>
                <Activity className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center justify-center py-2">
                <ScoreGauge score={78} zone="green" size={110} />
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                {[
                  { label: t('result.risk'), value: '24', cls: 'score-green' },
                  { label: t('result.return'), value: '82', cls: 'score-green' },
                  { label: t('result.stability'), value: '71', cls: 'score-amber' },
                ].map(s => (
                  <div key={s.label} className="rounded bg-secondary/40 border border-border/20 p-2 text-center">
                    <p className={`text-sm font-bold font-mono ${s.cls}`}>{s.value}</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t border-border/20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative glass rounded-lg viewfinder viewfinder-bottom p-10 md:p-14 overflow-hidden"
          >
            <div className="absolute inset-0 cadastral-grid opacity-20" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold md:text-4xl">{t('home.cta_title')}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{t('home.cta_subtitle')}</p>
              <Link to="/new">
                <Button size="lg" className="mt-8 h-12 gap-2 rounded-lg px-8 text-sm font-bold bg-primary text-primary-foreground glow-green">
                  <Crosshair className="h-4 w-4" /> {t('home.cta')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Propa AI. {t('home.footer_rights')}</p>
          <p className="font-mono text-primary/60">{t('home.footer_tagline')}</p>
        </div>
      </footer>
    </div>
  );
}
