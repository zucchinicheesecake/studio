
"use server";

import { provideCompilationGuidance } from "@/ai/flows/provide-compilation-guidance";
import { generateGenesisBlockCode } from "@/ai/flows/generate-genesis-block-code";
import { createNetworkConfigurationFile } from "@/ai/flows/create-network-configuration-file";
import { provideNodeSetupMiningInstructions } from "@/ai/flows/provide-node-setup-mining-instructions";
import type { FormValues, GenerationResult } from "@/app/types";


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
