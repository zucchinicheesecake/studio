
import { z } from "zod";

export const formSchema = z.object({
  // Step 1: Core Concept
  projectName: z.string().min(1, "Project name is required."),
  ticker: z.string().min(1, "Ticker is required.").max(5, "Ticker is too long."),
  missionStatement: z.string().min(1, "Mission statement is required."),
  
  // Step 2: Target Audience
  targetAudience: z.string().min(1, "Target audience is required."),
  brandVoice: z.string().min(1, "Brand voice is required."),

  // Step 3: Branding
  tagline: z.string().min(1, "A tagline is required."),
  logoDescription: z.string().min(1, "Please provide a logo description."),

  // Step 4: Tokenomics
  tokenUtility: z.string().min(1, "Token utility is required."),

  // Step 5: Distribution
  initialDistribution: z.string().min(1, "Initial distribution plan is required."),

  // Step 6: Community
  communityStrategy: z.string().min(1, "A community strategy is required."),
});

export type FormValues = z.infer<typeof formSchema>;

export type GenerationResult = {
    formValues: FormValues;
    genesisBlockCode: string;
    networkConfigurationFile: string;
    readmeContent: string;
    logoDataUri: string;
    installScript: string;
};

// This represents a project as it is stored in and retrieved from Firestore
export type Project = GenerationResult & {
    id: string;
    userId: string;
    createdAt: string; // Stored as a Timestamp, but converted to ISO string for client
};
