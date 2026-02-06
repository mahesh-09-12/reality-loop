'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating revised AI responses based on human correction.
 *
 * - generateRevisedAIResponse - A function that accepts a question, initial AI response, and human correction,
 *   and returns a revised AI response with changes highlighted and an updated confidence score.
 * - GenerateRevisedAIResponseInput - The input type for the generateRevisedAIResponse function.
 * - GenerateRevisedAIResponseOutput - The return type for the generateRevisedAIResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialAIResponseSchema = z.object({
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

const GenerateRevisedAIResponseInputSchema = z.object({
  question: z.string().describe('The original question asked.'),
  initialResponse: InitialAIResponseSchema.describe('The full initial AI response object, including answer, uncertainties, and confidence score.'),
  humanCorrection: z.string().describe('The human correction provided to refine the AI response.'),
});
export type GenerateRevisedAIResponseInput = z.infer<typeof GenerateRevisedAIResponseInputSchema>;

const GenerateRevisedAIResponseOutputSchema = z.object({
  revisedResponse: z.string().describe('The revised AI response incorporating the human correction.'),
  changesMade: z.string().describe('A summary of what changed, why, and how it affected confidence.'),
  updatedConfidenceScore: z.number().describe('The updated confidence score for the revised response (0-1), which may or may not have changed.'),
});
export type GenerateRevisedAIResponseOutput = z.infer<typeof GenerateRevisedAIResponseOutputSchema>;

export async function generateRevisedAIResponse(input: GenerateRevisedAIResponseInput): Promise<GenerateRevisedAIResponseOutput> {
  return generateRevisedAIResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRevisedAIResponsePrompt',
  input: {schema: GenerateRevisedAIResponseInputSchema},
  output: {schema: GenerateRevisedAIResponseOutputSchema},
  prompt: `You are an AI assistant that revises its answers based on human feedback, demonstrating transparent belief revision.

You have been given:
1.  **Original Question**: "{{question}}"
2.  **Your Initial Response**:
    -   **Answer**: "{{initialResponse.answer}}"
    -   **Uncertainties**: {{#each initialResponse.uncertainties}}- {{this}}\n{{/each}}
    -   **Confidence**: {{initialResponse.confidenceScore}}
3.  **Human Correction**: "{{humanCorrection}}"

Your task is to generate a revised response. Follow these rules strictly:

**1. Analyze the Correction:**
   - Determine which of your initial uncertainties the human correction addresses.
   - Decide if the correction **resolves**, **worsens**, or leaves the uncertainty **unchanged**.
   - If the correction is only about wording and doesn't affect any uncertainty, note this.

**2. Update Confidence Score:**
   - Confidence **MUST NOT** change if no uncertainty is materially affected.
   - If an uncertainty is **resolved**: Increase confidence by +0.05 to +0.15. The new confidence cannot exceed 0.99.
   - If an uncertainty is **worsened**: Decrease confidence.
   - If an uncertainty is **unchanged**: Confidence **MUST** remain the same.

**3. Generate Revised Output:**
   - **revisedResponse**: The new answer incorporating the feedback.
   - **updatedConfidenceScore**: The new confidence score, calculated according to the rules above.
   - **changesMade**: A clear explanation of your reasoning. This MUST include which uncertainty was affected (if any), how it was affected (resolved, unchanged, worsened), and a justification for why your confidence score changed or did not change.

**Example for 'changesMade':**
- "The human correction resolved my uncertainty about the specific timeframe of the data. This was a core uncertainty, so I have increased my confidence from 0.65 to 0.80. The answer has been updated to focus only on the 21st century."
- "The feedback clarified the wording, which improved readability but did not resolve any of my underlying uncertainties about data sources. Therefore, my confidence score remains unchanged at 0.75."
`, config: {safetySettings: [{
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateRevisedAIResponseFlow = ai.defineFlow(
  {
    name: 'generateRevisedAIResponseFlow',
    inputSchema: GenerateRevisedAIResponseInputSchema,
    outputSchema: GenerateRevisedAIResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
