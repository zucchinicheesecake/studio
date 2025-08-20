
'use server';
/**
 * @fileOverview A Genkit flow for generating an investor pitch deck for a crypto project.
 *
 * - generatePitchDeck - A function that generates the pitch deck content.
 * - GeneratePitchDeckInput - The input type for the generatePitchDeck function.
 * - GeneratePitchDeckOutput - The return type for the generatePitchDeck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePitchDeckInputSchema = z.object({
  projectName: z.string().describe("The name of the cryptocurrency project."),
  missionStatement: z.string().describe("The project's core mission statement."),
  targetAudience: z.string().describe("A description of the target audience."),
  tokenUtility: z.string().describe("The utility and purpose of the project's token."),
  initialDistribution: z.string().describe("The plan for initial token distribution."),
});

export type GeneratePitchDeckInput = z.infer<typeof GeneratePitchDeckInputSchema>;

const GeneratePitchDeckOutputSchema = z.object({
  pitchDeckContent: z.string().describe("The generated pitch deck content in Markdown format."),
});

export type GeneratePitchDeckOutput = z.infer<typeof GeneratePitchDeckOutputSchema>;

export async function generatePitchDeck(input: GeneratePitchDeckInput): Promise<GeneratePitchDeckOutput> {
  return generatePitchDeckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePitchDeckPrompt',
  input: {schema: GeneratePitchDeckInputSchema},
  output: {schema: GeneratePitchDeckOutputSchema},
  prompt: `You are an expert startup advisor specializing in creating compelling investor pitch decks for crypto projects.

  Based on the following strategic inputs, generate a concise but powerful 10-slide pitch deck in Markdown format.

  **Project Details:**
  - **Name:** {{{projectName}}}
  - **Mission:** {{{missionStatement}}}
  - **Target Audience:** {{{targetAudience}}}
  - **Token Utility:** {{{tokenUtility}}}
  - **Distribution Plan:** {{{initialDistribution}}}

  **Pitch Deck Structure (use Markdown headers for slides):**
  - **Slide 1: Title Slide:** Project Name & Tagline.
  - **Slide 2: The Problem:** Clearly define the problem {{{projectName}}} is solving, derived from the mission. Why is it significant?
  - **Slide 3: The Solution:** Introduce {{{projectName}}} as the solution. How does it work at a high level?
  - **Slide 4: Why Now?:** Market opportunity and timing. Why is this the right moment for this project?
  - **Slide 5: Target Market:** Describe the target audience and the market size.
  - **Slide 6: Product & Technology:** Briefly explain the core technology and product vision.
  - **Slide 7: Tokenomics:** Explain the token's utility and the high-level distribution model.
  - **Slide 8: Go-to-Market Strategy:** How will you reach your target audience?
  - **Slide 9: The Team:** (Use placeholder for the team) Why is this the right team to build this?
  - **Slide 10: The Ask & Vision:** (Use placeholder for funding ask) Conclude with the grand vision for the future.

  The tone should be confident, professional, and visionary. Each slide should be concise and focus on the most critical information.
  `,
});

const generatePitchDeckFlow = ai.defineFlow(
  {
    name: 'generatePitchDeckFlow',
    inputSchema: GeneratePitchDeckInputSchema,
    outputSchema: GeneratePitchDeckOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return { pitchDeckContent: output!.pitchDeckContent! };
  }
);
