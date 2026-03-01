import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCreateEvaluation } from "@/hooks/useCreateEvaluation";
import { MapPin, Loader2 } from "lucide-react";

interface GpsInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GpsInputSheet({ open, onOpenChange }: GpsInputSheetProps) {
  const geo = useGeolocation();
  const mutation = useCreateEvaluation();
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (geo.latitude === null || geo.longitude === null) return;
    mutation.mutate({
      method: "gps",
      latitude: geo.latitude,
      longitude: geo.longitude,
      notes: notes || undefined,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display">Detect My Location</SheetTitle>
          <SheetDescription>Auto-detect your GPS coordinates to find nearby properties</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <Button onClick={geo.detect} disabled={geo.loading} variant="outline" className="w-full">
            {geo.loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            {geo.loading ? "Detecting..." : "Detect Location"}
          </Button>

          {geo.error && <p className="text-sm text-destructive">{geo.error}</p>}

          {geo.latitude !== null && geo.longitude !== null && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">Location detected</p>
              <p className="mt-1 text-muted-foreground">
                {geo.latitude.toFixed(6)}, {geo.longitude.toFixed(6)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="gps-notes">Notes (optional)</Label>
            <Input
              id="gps-notes"
              placeholder="e.g. The blue house on the corner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            disabled={geo.latitude === null || mutation.isPending}
            onClick={handleSubmit}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Analysis
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
