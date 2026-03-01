import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEvaluation } from "@/hooks/useCreateEvaluation";
import { Loader2 } from "lucide-react";
import type { PropertyType } from "@/types/property";

interface ManualInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManualInputSheet({ open, onOpenChange }: ManualInputSheetProps) {
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [notes, setNotes] = useState("");
  const mutation = useCreateEvaluation();

  const handleSubmit = () => {
    if (!address.trim()) return;
    mutation.mutate({
      method: "manual",
      address: address.trim(),
      propertyType: propertyType || undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      sqft: sqft ? Number(sqft) : undefined,
      askingPrice: askingPrice ? Number(askingPrice) : undefined,
      notes: notes || undefined,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Manual Entry</SheetTitle>
          <SheetDescription>Type the address or describe the property</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manual-address">Address *</Label>
            <Input
              id="manual-address"
              placeholder="123 Main St, City, State, ZIP"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select value={propertyType} onValueChange={(v) => setPropertyType(v as PropertyType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="land">Land Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="manual-beds">Beds</Label>
              <Input id="manual-beds" type="number" min={0} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-baths">Baths</Label>
              <Input id="manual-baths" type="number" min={0} step={0.5} value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-sqft">Sq Ft</Label>
              <Input id="manual-sqft" type="number" min={0} value={sqft} onChange={(e) => setSqft(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manual-price">Asking Price ($)</Label>
            <Input id="manual-price" type="number" min={0} placeholder="250000" value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manual-notes">Additional Notes</Label>
            <Textarea id="manual-notes" placeholder="Any additional details..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <Button className="w-full" disabled={!address.trim() || mutation.isPending} onClick={handleSubmit}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Analysis
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
