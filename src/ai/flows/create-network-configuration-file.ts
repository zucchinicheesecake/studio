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
  coinAbbreviation: z.string().describe('The abbreviation for the cryptocurrency (e.g., BTC).'),
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

const prompt = ai.definePrompt({
  name: 'createNetworkConfigurationFilePrompt',
  input: {schema: CreateNetworkConfigurationFileInputSchema},
  output: {schema: CreateNetworkConfigurationFileOutputSchema},
  prompt: `You are an expert cryptocurrency configuration file generator.

  Based on the following parameters, generate a network configuration file for the cryptocurrency.

  Coin Name: {{{coinName}}}
  Coin Abbreviation: {{{coinAbbreviation}}}
  Address Letter: {{{addressLetter}}}
  Coin Unit: {{{coinUnit}}}
  Block Reward: {{{blockReward}}}
  Block Halving: {{{blockHalving}}}
  Coin Supply: {{{coinSupply}}}
  Coinbase Maturity: {{{coinbaseMaturity}}}
  Number of Confirmations: {{{numberOfConfirmations}}}
  Target Spacing in Minutes: {{{targetSpacingInMinutes}}}
  Target Timespan in Minutes: {{{targetTimespanInMinutes}}}

  The network configuration file should include all these parameters in a suitable format for configuring the cryptocurrency network.
  Ensure that the generated file is well-formatted and easy to read.
  Assume the format is similar to a standard .conf file with key-value pairs.

  Example:
  # Network configuration for {{{coinName}}}
  coin.name={{{coinName}}}
  coin.abbreviation={{{coinAbbreviation}}}
  address.letter={{{addressLetter}}}
  coin.unit={{{coinUnit}}}
  block.reward={{{blockReward}}}
  block.halving={{{blockHalving}}}
  coin.supply={{{coinSupply}}}
  coinbase.maturity={{{coinbaseMaturity}}}
  confirmations={{{numberOfConfirmations}}}
  target.spacing={{{targetSpacingInMinutes}}}
  target.timespan={{{targetTimespanInMinutes}}}

  Return only the generated file content.
  `,
});

const createNetworkConfigurationFileFlow = ai.defineFlow(
  {
    name: 'createNetworkConfigurationFileFlow',
    inputSchema: CreateNetworkConfigurationFileInputSchema,
    outputSchema: CreateNetworkConfigurationFileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {networkConfigurationFile: output!.networkConfigurationFile!};
  }
);

