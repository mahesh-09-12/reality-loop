"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RealityLoop } from "./shared";
import { Trash2 } from "lucide-react";

interface HistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loops: RealityLoop[];
  onSelect: (loop: RealityLoop) => void;
  onDelete: (loopId: string) => void;
  onClear: () => void;
}

export function HistoryDialog({
  isOpen,
  onOpenChange,
  loops,
  onSelect,
  onDelete,
  onClear,
}: HistoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Saved Belief Loops</DialogTitle>
          <DialogDescription>
            Here are your saved RealityLoop sessions. Click one to view it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-72 w-full">
            {loops.length > 0 ? (
              <div className="space-y-2">
                {loops.map((loop) => (
                  <div
                    key={loop.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <button
                      className="flex-1 text-left"
                      onClick={() => onSelect(loop)}
                    >
                      <p className="font-medium truncate">{loop.question}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(loop.createdAt).toLocaleString()}
                      </p>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(loop.id)}
                      aria-label="Delete belief loop"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No saved belief loops yet.</p>
              </div>
            )}
          </ScrollArea>
        </div>
        {loops.length > 0 && (
          <div className="flex justify-end">
            <Button variant="destructive" onClick={onClear}>
              Clear All History
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
