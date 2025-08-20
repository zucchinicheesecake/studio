
'use server';
/**
 * @fileOverview A flow for generating a TTS audio summary.
 *
 * - generateAudioSummary - A function that handles the audio summary generation process.
 * - GenerateAudioSummaryInput - The input type for the generateAudioSummary function.
 * - GenerateAudioSummaryOutput - The return type for the generateAudioSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const GenerateAudioSummaryInputSchema = z.object({
  summary: z.string().describe('The text summary to convert to audio.'),
});
export type GenerateAudioSummaryInput = z.infer<typeof GenerateAudioSummaryInputSchema>;

const GenerateAudioSummaryOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateAudioSummaryOutput = z.infer<typeof GenerateAudioSummaryOutputSchema>;

export async function generateAudioSummary(input: GenerateAudioSummaryInput): Promise<GenerateAudioSummaryOutput> {
  return generateAudioSummaryFlow(input);
}


async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}

const generateAudioSummaryFlow = ai.defineFlow(
    {
      name: 'generateAudioSummaryFlow',
      inputSchema: GenerateAudioSummaryInputSchema,
      outputSchema: GenerateAudioSummaryOutputSchema,
    },
    async ({ summary }) => {
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
              },
            },
            prompt: summary,
        });

        if (!media?.url) {
            throw new Error('Audio generation failed to produce a result.');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );

        const wavBase64 = await toWav(audioBuffer);
    
        return { audioDataUri: 'data:audio/wav;base64,' + wavBase64 };
    }
  );
