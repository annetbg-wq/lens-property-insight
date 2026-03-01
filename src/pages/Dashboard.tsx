import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Camera, Link as LinkIcon, PenLine } from "lucide-react";
import { GpsInputSheet } from "@/components/dashboard/GpsInputSheet";
import { PhotoInputSheet } from "@/components/dashboard/PhotoInputSheet";
import { UrlInputSheet } from "@/components/dashboard/UrlInputSheet";
import { ManualInputSheet } from "@/components/dashboard/ManualInputSheet";
import type { InputMethod } from "@/types/property";

interface InputMethodCard {
  method: InputMethod;
  icon: React.ElementType;
  title: string;
  description: string;
}

const inputMethods: InputMethodCard[] = [
  {
    method: "gps",
    icon: MapPin,
    title: "Detect My Location",
    description: "Auto-detect your GPS location to find nearby properties",
  },
  {
    method: "photo",
    icon: Camera,
    title: "Upload Photos",
    description: "Upload property photos for AI condition analysis",
  },
  {
    method: "url",
    icon: LinkIcon,
    title: "Paste Listing URL",
    description: "Paste a link from Zillow, Realtor, or any listing site",
  },
  {
    method: "manual",
    icon: PenLine,
    title: "Manual Entry",
    description: "Type the address or describe the property manually",
  },
];

export default function Dashboard() {
  const [activeMethod, setActiveMethod] = useState<InputMethod | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">New Property Evaluation</h1>
        <p className="mt-2 text-muted-foreground">
          Choose how you'd like to provide property data
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {inputMethods.map((item) => (
          <Card
            key={item.method}
            className="cursor-pointer border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30"
            onClick={() => setActiveMethod(item.method)}
          >
            <CardContent className="flex items-start gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <GpsInputSheet open={activeMethod === "gps"} onOpenChange={(open) => !open && setActiveMethod(null)} />
      <PhotoInputSheet open={activeMethod === "photo"} onOpenChange={(open) => !open && setActiveMethod(null)} />
      <UrlInputSheet open={activeMethod === "url"} onOpenChange={(open) => !open && setActiveMethod(null)} />
      <ManualInputSheet open={activeMethod === "manual"} onOpenChange={(open) => !open && setActiveMethod(null)} />
    </div>
  );
}
