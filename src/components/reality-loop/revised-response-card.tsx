import { ArrowDown, ArrowUp, Recycle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Revision } from "./shared";
import { cn } from "@/lib/utils";

interface RevisedResponseCardProps {
  revision: Revision;
  index: number;
}

export const RevisedResponseCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-12 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-full" />
            </div>
        </CardContent>
    </Card>
);

export default function RevisedResponseCard({ revision, index }: RevisedResponseCardProps) {
  const confidenceChange = revision.updatedConfidenceScore - revision.previousConfidenceScore;
  const confidenceIncreased = confidenceChange > 0;
  const confidenceDecreased = confidenceChange < 0;

  const prevConfidencePercentage = (revision.previousConfidenceScore * 100).toFixed(0);
  const newConfidencePercentage = (revision.updatedConfidenceScore * 100).toFixed(0);

  return (
    <Card className="bg-card/50 border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent text-2xl font-bold">
          <Sparkles />
          Revised Belief #{index + 1}
        </CardTitle>
        <CardDescription>
          The AI has incorporated your feedback to generate an improved belief.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Recycle /> What Changed</h3>
            <p className="text-muted-foreground italic">"{revision.changesMade}"</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Revised Answer</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{revision.revisedResponse}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            New Confidence Score: 
            <span className="flex items-center gap-1">
              {prevConfidencePercentage}% → {newConfidencePercentage}%
              {confidenceIncreased && <ArrowUp className="h-5 w-5 text-green-500" />}
              {confidenceDecreased && <ArrowDown className="h-5 w-5 text-red-500" />}
            </span>
          </h3>
          <Progress 
            value={revision.updatedConfidenceScore * 100} 
            className="[&>div]:bg-accent" 
            aria-label={`${newConfidencePercentage}% confidence`} 
          />
           <p className="text-xs text-muted-foreground mt-2">
            Confidence may increase or decrease based on new information.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
