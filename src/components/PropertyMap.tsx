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
      className={`relative rounded-2xl border border-border/40 overflow-hidden bg-card shadow-premium ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            {latitude && longitude
              ? `${latitude.toFixed(4)}° / ${longitude.toFixed(4)}°`
              : 'Location'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStreetView(!streetView)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-2.5 py-1.5 rounded-lg ${
              streetView
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {streetView ? <MapIcon className="h-3.5 w-3.5" /> : <Camera className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{streetView ? 'Map' : 'Street View'}</span>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary/50"
          >
            {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Map */}
      <motion.div
        animate={{ height: expanded ? 400 : 220 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full"
      >
        <iframe
          key={streetView ? 'sv' : 'map'}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Property Location"
        />
      </motion.div>
    </motion.div>
  );
}
