
'use server';
/**
 * @fileOverview A Genkit flow for generating a community building strategy.
 *
 * - generateCommunityStrategy - A function that generates the strategy document.
 * - GenerateCommunityStrategyInput - The input type for the function.
 * - GenerateCommunityStrategyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommunityStrategyInputSchema = z.object({
  projectName: z.string().describe("The name of the cryptocurrency project."),
  missionStatement: z.string().describe("The project's core mission statement."),
  targetAudience: z.string().describe("A description of the target audience."),
  brandVoice: z.string().describe("The brand voice and tone."),
});

export type GenerateCommunityStrategyInput = z.infer<typeof GenerateCommunityStrategyInputSchema>;

const GenerateCommunityStrategyOutputSchema = z.object({
  communityStrategyContent: z.string().describe("The generated community strategy in Markdown format."),
});

export type GenerateCommunityStrategyOutput = z.infer<typeof GenerateCommunityStrategyOutputSchema>;

export async function generateCommunityStrategy(input: GenerateCommunityStrategyInput): Promise<GenerateCommunityStrategyOutput> {
  return generateCommunityStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommunityStrategyPrompt',
  input: {schema: GenerateCommunityStrategyInputSchema},
  output: {schema: GenerateCommunityStrategyOutputSchema},
  prompt: `You are an expert community manager for Web3 projects. Your task is to create a comprehensive, actionable community building strategy.

  **Project Details:**
  - **Name:** {{{projectName}}}
  - **Mission:** {{{missionStatement}}}
  - **Target Audience:** {{{targetAudience}}}
  - **Brand Voice:** {{{brandVoice}}}

  **Instructions:**
  Generate a detailed community strategy in Markdown format. The strategy should be tailored to the project's specific audience and mission.

  **Community Strategy Sections:**
  1.  **Community Vision & Mission:**
      -   Define the purpose of the community. What is its "why"? (e.g., "To become the central hub for decentralized application developers.")
      -   Align the community mission with the overall project mission.
  2.  **Platform Strategy:**
      -   Recommend primary communication platforms (e.g., Discord, Telegram, X). Justify each choice based on the target audience.
      -   Suggest a content strategy for each platform (e.g., technical deep-dives on X, project updates on Discord, AMAs on Telegram).
  3.  **Phase 1: Foundation (First 3 Months):**
      -   **Goal:** Establish a core group of passionate early adopters.
      -   **Key Actions:**
          -   Content Creation: What foundational content is needed? (e.g., detailed blog posts, tutorials).
          -   Initial Outreach: Where to find the first 100 members? (e.g., relevant subreddits, other crypto communities, developer forums).
          -   Engagement: How to keep early members engaged? (e.g., direct access to the team, exclusive roles, early feedback sessions).
  4.  **Phase 2: Growth (Months 3-9):**
      -   **Goal:** Scale the community and increase brand awareness.
      -   **Key Actions:**
          -   Ambassador Program: Outline a program to empower and reward key community members.
          -   Partnerships: Suggest types of projects to partner with for cross-promotion.
          -   Campaigns & Events: Propose ideas for community campaigns (e.g., meme contests, educational workshops, hackathons).
  5.  **Phase 3: Maturity & Decentralization (Month 9+):**
      -   **Goal:** Foster a self-sustaining, member-led community.
      -   **Key Actions:**
          -   Community Governance: Propose a structure for community governance or a path towards a DAO.
          -   Grant Programs: Suggest a framework for a community grants program to fund ecosystem projects.
          -   Scaling Moderation: How to manage a large, global community.
  6.  **Key Metrics for Success:**
      -   List the key performance indicators (KPIs) to track at each phase (e.g., Active Members, Engagement Rate, Community-led Initiatives).

  The tone of the strategy should be practical, insightful, and aligned with the project's brand voice.
  `,
});

const generateCommunityStrategyFlow = ai.defineFlow(
  {
    name: 'generateCommunityStrategyFlow',
    inputSchema: GenerateCommunityStrategyInputSchema,
    outputSchema: GenerateCommunityStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return { communityStrategyContent: output!.communityStrategyContent! };
  }
);
