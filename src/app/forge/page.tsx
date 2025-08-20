
"use client";

import { useState, type ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as actions from "@/app/actions";
import { formSchema, type FormValues, type GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultsDisplay } from "@/components/crypto-forge/results-display";
import { AlertCircle, CheckCircle, CircleDashed, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HappyCoinIcon } from "@/components/icons/happy-coin-icon";
import { Step1CoreConcept } from "@/components/crypto-forge/step-1-core-concept";
import { Stepper } from "@/components/crypto-forge/stepper";
import { Step2BrandingAudience } from "@/components/crypto-forge/step-2-branding-audience";
import { Step3Tokenomics } from "@/components/crypto-forge/step-3-tokenomics";
import { Step4DistributionCommunity } from "@/components/crypto-forge/step-4-distribution-community";
import { Step5TechnicalDetails } from "@/components/crypto-forge/step-5-technical-details";
import { Step6NetworkParameters } from "@/components/crypto-forge/step-6-network-parameters";
import { ExplanationContext } from "@/hooks/use-explanation";
import { ExplanationDialog } from "@/components/crypto-forge/explanation-dialog";


type GenerationStepStatus = 'pending' | 'generating' | 'success' | 'error';
type GenerationStep = { name: string; status: GenerationStepStatus; error?: string };

const steps: { title: string, component: ReactNode }[] = [
    { title: "Core Concept", component: <Step1CoreConcept /> },
    { title: "Branding & Audience", component: <Step2BrandingAudience /> },
    { title: "Tokenomics", component: <Step3Tokenomics /> },
    { title: "Distribution & Community", component: <Step4DistributionCommunity /> },
    { title: "Technical Details", component: <Step5TechnicalDetails /> },
    { title: "Network Parameters", component: <Step6NetworkParameters /> },
];

export default function ForgePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [showResultsPage, setShowResultsPage] = useState(false);

  // Explanation Dialog State
  const [explanation, setExplanation] = useState({ isOpen: false, concept: '', content: '', isLoading: false });
  
  const { toast } = useToast();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
        projectName: "NovaNet",
        ticker: "NOV",
        missionStatement: "To build a decentralized, censorship-resistant internet for the next generation of web applications.",
        targetAudience: "Developers and privacy advocates looking for a censorship-resistant platform.",
        brandVoice: "Empowering, secure, and futuristic.",
        tagline: "The web, rebuilt.",
        tokenUtility: "Governance, staking for network security, and paying for decentralized storage.",
        initialDistribution: "50% to community treasury, 20% to team, 20% to early investors, 10% airdrop.",
        communityStrategy: "Engage developers via hackathons, provide grants for dApp development, and maintain an active presence on tech forums.",
        logoDescription: "A stylized 'N' that looks like a shield or a network node, with circuit-like patterns. Colors should be electric blue and dark purple.",
        timestamp: `The Times 03/Jan/2009 Chancellor on brink of second bailout for banks`,
        blockReward: 50,
        blockHalving: 210000,
        coinSupply: 21000000,
        addressLetter: "N",
        coinUnit: "satoshi",
        coinbaseMaturity: 100,
        numberOfConfirmations: 6,
        targetSpacingInMinutes: 10,
        targetTimespanInMinutes: 1440,
    },
  });

  const { getValues, trigger, formState } = methods;

  const handleExplain = async (concept: string) => {
    setExplanation({ isOpen: true, concept, content: '', isLoading: true });
    const content = await actions.explainConcept(concept);
    setExplanation({ isOpen: true, concept, content, isLoading: false });
  };
  
  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    setResults(null);
    setShowResultsPage(false);

    const initialSteps: GenerationStep[] = [
        { name: 'Logo Generation', status: 'pending' },
        { name: 'Genesis Block', status: 'pending' },
        { name: 'Network Config', status: 'pending' },
        { name: 'README File', status: 'pending' },
        { name: 'Install Script', status: 'pending' },
    ];
    setGenerationSteps(initialSteps.map(step => ({ ...step, status: 'generating' })));

    try {
        const generationPromises = [
            actions.generateLogo({ coinName: data.projectName, logoDescription: data.logoDescription }),
            actions.generateGenesisBlockCode({ coinName: data.projectName, ticker: data.ticker, timestamp: data.timestamp }),
            actions.createNetworkConfigurationFile(data),
            actions.generateReadme({ projectName: data.projectName, ticker: data.ticker, missionStatement: data.missionStatement }),
            actions.generateInstallScript({ projectName: data.projectName, ticker: data.ticker }),
        ];

        const results = await Promise.allSettled(generationPromises);

        const partialResults: Partial<GenerationResult> = {};
        let hasErrors = false;

        results.forEach((result, index) => {
            const stepName = initialSteps[index].name;
            if (result.status === 'fulfilled') {
                setGenerationSteps(prev => prev.map(s => s.name === stepName ? { ...s, status: 'success' } : s));
                switch(stepName) {
                    case 'Logo Generation': partialResults.logoDataUri = (result.value as { logoDataUri: string }).logoDataUri; break;
                    case 'Genesis Block': partialResults.genesisBlockCode = (result.value as { genesisBlockCode: string }).genesisBlockCode; break;
                    case 'Network Config': partialResults.networkConfigurationFile = (result.value as { networkConfigurationFile: string }).networkConfigurationFile; break;
                    case 'README File': partialResults.readmeContent = (result.value as { readmeContent: string }).readmeContent; break;
                    case 'Install Script': partialResults.installScript = (result.value as { installScript: string }).installScript; break;
                }
            } else {
                hasErrors = true;
                const errorMessage = (result.reason as Error).message || 'An unknown error occurred.';
                setGenerationSteps(prev => prev.map(s => s.name === stepName ? { ...s, status: 'error', error: errorMessage } : s));
            }
        });

        if (Object.keys(partialResults).length > 0) {
            setResults({
                formValues: data,
                ...partialResults
            });
        }

        if (hasErrors) {
            toast({
                variant: "destructive",
                title: "One or more steps failed",
                description: "Review the generation status below for details.",
            });
        } else {
            // If everything was successful, go straight to the results page.
            setShowResultsPage(true);
        }

    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "A critical error occurred",
            description: e.message || "Could not start the generation process.",
        });
        setGenerationSteps(initialSteps.map(step => ({ ...step, status: 'error', error: 'Process failed to start.' })));
    } finally {
        setIsGenerating(false);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = Object.keys(methods.getValues());
    const isValid = await trigger(fieldsToValidate as any, { shouldFocus: true });
    if (isValid && currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
    } else if (isValid && currentStep === steps.length - 1) {
        onSubmit(getValues());
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
    }
  };

  const resetForm = () => {
    setResults(null);
    setIsGenerating(false);
    setGenerationSteps([]);
    setCurrentStep(0);
    setShowResultsPage(false);
  }

  const handleTryAgain = () => {
    onSubmit(getValues());
  };

  if (showResultsPage && results) {
    return <ResultsDisplay results={results} onReset={resetForm} />;
  }

  if (generationSteps.length > 0) {
    const hasError = generationSteps.some(s => s.status === 'error');
    const allDone = generationSteps.every(s => s.status === 'success' || s.status === 'error');
    
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
                                        <p className="text-xs text-destructive/80 mt-1 font-code break-words">{step.error}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {allDone && (
                <div className="mt-8 flex justify-center items-center gap-4">
                    {hasError && (
                        <>
                            <Button onClick={handleTryAgain} variant="default">
                                Try Again
                            </Button>
                            <Button onClick={resetForm} variant="outline">
                                Back to Editor
                            </Button>
                        </>
                    )}
                    {results && (
                         <Button onClick={() => setShowResultsPage(true)} variant={hasError ? "secondary" : "default"}>
                            View Results
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
  }

  return (
    <ExplanationContext.Provider value={{ handleExplain }}>
      <FormProvider {...methods}>
        <div className="flex flex-col min-h-screen bg-background">
          <header className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                  <HappyCoinIcon className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold font-headline">Coin Engine</span>
              </Link>
              <Button asChild variant="outline">
                  <Link href="/dashboard">Login / Signup</Link>
              </Button>
          </header>
          <main className="flex-grow container mx-auto px-4 pt-4 pb-12 flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <Stepper currentStep={currentStep} steps={steps.map(s => s.title)} />
              
              <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-8">
                {steps[currentStep].component}

                <div className="flex justify-between mt-8">
                    <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                        Back
                    </Button>
                    <Button type="button" onClick={handleNext} disabled={!formState.isValid}>
                        {currentStep === steps.length - 1 ? "Forge Project" : "Next Step"}
                    </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
         <ExplanationDialog
            isOpen={explanation.isOpen}
            onOpenChange={(isOpen) => setExplanation(prev => ({ ...prev, isOpen }))}
            title={explanation.concept}
            content={explanation.content}
            isLoading={explanation.isLoading}
        />
      </FormProvider>
    </ExplanationContext.Provider>
  );
}
