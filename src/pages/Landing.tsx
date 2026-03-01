import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "AI Vision Analysis",
    description: "Upload photos and our AI evaluates property condition, renovations needed, and estimated costs.",
  },
  {
    icon: BarChart3,
    title: "Deep Financial Metrics",
    description: "Cap rate, cash-on-cash return, IRR, and ROI projections powered by real market data.",
  },
  {
    icon: Globe,
    title: "Market Intelligence",
    description: "Neighborhood trends, comparable sales, and demographic insights for any location worldwide.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[hsl(var(--hero-gradient-from))] text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 md:py-36 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Evaluate Any Property's Investment Potential in Seconds
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70"
          >
            AI-powered analysis for agents, investors, and buyers worldwide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/30">
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center font-display text-3xl font-bold sm:text-4xl"
          >
            Everything you need to make smarter investments
          </motion.h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <Card className="h-full border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} InvestorLens. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
