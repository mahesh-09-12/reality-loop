import { Bot, FileCheck2, HelpCircle, Lightbulb, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Belief } from "./shared";

interface InitialResponseCardProps {
  response: Belief | null;
  isLoading: boolean;
}

const LoadingSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
    </Card>
);


export default function InitialResponseCard({ response, isLoading }: InitialResponseCardProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!response) {
    return (
        <Card className="flex flex-col items-center justify-center min-h-[400px] border-dashed">
            <div className="text-center text-muted-foreground p-4">
                <Bot className="mx-auto h-12 w-12" />
                <p className="mt-4 text-xl font-semibold">AI Beliefs Evolve Here</p>
                <p className="text-sm max-w-xs mx-auto mt-2">
                  Watch how confidence and answers change when humans challenge the AI.
                </p>
            </div>
        </Card>
    );
  }

  const confidencePercentage = (response.confidenceScore * 100).toFixed(0);

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Lightbulb className="text-primary" />
          Initial AI Belief
        </CardTitle>
        <CardDescription>
          Here is the AI's first belief in response to your question, along with its self-evaluation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Answer</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{response.answer}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Confidence Score: {confidencePercentage}%</h3>
          <Progress value={response.confidenceScore * 100} aria-label={`${confidencePercentage}% confidence`} />
          <p className="text-xs text-muted-foreground mt-2">
            Confidence may increase or decrease based on new information.
          </p>
        </div>

        {response.assumptions && response.assumptions.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileCheck2 className="text-primary"/> {response.assumptions.length} Assumptions Made
                </h3>
                <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 pt-2">
                  {response.assumptions.map((assumption, index) => (
                    <li key={index}>{assumption}</li>
                  ))}
                </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {response.uncertainties && response.uncertainties.length > 0 && (
            <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <HelpCircle className="text-primary" /> 
                        {response.uncertainties.length} Active Uncertainties
                    </h3>
                    <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <Accordion type="single" collapsible className="w-full mt-2">
                        {response.uncertainties.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{item}</AccordionTrigger>
                                <AccordionContent>
                                    This is a point of potential weakness in the belief. Addressing it could improve accuracy.
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CollapsibleContent>
            </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
