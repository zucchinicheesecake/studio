
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as actions from "@/app/actions";
import { formSchema, type FormValues, type GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Stepper } from "@/components/crypto-forge/stepper";
import { ResultsDisplay } from "@/components/crypto-forge/results-display";
import { AlertCircle, CheckCircle, CircleDashed, Loader2 } from "lucide-react";
import { ExplanationDialog } from "@/components/crypto-forge/explanation-dialog";
import { ExplanationContext } from "@/hooks/use-explanation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HappyCoinIcon } from "@/components/icons/happy-coin-icon";
import { Step1ProjectIdentity } from "@/components/crypto-forge/step-1-project-identity";
import { Step2BlockchainParameters } from "@/components/crypto-forge/step-2-blockchain-parameters";


const steps = [
  { id: 1, name: "Project Identity", component: <Step1ProjectIdentity />, fields: ["projectName", "ticker", "missionStatement", "tagline", "logoDescription", "timestamp"] },
  { id: 2, name: "Blockchain Parameters", component: <Step2BlockchainParameters />, fields: ["blockReward", "blockHalving", "coinSupply", "addressLetter", "coinUnit", "coinbaseMaturity", "numberOfConfirmations", "targetSpacingInMinutes", "targetTimespanInMinutes"] },
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
      // Step 1
      projectName: "NovaNet",
      ticker: "NOV",
      missionStatement: "To build a decentralized, censorship-resistant internet for the next generation of web applications.",
      tagline: "The web, rebuilt.",
      logoDescription: "A stylized 'N' that looks like a shield or a network node, with circuit-like patterns. Colors should be electric blue and dark purple.",
      timestamp: `The Times 03/Jan/2009 Chancellor on brink of second bailout for banks`,

      // Step 2
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

        // Parallelize independent generation tasks
        const [
            logo,
            genesis,
            networkConfig,
            installScript
        ] = await Promise.all([
            runStep('Logo Generation', () => actions.generateLogo({ coinName: data.projectName, logoDescription: data.logoDescription })),
            runStep('Genesis Block', () => actions.generateGenesisBlockCode({ coinName: data.projectName, ticker: data.ticker, timestamp: data.timestamp })),
            runStep('Network Config', () => actions.createNetworkConfigurationFile(data)),
            runStep('Install Script', () => actions.generateInstallScript({ projectName: data.projectName, ticker: data.ticker })),
        ]);

        generatedAssets.logo = logo;
        generatedAssets.genesis = genesis;
        generatedAssets.networkConfig = networkConfig;
        generatedAssets.installScript = installScript;
        
        // Dependent step
        generatedAssets.readme = await runStep('README File', () => actions.generateReadme({
            projectName: data.projectName,
            ticker: data.ticker,
            missionStatement: data.missionStatement,
        }));
        
        setResults({
            formValues: data,
            genesisBlockCode: generatedAssets.genesis.genesisBlockCode,
            networkConfigurationFile: generatedAssets.networkConfig.networkConfigurationFile,
            readmeContent: generatedAssets.readme.readmeContent,
            logoDataUri: generatedAssets.logo.logoDataUri,
            installScript: generatedAssets.installScript.installScript,
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
    <FormProvider {...methods}>
        <div className="flex flex-col min-h-screen">
        <header className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                <HappyCoinIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold font-headline">Coin Engine</span>
            </Link>
            <Button asChild variant="outline">
                <Link href="/dashboard">My Dashboard</Link>
            </Button>
        </header>
        <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center mb-12">
              <h1 className="text-5xl font-headline font-bold text-primary">Coin Engine</h1>
              <p className="mt-2 text-lg text-muted-foreground">Your AI co-founder for launching a crypto project.</p>
          </div>
          <div className="w-full max-w-4xl">
            <Stepper currentStep={currentStep} steps={steps.map(s => ({id: s.id, name: s.name}))} />
          </div>
          <div className="w-full max-w-3xl mt-10">
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
         <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Coin Engine. All rights reserved.</p>
        </footer>
        <ExplanationDialog
            isOpen={!!explanation.title}
            onOpenChange={(isOpen) => !isOpen && setExplanation({ title: "", content: "", isLoading: false })}
            title={explanation.title}
            content={explanation.content}
            isLoading={explanation.isLoading}
        />
        </div>
    </FormProvider>
  );
}
