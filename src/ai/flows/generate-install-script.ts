
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a comprehensive install.sh script.
 *
 * - generateInstallScript - A function that generates the install script content.
 * - GenerateInstallScriptInput - The input type for the generateInstallScript function.
 * - GenerateInstallScriptOutput - The return type for the generateInstallScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInstallScriptInputSchema = z.object({
  projectName: z.string().describe('The name of the cryptocurrency project.'),
  ticker: z.string().describe('The ticker symbol for the cryptocurrency (e.g., BTC).'),
});

export type GenerateInstallScriptInput = z.infer<typeof GenerateInstallScriptInputSchema>;

const GenerateInstallScriptOutputSchema = z.object({
  installScript: z.string().describe('The generated install.sh script content.'),
});

export type GenerateInstallScriptOutput = z.infer<typeof GenerateInstallScriptOutputSchema>;

export async function generateInstallScript(input: GenerateInstallScriptInput): Promise<GenerateInstallScriptOutput> {
  return generateInstallScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInstallScriptPrompt',
  input: {schema: GenerateInstallScriptInputSchema},
  output: {schema: GenerateInstallScriptOutputSchema},
  prompt: `You are an expert Linux sysadmin and build engineer. Your task is to create a comprehensive, robust, and long-form \`install.sh\` script for compiling a new cryptocurrency from source on a Debian/Ubuntu-based system.

  **Project Details:**
  - **Name:** {{{projectName}}}
  - **Ticker:** {{{ticker}}}

  **Instructions:**
  Generate a well-commented \`install.sh\` bash script. The script should be runnable and perform all necessary steps from a clean OS install to a compiled and installed daemon.

  **install.sh Sections:**
  1.  **Shebang:** Start with \`#!/bin/bash\`.
  2.  **Preamble:** Include comments explaining what the script does.
  3.  **Variables:** Define variables for the project name (lowercase) and a temporary build directory.
  4.  **Update System:** Run \`sudo apt-get update\` and \`sudo apt-get upgrade -y\`.
  5.  **Install Dependencies:** Install a comprehensive list of required packages using \`apt-get install -y\`. Include: \`build-essential\`, \`libtool\`, \`autotools-dev\`, \`automake\`, \`pkg-config\`, \`libssl-dev\`, \`libevent-dev\`, \`bsdmainutils\`, \`python3\`, \`libboost-all-dev\`, \`libdb-dev\`, \`libdb++-dev\`, \`libminiupnpc-dev\`, \`git\`.
  6.  **Clone Source Code:** Clone a placeholder Git repository (e.g., \`https://github.com/your-org/{{{projectName}}}.git\`). Add a comment explaining that the user should replace this with their actual repository URL.
  7.  **Build Process:**
      -   Navigate into the cloned directory.
      -   Run \`./autogen.sh\`.
      -   Run \`./configure\` with the appropriate flags (e.g., \`--without-gui\`).
      -   Run \`make\` to compile the project.
      -   Run \`make install\` to install the binaries to \`/usr/local/bin\`.
  8.  **Post-Install Setup:**
      -   Explain how to create the \`.{{{projectName}}core\` directory and the \`{{{projectName}}}.conf\` file in the user's home directory. Provide an example config with \`rpcuser\` and \`rpcpassword\`.
  9.  **Success Message:** Echo a final success message telling the user that the installation is complete and how to run the daemon (e.g., \`{{{projectName}}}d\`).

  The script should be long, detailed, and include many comments explaining each step. Use \`echo\` statements to provide progress updates to the user running the script.
  `,
});

const generateInstallScriptFlow = ai.defineFlow(
  {
    name: 'generateInstallScriptFlow',
    inputSchema: GenerateInstallScriptInputSchema,
    outputSchema: GenerateInstallScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {installScript: output!.installScript!};
  }
);
