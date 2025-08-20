
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
  Generate a well-commented \`install.sh\` bash script. The script should be runnable and perform all necessary steps from a clean OS install to a compiled and installed daemon. The script should be very long, very detailed, and include many comments explaining each step. Use 'echo' statements with colors and formatting to provide clear, step-by-step progress updates to the user running the script. Make the script feel like a professional, automated build process.

  **install.sh Sections:**
  1.  **Shebang:** Start with \`#!/bin/bash\`.
  2.  **Preamble:** Include comments explaining what the script does, its intended audience (Debian/Ubuntu), and a disclaimer to review before running. Use ANSI color codes for emphasis.
  3.  **Variables:** Define variables for the project name (lowercase), a temporary build directory, the project's git repository URL (as a placeholder), and the number of CPU cores to use for compilation.
  4.  **Error Handling:** Use \`set -euo pipefail\` to ensure the script exits immediately if a command fails, if a variable is unset, or if a command in a pipeline fails.
  5.  **Root Check:** Add a check to ensure the script is not run as root, and exit with a helpful message if it is.
  6.  **Update System:** Run \`sudo apt-get update\` and \`sudo apt-get upgrade -y\`. Echo the progress clearly.
  7.  **Install Dependencies:** Install a comprehensive list of required packages using \`apt-get install -y\`. Include: \`build-essential\`, \`libtool\`, \`autotools-dev\`, \`automake\`, \`pkg-config\`, \`libssl-dev\`, \`libevent-dev\`, \`bsdmainutils\`, \`python3\`, \`libboost-system-dev\`, \`libboost-filesystem-dev\`, \`libboost-chrono-dev\`, \`libboost-program-options-dev\`, \`libboost-test-dev\`, \`libboost-thread-dev\`, \`libdb-dev\`, \`libdb++-dev\`, \`libminiupnpc-dev\`, \`libzmq3-dev\`, \`git\`.
  8.  **Clone Source Code:** Clone a placeholder Git repository (e.g., \`https://github.com/your-org/{{{projectName}}}.git\`). Add a comment explaining that the user should replace this with their actual repository URL. Check if the directory already exists.
  9.  **Build Process:**
      -   Navigate into the cloned directory.
      -   Run \`./autogen.sh\`.
      -   Run \`./configure\` with the appropriate flags (e.g., \`--with-gui=no --disable-wallet --without-miniupnpc --enable-zmq\`). Explain the flags in the comments.
      -   Run \`make -j\$(nproc)\` to compile the project using all available cores. Add timing information for the build.
      -   Run \`sudo make install\` to install the binaries to \`/usr/local/bin\`.
  10. **Post-Install Setup:**
      -   Explain in detail how to create the \`.{{{projectName}}}core\` directory and the \`{{{projectName}}}.conf\` file in the user's home directory. Provide a detailed example config with \`rpcuser\` and \`rpcpassword\` (using random strings), and explain what the fields mean. Add comments on how to secure this file.
  11. **Cleanup:** Offer an option to remove the build directory after installation, asking the user for confirmation.
  12. **Success Message:** Echo a final, detailed success message telling the user that the installation is complete, where the binaries are installed (\`{{{projectName}}}d\` and \`{{{projectName}}}-cli\`), and how to run the daemon and check its status. Use ANSI colors to make the message stand out.
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
