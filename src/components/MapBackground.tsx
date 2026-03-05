import { motion } from 'framer-motion';

interface MapBackgroundProps {
  variant?: 'hero' | 'page' | 'card';
  children: React.ReactNode;
  className?: string;
}

export function MapBackground({ variant = 'page', children, className = '' }: MapBackgroundProps) {
  if (variant === 'hero') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Topo contour lines */}
        <div className="absolute inset-0 topo-grid" />
        {/* Cadastral precision grid */}
        <div className="absolute inset-0 cadastral-grid opacity-60" />
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden scanline pointer-events-none" />
        {/* Floating coordinate labels */}
        <motion.div
          className="absolute top-[15%] right-[10%] font-mono text-[10px] text-primary/20 select-none pointer-events-none"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          55.7558° N
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[8%] font-mono text-[10px] text-primary/15 select-none pointer-events-none"
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          37.6173° E
        </motion.div>
        <motion.div
          className="absolute top-[40%] left-[15%] font-mono text-[9px] text-accent/10 select-none pointer-events-none"
          animate={{ opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          ZONE: R-1
        </motion.div>
        <motion.div
          className="absolute bottom-[35%] right-[15%] font-mono text-[9px] text-destructive/10 select-none pointer-events-none"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, delay: 3 }}
        >
          FAR: 2.5
        </motion.div>
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 terminal-grid" />
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
