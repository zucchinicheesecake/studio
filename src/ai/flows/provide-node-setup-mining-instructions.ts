'use server';
/**
 * @fileOverview Provides instructions on how to set up the initial node and begin mining for a cryptocurrency.
 *
 * - provideNodeSetupMiningInstructions - A function that generates node setup and mining instructions.
 * - ProvideNodeSetupMiningInstructionsInput - The input type for the provideNodeSetupMiningInstructions function.
 * - ProvideNodeSetupMiningInstructionsOutput - The return type for the provideNodeSetupMiningInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideNodeSetupMiningInstructionsInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  coinSymbol: z.string().describe('The symbol of the cryptocurrency (e.g., BTC).'),
  genesisBlockCode: z.string().describe('The genesis block code for the cryptocurrency.'),
  networkParameters: z.string().describe('The network parameters configuration.'),
  compilationInstructions: z.string().describe('Instructions on how to compile the cryptocurrency.'),
});
export type ProvideNodeSetupMiningInstructionsInput = z.infer<typeof ProvideNodeSetupMiningInstructionsInputSchema>;

const ProvideNodeSetupMiningInstructionsOutputSchema = z.object({
  instructions: z.string().describe('Instructions on how to set up the initial node and begin mining.'),
});
export type ProvideNodeSetupMiningInstructionsOutput = z.infer<typeof ProvideNodeSetupMiningInstructionsOutputSchema>;

export async function provideNodeSetupMiningInstructions(input: ProvideNodeSetupMiningInstructionsInput): Promise<ProvideNodeSetupMiningInstructionsOutput> {
  return provideNodeSetupMiningInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideNodeSetupMiningInstructionsPrompt',
  input: {schema: ProvideNodeSetupMiningInstructionsInputSchema},
  output: {schema: ProvideNodeSetupMiningInstructionsOutputSchema},
  prompt: `You are an expert in cryptocurrency and blockchain technology. Based on the provided information about a new cryptocurrency, provide clear and concise instructions on how to set up the initial node and begin mining. Consider various operating systems and provide general guidance applicable to most users.

Coin Name: {{{coinName}}}
Coin Symbol: {{{coinSymbol}}}
Genesis Block Code: {{{genesisBlockCode}}}
Network Parameters: {{{networkParameters}}}
Compilation Instructions: {{{compilationInstructions}}}

Instructions should include steps on:
1. Setting up the wallet or node software.
2. Configuring the network parameters.
3. Starting the mining process (if applicable for the consensus mechanism).
4. Best practices for securing the node.
5. How to verify the node is running correctly.

Ensure the instructions are easy to follow for users with varying levels of technical expertise.
`,
});

const provideNodeSetupMiningInstructionsFlow = ai.defineFlow(
  {
    name: 'provideNodeSetupMiningInstructionsFlow',
    inputSchema: ProvideNodeSetupMiningInstructionsInputSchema,
    outputSchema: ProvideNodeSetupMiningInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
