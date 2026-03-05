import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LANGUAGES, type Language } from '@/lib/translations';
import { Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/new', label: t('nav.new') },
    { to: '/library', label: t('nav.library') },
    { to: '/compare', label: t('nav.compare') },
    { to: '/about', label: t('nav.about') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight font-display">
            Propa <span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <Link key={l.to} to={l.to}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm font-medium transition-colors ${
                  isActive(l.to) ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={v => setLanguage(v as Language)}>
            <SelectTrigger className="h-8 w-[100px] text-xs border-none bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(l => (
                <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link to="/new" className="hidden md:block">
            <Button size="sm" className="rounded-full gap-1.5 px-4 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Sparkles className="h-3.5 w-3.5" /> {t('nav.new')}
            </Button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 glass">
              <nav className="mt-10 flex flex-col gap-1">
                {links.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-base ${isActive(l.to) ? 'text-primary bg-primary/5' : ''}`}
                    >
                      {l.label}
                    </Button>
                  </Link>
                ))}
                <Link to="/new" onClick={() => setOpen(false)} className="mt-4">
                  <Button className="w-full rounded-full gap-1.5">
                    <Sparkles className="h-4 w-4" /> {t('nav.new')}
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
