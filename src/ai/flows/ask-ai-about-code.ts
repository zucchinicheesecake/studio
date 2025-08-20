
'use server';
/**
 * @fileOverview A flow for answering questions about the generated project code.
 *
 * - askAiAboutCode - A function that answers a user's question based on the generated code context.
 * - AskAiAboutCodeInput - The input type for the function.
 * - AskAiAboutCodeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerationResult } from '@/app/types';

const AskAiAboutCodeInputSchema = z.object({
  question: z.string().describe("The user's question about their generated project."),
  codeContext: z.object({
        genesisBlockCode: z.string(),
        networkConfigurationFile: z.string(),
        readmeContent: z.string(),
        installScript: z.string(),
  }).describe("The full context of the generated code and documentation for the user's project."),
});

export type AskAiAboutCodeInput = z.infer<typeof AskAiAboutCodeInputSchema>;

const AskAiAboutCodeOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question, formatted in Markdown."),
});

export type AskAiAboutCodeOutput = z.infer<typeof AskAiAboutCodeOutputSchema>;


export async function askAiAboutCode(input: AskAiAboutCodeInput): Promise<AskAiAboutCodeOutput> {
  return askAiAboutCodeFlow(input);
}

const prompt = ai.definePrompt({
    name: 'askAiAboutCodePrompt',
    input: {schema: AskAiAboutCodeInputSchema},
    output: {schema: AskAiAboutCodeOutputSchema},
    prompt: `You are an expert C++ and blockchain developer, acting as a technical support lead for the "Coin Engine" application. Your user has just generated a new cryptocurrency project and is asking for help understanding it.

    You have been provided with the complete set of generated assets for their project. Your task is to answer their question accurately and concisely based *only* on the provided context.

    **Project Code Context:**

    **README.md:**
    \`\`\`markdown
    {{{codeContext.readmeContent}}}
    \`\`\`

    **install.sh:**
    \`\`\`bash
    {{{codeContext.installScript}}}
    \`\`\`

    **Network Configuration:**
    \`\`\`ini
    {{{codeContext.networkConfigurationFile}}}
    \`\`\`

    **Genesis Block (C++):**
    \`\`\`cpp
    {{{codeContext.genesisBlockCode}}}
    \`\`\`

    **User's Question:**
    "{{{question}}}"

    **Instructions:**
    1.  Carefully analyze the user's question and all the provided code context.
    2.  Formulate a clear, helpful, and accurate answer.
    3.  If the answer is in the code, refer to it. You can include small snippets if it's helpful, but don't just repeat large blocks of code.
    4.  If the question is about how to do something (e.g., "how do I compile?"), refer them to the appropriate section of the README.md or the install.sh script.
    5.  Keep your answers concise and to the point.
    6.  Format your answer using Markdown for readability (e.g., use backticks for code variables, bold for emphasis).
    `,
});


const askAiAboutCodeFlow = ai.defineFlow(
  {
    name: 'askAiAboutCodeFlow',
    inputSchema: AskAiAboutCodeInputSchema,
    outputSchema: AskAiAboutCodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return { answer: output!.answer! };
  }
);
