
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a README.md file for a cryptocurrency.
 *
 * - generateReadme - A function that generates the README file content.
 * - GenerateReadmeInput - The input type for the generateReadme function.
 * - GenerateReadmeOutput - The return type for the generateReadme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReadmeInputSchema = z.object({
  projectName: z.string().describe('The name of the cryptocurrency project.'),
  ticker: z.string().describe('The ticker symbol for the cryptocurrency (e.g., BTC).'),
  missionStatement: z.string().describe("The project's core mission statement."),
});

export type GenerateReadmeInput = z.infer<typeof GenerateReadmeInputSchema>;

const GenerateReadmeOutputSchema = z.object({
  readmeContent: z.string().describe('The generated README.md content.'),
});

export type GenerateReadmeOutput = z.infer<typeof GenerateReadmeOutputSchema>;

export async function generateReadme(input: GenerateReadmeInput): Promise<GenerateReadmeOutput> {
  return generateReadmeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadmePrompt',
  input: {schema: GenerateReadmeInputSchema},
  output: {schema: GenerateReadmeOutputSchema},
  prompt: `You are an expert developer documentation writer. Your task is to create a clear and concise README.md file for a new cryptocurrency project.

  **Project Details:**
  - **Name:** {{{projectName}}}
  - **Ticker:** {{{ticker}}}
  - **Mission:** {{{missionStatement}}}

  **Instructions:**
  Generate a comprehensive README.md file in Markdown format. The README should provide all the necessary information for a developer to understand, compile, and run the project.

  **README.md Sections:**
  1.  **Project Title:** Use the project name and ticker.
  2.  **Introduction:** Briefly describe the project, using its mission statement.
  3.  **Getting Started:**
      -   **Prerequisites:** List the necessary dependencies for a typical Ubuntu/Debian system (build-essential, libssl-dev, libboost-all-dev, libdb-dev, libminiupnpc-dev, etc.).
      -   **Compilation:** Provide a step-by-step guide to compile the source code. This should include cloning a placeholder repository, and running \`./autogen.sh\`, \`./configure\`, and \`make\`.
  4.  **Usage:**
      -   Explain how to create the configuration file (\`~/.<projectname>core/<projectname>.conf\`). Provide a basic example config with \`rpcuser\` and \`rpcpassword\`.
      -   Show the command to start the daemon (\`<projectname>d\`).
      -   Show basic RPC commands like \`getinfo\` and \`getmininginfo\` using the CLI tool (\`<projectname>-cli\`).
  5.  **Contributing:** Include a brief section inviting community contributions.

  The tone should be technical, clear, and direct. Provide commands in Markdown code blocks. Use the lowercase project name for directories and executables.
  `,
});

const generateReadmeFlow = ai.defineFlow(
  {
    name: 'generateReadmeFlow',
    inputSchema: GenerateReadmeInputSchema,
    outputSchema: GenerateReadmeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {readmeContent: output!.readmeContent!};
  }
);
