
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a cryptocurrency whitepaper.
 *
 * - generateWhitepaper - A function that generates the whitepaper content.
 * - GenerateWhitepaperInput - The input type for the generateWhitepaper function.
 * - GenerateWhitepaperOutput - The return type for the generateWhitepaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWhitepaperInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  coinAbbreviation: z.string().describe('The abbreviation for the cryptocurrency (e.g., BTC).'),
  problemStatement: z.string().describe('The problem the cryptocurrency aims to solve.'),
  solutionStatement: z.string().describe('How the cryptocurrency solves the problem.'),
  keyFeatures: z.string().describe('A summary of the key features of the cryptocurrency.'),
  consensusMechanism: z.string().describe('The consensus mechanism used.'),
  tokenomics: z.string().describe('A summary of the coin\'s tokenomics (supply, distribution, etc.).'),
});

export type GenerateWhitepaperInput = z.infer<
  typeof GenerateWhitepaperInputSchema
>;

const GenerateWhitepaperOutputSchema = z.object({
  whitepaperContent: z.string().describe('The generated whitepaper content in Markdown format.'),
});

export type GenerateWhitepaperOutput = z.infer<
  typeof GenerateWhitepaperOutputSchema
>;

export async function generateWhitepaper(
  input: GenerateWhitepaperInput
): Promise<GenerateWhitepaperOutput> {
  return generateWhitepaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWhitepaperPrompt',
  input: {schema: GenerateWhitepaperInputSchema},
  output: {schema: GenerateWhitepaperOutputSchema},
  prompt: `You are an expert in writing compelling and professional cryptocurrency whitepapers.

  Based on the following parameters, generate a detailed whitepaper in Markdown format for the new cryptocurrency, {{{coinName}}} ({{{coinAbbreviation}}}).

  ## Core Concepts
  - **Problem Statement:** {{{problemStatement}}}
  - **Proposed Solution:** {{{solutionStatement}}}
  - **Key Features:** {{{keyFeatures}}}

  ## Technical Details
  - **Consensus Mechanism:** {{{consensusMechanism}}}
  - **Tokenomics Summary:** {{{tokenomics}}}

  Structure the whitepaper with the following sections:
  1.  **Abstract:** A brief summary of the entire paper.
  2.  **Introduction:** Elaborate on the problem statement. Discuss the current landscape and the opportunity for {{{coinName}}}.
  3.  **Solution: The {{{coinName}}} Protocol:** Detail the proposed solution. Explain the architecture and how it works.
  4.  **Key Features:** Describe the key features in detail.
  5.  **Tokenomics:** Provide a detailed breakdown of the {{{coinAbbreviation}}} tokenomics, including total supply, distribution plan, and utility.
  6.  **Consensus:** Explain the chosen consensus mechanism ({{{consensusMechanism}}}) and why it was selected.
  7.  **Roadmap:** Create a plausible future roadmap with milestones (e.g., Mainnet Launch, Wallet Development, Exchange Listings, Community Growth).
  8.  **Conclusion:** Summarize the paper and reiterate the vision for {{{coinName}}}.

  The tone should be professional, authoritative, and optimistic. The content should be well-organized and easy to read. Ensure the output is valid Markdown.
  `,
});

const generateWhitepaperFlow = ai.defineFlow(
  {
    name: 'generateWhitepaperFlow',
    inputSchema: GenerateWhitepaperInputSchema,
    outputSchema: GenerateWhitepaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {whitepaperContent: output!.whitepaperContent!};
  }
);
