
"use server";

import { z } from "zod";
import { provideCompilationGuidance } from "@/ai/flows/provide-compilation-guidance";
import { generateGenesisBlockCode } from "@/ai/flows/generate-genesis-block-code";
import { createNetworkConfigurationFile } from "@/ai/flows/create-network-configuration-file";
import { provideNodeSetupMiningInstructions } from "@/ai/flows/provide-node-setup-mining-instructions";

export const formSchema = z.object({
  // Step 1
  consensusMechanism: z.string().min(1, "Please select a consensus mechanism."),
  // Step 2
  coinName: z.string().min(1, "Coin name is required."),
  coinAbbreviation: z.string().min(1, "Abbreviation is required.").max(5, "Abbreviation is too long."),
  addressLetter: z.string().min(1, "Address letter is required."),
  coinUnit: z.string().min(1, "Coin unit is required."),
  timestamp: z.string().min(1, "Timestamp is required."),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  // Step 3
  blockReward: z.coerce.number().min(0, "Block reward must be a positive number."),
  blockHalving: z.coerce.number().min(1, "Block halving must be at least 1."),
  coinSupply: z.coerce.number().min(1, "Coin supply must be at least 1."),
  // Step 4
  coinbaseMaturity: z.coerce.number().min(1, "Coinbase maturity must be at least 1."),
  numberOfConfirmations: z.coerce.number().min(1, "Number of confirmations must be at least 1."),
  targetSpacingInMinutes: z.coerce.number().min(1, "Target spacing must be at least 1 minute."),
  targetTimespanInMinutes: z.coerce.number().min(1, "Target timespan must be at least 1 minute."),
});

export type FormValues = z.infer<typeof formSchema>;

export type GenerationResult = {
    technicalSummary: string;
    genesisBlockCode: string;
    networkConfigurationFile: string;
    compilationInstructions: string;
    nodeSetupInstructions: string;
};

export async function generateCrypto(values: FormValues): Promise<GenerationResult> {
    try {
        const compilationGuidancePromise = provideCompilationGuidance({
            coinName: values.coinName,
            consensusMechanism: values.consensusMechanism,
            targetSpacing: values.targetSpacingInMinutes,
        });

        const genesisBlockPromise = generateGenesisBlockCode({
            coinName: values.coinName,
            coinAbbreviation: values.coinAbbreviation,
            addressLetter: values.addressLetter,
            coinUnit: values.coinUnit,
            timestamp: values.timestamp,
            blockReward: values.blockReward,
            blockHalving: values.blockHalving,
            coinSupply: values.coinSupply,
        });

        const networkConfigPromise = createNetworkConfigurationFile({
            ...values,
            targetSpacingInMinutes: values.targetSpacingInMinutes,
            targetTimespanInMinutes: values.targetTimespanInMinutes,
        });
        
        const [compilationGuidance, genesisBlock, networkConfig] = await Promise.all([
            compilationGuidancePromise,
            genesisBlockPromise,
            networkConfigPromise,
        ]);

        const nodeSetupInstructions = await provideNodeSetupMiningInstructions({
            coinName: values.coinName,
            coinSymbol: values.coinAbbreviation,
            genesisBlockCode: genesisBlock.genesisBlockCode,
            networkParameters: networkConfig.networkConfigurationFile,
            compilationInstructions: compilationGuidance.compilationInstructions,
        });
        
        const technicalSummary = `You've chosen to build **${values.coinName} (${values.coinAbbreviation})**. It will use the **${values.consensusMechanism}** consensus mechanism. The network is designed for a **${values.targetSpacingInMinutes}-minute** block time, with a difficulty readjustment every **${values.targetTimespanInMinutes} minutes**. Miners will initially receive a reward of **${values.blockReward} ${values.coinAbbreviation}** per block, which will halve every **${values.blockHalving}** blocks, leading to a total supply of **${values.coinSupply} ${values.coinAbbreviation}**. Transactions will be considered confirmed after **${values.numberOfConfirmations}** blocks, and mined coins will mature after **${values.coinbaseMaturity}** blocks.`;
        
        return {
            technicalSummary,
            genesisBlockCode: genesisBlock.genesisBlockCode,
            networkConfigurationFile: networkConfig.networkConfigurationFile,
            compilationInstructions: compilationGuidance.compilationInstructions,
            nodeSetupInstructions: nodeSetupInstructions.instructions,
        };
    } catch (error) {
        console.error("Error generating crypto configuration:", error);
        throw new Error("Failed to generate cryptocurrency configuration. Please try again.");
    }
}
