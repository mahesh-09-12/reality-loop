"use client";

import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Bot, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const questionSchema = z.object({
  question: z.string().min(10).max(500),
});

interface QuestionFormProps {
  form: UseFormReturn<z.infer<typeof questionSchema>>;
  onSubmit: (values: z.infer<typeof questionSchema>) => void;
  isLoading: boolean;
}

export default function QuestionForm({ form, onSubmit, isLoading }: QuestionFormProps) {
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
          Step 1: Initial AI Belief
        </CardTitle>
        <CardDescription>
          Ask a question to get the AI's initial belief.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., What are the main ethical considerations of using generative AI in creative writing?"
                      className="min-h-[120px] resize-none"
                      {...field}
                      onKeyDown={handleKeyDown}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Bot /> Get Initial Belief
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
