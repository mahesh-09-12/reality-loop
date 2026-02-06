"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RefreshCcw, Save, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getInitialResponse, getRevisedResponse } from "@/app/actions";
import type { RealityLoop, Belief, Revision } from "./shared";
import QuestionForm from "./question-form";
import InitialResponseCard from "./initial-response-card";
import CorrectionForm from "./correction-form";
import RevisedResponseCard, { RevisedResponseCardSkeleton } from "./revised-response-card";
import { Separator } from "../ui/separator";
import { HistoryDialog } from "./history-dialog";

const questionSchema = z.object({
  question: z.string().min(10, { message: "Please ask a more detailed question." }).max(500),
});

const correctionSchema = z.object({
  correction: z.string().min(5, { message: "Please provide more detail." }).max(500),
});

const LOCAL_STORAGE_KEY = "realityloop_history";

const StepIndicator = () => (
    <div className="mb-8 flex items-center justify-center text-sm text-muted-foreground">
      <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
        <span>Initial Belief</span>
        <span className="text-primary font-semibold">→</span>
        <span>Human Challenge</span>
        <span className="text-primary font-semibold">→</span>
        <span>Revised Belief</span>
        <span className="text-primary font-semibold">→</span>
        <span className="flex items-center gap-1">
          <RefreshCcw className="h-3 w-3" /> Repeat
        </span>
      </div>
    </div>
  );

export default function RealityLoopClient() {
  const { toast } = useToast();
  const [activeLoop, setActiveLoop] = useState<Omit<RealityLoop, 'id' | 'createdAt'> | null>(null);
  
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingRevised, setIsLoadingRevised] = useState(false);
  
  const [savedLoops, setSavedLoops] = useState<RealityLoop[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setSavedLoops(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load history from local storage:", error);
    }
  }, []);

  const questionForm = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: { question: "" },
  });

  const correctionForm = useForm<z.infer<typeof correctionSchema>>({
    resolver: zodResolver(correctionSchema),
    defaultValues: { correction: "" },
  });

  const handleQuestionSubmit = async (values: z.infer<typeof questionSchema>) => {
    setIsLoadingInitial(true);
    setActiveLoop(null);
    correctionForm.reset();
    
    const { data, error } = await getInitialResponse(values);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error });
    } else {
      setActiveLoop({
        question: values.question,
        initialBelief: data,
        revisions: [],
      });
    }
    setIsLoadingInitial(false);
  };

  const handleCorrectionSubmit = async (values: z.infer<typeof correctionSchema>) => {
    if (!activeLoop?.initialBelief) return;

    const latestBelief = activeLoop.revisions.length > 0 
      ? {
          answer: activeLoop.revisions[activeLoop.revisions.length - 1].revisedResponse,
          confidenceScore: activeLoop.revisions[activeLoop.revisions.length - 1].updatedConfidenceScore,
          assumptions: activeLoop.initialBelief.assumptions, // Assumptions are not revised in this flow
          uncertainties: activeLoop.initialBelief.uncertainties, // Uncertainties are not revised in this flow
        }
      : activeLoop.initialBelief;
    
    setIsLoadingRevised(true);

    const { data, error } = await getRevisedResponse({
      question: activeLoop.question,
      initialResponse: latestBelief,
      humanCorrection: values.correction,
    });
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error });
    } else if (data) {
      const newRevision: Revision = {
        ...data,
        humanCorrection: values.correction,
        previousConfidenceScore: latestBelief.confidenceScore,
      };
      setActiveLoop(prev => prev ? { ...prev, revisions: [...prev.revisions, newRevision] } : null);
      correctionForm.reset();
    }
    setIsLoadingRevised(false);
  };

  const handleSave = () => {
    if (!activeLoop?.initialBelief) return;
    setIsSaving(true);
    try {
      const newLoop: RealityLoop = {
        ...activeLoop,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedLoops = [newLoop, ...savedLoops];
      setSavedLoops(updatedLoops);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLoops));
      toast({ title: "Belief Loop Saved", description: "Your RealityLoop session has been saved." });
    } catch (error) {
      console.error("Failed to save to local storage:", error);
      toast({ variant: "destructive", title: "Save Failed", description: "Could not save belief loop." });
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    questionForm.reset();
    correctionForm.reset();
    setActiveLoop(null);
    setIsLoadingInitial(false);
    setIsLoadingRevised(false);
  };

  const handleSelectLoop = (loop: RealityLoop) => {
    questionForm.setValue("question", loop.question);
    setActiveLoop({
      question: loop.question,
      initialBelief: loop.initialBelief,
      revisions: loop.revisions,
    });
    setIsHistoryOpen(false);
  };

  const handleDeleteLoop = (loopId: string) => {
    const updatedLoops = savedLoops.filter(l => l.id !== loopId);
    setSavedLoops(updatedLoops);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLoops));
    toast({ title: "Belief Loop Deleted" });
  };
  
  const handleClearHistory = () => {
    setSavedLoops([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast({ title: "History Cleared" });
  };


  const showCorrectionForm = activeLoop?.initialBelief && !isLoadingInitial;

  return (
    <div className="container py-8">
      <StepIndicator />
      <div className="flex flex-col sm:flex-row justify-end items-center mb-4 gap-2">
          <Button onClick={handleSave} disabled={isSaving || !activeLoop?.initialBelief} className="w-full sm:w-auto">
              <Save /> {isSaving ? "Saving..." : "Save Belief Loop"}
          </Button>
          <Button variant="outline" onClick={() => setIsHistoryOpen(true)} className="w-full sm:w-auto">
              <History /> View History
          </Button>
          <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              <RefreshCcw /> Start Over
          </Button>
      </div>
      <Separator className="mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-8">
          <QuestionForm form={questionForm} onSubmit={handleQuestionSubmit} isLoading={isLoadingInitial} />
          {showCorrectionForm && (
            <>
              <Separator />
              <CorrectionForm form={correctionForm} onSubmit={handleCorrectionSubmit} isLoading={isLoadingRevised} isFirstChallenge={activeLoop?.revisions?.length === 0} />
            </>
          )}
        </div>

        <div className="space-y-8 mt-8 lg:mt-0">
          <InitialResponseCard response={activeLoop?.initialBelief ?? null} isLoading={isLoadingInitial} />
          {activeLoop && activeLoop.revisions.length > 0 && <Separator />}
          {activeLoop?.revisions.map((revision, index) => (
            <RevisedResponseCard key={index} revision={revision} index={index} />
          ))}
          {isLoadingRevised && (
            <>
              <Separator />
              <RevisedResponseCardSkeleton />
            </>
          )}
        </div>
      </div>
      
      <HistoryDialog 
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        loops={savedLoops}
        onSelect={handleSelectLoop}
        onDelete={handleDeleteLoop}
        onClear={handleClearHistory}
      />
    </div>
  );
}
