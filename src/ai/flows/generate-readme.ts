
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
  prompt: `You are an expert developer documentation writer. Your task is to create a clear, comprehensive, and professional README.md file for a new cryptocurrency project.

  **Project Details:**
  - **Name:** {{{projectName}}}
  - **Ticker:** {{{ticker}}}
  - **Mission:** {{{missionStatement}}}

  **Instructions:**
  Generate a comprehensive, long-form README.md file in Markdown format. The README should provide all the necessary information for a developer to understand, compile, and run the project. It should be well-structured, easy to follow, and very detailed.

  **README.md Sections:**
  1.  **Project Title:** Use the project name and ticker. Include a placeholder badge for the build status.
  2.  **Introduction:** Briefly describe the project, using its mission statement. Expand on it slightly to provide more context.
  3.  **Table of Contents:** Include a detailed table of contents for easy navigation.
  4.  **What is {{{projectName}}}?**: A slightly more detailed section about the project's goals and what makes it unique.
  5.  **Getting Started:**
      -   **Prerequisites:** List the necessary dependencies for a typical Ubuntu/Debian system in detail (e.g., \`build-essential\`, \`libssl-dev\`, \`libboost-all-dev\`, \`libdb-dev\`, \`libminiupnpc-dev\`, etc.). Provide the full \`apt-get install\` command.
      -   **Compilation:** Provide a step-by-step guide to compile the source code. This should include cloning a placeholder repository, and running \`./autogen.sh\`, \`./configure\` (with example flags), and \`make\`. Explain what each step does in detail. Include a note about the number of cores for 'make -j'.
  6.  **Usage:**
      -   Explain how to create the configuration file (\`~/.{{{projectName_lowercase}}}core/{{{projectName_lowercase}}}.conf\`). Provide a detailed example config with a randomly generated \`rpcuser\` and \`rpcpassword\` and explain what the most important settings do.
      -   Show the command to start the daemon (\`{{{projectName_lowercase}}}d\`) and explain common runtime flags (like \`-daemon\`, \`-testnet\`, \`-printtoconsole\`).
      -   Show a list of basic RPC commands like \`getinfo\`, \`getmininginfo\`, \`getnewaddress\`, \`getbalance\`, and \`sendtoaddress\` using the CLI tool (\`{{{projectName_lowercase}}}-cli\`). Provide an example for each command and its expected output.
  7.  **Contributing:** Include a detailed section inviting community contributions. Explain the process: forking the repository, creating a new branch for a feature (\`git checkout -b feature/my-new-feature\`), making changes, committing them, and submitting a pull request.
  8.  **License:** Include a section mentioning the project license (e.g., MIT License).
  9.  **Development Process:** Briefly mention the master branch is for stable code and development is done on separate branches.

  The tone should be technical, clear, and direct. Provide commands in Markdown code blocks. Use the lowercase project name (e.g., '{{{projectName_lowercase}}}') for directories and executables. Make the README long, very detailed, and professional.
  `,
});

const generateReadmeFlow = ai.defineFlow(
  {
    name: 'generateReadmeFlow',
    inputSchema: GenerateReadmeInputSchema,
    outputSchema: GenerateReadmeOutputSchema,
  },
  async input => {
    const {output} = await prompt({...input, projectName_lowercase: input.projectName.toLowerCase()});
    return {readmeContent: output!.readmeContent!};
  }
);
