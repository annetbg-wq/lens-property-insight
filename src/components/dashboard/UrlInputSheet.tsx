import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEvaluation } from "@/hooks/useCreateEvaluation";
import { Loader2 } from "lucide-react";

interface UrlInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isValidUrl(value: string): boolean {
  return /^https?:\/\/.+/.test(value);
}

export function UrlInputSheet({ open, onOpenChange }: UrlInputSheetProps) {
  const [url, setUrl] = useState("");
  const mutation = useCreateEvaluation();
  const valid = isValidUrl(url);

  const handleSubmit = () => {
    if (!valid) return;
    mutation.mutate({ method: "url", url });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display">Paste Listing URL</SheetTitle>
          <SheetDescription>Paste a link from Zillow, Realtor, or any listing site</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="listing-url">Listing URL</Label>
            <Input
              id="listing-url"
              type="url"
              placeholder="https://www.zillow.com/homedetails/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {url && !valid && (
              <p className="text-xs text-destructive">URL must start with http:// or https://</p>
            )}
          </div>

          <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
            Listing data will appear here after scraping...
          </div>

          <Button className="w-full" disabled={!valid || mutation.isPending} onClick={handleSubmit}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Scrape &amp; Analyze
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
