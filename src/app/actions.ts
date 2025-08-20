
"use server";

import { generateGenesisBlockCode as generateGenesisBlockCodeFlow, type GenesisBlockCodeInput } from "@/ai/flows/generate-genesis-block-code";
import { createNetworkConfigurationFile as createNetworkConfigurationFileFlow, type CreateNetworkConfigurationFileInput } from "@/ai/flows/create-network-configuration-file";
import { generateLogo as generateLogoFlow } from "@/ai/flows/generate-logo";
import { explainConcept as explainConceptFlow } from "@/ai/flows/explain-concept";
import { suggestTextForField as suggestTextForFieldFlow, type SuggestTextForFieldInput } from "@/ai/flows/suggest-text";
import { generateReadme as generateReadmeFlow } from "@/ai/flows/generate-readme";
import { generateInstallScript as generateInstallScriptFlow } from "@/ai/flows/generate-install-script";
import { askAiAboutCode as askAiAboutCodeFlow, type AskAiAboutCodeInput } from "@/ai/flows/ask-ai-about-code";
import type { GenerationResult, Project } from "@/app/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import type { GenerateLogoInput } from "@/ai/flows/generate-logo";
import type { GenerateReadmeInput } from "@/ai/flows/generate-readme";
import type { GenerateInstallScriptInput } from "@/ai/flows/generate-install-script";


// This file now only contains individual server actions that can be called from the client.
// The main orchestration logic has been moved to the client in `forge/page.tsx`.

export async function generateGenesisBlockCode(input: GenesisBlockCodeInput) {
    try {
        return await generateGenesisBlockCodeFlow(input);
    } catch (error) {
        console.error("Error in generateGenesisBlockCode:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate Genesis Block code: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the Genesis Block code.");
    }
}

export async function createNetworkConfigurationFile(input: CreateNetworkConfigurationFileInput) {
    try {
        return await createNetworkConfigurationFileFlow(input);
    } catch (error) {
        console.error("Error in createNetworkConfigurationFile:", error);
         if (error instanceof Error) {
            throw new Error(`Failed to create network configuration: ${error.message}`);
        }
        throw new Error("An unknown error occurred while creating the network configuration.");
    }
}

export async function generateLogo(input: GenerateLogoInput) {
    try {
        return await generateLogoFlow(input);
    } catch (error) {
        console.error("Error in generateLogo:", error);
         if (error instanceof Error) {
            throw new Error(`Failed to generate logo: ${error.message}`);
        }
        throw new Error("Failed to generate logo. The image generation service may be down.");
    }
}

export async function generateReadme(input: GenerateReadmeInput) {
     try {
        return await generateReadmeFlow(input);
    } catch (error) {
        console.error("Error in generateReadme:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate README: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the README.");
    }
}

export async function generateInstallScript(input: GenerateInstallScriptInput) {
     try {
        return await generateInstallScriptFlow(input);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to generate installation script: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the installation script.");
    }
}

export async function askAiAboutCode(input: AskAiAboutCodeInput): Promise<string> {
    try {
        const result = await askAiAboutCodeFlow(input);
        return result.answer;
    } catch (error) {
        console.error("Error in askAiAboutCode:", error);
        if (error instanceof Error) {
            return `AI Assistant failed: ${error.message}`;
        }
        return "The AI assistant encountered an error. Please try again.";
    }
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
