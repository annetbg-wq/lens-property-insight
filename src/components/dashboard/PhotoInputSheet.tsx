import { useState, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEvaluation } from "@/hooks/useCreateEvaluation";
import { Upload, X, Loader2 } from "lucide-react";

interface PhotoInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILES = 10;
const MAX_SIZE = 10 * 1024 * 1024;

export function PhotoInputSheet({ open, onOpenChange }: PhotoInputSheetProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [address, setAddress] = useState("");
  const mutation = useCreateEvaluation();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_SIZE
    );
    setPhotos((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  }, []);

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    mutation.mutate({
      method: "photo",
      photos,
      address: address || undefined,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display">Upload Photos</SheetTitle>
          <SheetDescription>Upload property photos for AI condition analysis</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <label
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50 hover:bg-muted/50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drop images here or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Max 10 files, 10MB each</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          {photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.map((photo, i) => (
                <div key={`${photo.name}-${i}`} className="group relative aspect-square rounded-md overflow-hidden bg-muted">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="photo-address">Address or description (optional)</Label>
            <Input
              id="photo-address"
              placeholder="123 Main St, City, State"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            disabled={photos.length === 0 || mutation.isPending}
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
