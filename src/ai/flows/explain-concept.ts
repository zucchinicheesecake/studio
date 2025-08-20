
'use server';
/**
 * @fileOverview A flow for explaining a cryptocurrency concept.
 *
 * - explainConcept - A function that explains a given technical concept.
 * - ExplainConceptInput - The input type for the explainConcept function.
 * - ExplainConceptOutput - The return type for the explainConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainConceptInputSchema = z.object({
  concept: z.string().describe('The technical cryptocurrency concept to explain.'),
});
export type ExplainConceptInput = z.infer<typeof ExplainConceptInputSchema>;

const ExplainConceptOutputSchema = z.object({
  explanation: z.string().describe("A simple, easy-to-understand explanation of the concept."),
});
export type ExplainConceptOutput = z.infer<typeof ExplainConceptOutputSchema>;

export async function explainConcept(input: ExplainConceptInput): Promise<ExplainConceptOutput> {
  return explainConceptFlow(input);
}

const prompt = ai.definePrompt({
    name: 'explainConceptPrompt',
    input: {schema: ExplainConceptInputSchema},
    output: {schema: ExplainConceptOutputSchema},
    prompt: `You are an expert at explaining complex cryptocurrency and blockchain concepts to beginners.

    Explain the following concept in a simple, clear, and concise way (2-3 sentences max). Use an analogy if it helps. Avoid overly technical jargon.

    Concept: {{{concept}}}
    `,
});


const explainConceptFlow = ai.defineFlow(
  {
    name: 'explainConceptFlow',
    inputSchema: ExplainConceptInputSchema,
    outputSchema: ExplainConceptOutputSchema,
  },
  async ({ concept }) => {
    const { output } = await prompt({ concept });
    return { explanation: output!.explanation! };
  }
);
