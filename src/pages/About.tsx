import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lightbulb, Workflow } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  const sections = [
    { icon: Lightbulb, title: t('about.what_title'), desc: t('about.what_desc') },
    { icon: Workflow, title: t('about.how_title'), desc: t('about.how_desc') },
    { icon: Shield, title: t('about.trust_title'), desc: t('about.disclaimer') },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold md:text-3xl">{t('about.title')}</h1>
      <div className="mt-8 space-y-6">
        {sections.map((s, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
