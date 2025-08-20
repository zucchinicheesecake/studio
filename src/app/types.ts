
import { z } from "zod";

export const formSchema = z.object({
  // Step 1: Core Concept
  projectName: z.string().min(1, "Project name is required."),
  ticker: z.string().min(1, "Ticker is required.").max(5, "Ticker is too long."),
  missionStatement: z.string().min(1, "Mission statement is required."),
  
  // Step 2: Network Parameters
  blockReward: z.coerce.number().min(1, "Block reward must be at least 1."),
  blockHalving: z.coerce.number().min(1, "Block halving must be at least 1."),
  coinSupply: z.coerce.number().min(1, "Coin supply must be at least 1."),
  
  // Step 3: Technical Details
  timestamp: z.string().min(1, "Genesis timestamp message is required."),
  logoDescription: z.string().min(1, "Please provide a logo description."),

  // Step 4: Consensus & Addressing
  addressLetter: z.string().min(1, "Address letter is required.").max(1, "Address letter must be a single character."),
  coinUnit: z.string().min(1, "Coin unit is required."),
  coinbaseMaturity: z.coerce.number().min(1, "Coinbase maturity must be at least 1."),
  numberOfConfirmations: z.coerce.number().min(1, "Number of confirmations must be at least 1."),
  targetSpacingInMinutes: z.coerce.number().min(1, "Target spacing must be at least 1 minute."),
  targetTimespanInMinutes: z.coerce.number().min(1, "Target timespan must be at least 1 minute."),
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
