
"use server";

import { provideCompilationGuidance } from "@/ai/flows/provide-compilation-guidance";
import { generateGenesisBlockCode } from "@/ai/flows/generate-genesis-block-code";
import { createNetworkConfigurationFile } from "@/ai/flows/create-network-configuration-file";
import { provideNodeSetupMiningInstructions } from "@/ai/flows/provide-node-setup-mining-instructions";
import { generateLogo } from "@/ai/flows/generate-logo";
import { generateWhitepaper } from "@/ai/flows/generate-whitepaper";
import { generateAudioSummary } from "@/ai/flows/generate-audio-summary";
import { explainConcept as explainConceptFlow } from "@/ai/flows/explain-concept";
import { generateLandingPage } from "@/ai/flows/generate-landing-page";
import { generateSocialCampaign } from "@/ai/flows/generate-social-campaign";
import type { FormValues, GenerationResult, Project } from "@/app/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";


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
            summary: technicalSummary.replace(/\*\*/g, ''), // remove markdown for TTS
        }),
        generateLandingPage({
            ...values,
            tokenomics: tokenomicsSummary,
        }),
        generateSocialCampaign({
            coinName: values.coinName,
            coinAbbreviation: values.coinAbbreviation,
            problemStatement: values.problemStatement,
            solutionStatement: values.solutionStatement,
            keyFeatures: values.keyFeatures,
            websiteUrl: values.websiteUrl,
        }),
    ]);

    const [compilationGuidanceResult, genesisBlockResult, networkConfigResult, logoResult, whitepaperResult, audioSummaryResult, landingPageResult, socialCampaignResult] = results;

    const failedSteps = results
        .map((result, index) => (result.status === 'rejected' ? [
            'Compilation Guidance', 
            'Genesis Block', 
            'Network Config', 
            'Logo Generation',
            'Whitepaper',
            'Audio Summary',
            'Landing Page',
            'Social Campaign',
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
    const landingPage = (landingPageResult as PromiseFulfillment<any>).value;
    const socialCampaign = (socialCampaignResult as PromiseFulfillment<any>).value;


    const nodeSetupInstructions = await provideNodeSetupMiningInstructions({
        coinName: values.coinName,
        coinSymbol: values.coinAbbreviation,
        genesisBlockCode: genesisBlock.genesisBlockCode,
        networkParameters: networkConfig.networkConfigurationFile,
        compilationInstructions: compilationGuidance.compilationInstructions,
    });
    
    return {
        formValues: values,
        technicalSummary,
        genesisBlockCode: genesisBlock.genesisBlockCode,
        networkConfigurationFile: networkConfig.networkConfigurationFile,
        compilationInstructions: compilationGuidance.compilationInstructions,
        nodeSetupInstructions: nodeSetupInstructions.instructions,
        logoDataUri: logo.logoDataUri,
        whitepaperContent: whitepaper.whitepaperContent,
        audioDataUri: audioSummary.audioDataUri,
        landingPageCode: landingPage.landingPageCode,
        ...socialCampaign,
    };
}

export async function explainConcept(concept: string): Promise<string> {
    try {
        const result = await explainConceptFlow({ concept });
        return result.explanation;
    } catch (error) {
        console.error("Error explaining concept:", error);
        return "Sorry, I couldn't fetch an explanation at this time. Please try again later.";
    }
}

export async function saveProject(projectData: GenerationResult, userId: string): Promise<{ projectId: string }> {
    if (!userId) {
        throw new Error("User must be logged in to save a project.");
    }
    try {
        const projectCollection = collection(db, "users", userId, "projects");
        const docRef = await addDoc(projectCollection, {
            ...projectData,
            createdAt: serverTimestamp(),
            userId: userId,
        });
        return { projectId: docRef.id };
    } catch (error) {
        console.error("Error saving project to Firestore:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to save project: ${error.message}`);
        }
        throw new Error("An unknown error occurred while saving the project.");
    }
}


export async function getProjectsForUser(userId: string): Promise<Project[]> {
    if (!userId) {
        throw new Error("User must be logged in to view projects.");
    }
    try {
        const projectCollection = collection(db, "users", userId, "projects");
        const q = query(projectCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const projects: Project[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // The `createdAt` field is a Firestore Timestamp object.
            // We need to convert it to a serializable format (e.g., ISO string)
            // for it to be passed from a server component to a client component.
            const createdAt = (data.createdAt?.toDate?.() || new Date()).toISOString();

            return {
                id: doc.id,
                ...data,
                createdAt,
            } as Project;
        });

        return projects;

    } catch (error) {
        console.error("Error fetching projects from Firestore:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch projects: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching projects.");
    }
}



// Helper type for Promise.allSettled
type PromiseFulfillment<T> = {
    status: 'fulfilled';
    value: T;
};
