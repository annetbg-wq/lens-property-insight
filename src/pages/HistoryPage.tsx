import { Card, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Evaluation History</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <History className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">No evaluations yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your past property evaluations will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
