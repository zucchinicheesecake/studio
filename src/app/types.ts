
import { z } from "zod";

export const formSchema = z.object({
  // Step 1: Core Concept
  projectName: z.string().min(1, "Project name is required."),
  ticker: z.string().min(1, "Ticker is required.").max(5, "Ticker is too long."),
  missionStatement: z.string().min(1, "Mission statement is required."),
  
  // Step 2: Target Audience
  targetAudience: z.string().min(1, "Please describe your target audience."),
  
  // Step 3: Branding
  brandVoice: z.string().min(1, "Please describe your brand voice."),
  logoDescription: z.string().min(1, "Please provide a logo description."),
  
  // Step 4: Token Strategy
  tokenUtility: z.string().min(1, "Please describe the token's utility."),
  initialDistribution: z.string().min(1, "Please describe the initial token distribution plan."),
  
  // Implicitly derived or default values, no longer in the form
  websiteUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  consensusMechanism: z.string().optional().default("Scrypt - Proof of Work and Proof of Stake"),
  timestamp: z.string().optional().default("The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"),
});

export type FormValues = z.infer<typeof formSchema>;

export type GenerationResult = {
    formValues: FormValues;
    technicalSummary: string;
    genesisBlockCode: string;
    networkConfigurationFile: string;
    compilationInstructions: string;
    nodeSetupInstructions: string;
    logoDataUri: string;
    whitepaperContent: string;
    audioDataUri: string;
    landingPageCode: string;
    twitterCampaign: string;
    linkedInPost: string;
    communityWelcome: string;
    // New strategic assets
    pitchDeckContent: string;
    tokenomicsModelContent: string;
    communityStrategyContent: string;
};

// This represents a project as it is stored in and retrieved from Firestore
export type Project = GenerationResult & {
    id: string;
    userId: string;
    createdAt: string; // Stored as a Timestamp, but converted to ISO string for client
};
