
'use server';
/**
 * @fileOverview This file defines a Genkit flow for creating a network configuration file for a cryptocurrency.
 *
 * - createNetworkConfigurationFile - A function that generates the network configuration file.
 * - CreateNetworkConfigurationFileInput - The input type for the createNetworkConfigurationFile function.
 * - CreateNetworkConfigurationFileOutput - The return type for the createNetworkConfigurationFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateNetworkConfigurationFileInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  ticker: z.string().describe('The abbreviation for the cryptocurrency (e.g., BTC).'),
  addressLetter: z.string().describe('The starting letter for public addresses.'),
  coinUnit: z.string().describe('The name of the smallest unit of the coin (e.g., Satoshi).'),
  blockReward: z.number().describe('The number of coins received for mining a block.'),
  blockHalving: z.number().describe('The block number at which the block reward is halved.'),
  coinSupply: z.number().describe('The total number of coins that will be created.'),
  coinbaseMaturity: z.number().describe('The number of blocks that must pass before a mined block can be spent.'),
  numberOfConfirmations: z.number().describe('The number of blocks that must pass before a transaction is considered confirmed.'),
  targetSpacingInMinutes: z.number().describe('The target time in minutes to mine each block.'),
  targetTimespanInMinutes: z.number().describe('The target time in minutes before the network difficulty is readjusted.'),
});

export type CreateNetworkConfigurationFileInput = z.infer<
  typeof CreateNetworkConfigurationFileInputSchema
>;

const CreateNetworkConfigurationFileOutputSchema = z.object({
  networkConfigurationFile: z.string().describe('The generated network configuration file content.'),
});

export type CreateNetworkConfigurationFileOutput = z.infer<
  typeof CreateNetworkConfigurationFileOutputSchema
>;

export async function createNetworkConfigurationFile(
  input: CreateNetworkConfigurationFileInput
): Promise<CreateNetworkConfigurationFileOutput> {
  return createNetworkConfigurationFileFlow(input);
}

const createNetworkConfigurationFileFlow = ai.defineFlow(
  {
    name: 'createNetworkConfigurationFileFlow',
    inputSchema: CreateNetworkConfigurationFileInputSchema,
    outputSchema: CreateNetworkConfigurationFileOutputSchema,
  },
  async (input) => {
    const content = `
# Network configuration for ${input.coinName}
coin.name=${input.coinName}
coin.abbreviation=${input.ticker}
address.letter=${input.addressLetter}
coin.unit=${input.coinUnit}
block.reward=${input.blockReward}
block.halving=${input.blockHalving}
coin.supply=${input.coinSupply}
coinbase.maturity=${input.coinbaseMaturity}
confirmations=${input.numberOfConfirmations}
target.spacing=${input.targetSpacingInMinutes}
target.timespan=${input.targetTimespanInMinutes}
`.trim();

    return { networkConfigurationFile: content };
  }
);
