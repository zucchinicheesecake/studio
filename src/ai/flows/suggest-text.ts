
'use server';
/**
 * @fileOverview A Genkit flow for providing AI-powered suggestions for form fields.
 *
 * - suggestTextForField - A function that suggests content for a specific form field.
 * - SuggestTextForFieldInput - The input type for the function.
 * - SuggestTextForFieldOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { formSchema, type FormValues } from '@/app/types';


const SuggestTextForFieldInputSchema = z.object({
  fieldName: z.keyof(formSchema.shape),
  currentValue: z.string().optional(),
  formContext: formSchema.partial(),
});

export type SuggestTextForFieldInput = z.infer<typeof SuggestTextForFieldInputSchema>;

const SuggestTextForFieldOutputSchema = z.object({
  suggestion: z.string().describe("The generated or improved text for the specified field."),
});

export type SuggestTextForFieldOutput = z.infer<typeof SuggestTextForFieldOutputSchema>;

export async function suggestTextForField(input: SuggestTextForFieldInput): Promise<SuggestTextForFieldOutput> {
  return suggestTextForFieldFlow(input);
}


const improvePrompt = ai.definePrompt({
    name: 'improveFormFieldPrompt',
    input: {schema: SuggestTextForFieldInputSchema},
    output: {schema: SuggestTextForFieldOutputSchema},
    prompt: `You are an expert marketing copywriter and crypto project strategist. Your task is to improve the existing text for a form field based on the overall project vision.

    **Project Context:**
    - Project Name: {{{formContext.projectName}}}
    - Ticker: {{{formContext.ticker}}}
    - Mission Statement: {{{formContext.missionStatement}}}
    - Target Audience: {{{formContext.targetAudience}}}
    - Brand Voice: {{{formContext.brandVoice}}}
    - Token Utility: {{{formContext.tokenUtility}}}
    - Initial Distribution: {{{formContext.initialDistribution}}}

    **Field to Improve:** {{{fieldName}}}

    **Existing Text:**
    "{{{currentValue}}}"

    **Instructions:**
    Rewrite and improve the "Existing Text" to be more compelling, clear, and aligned with the project's brand voice and mission. Return only the improved text. Do not add any introductory phrases like "Here's the improved version:".
    `,
});

const generatePrompt = ai.definePrompt({
    name: 'generateFormFieldPrompt',
    input: {schema: SuggestTextForFieldInputSchema},
    output: {schema: SuggestTextForFieldOutputSchema},
    prompt: `You are an expert marketing copywriter and crypto project strategist. Your task is to generate compelling text for a form field based on the overall project vision.

    **Project Context:**
    - Project Name: {{{formContext.projectName}}}
    - Ticker: {{{formContext.ticker}}}
    - Mission Statement: {{{formContext.missionStatement}}}
    - Target Audience: {{{formContext.targetAudience}}}
    - Brand Voice: {{{formContext.brandVoice}}}
    - Token Utility: {{{formContext.tokenUtility}}}
    - Initial Distribution: {{{formContext.initialDistribution}}}

    **Field to Generate Text For:** {{{fieldName}}}

    **Instructions:**
    Based on the provided project context, generate a high-quality, relevant, and creative suggestion for the "{{{fieldName}}}" field. Return only the generated text. Do not add any introductory phrases like "Here's a suggestion:".
    `,
});

const suggestTextForFieldFlow = ai.defineFlow(
  {
    name: 'suggestTextForFieldFlow',
    inputSchema: SuggestTextForFieldInputSchema,
    outputSchema: SuggestTextForFieldOutputSchema,
  },
  async (input) => {
    const promptToUse = input.currentValue ? improvePrompt : generatePrompt;
    const { output } = await promptToUse(input);
    return { suggestion: output!.suggestion! };
  }
);
