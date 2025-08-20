
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
import { generatePitchDeck } from "@/ai/flows/generate-pitch-deck";
import { generateTokenomicsModel } from "@/ai/flows/generate-tokenomics-model";
import { generateCommunityStrategy } from "@/ai/flows/generate-community-strategy";
import { suggestTextForField as suggestTextForFieldFlow, type SuggestTextForFieldInput } from "@/ai/flows/suggest-text";
import type { FormValues, GenerationResult, Project } from "@/app/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";


// Helper function to derive technical parameters from strategic inputs
const deriveTechnicalParams = (values: FormValues) => {
    // This is a simplified derivation. A real implementation could involve a separate AI call
    // or more complex logic to determine these values based on the project's mission and utility.
    return {
        coinName: values.projectName,
        coinAbbreviation: values.ticker,
        addressLetter: values.ticker.charAt(0).toUpperCase(),
        coinUnit: "sats", // a common default
        blockReward: 50,
        blockHalving: 210000,
        coinSupply: 100000000,
        coinbaseMaturity: 100,
        numberOfConfirmations: 6,
        targetSpacingInMinutes: 10,
        targetTimespanInMinutes: 1440, // 1 day
        problemStatement: `The current market lacks a solution for: ${values.missionStatement}`,
        solutionStatement: `${values.projectName} addresses this by providing a platform that is ${values.brandVoice.toLowerCase()}.`,
        keyFeatures: `- Core Utility: ${values.tokenUtility}\n- Target Audience Focus: ${values.targetAudience}\n- Decentralized Governance`,
    };
};


export async function generateCrypto(values: FormValues): Promise<GenerationResult> {
    
    const derivedParams = deriveTechnicalParams(values);
    const fullFormParams = { ...values, ...derivedParams };

    const technicalSummary = `**${fullFormParams.coinName} (${fullFormParams.coinAbbreviation})** is a new cryptocurrency protocol driven by the mission: *"${values.missionStatement}"*. It uses the **${values.consensusMechanism}** consensus mechanism. The network is designed for a **${fullFormParams.targetSpacingInMinutes}-minute** block time. This project is tailored for **${values.targetAudience.toLowerCase()}** with a brand voice that is **${values.brandVoice.toLowerCase()}**.`;

    const results = await Promise.allSettled([
        provideCompilationGuidance({
            coinName: fullFormParams.coinName,
            consensusMechanism: values.consensusMechanism!,
            targetSpacing: fullFormParams.targetSpacingInMinutes,
        }),
        generateGenesisBlockCode({
            ...derivedParams,
            timestamp: values.timestamp!,
        }),
        createNetworkConfigurationFile({
            ...derivedParams,
        }),
        generateLogo({
            coinName: fullFormParams.coinName,
            logoDescription: values.logoDescription,
        }),
        generateWhitepaper({
            ...fullFormParams,
        }),
        generateAudioSummary({
            summary: technicalSummary.replace(/\*\*/g, '').replace(/\*/g, ''), // remove markdown for TTS
        }),
        generateLandingPage({
            ...fullFormParams,
        }),
        generateSocialCampaign({
            ...fullFormParams
        }),
        generatePitchDeck({ ...values }),
        generateTokenomicsModel({ ...values }),
        generateCommunityStrategy({ ...values }),
    ]);

    const [
        compilationGuidanceResult, 
        genesisBlockResult, 
        networkConfigResult, 
        logoResult, 
        whitepaperResult, 
        audioSummaryResult, 
        landingPageResult, 
        socialCampaignResult,
        pitchDeckResult,
        tokenomicsModelResult,
        communityStrategyResult
    ] = results;

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
            'Pitch Deck',
            'Tokenomics Model',
            'Community Strategy',
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
    const pitchDeck = (pitchDeckResult as PromiseFulfillment<any>).value;
    const tokenomicsModel = (tokenomicsModelResult as PromiseFulfillment<any>).value;
    const communityStrategy = (communityStrategyResult as PromiseFulfillment<any>).value;


    const nodeSetupInstructions = await provideNodeSetupMiningInstructions({
        coinName: fullFormParams.coinName,
        coinSymbol: fullFormParams.coinAbbreviation,
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
        pitchDeckContent: pitchDeck.pitchDeckContent,
        tokenomicsModelContent: tokenomicsModel.tokenomicsModelContent,
        communityStrategyContent: communityStrategy.communityStrategyContent,
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

export async function suggestTextForField(input: SuggestTextForFieldInput): Promise<string> {
    try {
        const result = await suggestTextForFieldFlow(input);
        return result.suggestion;
    } catch (error) {
        console.error("Error suggesting text for field:", error);
        if (error instanceof Error) {
            return `AI suggestion failed: ${error.message}`;
        }
        return "AI suggestion failed. Please try again.";
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


export async function getProjectById(userId: string, projectId: string): Promise<Project | null> {
    if (!userId) {
      throw new Error('User must be logged in to view a project.');
    }
    try {
      const docRef = doc(db, 'users', userId, 'projects', projectId);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        return null;
      }
  
      const data = docSnap.data();
      const createdAt = (data.createdAt?.toDate?.() || new Date()).toISOString();
  
      return {
        id: docSnap.id,
        ...data,
        createdAt,
      } as Project;
    } catch (error) {
      console.error('Error fetching project from Firestore:', error);
      throw new Error('Failed to fetch project.');
    }
}


// Helper type for Promise.allSettled
type PromiseFulfillment<T> = {
    status: 'fulfilled';
    value: T;
};
