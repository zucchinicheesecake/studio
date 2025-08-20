
import { z } from "zod";

export const formSchema = z.object({
  // Step 1: Core Concept
  projectName: z.string().min(1, "Project name is required."),
  ticker: z.string().min(1, "Ticker is required.").max(5, "Ticker is too long."),
  missionStatement: z.string().min(1, "Mission statement is required."),
  
  // Step 2: Target Audience
  targetAudience: z.string().min(1, "Target audience is required."),
  
  // Step 3: Branding
  brandVoice: z.string().min(1, "Brand voice is required."),
  logoDescription: z.string().min(1, "Please provide a logo description."),

  // Step 4: Token Strategy
  tokenUtility: z.string().min(1, "Token utility is required."),
  initialDistribution: z.string().min(1, "Initial distribution plan is required."),
});

export type FormValues = z.infer<typeof formSchema>;

export type GenerationResult = {
    formValues: FormValues;
    genesisBlockCode: string;
    networkConfigurationFile: string;
    readmeContent: string;
    logoDataUri: string;
};

// This represents a project as it is stored in and retrieved from Firestore
export type Project = GenerationResult & {
    id: string;
    userId: string;
    createdAt: string; // Stored as a Timestamp, but converted to ISO string for client
};
