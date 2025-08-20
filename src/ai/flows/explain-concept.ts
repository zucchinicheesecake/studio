
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

const predefinedExplanations: Record<string, string> = {
    'Target Audience': 'Your target audience is the specific group of people you want to reach with your project. Defining this helps tailor your marketing, features, and community efforts effectively. Think about their needs, motivations, and where they spend their time online.',
    'Token Utility': "Token utility refers to the specific purpose or use case of your cryptocurrency within its ecosystem. It's what gives the token value beyond just speculation. Examples include governance rights (voting), paying for network fees, or accessing exclusive features.",
    'Token Distribution': 'Token distribution outlines how your total supply of tokens will be allocated among different groups, such as the community, development team, investors, and ecosystem fund. A well-planned distribution model is crucial for long-term project health and decentralization.',
  };
  

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
    const predefined = predefinedExplanations[concept];
    if (predefined) {
      return { explanation: predefined };
    }

    const { output } = await prompt({ concept });
    return { explanation: output!.explanation! };
  }
);
