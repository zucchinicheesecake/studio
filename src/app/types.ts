
import { z } from "zod";

export const formSchema = z.object({
  // Step 1
  consensusMechanism: z.string().min(1, "Please select a consensus mechanism."),
  // Step 2
  coinName: z.string().min(1, "Coin name is required."),
  coinAbbreviation: z.string().min(1, "Abbreviation is required.").max(5, "Abbreviation is too long."),
  addressLetter: z.string().min(1, "Address letter is required."),
  coinUnit: z.string().min(1, "Coin unit is required."),
  timestamp: z.string().min(1, "Timestamp is required."),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  // Step 3
  blockReward: z.coerce.number().min(0, "Block reward must be a positive number."),
  blockHalving: z.coerce.number().min(1, "Block halving must be at least 1."),
  coinSupply: z.coerce.number().min(1, "Coin supply must be at least 1."),
  // Step 4
  coinbaseMaturity: z.coerce.number().min(1, "Coinbase maturity must be at least 1."),
  numberOfConfirmations: z.coerce.number().min(1, "Number of confirmations must be at least 1."),
  targetSpacingInMinutes: z.coerce.number().min(1, "Target spacing must be at least 1 minute."),
  targetTimespanInMinutes: z.coerce.number().min(1, "Target timespan must be at least 1 minute."),
  // Step 5
  logoDescription: z.string().min(1, "Please provide a logo description."),
  // Step 6
  problemStatement: z.string().min(1, "Problem statement is required."),
  solutionStatement: z.string().min(1, "Solution statement is required."),
  keyFeatures: z.string().min(1, "Key features are required."),
});

export type FormValues = z.infer<typeof formSchema>;

export type GenerationResult = {
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
};
