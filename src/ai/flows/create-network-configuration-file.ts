
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
import { formSchema } from '@/app/types';

const CreateNetworkConfigurationFileInputSchema = formSchema;

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
# Network configuration for ${input.projectName}
coin.name=${input.projectName}
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
