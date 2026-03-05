import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, ChevronRight, Crosshair, Layers, Map, Shield, Radar } from 'lucide-react';
import { getDemoResult } from '@/lib/demoCases';
import { ScoreGauge } from '@/components/ScoreGauge';
import { MapBackground } from '@/components/MapBackground';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  const { t } = useTranslation();

  const demoCards = [
    { key: 'apartment', emoji: '🏢' },
    { key: 'house', emoji: '🏡' },
    { key: 'commercial', emoji: '🏬' },
  ];

  const layers = [
    { icon: Map, label: 'Cadastral', desc: 'Границы участков и размеры', color: 'text-primary' },
    { icon: Layers, label: 'Zoning', desc: 'FAR, высота, назначение', color: 'text-accent' },
    { icon: Shield, label: 'Environment', desc: 'Шум, экология, риски', color: 'text-destructive' },
    { icon: Radar, label: 'Infrastructure', desc: 'Транспорт, школы, сервисы', color: 'text-primary' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero — Map-centric */}
      <MapBackground variant="hero" className="min-h-[90vh] flex items-center justify-center">
        <div className="mx-auto max-w-5xl px-4 py-20 md:py-28">
          <div className="flex flex-col items-center text-center">
            {/* AR-style system status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-primary tracking-wider">SYSTEM ONLINE • REAL-TIME ANALYSIS</span>
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
              className="mx-auto mt-5 max-w-md text-sm text-muted-foreground md:text-base leading-relaxed"
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
          </div>

          {/* Flash-Verdict demo cards */}
          <motion.div
            className="mt-20 grid grid-cols-1 gap-3 sm:grid-cols-3"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            {demoCards.map(({ key, emoji }) => {
              const result = getDemoResult(key);
              if (!result) return null;
              const zoneClass = result.zone === 'green' ? 'border-primary/20' : result.zone === 'yellow' ? 'border-accent/20' : 'border-destructive/20';
              const scoreColor = result.zone === 'green' ? 'score-green' : result.zone === 'yellow' ? 'score-amber' : 'score-red';
              return (
                <motion.div key={key} variants={fadeUp}>
                  <div className={`glass rounded-lg viewfinder viewfinder-bottom p-4 hover-lift cursor-pointer border ${zoneClass}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{emoji}</span>
                        <div>
                          <p className="text-xs font-semibold truncate max-w-[130px]">{result.displayName.split(',')[0]}</p>
                          <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">{result.input.goal}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-bold font-mono ${scoreColor}`}>{result.score}</span>
                        <p className="text-[8px] text-muted-foreground font-mono">/100</p>
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </MapBackground>

      {/* Map Layers Section */}
      <section className="relative py-20 md:py-28 border-t border-border/20">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Intelligence Layers</span>
            <h2 className="mt-2 text-2xl font-bold md:text-4xl">Слои данных</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">Каждая оценка включает глубокий анализ кадастровых, зонировочных и инфраструктурных данных</p>
          </motion.div>

          <div className="grid gap-3 md:grid-cols-2">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass rounded-lg p-5 hover-lift border border-border/30 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/60 border border-border/30 group-hover:border-primary/20 transition-colors`}>
                    <layer.icon className={`h-4 w-4 ${layer.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-0.5">{layer.label}</p>
                    <h3 className="text-sm font-bold">{layer.desc}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 md:py-28 border-t border-border/20">
        <div className="absolute inset-0 terminal-grid opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Workflow</span>
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

      {/* For Agents */}
      <section className="relative py-20 md:py-28 border-t border-border/20">
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">For Professionals</span>
              <h2 className="mt-2 text-2xl font-bold md:text-4xl">{t('home.agents_title')}</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('home.agents_desc')}</p>
              <Link to="/new" className="mt-8 inline-block">
                <Button size="lg" className="gap-2 rounded-lg px-8 h-11 text-sm font-bold bg-accent hover:bg-accent/90 text-accent-foreground glow-amber">
                  {t('home.cta')} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="flex-1 w-full"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <div className="glass rounded-lg viewfinder viewfinder-bottom p-5 border border-accent/15">
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
    </div>
  );
}
