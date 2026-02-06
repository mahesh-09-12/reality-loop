"use client";

import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Edit, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const correctionSchema = z.object({
  correction: z.string().min(5).max(500),
});

interface CorrectionFormProps {
  form: UseFormReturn<z.infer<typeof correctionSchema>>;
  onSubmit: (values: z.infer<typeof correctionSchema>) => void;
  isLoading: boolean;
  isFirstChallenge: boolean;
}

export default function CorrectionForm({ form, onSubmit, isLoading, isFirstChallenge }: CorrectionFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          {isFirstChallenge ? "Step 2: Human Challenge" : "Challenge Again"}
        </CardTitle>
        <CardDescription>
          Challenge the AI's belief. What did it miss? What should it change? Be concise and clear.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="correction"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Focus more on the impact on independent authors and less on large publishing houses.'"
                      className="min-h-[120px] resize-none"
                      {...field}
                      onKeyDown={handleKeyDown}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full" variant="accent">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Revising...
                </>
              ) : (
                <>
                  <Edit /> {isFirstChallenge ? "Revise Belief" : "Revise Belief Again"}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
