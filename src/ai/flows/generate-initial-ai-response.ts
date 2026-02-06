// This file implements the Genkit flow for generating the initial AI response to a user's question.

'use server';

/**
 * @fileOverview Generates the initial AI response to a user's question, including the answer, confidence score, assumptions, and potential uncertainties.
 *
 * - generateInitialAIResponse - A function that generates the initial AI response.
 * - GenerateInitialAIResponseInput - The input type for the generateInitialAIResponse function.
 * - GenerateInitialAIResponseOutput - The return type for the generateInitialAIResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialAIResponseInputSchema = z.object({
  question: z.string().describe('The question to be answered by the AI.'),
});
export type GenerateInitialAIResponseInput = z.infer<
  typeof GenerateInitialAIResponseInputSchema
>;

const GenerateInitialAIResponseOutputSchema = z.object({
  answer: z.string().describe('The AI generated answer to the question.'),
  confidenceScore: z
    .number()
    .describe(
      'A justified confidence score from 0.0 to 0.9, reflecting the identified uncertainties. Never 1.0.'
    ),
  assumptions: z
    .array(z.string())
    .describe('The assumptions made by the AI in answering the question.'),
  uncertainties: z
    .array(z.string())
    .describe(
      'The potential uncertainties or areas of concern related to the AI answer. Each uncertainty should explain why it matters.'
    ),
});
export type GenerateInitialAIResponseOutput = z.infer<
  typeof GenerateInitialAIResponseOutputSchema
>;

export async function generateInitialAIResponse(
  input: GenerateInitialAIResponseInput
): Promise<GenerateInitialAIResponseOutput> {
  return generateInitialAIResponseFlow(input);
}

const generateInitialAIResponsePrompt = ai.definePrompt({
  name: 'generateInitialAIResponsePrompt',
  input: {schema: GenerateInitialAIResponseInputSchema},
  output: {schema: GenerateInitialAIResponseOutputSchema},
  prompt: `You are an AI assistant that provides thoughtful and well-reasoned answers, demonstrating epistemic humility.

  Analyze the following question:
  {{question}}
  
  Generate a response with the following elements:
  1.  **Answer**: A clear, concise answer.
  2.  **Uncertainties**: A list of specific potential uncertainties in your answer. For each, explain why it matters. If there are no uncertainties, provide an empty array.
  3.  **Assumptions**: A list of assumptions made to arrive at the answer.
  4.  **Confidence Score**: A numerical score between 0.0 and 0.9.
  
  **Confidence Score Rules:**
  - You must never output 1.0 (100%) confidence. The maximum is 0.9.
  - Your confidence must be directly and justifiably tied to your stated uncertainties.
  - Start with a baseline (e.g., 0.9) and reduce it for each uncertainty. A minor uncertainty might reduce confidence by 0.05; a major one might reduce it by 0.2 or more.
  - If there are uncertainties, your confidence must be less than 0.9.

  Ensure the final output is a valid JSON object.
  `,
});

const generateInitialAIResponseFlow = ai.defineFlow(
  {
    name: 'generateInitialAIResponseFlow',
    inputSchema: GenerateInitialAIResponseInputSchema,
    outputSchema: GenerateInitialAIResponseOutputSchema,
  },
  async input => {
    const {output} = await generateInitialAIResponsePrompt(input);
    return output!;
  }
);
