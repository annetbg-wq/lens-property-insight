import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Eye,
  BarChart3,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Clock3,
  Building2,
  LineChart,
  Wallet,
  ArrowRight,
} from "lucide-react";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface BenefitItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}

const features: FeatureItem[] = [
  {
    icon: Eye,
    title: "AI Vision Analysis",
    description:
      "Upload photos and instantly detect visible risks, renovation scope, and condition red flags before you commit capital.",
  },
  {
    icon: BarChart3,
    title: "Deep Financial Metrics",
    description:
      "Generate cap rate, cash flow, break-even horizon, and scenario projections in seconds instead of spreadsheet hours.",
  },
  {
    icon: Globe,
    title: "Market Intelligence",
    description:
      "Benchmark each deal against local trends, demand patterns, and comparable properties to avoid emotional decisions.",
  },
];

const benefits: BenefitItem[] = [
  {
    icon: Clock3,
    title: "From 2 hours to 2 minutes",
    description: "Evaluate opportunities instantly and move before slower buyers even open their underwriting model.",
  },
  {
    icon: ShieldCheck,
    title: "Risk-first underwriting",
    description: "Spot hidden downside early with structured AI checks across property condition and investment assumptions.",
  },
  {
    icon: Wallet,
    title: "Higher confidence offers",
    description: "Make tighter bids backed by data, not gut feeling, and protect your margin on every acquisition.",
  },
  {
    icon: LineChart,
    title: "Portfolio-level consistency",
    description: "Use one repeatable framework for every market and every deal so quality decisions scale with your team.",
  },
];

const steps = [
  "Choose your input method: GPS, photos, listing URL, or manual entry.",
  "InvestorLens structures the property data and starts analysis instantly.",
  "Review clear insights and decide to buy, negotiate, or walk away.",
];

const testimonials: TestimonialItem[] = [
  {
    quote:
      "InvestorLens helped us filter 43 listings in one evening and only inspect 6. We saved weeks and cut bad viewings dramatically.",
    name: "Michael Torres",
    role: "Acquisitions Lead, Horizon Homes",
  },
  {
    quote:
      "The financial snapshot is brutally clear. If a deal doesn’t cash flow, we know immediately and move on.",
    name: "Aisha Patel",
    role: "Independent Investor",
  },
  {
    quote:
      "Our agents now deliver investor-grade analysis in the first call. It makes us look premium and closes trust faster.",
    name: "Daniel Kim",
    role: "Broker, Northline Realty",
  },
];

const faqs = [
  {
    question: "Who is InvestorLens for?",
    answer:
      "InvestorLens is built for property investors, buyer agents, brokers, and teams who need fast, repeatable deal evaluation.",
  },
  {
    question: "Do I need technical skills to use it?",
    answer:
      "No. You can start with a listing URL or photos and get structured analysis without spreadsheets or complex setup.",
  },
  {
    question: "Can I use it across different countries?",
    answer:
      "Yes. The platform is designed for global workflows and supports omnichannel property input from any market.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const appear = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="font-display text-xl font-bold">InvestorLens</div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] via-[hsl(var(--hero-gradient-to))] to-[hsl(var(--hero-gradient-from))] text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_85%_10%,hsl(var(--primary)/0.35),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_400px_at_15%_90%,hsl(var(--accent)/0.22),transparent_70%)]" />

          <div className="relative mx-auto grid min-h-[78vh] w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <motion.div initial="hidden" animate="visible" variants={appear}>
              <Badge className="mb-5 bg-primary/20 text-primary-foreground">Real Estate Investment Intelligence</Badge>
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Evaluate Any Property&apos;s Investment Potential in Seconds
              </h1>
              <p className="mt-6 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
                AI-powered analysis for agents, investors, and buyers worldwide. Stop guessing, start underwriting every opportunity with speed and confidence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-xl px-7 text-base">
                  <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="rounded-xl px-7 text-base">
                  <Link to="/login">See Live Dashboard</Link>
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="font-display text-2xl font-semibold">10x</p>
                  <p className="text-sm text-primary-foreground/75">Faster deal triage</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold">+31%</p>
                  <p className="text-sm text-primary-foreground/75">Better offer quality</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold">24/7</p>
                  <p className="text-sm text-primary-foreground/75">Always-on analysis</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <Card className="border-primary/20 bg-card/95 shadow-xl backdrop-blur">
                <CardContent className="space-y-5 p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-semibold">Live Deal Snapshot</p>
                    <Badge className="bg-success/15 text-success">High Confidence</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl border bg-background/70 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Asset</p>
                      <p className="mt-1 font-medium">3BR Duplex • Austin, TX</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border bg-background/70 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Projected Cap Rate</p>
                        <p className="mt-1 font-display text-2xl font-semibold text-success">8.4%</p>
                      </div>
                      <div className="rounded-xl border bg-background/70 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Risk Score</p>
                        <p className="mt-1 font-display text-2xl font-semibold">Low</p>
                      </div>
                    </div>
                    <div className="rounded-xl border bg-background/70 p-4">
                      <p className="text-sm text-muted-foreground">Key insight</p>
                      <p className="mt-1 text-sm font-medium">
                        Strong rent demand + below-market asking price creates negotiation edge and positive monthly cash flow.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="mx-auto max-w-3xl text-center"
            >
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Why top investors switch to InvestorLens</h2>
              <p className="mt-4 text-muted-foreground">
                You don’t need more listings. You need faster conviction on the right listings.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={index + 1}
                >
                  <Card className="h-full border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="p-5">
                      <item.icon className="h-5 w-5 text-primary" />
                      <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/40 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="mx-auto max-w-3xl text-center"
            >
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything you need to make smarter investments</h2>
            </motion.div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={index + 1}
                >
                  <Card className="h-full border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
              >
                <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works in under 60 seconds</h2>
                <p className="mt-4 text-muted-foreground">
                  Purpose-built for teams that need to move fast without sacrificing underwriting quality.
                </p>
                <div className="mt-8 space-y-4">
                  {steps.map((step, index) => (
                    <div key={step} className="flex gap-3 rounded-xl border bg-card p-4">
                      <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={1}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <p className="font-display text-2xl font-semibold">What you get instantly</p>
                    <ul className="mt-6 space-y-4">
                      {[
                        "Instant property condition flags",
                        "Financial viability snapshot",
                        "Market fit and demand indicators",
                        "Action recommendation: buy, negotiate, or skip",
                      ].map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-8 w-full sm:w-auto">
                      <Link to="/signup" className="inline-flex items-center gap-2">
                        Start your first evaluation <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-muted/40 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="mx-auto max-w-3xl text-center"
            >
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Trusted by operators who buy with discipline</h2>
            </motion.div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={index + 1}
                >
                  <Card className="h-full border-border/60 bg-card shadow-sm">
                    <CardContent className="p-6">
                      <p className="text-sm leading-relaxed">“{item.quote}”</p>
                      <div className="mt-5">
                        <p className="font-display font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center"
            >
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
            </motion.div>
            <Accordion type="single" collapsible className="mt-8 rounded-xl border bg-card px-4 sm:px-6">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="pb-20 pt-4">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 shadow-sm">
              <CardContent className="grid gap-6 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    Built for serious investors
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Start evaluating deals with confidence today</h2>
                  <p className="mt-3 max-w-2xl text-muted-foreground">
                    Join InvestorLens and make faster, cleaner, data-backed acquisition decisions from your very first session.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <Button asChild size="lg" className="px-7">
                    <Link to="/signup">Get Started Free</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="px-7">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} InvestorLens. All rights reserved.</p>
          <p>Evaluate faster. Invest smarter.</p>
        </div>
      </footer>
    </div>
  );
}

