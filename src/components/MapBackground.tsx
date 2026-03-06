interface MapBackgroundProps {
  variant?: 'hero' | 'page' | 'card';
  children: React.ReactNode;
  className?: string;
}

export function MapBackground({ variant = 'page', children, className = '' }: MapBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {variant === 'hero' && (
        <>
          <div className="absolute inset-0 ambient-glow" />
          <div className="absolute inset-0 pattern-dots opacity-30" />
        </>
      )}
      {variant === 'page' && (
        <>
          <div className="absolute inset-0 ambient-glow-soft" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
