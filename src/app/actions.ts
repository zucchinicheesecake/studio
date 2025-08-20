
"use server";

import { provideCompilationGuidance } from "@/ai/flows/provide-compilation-guidance";
import { generateGenesisBlockCode } from "@/ai/flows/generate-genesis-block-code";
import { createNetworkConfigurationFile } from "@/ai/flows/create-network-configuration-file";
import { provideNodeSetupMiningInstructions } from "@/ai/flows/provide-node-setup-mining-instructions";
import { generateLogo } from "@/ai/flows/generate-logo";
import { generateWhitepaper } from "@/ai/flows/generate-whitepaper";
import { generateAudioSummary } from "@/ai/flows/generate-audio-summary";
import type { FormValues, GenerationResult } from "@/app/types";


export async function generateCrypto(values: FormValues): Promise<GenerationResult> {
    const tokenomicsSummary = `Initial block reward of ${values.blockReward} ${values.coinAbbreviation}, halving every ${values.blockHalving} blocks, with a total supply of ${values.coinSupply} coins.`;
    
    const technicalSummary = `You've chosen to build **${values.coinName} (${values.coinAbbreviation})**. It will use the **${values.consensusMechanism}** consensus mechanism. The network is designed for a **${values.targetSpacingInMinutes}-minute** block time, with a difficulty readjustment every **${values.targetTimespanInMinutes} minutes**. Miners will initially receive a reward of **${values.blockReward} ${values.coinAbbreviation}** per block, which will halve every **${values.blockHalving}** blocks, leading to a total supply of **${values.coinSupply} ${values.coinAbbreviation}**. Transactions will be considered confirmed after **${values.numberOfConfirmations}** blocks, and mined coins will mature after **${values.coinbaseMaturity}** blocks.`;

    const results = await Promise.allSettled([
        provideCompilationGuidance({
            coinName: values.coinName,
            consensusMechanism: values.consensusMechanism,
            targetSpacing: values.targetSpacingInMinutes,
        }),
        generateGenesisBlockCode({
            coinName: values.coinName,
            coinAbbreviation: values.coinAbbreviation,
            addressLetter: values.addressLetter,
            coinUnit: values.coinUnit,
            timestamp: values.timestamp,
            blockReward: values.blockReward,
            blockHalving: values.blockHalving,
            coinSupply: values.coinSupply,
        }),
        createNetworkConfigurationFile({
            ...values,
            targetSpacingInMinutes: values.targetSpacingInMinutes,
            targetTimespanInMinutes: values.targetTimespanInMinutes,
        }),
        generateLogo({
            coinName: values.coinName,
            logoDescription: values.logoDescription,
        }),
        generateWhitepaper({
            coinName: values.coinName,
            coinAbbreviation: values.coinAbbreviation,
            problemStatement: values.problemStatement,
            solutionStatement: values.solutionStatement,
            keyFeatures: values.keyFeatures,
            consensusMechanism: values.consensusMechanism,
            tokenomics: tokenomicsSummary,
        }),
        generateAudioSummary({
            summary: technicalSummary.replace(/\\*\\*/g, ''), // remove markdown for TTS
        })
    ]);

    const [compilationGuidanceResult, genesisBlockResult, networkConfigResult, logoResult, whitepaperResult, audioSummaryResult] = results;

    const failedSteps = results
        .map((result, index) => (result.status === 'rejected' ? [
            'Compilation Guidance', 
            'Genesis Block', 
            'Network Config', 
            'Logo Generation',
            'Whitepaper',
            'Audio Summary'
        ][index] : null))
        .filter(Boolean);

    if (failedSteps.length > 0) {
        throw new Error(`The following steps failed: ${failedSteps.join(', ')}. Please try again.`);
    }

    const compilationGuidance = (compilationGuidanceResult as PromiseFulfillment<any>).value;
    const genesisBlock = (genesisBlockResult as PromiseFulfillment<any>).value;
    const networkConfig = (networkConfigResult as PromiseFulfillment<any>).value;
    const logo = (logoResult as PromiseFulfillment<any>).value;
    const whitepaper = (whitepaperResult as PromiseFulfillment<any>).value;
    const audioSummary = (audioSummaryResult as PromiseFulfillment<any>).value;


    const nodeSetupInstructions = await provideNodeSetupMiningInstructions({
        coinName: values.coinName,
        coinSymbol: values.coinAbbreviation,
        genesisBlockCode: genesisBlock.genesisBlockCode,
        networkParameters: networkConfig.networkConfigurationFile,
        compilationInstructions: compilationGuidance.compilationInstructions,
    });
    
    return {
        technicalSummary,
        genesisBlockCode: genesisBlock.genesisBlockCode,
        networkConfigurationFile: networkConfig.networkConfigurationFile,
        compilationInstructions: compilationGuidance.compilationInstructions,
        nodeSetupInstructions: nodeSetupInstructions.instructions,
        logoDataUri: logo.logoDataUri,
        whitepaperContent: whitepaper.whitepaperContent,
        audioDataUri: audioSummary.audioDataUri,
    };
}

// Helper type for Promise.allSettled
type PromiseFulfillment<T> = {
    status: 'fulfilled';
    value: T;
};
