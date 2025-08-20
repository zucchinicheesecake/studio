
import { z } from "zod";

// Reusable schema for numeric fields to reduce repetition
const numberField = z.preprocess(
  (val) => (val ? parseFloat(String(val)) : undefined),
  z.number({ required_error: "This field is required." }).positive({ message: "Must be a positive number." })
);

export const formSchema = z.object({
  // Step 1: Core Concept
  projectName: z.string().min(1, "Project name is required."),
  ticker: z.string().min(1, "Ticker is required.").max(5, "Ticker cannot be more than 5 characters."),
  missionStatement: z.string().min(1, "Mission statement is required."),

  // Step 2: Branding & Audience
  targetAudience: z.string().min(1, "Target audience is required."),
  brandVoice: z.string().min(1, "Brand voice is required."),
  tagline: z.string().min(1, "A tagline is required."),

  // Step 3: Tokenomics
  tokenUtility: z.string().min(1, "Token utility is required."),

  // Step 4: Distribution & Community
  initialDistribution: z.string().min(1, "Initial distribution plan is required."),
  communityStrategy: z.string().min(1, "Community strategy is required."),
  
  // Step 5: Technical Details
  logoDescription: z.string().min(1, "Please provide a logo description."),
  timestamp: z.string().min(1, "Genesis block timestamp message is required."),
  
  // Step 6: Network Parameters
  blockReward: numberField,
  blockHalving: numberField,
  coinSupply: numberField,
  addressLetter: z.string().min(1, "Address letter is required").max(1, "Must be a single character."),
  coinUnit: z.string().min(1, "Coin unit is required."),
  coinbaseMaturity: numberField,
  numberOfConfirmations: numberField,
  targetSpacingInMinutes: numberField,
  targetTimespanInMinutes: numberField,
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
