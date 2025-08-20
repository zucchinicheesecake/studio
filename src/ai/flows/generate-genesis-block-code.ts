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

const generateGenesisBlockCodeFlow = ai.defineFlow(
  {
    name: 'generateGenesisBlockCodeFlow',
    inputSchema: GenesisBlockCodeInputSchema,
    outputSchema: GenesisBlockCodeOutputSchema,
  },
  async (input) => {
    const genesisBlockCode = `
// Genesis Block for ${input.coinName} (${input.coinAbbreviation})
static CBlock CreateGenesisBlock(uint32_t nTime, uint32_t nNonce, uint32_t nBits, int32_t nVersion, const CAmount& genesisReward)
{
    const char* pszTimestamp = "${input.timestamp}";
    CMutableTransaction txNew;
    txNew.nVersion = 1;
    txNew.vin.resize(1);
    txNew.vout.resize(1);
    txNew.vin[0].scriptSig = CScript() << 486604799 << CScriptNum(4) << std::vector<unsigned char>((const unsigned char*)pszTimestamp, (const unsigned char*)pszTimestamp + strlen(pszTimestamp));
    txNew.vout[0].nValue = genesisReward;
    txNew.vout[0].scriptPubKey = CScript() << ParseHex("04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f") << OP_CHECKSIG;

    CBlock genesis;
    genesis.nTime    = nTime;
    genesis.nBits    = nBits;
    genesis.nNonce   = nNonce;
    genesis.nVersion = nVersion;
    genesis.vtx.push_back(MakeTransactionRef(std::move(txNew)));
    genesis.hashPrevBlock.SetNull();
    genesis.hashMerkleRoot = BlockMerkleRoot(genesis);
    return genesis;
}
`.trim();

    return { genesisBlockCode };
  }
);
