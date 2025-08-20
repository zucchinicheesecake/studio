/**
 * @fileOverview Generates the genesis block code for a cryptocurrency based on user-provided parameters.
 *
 * - generateGenesisBlockCode - A function that generates genesis block code.
 * - GenesisBlockCodeInput - The input type for the generateGenesisBlockCode function.
 * - GenesisBlockCodeOutput - The return type for the generateGenesisBlockCode function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenesisBlockCodeInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  coinAbbreviation: z.string().describe('The abbreviation for the cryptocurrency (e.g., BTC).'),
  addressLetter: z.string().describe('The starting letter for public addresses.'),
  coinUnit: z.string().describe('The name of the smallest unit for the coin (e.g., Satoshi).'),
  timestamp: z.string().describe('A unique sentence to store inside the genesis block.'),
  blockReward: z.number().describe('The number of coins received for mining a block.'),
  blockHalving: z.number().describe('The block number at which the block reward is cut in half.'),
  coinSupply: z.number().describe('The total number of coins the cryptocurrency will create.'),
});

export type GenesisBlockCodeInput = z.infer<typeof GenesisBlockCodeInputSchema>;

const GenesisBlockCodeOutputSchema = z.object({
  genesisBlockCode: z.string().describe('The generated genesis block code.'),
});

export type GenesisBlockCodeOutput = z.infer<typeof GenesisBlockCodeOutputSchema>;

export async function generateGenesisBlockCode(input: GenesisBlockCodeInput): Promise<GenesisBlockCodeOutput> {
  return generateGenesisBlockCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'genesisBlockCodePrompt',
  input: {schema: GenesisBlockCodeInputSchema},
  output: {schema: GenesisBlockCodeOutputSchema},
  prompt: `You are an expert in blockchain technology and cryptocurrency development. Your task is to generate the genesis block code for a new cryptocurrency based on the following parameters provided by the user:

Coin Name: {{{coinName}}}
Coin Abbreviation: {{{coinAbbreviation}}}
Address Letter: {{{addressLetter}}}
Coin Unit: {{{coinUnit}}}
Timestamp: {{{timestamp}}}
Block Reward: {{{blockReward}}}
Block Halving: {{{blockHalving}}}
Coin Supply: {{{coinSupply}}}

Based on these parameters, generate the genesis block code. The code should be well-formatted and ready to be integrated into the cryptocurrency's source code. Pay specific attention to using the timestamp provided in the genesis block.

Ensure that the generated code includes the timestamp and adheres to standard cryptocurrency genesis block conventions.
`,
});

const generateGenesisBlockCodeFlow = ai.defineFlow(
  {
    name: 'generateGenesisBlockCodeFlow',
    inputSchema: GenesisBlockCodeInputSchema,
    outputSchema: GenesisBlockCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
