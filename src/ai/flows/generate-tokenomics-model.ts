
'use server';
/**
 * @fileOverview A Genkit flow for generating a detailed tokenomics model.
 *
 * - generateTokenomicsModel - A function that generates the tokenomics model.
 * - GenerateTokenomicsModelInput - The input type for the function.
 * - GenerateTokenomicsModelOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTokenomicsModelInputSchema = z.object({
  projectName: z.string().describe("The name of the cryptocurrency project."),
  ticker: z.string().describe("The ticker symbol for the token."),
  tokenUtility: z.string().describe("The utility and purpose of the project's token."),
  initialDistribution: z.string().describe("The user's description of the initial token distribution plan."),
});

export type GenerateTokenomicsModelInput = z.infer<typeof GenerateTokenomicsModelInputSchema>;

const GenerateTokenomicsModelOutputSchema = z.object({
  tokenomicsModelContent: z.string().describe("The generated tokenomics model in Markdown format."),
});

export type GenerateTokenomicsModelOutput = z.infer<typeof GenerateTokenomicsModelOutputSchema>;

export async function generateTokenomicsModel(input: GenerateTokenomicsModelInput): Promise<GenerateTokenomicsModelOutput> {
  return generateTokenomicsModelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTokenomicsModelPrompt',
  input: {schema: GenerateTokenomicsModelInputSchema},
  output: {schema: GenerateTokenomicsModelOutputSchema},
  prompt: `You are an expert crypto-economist. Your task is to design a robust and sustainable tokenomics model for a new project.

  **Project Details:**
  - **Name:** {{{projectName}}} ({{{ticker}}})
  - **Token Utility:** {{{tokenUtility}}}
  - **Initial Distribution Idea:** {{{initialDistribution}}}

  **Instructions:**
  Generate a detailed tokenomics model in Markdown format. The model should be professional and well-structured.

  **Tokenomics Model Sections:**
  1.  **Token Overview:**
      -   **Token Name:** {{{projectName}}} Token
      -   **Ticker:** {{{ticker}}}
      -   **Total Supply:** (Determine a reasonable total supply, e.g., 1,000,000,000)
      -   **Token Type:** (e.g., Utility, Governance, Security - infer from utility)
  2.  **Core Utility:**
      -   Elaborate on the points from \`{{{tokenUtility}}}\`.
      -   Explain how the token is integral to the ecosystem.
      -   Describe the value accrual mechanism (how the token is expected to gain value).
  3.  **Allocation & Distribution:**
      -   Based on \`{{{initialDistribution}}}\`, create a clear, tabulated allocation breakdown with percentages (e.g., Team, Community, Treasury, Investors).
      -   Ensure the total allocation sums to 100%.
  4.  **Vesting Schedule:**
      -   Propose a standard, fair vesting schedule for key stakeholders (Team, Advisors, Private Investors).
      -   Typically includes a cliff (e.g., 6-12 months) and a linear vesting period (e.g., 24-48 months). Explain why this is important for long-term alignment.
  5.  **Token Sink & Faucets:**
      -   Describe mechanisms that increase demand or reduce supply ("sinks"), such as staking, burning, or usage fees.
      -   Describe mechanisms that release tokens into circulation ("faucets"), such as emission rewards or ecosystem grants.
  6.  **Economic Flywheel:**
      -   Explain how all the above elements work together to create a self-sustaining economic loop that encourages participation and growth.

  The final output must be a single, comprehensive Markdown document.
  `,
});

const generateTokenomicsModelFlow = ai.defineFlow(
  {
    name: 'generateTokenomicsModelFlow',
    inputSchema: GenerateTokenomicsModelInputSchema,
    outputSchema: GenerateTokenomicsModelOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return { tokenomicsModelContent: output!.tokenomicsModelContent! };
  }
);
