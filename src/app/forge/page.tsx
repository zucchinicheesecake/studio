
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as actions from "@/app/actions";
import { formSchema, type FormValues, type GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Stepper } from "@/components/crypto-forge/stepper";
import { Step1CoreConcept } from "@/components/crypto-forge/step-1-core-concept";
import { Step2TargetAudience } from "@/components/crypto-forge/step-2-target-audience";
import { Step3Branding } from "@/components/crypto-forge/step-3-branding";
import { Step4TokenStrategy } from "@/components/crypto-forge/step-4-token-strategy";
import { ResultsDisplay } from "@/components/crypto-forge/results-display";
import { AlertCircle, CheckCircle, CircleDashed, Loader2 } from "lucide-react";
import { ExplanationDialog } from "@/components/crypto-forge/explanation-dialog";
import { ExplanationContext } from "@/hooks/use-explanation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const steps = [
  { id: 1, name: "Core Concept", component: <Step1CoreConcept />, fields: ["projectName", "ticker", "missionStatement"] },
  { id: 2, name: "Audience", component: <Step2TargetAudience />, fields: ["targetAudience"] },
  { id: 3, name: "Branding", component: <Step3Branding />, fields: ["brandVoice", "logoDescription"] },
  { id: 4, name: "Token Strategy", component: <Step4TokenStrategy />, fields: ["tokenUtility", "initialDistribution"] },
];

type GenerationStepStatus = 'pending' | 'generating' | 'success' | 'error';
type GenerationStep = { name: string; status: GenerationStepStatus; error?: string };

export default function ForgePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [explanation, setExplanation] = useState({ title: "", content: "", isLoading: false });
  
  const { toast } = useToast();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "NovaNet",
      ticker: "NOV",
      missionStatement: "To build a decentralized, censorship-resistant internet for the next generation of web applications.",
      targetAudience: "Developers and users interested in Web3, privacy advocates, and people in regions with restricted internet access.",
      brandVoice: "Empowering, innovative, and slightly rebellious. We are for the builders and the pioneers.",
      logoDescription: "A stylized 'N' that looks like a shield or a network node, with circuit-like patterns. Colors should be electric blue and dark purple.",
      tokenUtility: "The NOV token is used for network governance, paying for decentralized storage, and accessing premium features on the network.",
      initialDistribution: "40% for community mining rewards, 20% for the development team (vested over 4 years), 20% for the ecosystem fund, 10% for a public sale.",
    },
  });

  const { trigger, handleSubmit, getValues } = methods;

  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields;
    const output = await trigger(fields as any, { shouldFocus: true });
    if (!output) return;

    if (currentStep < steps.length) {
      setCurrentStep(step => step + 1);
    } else {
        handleSubmit(onSubmit)();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(step => step - 1);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    setResults(null);

    const initialSteps: GenerationStep[] = [
        { name: 'Investor Pitch Deck', status: 'pending' },
        { name: 'Tokenomics Model', status: 'pending' },
        { name: 'Community Strategy', status: 'pending' },
        { name: 'Logo Generation', status: 'pending' },
        { name: 'Whitepaper', status: 'pending' },
        { name: 'Audio Summary', status: 'pending' },
        { name: 'Landing Page', status: 'pending' },
        { name: 'Social Campaign', status: 'pending' },
        { name: 'Genesis Block', status: 'pending' },
        { name: 'Network Config', status: 'pending' },
        { name: 'Compilation Guidance', status: 'pending' },
        { name: 'Node Setup Instructions', status: 'pending' },
    ];
    setGenerationSteps(initialSteps);

    try {
        const derivedParams = {
            coinName: data.projectName,
            coinAbbreviation: data.ticker,
            addressLetter: data.ticker.charAt(0).toUpperCase(),
            coinUnit: "sats",
            blockReward: 50,
            blockHalving: 210000,
            coinSupply: 100000000,
            coinbaseMaturity: 100,
            numberOfConfirmations: 6,
            targetSpacingInMinutes: 10,
            targetTimespanInMinutes: 1440,
            problemStatement: `The current market lacks a solution for: ${data.missionStatement}`,
            solutionStatement: `${data.projectName} addresses this by providing a platform that is ${data.brandVoice.toLowerCase()}.`,
            keyFeatures: `- Core Utility: ${data.tokenUtility}\n- Target Audience Focus: ${data.targetAudience}\n- Decentralized Governance`,
        };
        const fullFormParams = { ...data, ...derivedParams };
        const technicalSummary = `**${fullFormParams.coinName} (${fullFormParams.coinAbbreviation})** is a new cryptocurrency protocol driven by the mission: *"${data.missionStatement}"*. It uses the **${data.consensusMechanism}** consensus mechanism. The network is designed for a **${fullFormParams.targetSpacingInMinutes}-minute** block time. This project is tailored for **${data.targetAudience.toLowerCase()}** with a brand voice that is **${data.brandVoice.toLowerCase()}**.`;

        const generatedAssets: any = {};
        
        const runStep = async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
            setGenerationSteps(prev => prev.map(s => s.name === name ? { ...s, status: 'generating' } : s));
            try {
                const result = await fn();
                setGenerationSteps(prev => prev.map(s => s.name === name ? { ...s, status: 'success' } : s));
                return result;
            } catch (e: any) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                setGenerationSteps(prev => prev.map(s => s.name === name ? { ...s, status: 'error', error: errorMessage } : s));
                throw new Error(`Failed at step: ${name}`);
            }
        };

        generatedAssets.pitchDeck = await runStep('Investor Pitch Deck', () => actions.generatePitchDeck({ ...data }));
        generatedAssets.tokenomics = await runStep('Tokenomics Model', () => actions.generateTokenomicsModel({ ...data }));
        generatedAssets.community = await runStep('Community Strategy', () => actions.generateCommunityStrategy({ ...data }));
        generatedAssets.logo = await runStep('Logo Generation', () => actions.generateLogo({ coinName: fullFormParams.coinName, logoDescription: data.logoDescription }));
        generatedAssets.whitepaper = await runStep('Whitepaper', () => actions.generateWhitepaper({ ...fullFormParams }));
        generatedAssets.audio = await runStep('Audio Summary', () => actions.generateAudioSummary({ summary: technicalSummary.replace(/\*\*/g, '').replace(/\*/g, '') }));
        generatedAssets.landingPage = await runStep('Landing Page', () => actions.generateLandingPage({ ...fullFormParams }));
        generatedAssets.social = await runStep('Social Campaign', () => actions.generateSocialCampaign({ ...fullFormParams }));
        generatedAssets.genesis = await runStep('Genesis Block', () => actions.generateGenesisBlockCode({ ...derivedParams, timestamp: data.timestamp! }));
        generatedAssets.networkConfig = await runStep('Network Config', () => actions.createNetworkConfigurationFile({ ...derivedParams }));
        generatedAssets.compilation = await runStep('Compilation Guidance', () => actions.provideCompilationGuidance({ coinName: fullFormParams.coinName, consensusMechanism: data.consensusMechanism!, targetSpacing: fullFormParams.targetSpacingInMinutes }));
        generatedAssets.nodeSetup = await runStep('Node Setup Instructions', () => actions.provideNodeSetupMiningInstructions({
            coinName: fullFormParams.coinName,
            coinSymbol: fullFormParams.coinAbbreviation,
            genesisBlockCode: generatedAssets.genesis.genesisBlockCode,
            networkParameters: generatedAssets.networkConfig.networkConfigurationFile,
            compilationInstructions: generatedAssets.compilation.compilationInstructions,
        }));
        
        setResults({
            formValues: data,
            technicalSummary,
            genesisBlockCode: generatedAssets.genesis.genesisBlockCode,
            networkConfigurationFile: generatedAssets.networkConfig.networkConfigurationFile,
            compilationInstructions: generatedAssets.compilation.compilationInstructions,
            nodeSetupInstructions: generatedAssets.nodeSetup.instructions,
            logoDataUri: generatedAssets.logo.logoDataUri,
            whitepaperContent: generatedAssets.whitepaper.whitepaperContent,
            audioDataUri: generatedAssets.audio.audioDataUri,
            landingPageCode: generatedAssets.landingPage.landingPageCode,
            pitchDeckContent: generatedAssets.pitchDeck.pitchDeckContent,
            tokenomicsModelContent: generatedAssets.tokenomics.tokenomicsModelContent,
            communityStrategyContent: generatedAssets.community.communityStrategyContent,
            ...generatedAssets.social,
        });

    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: e.message || "One or more steps failed. See details below.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setResults(null);
    setCurrentStep(1);
    setIsGenerating(false);
    setGenerationSteps([]);
    methods.reset();
  }

  const handleTryAgain = () => {
    onSubmit(getValues());
  };

  const handleExplain = async (concept: string) => {
    setExplanation({ title: concept, content: "", isLoading: true });
    const explanationText = await actions.explainConcept(concept);
    setExplanation({ title: concept, content: explanationText, isLoading: false });
  };


  if (generationSteps.length > 0) {
    const hasError = generationSteps.some(s => s.status === 'error');
    const isComplete = generationSteps.every(s => s.status === 'success' || s.status === 'error');
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center container mx-auto px-4 py-12">
            <h1 className="text-3xl font-headline font-bold text-primary">
                {isGenerating ? 'Forging Your Project...' : hasError ? 'Generation Failed' : 'Generation Complete!'}
            </h1>
            <p className="text-muted-foreground mt-2 mb-8">
                {isGenerating ? 'The AI is building your assets. Please wait.' : 'Review the status of each step below.'}
            </p>
            <Card className="w-full max-w-2xl text-left">
                <CardHeader>
                    <CardTitle>Generation Status</CardTitle>
                    <CardDescription>Tracking the progress of your project asset creation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {generationSteps.map(step => (
                            <li key={step.name} className="flex items-start">
                                <div className="flex items-center h-6">
                                    {step.status === 'pending' && <CircleDashed className="h-5 w-5 text-muted-foreground" />}
                                    {step.status === 'generating' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                                    {step.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                    {step.status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                                </div>
                                <div className="ml-4">
                                    <p className={`font-medium ${step.status === 'error' ? 'text-destructive' : ''}`}>{step.name}</p>
                                    {step.status === 'error' && (
                                        <p className="text-xs text-destructive/80 mt-1 font-code">{step.error}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            {!isGenerating && hasError && (
                <div className="mt-8">
                    <Button onClick={handleTryAgain}>
                        Try Again
                    </Button>
                </div>
            )}
             {!isGenerating && !hasError && results && (
                 <div className="mt-8">
                    <Button onClick={() => setGenerationSteps([])}>View Results</Button>
                </div>
             )}
        </div>
    );
  }

  if (results) {
    return <ResultsDisplay results={results} onReset={resetForm} />;
  }

  return (
    <FormProvider {...methods}>
        <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-4">
              <h1 className="text-5xl font-headline font-bold text-primary">CryptoForge</h1>
              <p className="mt-2 text-lg text-muted-foreground">Your AI co-founder for launching a crypto project.</p>
          </div>
          <div className="w-full max-w-4xl">
            <Stepper currentStep={currentStep} steps={steps.map(s => s.name)} />
          </div>
          <div className="w-full max-w-3xl mt-8">
            <form onSubmit={handleSubmit(onSubmit)}
                // By wrapping the component in a new context provider, we can pass down the `handleExplain` function
                // to any of the step components without prop drilling.
                >
                <ExplanationContext.Provider value={{ handleExplain }}>
                    {steps[currentStep-1].component}
                </ExplanationContext.Provider>
            </form>
          </div>
          <div className="w-full max-w-3xl flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length ? "Forge My Project" : "Next Step"}
            </Button>
          </div>
        </main>
        <ExplanationDialog
            isOpen={!!explanation.title}
            onOpenChange={(isOpen) => !isOpen && setExplanation({ title: "", content: "", isLoading: false })}
            title={explanation.title}
            content={explanation.content}
            isLoading={explanation.isLoading}
        />
    </FormProvider>
  );
}
