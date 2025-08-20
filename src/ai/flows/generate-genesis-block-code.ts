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

Here's an example of what a genesis block might look like (this is just a template, use the user provided information):

```c++
static CBlock CreateGenesisBlock(uint32_t nTime, uint256 nNonce, uint32_t nBits, int32_t nVersion, const CAmount& genesisReward) {
    const char* pszTimestamp = \"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks\";
    const CScript genesisOutputScript = CScript() << ParseHex(\"04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38\") << OP_CHECKSIG;
    return CreateGenesisBlock(genesisOutputScript, nTime, nNonce, nBits, nVersion, genesisReward);
}
```

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
