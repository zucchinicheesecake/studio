
'use server';
/**
 * @fileOverview A flow for generating a logo for a cryptocurrency.
 *
 * - generateLogo - A function that handles the logo generation process.
 * - GenerateLogoInput - The input type for the generateLogo function.
 * - GenerateLogoOutput - The return type for the generateLogo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLogoInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  logoDescription: z.string().describe('A description of the desired logo style.'),
});
export type GenerateLogoInput = z.infer<typeof GenerateLogoInputSchema>;

const GenerateLogoOutputSchema = z.object({
  logoDataUri: z.string().describe("The generated logo image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateLogoOutput = z.infer<typeof GenerateLogoOutputSchema>;

export async function generateLogo(input: GenerateLogoInput): Promise<GenerateLogoOutput> {
  return generateLogoFlow(input);
}

const generateLogoFlow = ai.defineFlow(
  {
    name: 'generateLogoFlow',
    inputSchema: GenerateLogoInputSchema,
    outputSchema: GenerateLogoOutputSchema,
  },
  async ({ coinName, logoDescription }) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Create a flat, vector-style logo for a cryptocurrency named "${coinName}". The logo should be on a dark, moody background. The user's description of the logo style is: "${logoDescription}". The logo should be iconic, simple, and memorable. Do not include any text in the logo itself.`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed to produce a result.');
    }

    return { logoDataUri: media.url };
  }
);
