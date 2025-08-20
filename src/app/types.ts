
import { z } from "zod";

const numberField = z.preprocess(
  (a) => (a ? parseFloat(String(a)) : undefined),
  z.number().positive()
);

export const formSchema = z.object({
  // Step 1: Core Concept
  projectName: z.string().min(1, "Project name is required."),
  ticker: z.string().min(1, "Ticker is required.").max(5, "Ticker is too long."),
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
  blockReward: numberField.describe('The number of coins received for mining a block.'),
  blockHalving: numberField.describe('The block number at which the block reward is halved.'),
  coinSupply: numberField.describe('The total number of coins that will be created.'),
  addressLetter: z.string().min(1, "Address letter is required").max(1, "Address letter must be a single character."),
  coinUnit: z.string().min(1, "Coin unit is required."),
  coinbaseMaturity: numberField.describe('The number of blocks that must pass before a mined block can be spent.'),
  numberOfConfirmations: numberField.describe('The number of blocks that must pass before a transaction is considered confirmed.'),
  targetSpacingInMinutes: numberField.describe('The target time in minutes to mine each block.'),
  targetTimespanInMinutes: numberField.describe('The target time in minutes before the network difficulty is readjusted.'),
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
