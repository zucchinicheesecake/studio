
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
  projectName: z.string().describe('The name of the cryptocurrency project.'),
  ticker: z.string().describe('The ticker symbol for the cryptocurrency (e.g., BTC).'),
  missionStatement: z.string().describe("The project's core mission statement."),
  targetAudience: z.string().describe('The target audience for the project.'),
  brandVoice: z.string().describe('The brand voice and tone.'),
  tokenUtility: z.string().describe("The utility of the project's token."),
  initialDistribution: z.string().describe('The plan for initial token distribution.'),
  consensusMechanism: z.string().describe('The consensus mechanism used.'),
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

  Based on the following strategic inputs, generate a detailed whitepaper in Markdown format for the new project, {{{projectName}}} ({{{ticker}}}).

  ## Core Concepts
  - **Mission:** {{{missionStatement}}}
  - **Target Audience:** {{{targetAudience}}}

  ## Technical & Economic Details
  - **Consensus Mechanism:** {{{consensusMechanism}}}
  - **Token Utility:** {{{tokenUtility}}}
  - **Initial Distribution:** {{{initialDistribution}}}

  Structure the whitepaper with the following sections:
  1.  **Abstract:** A brief summary of the entire paper.
  2.  **Introduction:** Elaborate on the problem {{{projectName}}} solves, derived from its mission. Discuss the current landscape and the opportunity.
  3.  **Vision & Mission:** Detail the project's long-term vision and core mission.
  4.  **The {{{projectName}}} Protocol:** Explain the architecture and how it works, tying it back to the mission.
  5.  **Target Audience Analysis:** Describe the target audience and why {{{projectName}}} is valuable to them.
  6.  **Tokenomics: The {{{ticker}}} Token:** Provide a detailed breakdown of the token model, including utility, supply, and the distribution plan.
  7.  **Consensus:** Explain the chosen consensus mechanism ({{{consensusMechanism}}}) and why it fits the project's goals.
  8.  **Roadmap:** Create a plausible future roadmap with milestones (e.g., Testnet Launch, Mainnet Launch, dApp Ecosystem Growth, DAO Formation).
  9.  **Conclusion:** Summarize the paper and reiterate the transformative potential of {{{projectName}}}.

  The tone should reflect the specified brand voice: '{{{brandVoice}}}'. The content must be well-organized, professional, and easy to read. Ensure the output is valid Markdown.
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
