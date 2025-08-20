
"use client";

import { useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { generateCrypto, explainConcept } from "@/app/actions";
import { formSchema, type FormValues, type GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Stepper } from "@/components/crypto-forge/stepper";
import { Step1CoreConcept } from "@/components/crypto-forge/step-1-core-concept";
import { Step2TargetAudience } from "@/components/crypto-forge/step-2-target-audience";
import { Step3Branding } from "@/components/crypto-forge/step-3-branding";
import { Step4TokenStrategy } from "@/components/crypto-forge/step-4-token-strategy";
import { ResultsDisplay } from "@/components/crypto-forge/results-display";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { ExplanationDialog } from "@/components/crypto-forge/explanation-dialog";
import { ExplanationContext } from "@/hooks/use-explanation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const steps = [
  { id: 1, name: "Core Concept", component: <Step1CoreConcept />, fields: ["projectName", "ticker", "missionStatement"] },
  { id: 2, name: "Audience", component: <Step2TargetAudience />, fields: ["targetAudience"] },
  { id: 3, name: "Branding", component: <Step3Branding />, fields: ["brandVoice", "logoDescription"] },
  { id: 4, name: "Token Strategy", component: <Step4TokenStrategy />, fields: ["tokenUtility", "initialDistribution"] },
];

const generationSteps = [
    'Investor Pitch Deck',
    'Tokenomics Model',
    'Community Strategy',
    'Logo Generation',
    'Whitepaper',
    'Audio Summary',
    'Landing Page',
    'Social Campaign',
    'Genesis Block',
    'Network Config',
    'Compilation Guidance',
    'Node Setup Instructions',
];


type Status = 'idle' | 'generating' | 'success' | 'error';
type StepStatus = {
    [key: string]: { status: 'pending' | 'success' | 'error'; error?: string };
};


export default function ForgePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generationStatus, setGenerationStatus] = useState<Status>('idle');
  const [stepStatuses, setStepStatuses] = useState<StepStatus>({});
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [explanation, setExplanation] = useState({ title: "", content: "", isLoading: false });
  const [error, setError] = useState<string | null>(null);

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
      initialDistribution: "40% for community mining rewards, 20% for the development team (vested over 4 years), 20% for the ecosystem fund, 10% for strategic partners, and 10% for a public sale.",
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
    setGenerationStatus('generating');
    setResults(null);
    setError(null);
    setStepStatuses(
        generationSteps.reduce((acc, stepName) => {
            acc[stepName] = { status: 'pending' };
            return acc;
        }, {} as StepStatus)
    );

    try {
        // This function will be called by the server action to update status
        const onStepComplete = async (step: string, success: boolean, error?: string) => {
            setStepStatuses(prev => ({
                ...prev,
                [step]: { status: success ? 'success' : 'error', error },
            }));
        };

        const resultData = await generateCrypto(data, onStepComplete);
        setResults(resultData);
        setGenerationStatus('success');
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during generation.";
        setError(errorMessage);
        setGenerationStatus('error');
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "One or more steps failed. See details below.",
        });
    }
  };

  const resetForm = () => {
    setResults(null);
    setCurrentStep(1);
    setGenerationStatus('idle');
    methods.reset();
  }

  const handleTryAgain = () => {
    onSubmit(getValues());
  };

  const handleExplain = async (concept: string) => {
    setExplanation({ title: concept, content: "", isLoading: true });
    const explanationText = await explainConcept(concept);
    setExplanation({ title: concept, content: explanationText, isLoading: false });
  };


  if (generationStatus === 'generating' || generationStatus === 'error') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center container mx-auto px-4 py-12">
            <h1 className="text-3xl font-headline font-bold text-primary">
                {generationStatus === 'error' ? 'Generation Failed' : 'Forging Your Project...'}
            </h1>
            <p className="text-muted-foreground mt-2 mb-8">
                {generationStatus === 'error' ? 'An error occurred. See the log below for details.' : 'The AI is building your assets. Please wait.'}
            </p>
            <Card className="w-full max-w-2xl text-left">
                <CardHeader>
                    <CardTitle>Generation Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {Object.entries(stepStatuses).map(([stepName, { status, error }]) => (
                            <li key={stepName} className="flex items-center text-sm">
                                {status === 'pending' && <Loader2 className="h-4 w-4 animate-spin text-primary mr-3" />}
                                {status === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mr-3" />}
                                {status === 'error' && <AlertCircle className="h-4 w-4 text-destructive mr-3" />}
                                <span className="flex-grow">{stepName}</span>
                                {status === 'error' && <span className="text-destructive text-xs ml-4">Failed</span>}
                            </li>
                        ))}
                    </ul>
                    {generationStatus === 'error' && error && (
                         <Alert variant="destructive" className="mt-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error Details</AlertTitle>
                            <AlertDescription className="font-code text-xs">{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
            {generationStatus === 'error' && (
                <div className="mt-8">
                    <Button onClick={handleTryAgain}>
                        Try Again
                    </Button>
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

    