import type { GenerateInitialAIResponseOutput } from '@/ai/flows/generate-initial-ai-response';
import type { GenerateRevisedAIResponseOutput } from '@/ai/flows/generate-revised-ai-response';

export type Belief = GenerateInitialAIResponseOutput;

export interface Revision extends GenerateRevisedAIResponseOutput {
  humanCorrection: string;
  previousConfidenceScore: number;
}

export interface RealityLoop {
  id: string;
  question: string;
  initialBelief: Belief;
  revisions: Revision[];
  createdAt: string;
}
