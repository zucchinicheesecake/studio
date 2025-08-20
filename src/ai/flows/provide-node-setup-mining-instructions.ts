'use server';
/**
 * @fileOverview Provides instructions on how to set up the initial node and begin mining for a cryptocurrency.
 *
 * - provideNodeSetupMiningInstructions - A function that generates node setup and mining instructions.
 * - ProvideNodeSetupMiningInstructionsInput - The input type for the provideNodeSetupMiningInstructions function.
 * - ProvideNodeSetupMiningInstructionsOutput - The return type for the provideNodeSetupMiningInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideNodeSetupMiningInstructionsInputSchema = z.object({
  coinName: z.string().describe('The name of the cryptocurrency.'),
  coinSymbol: z.string().describe('The symbol of the cryptocurrency (e.g., BTC).'),
  genesisBlockCode: z.string().describe('The genesis block code for the cryptocurrency.'),
  networkParameters: z.string().describe('The network parameters configuration.'),
  compilationInstructions: z.string().describe('Instructions on how to compile the cryptocurrency.'),
});
export type ProvideNodeSetupMiningInstructionsInput = z.infer<typeof ProvideNodeSetupMiningInstructionsInputSchema>;

const ProvideNodeSetupMiningInstructionsOutputSchema = z.object({
  instructions: z.string().describe('Instructions on how to set up the initial node and begin mining.'),
});
export type ProvideNodeSetupMiningInstructionsOutput = z.infer<typeof ProvideNodeSetupMiningInstructionsOutputSchema>;

export async function provideNodeSetupMiningInstructions(input: ProvideNodeSetupMiningInstructionsInput): Promise<ProvideNodeSetupMiningInstructionsOutput> {
  return provideNodeSetupMiningInstructionsFlow(input);
}

const provideNodeSetupMiningInstructionsFlow = ai.defineFlow(
  {
    name: 'provideNodeSetupMiningInstructionsFlow',
    inputSchema: ProvideNodeSetupMiningInstructionsInputSchema,
    outputSchema: ProvideNodeSetupMiningInstructionsOutputSchema,
  },
  async ({ coinName, coinSymbol }) => {
    const instructions = `
# Node Setup & Mining Guide for ${coinName}

This guide explains how to set up a node for ${coinName} and start mining to secure the network and earn ${coinSymbol}.

## 1. Create the Configuration File

Before you can run the node, you need to create a configuration file. This tells your node how to connect to the network.

Create a directory for the configuration file:

\`\`\`bash
mkdir ~/.${coinName.toLowerCase()}core
\`\`\`

Now, create the configuration file itself. Use a text editor like \`nano\`:

\`\`\`bash
nano ~/.${coinName.toLowerCase()}core/${coinName.toLowerCase()}.conf
\`\`\`

Add the following lines to the file. This sets up RPC (Remote Procedure Call) access, which is needed for mining.

\`\`\`ini
rpcuser=your_rpc_username
rpcpassword=your_strong_rpc_password
server=1
listen=1
daemon=1
\`\`\`

**Important:** Replace \`your_rpc_username\` and \`your_strong_rpc_password\` with your own secure credentials.

## 2. Start the Node Daemon

With the configuration in place, you can start the ${coinName} daemon. This is the background process that runs the node.

\`\`\`bash
${coinName.toLowerCase()}d
\`\`\`

The first time you start the daemon, it will begin downloading and verifying the entire blockchain history. This can take a significant amount of time and disk space.

You can check the progress with this command:

\`\`\`bash
${coinName.toLowerCase()}-cli getblockchaininfo
\`\`\`

## 3. Start Mining (Solo Mining)

Once your node is fully synced, you can start mining. The following command tells your node to generate new blocks, using all available processor cores.

\`\`\`bash
# The '-1' tells the client to use the maximum number of threads
${coinName.toLowerCase()}-cli setgenerate true -1
\`\`\`

You have now started mining! Any block rewards you earn will be sent to your wallet.

## 4. Securing Your Node

*   **Firewall:** Ensure you have a firewall configured to only allow necessary ports (the P2P port and, if needed, the RPC port).
*   **Strong Passwords:** Use a very strong RPC password.
*   **Regular Updates:** Keep your node software updated to the latest version.
*   **Wallet Backup:** Regularly back up your \`wallet.dat\` file, which is located in your data directory (\`~/.${coinName.toLowerCase()}core/\`).
`.trim();

    return { instructions };
  }
);
