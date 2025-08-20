'use server';
/**
 * @fileOverview This file defines a Genkit flow to provide step-by-step compilation instructions for building a cryptocurrency from source code.
 *
 * - provideCompilationGuidance - A function that handles the compilation guidance process.
 * - ProvideCompilationGuidanceInput - The input type for the provideCompilationGuidance function.
 * - ProvideCompilationGuidanceOutput - The return type for the provideCompilationGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideCompilationGuidanceInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  consensusMechanism: z.string().describe('The chosen consensus mechanism (e.g., Scrypt, SHA-256, X11).'),
  targetSpacing: z.number().describe('The target spacing in minutes for mining each block.'),
});
export type ProvideCompilationGuidanceInput = z.infer<typeof ProvideCompilationGuidanceInputSchema>;

const ProvideCompilationGuidanceOutputSchema = z.object({
  compilationInstructions: z.string().describe('Step-by-step instructions for compiling the cryptocurrency from source code.'),
});
export type ProvideCompilationGuidanceOutput = z.infer<typeof ProvideCompilationGuidanceOutputSchema>;

export async function provideCompilationGuidance(input: ProvideCompilationGuidanceInput): Promise<ProvideCompilationGuidanceOutput> {
  return provideCompilationGuidanceFlow(input);
}

const provideCompilationGuidanceFlow = ai.defineFlow(
  {
    name: 'provideCompilationGuidanceFlow',
    inputSchema: ProvideCompilationGuidanceInputSchema,
    outputSchema: ProvideCompilationGuidanceOutputSchema,
  },
  async ({ coinName }) => {
    const instructions = `
# Compiling ${coinName} from Source

These instructions provide a general guide for compiling the ${coinName} daemon and wallet from source code on a Linux-based system (like Ubuntu).

## 1. Install Dependencies

First, you need to install the required libraries and build tools. Open your terminal and run the following commands:

\`\`\`bash
sudo apt-get update
sudo apt-get install -y build-essential libtool autotools-dev automake pkg-config libssl-dev libevent-dev bsdmainutils
sudo apt-get install -y libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-program-options-dev libboost-test-dev libboost-thread-dev
sudo apt-get install -y libminiupnpc-dev libzmq3-dev
\`\`\`

You will also need Berkeley DB 4.8. It is recommended to build this from source.

\`\`\`bash
wget 'http://download.oracle.com/berkeley-db/db-4.8.30.NC.tar.gz'
tar -xzvf db-4.8.30.NC.tar.gz
cd db-4.8.30.NC/build_unix/
../dist/configure --enable-cxx --disable-shared --with-pic --prefix=/usr/local
sudo make install
\`\`\`

## 2. Clone the Source Code

Next, get the ${coinName} source code from its repository. (Note: This is a placeholder URL).

\`\`\`bash
git clone https://github.com/your-repo/${coinName.toLowerCase()}.git
cd ${coinName.toLowerCase()}
\`\`\`

## 3. Build the Code

Now you are ready to compile. Run the following commands from the root of the source code directory.

\`\`\`bash
./autogen.sh
./configure
make
\`\`\`

The compilation process can take a while.

## 4. Install the Binaries

Once compilation is complete, you can install the binaries to your system.

\`\`\`bash
sudo make install
\`\`\`

This will typically place \`${coinName.toLowerCase()}d\` (the daemon) and \`${coinName.toLowerCase()}-qt\` (the QT wallet) in \`/usr/local/bin\`.

## 5. Troubleshooting

*   **Missing Dependencies:** If \`./configure\` fails, check its output for messages about missing libraries.
*   **Compilation Errors:** If \`make\` fails, the error messages can be complex. Often, they are due to an incorrect version of a dependency or a missing tool. Search for the error online or ask for help in the community channels.
*   **Permissions:** Ensure you have the correct permissions. Use \`sudo\` when installing packages or running \`make install\`.
`.trim();

    return { compilationInstructions: instructions };
  }
);
