import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analysis() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Property Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">Evaluation ID: {id}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Analyzing property...</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This may take a moment. Results will appear here once processing is complete.
          </p>
          <div className="mt-8 w-full max-w-md space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
