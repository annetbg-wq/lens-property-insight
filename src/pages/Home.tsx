import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Share2, Upload, Zap, Shield, TrendingUp, Activity, ChevronRight } from 'lucide-react';
import { getDemoResult } from '@/lib/demoCases';
import { ScoreGauge } from '@/components/ScoreGauge';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function Home() {
  const { t } = useTranslation();

  const steps = [
    { icon: Upload, title: t('home.step1_title'), desc: t('home.step1_desc'), num: '01' },
    { icon: Zap, title: t('home.step2_title'), desc: t('home.step2_desc'), num: '02' },
    { icon: BarChart3, title: t('home.step3_title'), desc: t('home.step3_desc'), num: '03' },
  ];

  const features = [
    { icon: BarChart3, title: t('home.feature1_title'), desc: t('home.feature1_desc') },
    { icon: Activity, title: t('home.feature2_title'), desc: t('home.feature2_desc') },
    { icon: Share2, title: t('home.feature3_title'), desc: t('home.feature3_desc') },
  ];

  const demoCards = [
    { key: 'apartment', emoji: '🏢' },
    { key: 'house', emoji: '🏡' },
    { key: 'commercial', emoji: '🏬' },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden terminal-grid">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-20 right-1/4 h-48 w-48 rounded-full bg-primary/8 blur-[100px] animate-float" />
        <div className="absolute bottom-32 left-1/3 h-40 w-40 rounded-full bg-destructive/5 blur-[80px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono text-primary"
            >
              <Activity className="h-3 w-3" />
              PropTech Terminal v2.0
            </motion.div>

            <motion.h1
              className="text-4xl font-extrabold tracking-tight leading-[1.1] md:text-6xl lg:text-7xl"
              variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }}
            >
              {t('home.hero_title').split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'gradient-text' : ''}>
                  {line}{i === 0 && <br />}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground md:text-base leading-relaxed"
              variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7, delay: 0.15 }}
            >
              {t('home.hero_subtitle')}
            </motion.p>

            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Link to="/new">
                <Button size="lg" className="h-11 gap-2 rounded-lg px-6 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-green">
                  {t('home.cta')} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="lg" className="h-11 gap-1.5 rounded-lg px-6 text-sm text-muted-foreground hover:text-foreground">
                  {t('nav.about')} <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Demo score cards */}
          <motion.div
            className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            {demoCards.map(({ key, emoji }) => {
              const result = getDemoResult(key);
              if (!result) return null;
              const zoneClass = result.zone === 'green' ? 'score-green border-score-green' : result.zone === 'yellow' ? 'score-amber border-score-amber' : 'score-red border-score-red';
              return (
                <motion.div key={key} variants={fadeUp}>
                  <Card className="border border-border/50 bg-card/80 hover-lift overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{emoji}</span>
                          <div>
                            <p className="text-xs font-semibold truncate max-w-[140px]">{result.displayName.split(',')[0]}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{result.input.goal}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-xl font-bold font-mono ${zoneClass}`}>{result.score}</span>
                          <span className="text-[9px] text-muted-foreground font-mono">/100</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-1.5">
                        {(['risk', 'return', 'stability'] as const).map(k => (
                          <div key={k} className="flex-1 rounded-md bg-secondary/50 p-1.5 text-center">
                            <p className="text-xs font-bold font-mono">{result.subScores[k]}</p>
                            <p className="text-[9px] text-muted-foreground">{t(`result.${k}`)}</p>
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
      <section className="relative py-20 md:py-28 border-t border-border/30">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="text-xs font-mono text-primary uppercase tracking-widest">{t('home.how_title')}</span>
            <h2 className="mt-2 text-2xl font-bold md:text-4xl">{t('home.how_title')}</h2>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 transition-colors group-hover:bg-primary/15">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-4xl font-bold text-secondary/80 absolute -top-1 right-0 font-mono">{s.num}</span>
                <h3 className="text-base font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 md:py-28 border-t border-border/30">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Features</span>
            <h2 className="mt-2 text-2xl font-bold md:text-4xl">{t('home.features_title')}</h2>
          </motion.div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full border border-border/50 bg-card/80 hover-lift">
                  <CardContent className="p-5">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold">{f.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Agents */}
      <section className="py-20 md:py-28 border-t border-border/30">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <span className="text-xs font-mono text-accent uppercase tracking-widest">{t('home.agents_title')}</span>
              <h2 className="mt-2 text-2xl font-bold md:text-4xl">{t('home.agents_title')}</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('home.agents_desc')}</p>
              <div className="mt-6 space-y-3">
                {[
                  { icon: TrendingUp, text: 'Мгновенные отчёты для клиентов' },
                  { icon: Share2, text: 'Брендированные ссылки для шаринга' },
                  { icon: Shield, text: 'Повышение профессионального доверия' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 border border-accent/20">
                      <item.icon className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/new" className="mt-6 inline-block">
                <Button size="lg" className="gap-2 rounded-lg px-6 h-10 text-sm bg-accent hover:bg-accent/90 text-accent-foreground glow-amber">
                  {t('home.cta')} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="flex-1 w-full"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <Card className="border border-border/50 bg-card/80 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold">ул. Тверская 15, кв. 42</p>
                      <p className="text-[10px] text-muted-foreground font-mono">Москва</p>
                    </div>
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center justify-center py-3">
                    <ScoreGauge score={78} zone="green" size={100} />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {[
                      { label: t('result.risk'), value: '24', cls: 'score-green' },
                      { label: t('result.return'), value: '82', cls: 'score-green' },
                      { label: t('result.stability'), value: '71', cls: 'score-amber' },
                    ].map(s => (
                      <div key={s.label} className="rounded-md bg-secondary/50 p-2 text-center">
                        <p className={`text-sm font-bold font-mono ${s.cls}`}>{s.value}</p>
                        <p className="text-[9px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t border-border/30">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden p-10 md:p-14 border border-border/50 bg-card/50"
          >
            <div className="absolute inset-0 mesh-gradient opacity-60" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold md:text-4xl">{t('home.cta_title')}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{t('home.cta_subtitle')}</p>
              <Link to="/new">
                <Button size="lg" className="mt-6 h-11 gap-2 rounded-lg px-8 text-sm font-semibold bg-primary text-primary-foreground glow-green">
                  {t('home.cta')} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
