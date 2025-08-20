
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
  coinName: z.string().describe('The name of the cryptocurrency.'),
  coinAbbreviation: z.string().describe('The abbreviation for the cryptocurrency (e.g., BTC).'),
  problemStatement: z.string().describe('The problem the cryptocurrency aims to solve.'),
  solutionStatement: z.string().describe('How the cryptocurrency solves the problem.'),
  keyFeatures: z.string().describe('A summary of the key features of the cryptocurrency (as a bulleted list).'),
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
  prompt: `You are an expert crypto marketing manager. Your task is to generate a launch campaign for a new cryptocurrency.

  **Cryptocurrency Details:**
  -   **Name:** {{{coinName}}} ({{{coinAbbreviation}}})
  -   **Website:** {{{websiteUrl}}}
  -   **Problem:** {{{problemStatement}}}
  -   **Solution:** {{{solutionStatement}}}
  -   **Key Features:**
      {{{keyFeatures}}}

  **Instructions:**
  1.  **Twitter/X Thread:**
      -   Create a compelling, multi-tweet thread (3-4 tweets) announcing the project.
      -   The first tweet should be a strong hook.
      -   Subsequent tweets should explain the problem, solution, and key features.
      -   The final tweet should be a call to action (e.g., visit the website, join the community).
      -   Use relevant hashtags like #crypto #blockchain #{{{coinName}}} \${{{coinAbbreviation}}}.
      -   Format it clearly with "1/n", "2/n", etc.
  2.  **LinkedIn Post:**
      -   Write a professional, slightly more detailed post suitable for LinkedIn.
      -   Focus on the mission, vision, and technology.
      -   Structure it with clear paragraphs and bullet points for readability.
      -   Include a call to action and relevant hashtags.
  3.  **Discord/Telegram Welcome Message:**
      -   Write a friendly and enthusiastic welcome message for new members joining the community channel.
      -   Briefly introduce the project's vision.
      -   Guide them on what to do next (e.g., read the whitepaper, check out specific channels, ask questions).
      -   Use emojis to make it engaging.

  Generate the content for all three platforms.
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
