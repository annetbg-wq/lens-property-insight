import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LANGUAGES, type Language } from '@/lib/translations';
import { Menu, User, Briefcase, Globe, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { viewMode, setViewMode } = useViewMode();
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <span className="text-sm font-extrabold">P</span>
          </div>
          <span className="text-base font-bold tracking-tight">
            Propa<span className="gradient-text ml-0.5">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <Link key={l.to} to={l.to}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-[13px] font-medium h-9 px-4 rounded-lg transition-all ${
                  isActive(l.to)
                    ? 'text-foreground bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {l.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Mode toggle */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/60 bg-secondary/30 px-3 py-1.5">
            <User className={`h-3.5 w-3.5 transition-colors ${viewMode === 'client' ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch
              checked={viewMode === 'agent'}
              onCheckedChange={(checked) => setViewMode(checked ? 'agent' : 'client')}
              className="scale-[0.8]"
            />
            <Briefcase className={`h-3.5 w-3.5 transition-colors ${viewMode === 'agent' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>

          {/* Language */}
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
            <Select value={language} onValueChange={v => setLanguage(v as Language)}>
              <SelectTrigger className="h-8 w-[88px] text-xs border-border/50 bg-secondary/30 rounded-lg font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(l => (
                  <SelectItem key={l.code} value={l.code} className="text-xs">{l.flag} {l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CTA */}
          <Link to="/new" className="hidden md:block">
            <Button size="sm" className="h-9 rounded-xl gap-2 px-5 text-[13px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              {t('nav.new')} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-border/50">
              <nav className="mt-10 flex flex-col gap-1">
                {links.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-sm font-medium rounded-xl h-11 ${
                        isActive(l.to) ? 'text-foreground bg-secondary' : 'text-muted-foreground'
                      }`}
                    >
                      {l.label}
                    </Button>
                  </Link>
                ))}

                <div className="flex items-center gap-3 mt-6 mx-4 py-3 border-t border-border/30">
                  <User className={`h-4 w-4 ${viewMode === 'client' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs text-muted-foreground flex-1">Mode</span>
                  <Switch
                    checked={viewMode === 'agent'}
                    onCheckedChange={(checked) => setViewMode(checked ? 'agent' : 'client')}
                  />
                  <Briefcase className={`h-4 w-4 ${viewMode === 'agent' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>

                <Link to="/new" onClick={() => setOpen(false)} className="mt-4 mx-3">
                  <Button className="w-full rounded-xl gap-2 h-11 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20">
                    {t('nav.new')} <ArrowRight className="h-4 w-4" />
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
