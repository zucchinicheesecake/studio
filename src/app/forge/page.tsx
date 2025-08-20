
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

    const initialSteps: GenerationStep[] = [
        { name: 'Logo Generation', status: 'pending' },
        { name: 'Genesis Block', status: 'pending' },
        { name: 'Network Config', status: 'pending' },
        { name: 'README File', status: 'pending' },
        { name: 'Install Script', status: 'pending' },
    ];
    setGenerationSteps(initialSteps);

    try {
        const generatedAssets: any = {};
        
        const updateStepStatus = (name: string, status: GenerationStepStatus, error?: string) => {
            setGenerationSteps(prev => prev.map(s => s.name === name ? { ...s, status, error } : s));
        };
        
        const runStep = async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
            updateStepStatus(name, 'generating');
            try {
                const result = await fn();
                updateStepStatus(name, 'success');
                return result;
            } catch (e: any) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                updateStepStatus(name, 'error', errorMessage);
                throw new Error(`Failed at step: ${name}`);
            }
        };

        const [
            logo,
            genesis,
            networkConfig,
            installScript,
            readme,
        ] = await Promise.all([
            runStep('Logo Generation', () => actions.generateLogo({ coinName: data.projectName, logoDescription: data.logoDescription })),
            runStep('Genesis Block', () => actions.generateGenesisBlockCode({ coinName: data.projectName, ticker: data.ticker, timestamp: data.timestamp })),
            runStep('Network Config', () => actions.createNetworkConfigurationFile(data)),
            runStep('Install Script', () => actions.generateInstallScript({ projectName: data.projectName, ticker: data.ticker })),
            runStep('README File', () => actions.generateReadme({ projectName: data.projectName, ticker: data.ticker, missionStatement: data.missionStatement })),
        ]);
        
        setResults({
            formValues: data,
            genesisBlockCode: genesis.genesisBlockCode,
            networkConfigurationFile: networkConfig.networkConfigurationFile,
            readmeContent: readme.readmeContent,
            logoDataUri: logo.logoDataUri,
            installScript: installScript.installScript,
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
    methods.reset();
  }

  const handleTryAgain = () => {
    onSubmit(getValues());
  };


  if (isGenerating || (generationSteps.length > 0 && !results)) {
    const hasError = generationSteps.some(s => s.status === 'error');
    
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
    <ExplanationContext.Provider value={{ handleExplain }}>
      <FormProvider {...methods}>
        <div className="flex flex-col min-h-screen bg-background">
          <header className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                  <HappyCoinIcon className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold font-headline">Coin Engine</span>
              </Link>
              <Button asChild variant="outline">
                  <Link href="/dashboard">My Dashboard</Link>
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

