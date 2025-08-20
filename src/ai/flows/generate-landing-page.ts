
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a landing page for a cryptocurrency.
 *
 * - generateLandingPage - A function that generates the landing page JSX code.
 * - GenerateLandingPageInput - The input type for the generateLandingPage function.
 * - GenerateLandingPageOutput - The return type for the generateLandingPage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLandingPageInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  coinAbbreviation: z.string().describe('The abbreviation for the cryptocurrency (e.g., BTC).'),
  problemStatement: z.string().describe('The problem the cryptocurrency aims to solve.'),
  solutionStatement: z.string().describe('How the cryptocurrency solves the problem.'),
  keyFeatures: z.string().describe('A summary of the key features of the cryptocurrency (should be a bulleted list).'),
  consensusMechanism: z.string().describe('The consensus mechanism used.'),
  tokenomics: z.string().describe('A summary of the coin\'s tokenomics (supply, distribution, etc.).'),
  websiteUrl: z.string().optional().describe('The optional official website URL.'),
  githubUrl: z.string().optional().describe('The optional GitHub repository URL.'),
});

export type GenerateLandingPageInput = z.infer<
  typeof GenerateLandingPageInputSchema
>;

const GenerateLandingPageOutputSchema = z.object({
  landingPageCode: z.string().describe('The generated landing page code as a single React/JSX string.'),
});

export type GenerateLandingPageOutput = z.infer<
  typeof GenerateLandingPageOutputSchema
>;

export async function generateLandingPage(
  input: GenerateLandingPageInput
): Promise<GenerateLandingPageOutput> {
  return generateLandingPageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLandingPagePrompt',
  input: {schema: GenerateLandingPageInputSchema},
  output: {schema: GenerateLandingPageOutputSchema},
  prompt: `You are an expert web developer who creates beautiful, modern, and responsive landing pages using React, Tailwind CSS, and lucide-react for icons.

  Your task is to generate the code for a single React component that serves as a landing page for a new cryptocurrency.

  **Instructions:**
  1.  **Frameworks:** Use React with functional components and hooks. Style with Tailwind CSS. Use \`lucide-react\` for any icons.
  2.  **Structure:** Create a standard landing page structure:
      *   A navigation bar.
      *   A hero section.
      *   A "Problem & Solution" section.
      *   A "Key Features" section.
      *   A "Tokenomics" section.
      *   A "Get Started" or "Call to Action" section.
      *   A simple footer.
  3.  **Content:** Use the provided parameters to populate the content of the page.
  4.  **Styling:**
      *   Use a dark theme. The background should be dark (e.g., \`bg-gray-900\`), and text should be light (e.g., \`text-white\`, \`text-gray-300\`).
      *   Use the project's magenta/pink color (like \`text-pink-500\`, \`bg-pink-600\`) as the primary accent color for buttons, headings, and highlights.
      *   Make it look professional, sleek, and modern. Use cards, proper spacing, and good typography.
  5.  **Code Format:**
      *   Return the code for a **single React component** as a raw string.
      *   The component should be self-contained. All necessary imports (\`React\`, \`lucide-react\`) should be at the top.
      *   The component should accept a \`logoUrl: string\` prop to display the coin's logo.
      *   Do not include \`export default ...\` at the end. The output should be only the component code itself.
      *   Assume all passed icon names from lucide-react are valid.

  **Cryptocurrency Details:**
  -   **Name:** {{{coinName}}}
  -   **Abbreviation:** {{{coinAbbreviation}}}
  -   **Problem:** {{{problemStatement}}}
  -   **Solution:** {{{solutionStatement}}}
  -   **Key Features:**
      {{{keyFeatures}}}
  -   **Tokenomics:** {{{tokenomics}}}
  -   **Consensus:** {{{consensusMechanism}}}
  -   **Website URL:** {{{websiteUrl}}}
  -   **GitHub URL:** {{{githubUrl}}}

  Generate the JSX code now.
  `,
});

const generateLandingPageFlow = ai.defineFlow(
  {
    name: 'generateLandingPageFlow',
    inputSchema: GenerateLandingPageInputSchema,
    outputSchema: GenerateLandingPageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {landingPageCode: output!.landingPageCode!};
  }
);
