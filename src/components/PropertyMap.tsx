import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Maximize2, Minimize2, Camera, Map as MapIcon } from 'lucide-react';

interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  className?: string;
}

export function PropertyMap({ latitude, longitude, address, className = '' }: PropertyMapProps) {
  const [expanded, setExpanded] = useState(false);
  const [streetView, setStreetView] = useState(false);

  const query = latitude && longitude
    ? `${latitude},${longitude}`
    : address || '';

  if (!query) return null;

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const streetViewUrl = latitude && longitude
    ? `https://www.google.com/maps?layer=c&cbll=${latitude},${longitude}&cbp=11,0,0,0,0&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(query)}&layer=c&output=embed`;

  const embedUrl = streetView ? streetViewUrl : mapUrl;

  return (
    <motion.div
      layout
      className={`relative group rounded-lg border border-border/30 overflow-hidden bg-card/40 backdrop-blur-sm ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/20 bg-secondary/30">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            {latitude && longitude
              ? `${latitude.toFixed(4)}° / ${longitude.toFixed(4)}°`
              : 'Локация'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Street View toggle */}
          <button
            onClick={() => setStreetView(!streetView)}
            className={`flex items-center gap-1 text-[9px] font-mono transition-colors px-1.5 py-0.5 rounded ${
              streetView 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
            title={streetView ? 'Карта' : 'Фотосъёмка'}
          >
            {streetView ? <MapIcon className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
            <span className="hidden sm:inline">{streetView ? 'Карта' : 'Street View'}</span>
          </button>
          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-secondary/50"
          >
            {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Map iframe */}
      <motion.div
        animate={{ height: expanded ? 400 : 200 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full"
      >
        <iframe
          key={streetView ? 'sv' : 'map'}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, filter: streetView ? 'none' : 'invert(0.9) hue-rotate(180deg) saturate(0.3) brightness(0.8)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Property Location"
        />
      </motion.div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/30 rounded-tr-lg pointer-events-none" />
    </motion.div>
  );
}
