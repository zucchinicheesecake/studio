'use server';
/**
 * @fileOverview This file defines a Genkit flow to provide step-by-step compilation instructions for building a cryptocurrency from source code.
 *
 * - provideCompilationGuidance - A function that handles the compilation guidance process.
 * - ProvideCompilationGuidanceInput - The input type for the provideCompilationGuidance function.
 * - ProvideCompilationGuidanceOutput - The return type for the provideCompilationGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideCompilationGuidanceInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  consensusMechanism: z.string().describe('The chosen consensus mechanism (e.g., Scrypt, SHA-256, X11).'),
  targetSpacing: z.number().describe('The target spacing in minutes for mining each block.'),
});
export type ProvideCompilationGuidanceInput = z.infer<typeof ProvideCompilationGuidanceInputSchema>;

const ProvideCompilationGuidanceOutputSchema = z.object({
  compilationInstructions: z.string().describe('Step-by-step instructions for compiling the cryptocurrency from source code.'),
});
export type ProvideCompilationGuidanceOutput = z.infer<typeof ProvideCompilationGuidanceOutputSchema>;

export async function provideCompilationGuidance(input: ProvideCompilationGuidanceInput): Promise<ProvideCompilationGuidanceOutput> {
  return provideCompilationGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideCompilationGuidancePrompt',
  input: {schema: ProvideCompilationGuidanceInputSchema},
  output: {schema: ProvideCompilationGuidanceOutputSchema},
  prompt: `You are an expert in compiling cryptocurrency source code. Based on the user's chosen parameters, provide detailed, step-by-step instructions on how to compile the source code for their cryptocurrency.\n\nConsider the chosen consensus mechanism: {{{consensusMechanism}}}.\nAlso consider the block target spacing: {{{targetSpacing}}} minutes.\nConsider the name of the coin: {{{coinName}}}.\n\nProvide comprehensive and beginner-friendly compilation instructions, including dependencies, commands, and troubleshooting tips.\n`,
});

const provideCompilationGuidanceFlow = ai.defineFlow(
  {
    name: 'provideCompilationGuidanceFlow',
    inputSchema: ProvideCompilationGuidanceInputSchema,
    outputSchema: ProvideCompilationGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
