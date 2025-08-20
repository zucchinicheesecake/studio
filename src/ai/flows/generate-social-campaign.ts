
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a social media campaign for a new cryptocurrency.
 *
 * - generateSocialCampaign - A function that generates social media content.
 * - GenerateSocialCampaignInput - The input type for the generateSocialCampaign function.
 * - GenerateSocialCampaignOutput - The return type for the generateSocialCampaign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialCampaignInputSchema = z.object({
  projectName: z.string().describe('The name of the cryptocurrency project.'),
  ticker: z.string().describe('The ticker symbol for the cryptocurrency (e.g., BTC).'),
  missionStatement: z.string().describe("The project's core mission statement."),
  keyFeatures: z.string().describe('A summary of the key features of the cryptocurrency (as a bulleted list).'),
  brandVoice: z.string().describe('The brand voice and tone.'),
  targetAudience: z.string().describe('The target audience for the project.'),
  websiteUrl: z.string().optional().describe('The optional official website URL.'),
});

export type GenerateSocialCampaignInput = z.infer<
  typeof GenerateSocialCampaignInputSchema
>;

const GenerateSocialCampaignOutputSchema = z.object({
  twitterCampaign: z.string().describe('A multi-tweet thread for X (formerly Twitter) to announce the launch.'),
  linkedInPost: z.string().describe('A professional post for LinkedIn to announce the launch.'),
  communityWelcome: z.string().describe('A welcome message for a new Discord or Telegram community.'),
});

export type GenerateSocialCampaignOutput = z.infer<
  typeof GenerateSocialCampaignOutputSchema
>;

export async function generateSocialCampaign(
  input: GenerateSocialCampaignInput
): Promise<GenerateSocialCampaignOutput> {
  return generateSocialCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialCampaignPrompt',
  input: {schema: GenerateSocialCampaignInputSchema},
  output: {schema: GenerateSocialCampaignOutputSchema},
  prompt: `You are an expert crypto marketing manager. Your task is to generate a launch campaign for a new cryptocurrency project. The campaign's tone must match the specified brand voice.

  **Project Details:**
  -   **Name:** {{{projectName}}} ({{{ticker}}})
  -   **Website:** {{{websiteUrl}}}
  -   **Mission:** {{{missionStatement}}}
  -   **Key Features:**
      {{{keyFeatures}}}
  -   **Brand Voice:** {{{brandVoice}}}
  -   **Target Audience:** {{{targetAudience}}}

  **Instructions:**
  1.  **Twitter/X Thread:**
      -   Create a compelling, multi-tweet thread (3-4 tweets) announcing the project, targeted at the specified audience.
      -   The first tweet should be a strong hook that resonates with the mission.
      -   Subsequent tweets should explain the project's purpose and key features.
      -   The final tweet should be a call to action (e.g., read the whitepaper, join the community).
      -   Use relevant hashtags like #crypto #blockchain #{{{projectName}}} \${{{ticker}}}.
      -   Format it clearly with "1/n", "2/n", etc.
  2.  **LinkedIn Post:**
      -   Write a professional, slightly more detailed post suitable for LinkedIn, focusing on the project's long-term vision and potential impact.
      -   Structure it with clear paragraphs and bullet points for readability.
      -   Include a call to action and relevant hashtags.
  3.  **Discord/Telegram Welcome Message:**
      -   Write a friendly and enthusiastic welcome message for new members joining the community channel.
      -   Briefly introduce the project's vision, using the specified brand voice.
      -   Guide them on what to do next (e.g., read the whitepaper, check out specific channels, ask questions).
      -   Use emojis to make it engaging.

  Generate the content for all three platforms, ensuring the tone is consistent with the brand voice.
  `,
});

const generateSocialCampaignFlow = ai.defineFlow(
  {
    name: 'generateSocialCampaignFlow',
    inputSchema: GenerateSocialCampaignInputSchema,
    outputSchema: GenerateSocialCampaignOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
