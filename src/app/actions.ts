
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


// This file now only contains individual server actions that can be called from the client.
// The main orchestration logic has been moved to the client in `forge/page.tsx`.

export { 
    provideCompilationGuidance,
    generateGenesisBlockCode,
    createNetworkConfigurationFile,
    provideNodeSetupMiningInstructions,
    generateLogo,
    generateWhitepaper,
    generateAudioSummary,
    generateLandingPage,
    generateSocialCampaign,
    generatePitchDeck,
    generateTokenomicsModel,
    generateCommunityStrategy
};


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
