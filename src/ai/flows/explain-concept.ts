
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
    'Mission Statement': 'A short, powerful sentence that declares the core purpose and goal of your project. It should answer the question: "Why does this project exist?"',
    'Target Audience': 'The specific group of people you are trying to reach and serve with your project. Defining this helps tailor your messaging, features, and overall strategy. For example, are you building for developers, gamers, artists, or financial institutions?',
    'Brand Voice': 'The distinct personality your project uses in its communications. Is it professional and serious, or fun and rebellious? This tone should be consistent across your website, social media, and announcements.',
    'Tagline': "A very short, catchy phrase that's easy to remember and captures the essence of your brand. Think of it as a slogan.",
    'Logo Design': 'A visual representation of your project. A good logo is simple, memorable, and reflects the core identity of your cryptocurrency.',
    'Token Utility': "The specific purpose or use case of your cryptocurrency within its ecosystem. What can you do with it? Common utilities include governance (voting on proposals), paying transaction fees, staking for network security, or accessing exclusive features.",
    'Token Distribution': 'The plan for how the initial supply of your cryptocurrency will be allocated. This is crucial for transparency and demonstrating the long-term vision of the project. A typical distribution might allocate percentages to the community, development team, early investors, and a public sale.',
    'Community Strategy': 'The plan for how you will attract, grow, and engage a vibrant community around your project. This can include activities like online events, educational content, social media campaigns, and developer grant programs.',
    'Block Reward': 'The number of new coins that are "minted" and awarded to a miner for successfully validating a new block of transactions.',
    'Block Halving': 'A pre-programmed event that cuts the block reward in half. It happens at a specific block number to create scarcity and control inflation over time.',
    'Total Coin Supply': 'The absolute maximum number of coins that will ever be created for this cryptocurrency. Once this number is reached, no new coins can be minted.',
    'Genesis Block Timestamp': "A unique piece of text or data embedded in the very first block (the 'genesis block') of the blockchain. It often contains a headline from the day it was created, serving as a proof-of-creation timestamp.",
    'Address Prefix': "The character that all public addresses for your cryptocurrency will begin with. For example, Bitcoin addresses often start with '1' or '3', and Ethereum addresses start with '0x'.",
    'Coin Unit': "The name for the smallest divisible unit of your cryptocurrency, similar to how a 'satoshi' is the smallest unit of Bitcoin.",
    'Coinbase Maturity': 'The number of blocks that must pass before the coins from a block reward can actually be spent by the miner who earned them. This prevents blockchain reorganizations from invalidating newly minted coins.',
    'Number of Confirmations': 'The number of blocks that must be mined on top of the block containing a transaction before that transaction is considered final and irreversible.',
    'Target Spacing': 'The ideal amount of time, in minutes, between the creation of new blocks on the network. This setting directly impacts transaction confirmation times.',
    'Target Timespan': 'The timeframe, in minutes, over which the network difficulty is recalculated. The difficulty adjusts to try and maintain the "Target Spacing" between blocks, even as more or less mining power joins the network.',
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
