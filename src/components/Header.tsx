import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LANGUAGES, type Language } from '@/lib/translations';
import { Menu, Activity, User, Briefcase } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full glass-strong">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 transition-all group-hover:bg-primary/20 group-hover:border-primary/30">
            <Activity className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight">
            Propa <span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map(l => (
            <Link key={l.to} to={l.to}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs font-medium h-8 px-3 rounded-lg transition-colors ${
                  isActive(l.to) ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {l.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Agent/Client mode toggle */}
          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-border/40 px-2 py-1">
            <User className={`h-3 w-3 ${viewMode === 'client' ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch 
              checked={viewMode === 'agent'}
              onCheckedChange={(checked) => setViewMode(checked ? 'agent' : 'client')}
              className="scale-75"
            />
            <Briefcase className={`h-3 w-3 ${viewMode === 'agent' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>

          <Select value={language} onValueChange={v => setLanguage(v as Language)}>
            <SelectTrigger className="h-7 w-[80px] text-[11px] border-border/50 bg-secondary/30 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(l => (
                <SelectItem key={l.code} value={l.code} className="text-xs">{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link to="/new" className="hidden md:block">
            <Button size="sm" className="h-7 rounded-lg gap-1.5 px-3 text-[11px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              {t('nav.new')}
            </Button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 glass-strong border-border/50">
              <nav className="mt-8 flex flex-col gap-0.5">
                {links.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-sm rounded-lg ${isActive(l.to) ? 'text-primary bg-primary/5' : ''}`}
                    >
                      {l.label}
                    </Button>
                  </Link>
                ))}
                {/* Mobile mode toggle */}
                <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-border/30">
                  <User className={`h-3.5 w-3.5 ${viewMode === 'client' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Label className="text-xs text-muted-foreground">Клиент</Label>
                  <Switch 
                    checked={viewMode === 'agent'}
                    onCheckedChange={(checked) => setViewMode(checked ? 'agent' : 'client')}
                  />
                  <Label className="text-xs text-muted-foreground">Агент</Label>
                  <Briefcase className={`h-3.5 w-3.5 ${viewMode === 'agent' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <Link to="/new" onClick={() => setOpen(false)} className="mt-3">
                  <Button className="w-full rounded-lg gap-1.5 bg-primary text-primary-foreground">
                    {t('nav.new')}
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
