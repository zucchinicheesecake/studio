
"use client";

import { useState, createContext, useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { generateCrypto, explainConcept } from "@/app/actions";
import { formSchema, type FormValues, type GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Stepper } from "@/components/crypto-forge/stepper";
import { Step1Consensus } from "@/components/crypto-forge/step-1-consensus";
import { Step2BasicInfo } from "@/components/crypto-forge/step-2-basic-info";
import { Step3Economics } from "@/components/crypto-forge/step-3-economics";
import { Step4Network } from "@/components/crypto-forge/step-4-network";
import { Step5Logo } from "@/components/crypto-forge/step-5-logo";
import { Step6Whitepaper } from "@/components/crypto-forge/step-6-whitepaper";
import { ResultsDisplay } from "@/components/crypto-forge/results-display";
import { Loader2 } from "lucide-react";
import { ExplanationDialog } from "@/components/crypto-forge/explanation-dialog";


const steps = [
  { id: 1, name: "Consensus", component: <Step1Consensus />, fields: ["consensusMechanism"] },
  { id: 2, name: "Basics", component: <Step2BasicInfo />, fields: ["coinName", "coinAbbreviation", "addressLetter", "coinUnit", "timestamp", "websiteUrl", "githubUrl"] },
  { id: 3, name: "Economics", component: <Step3Economics />, fields: ["blockReward", "blockHalving", "coinSupply"] },
  { id: 4, name: "Network", component: <Step4Network />, fields: ["coinbaseMaturity", "numberOfConfirmations", "targetSpacingInMinutes", "targetTimespanInMinutes"] },
  { id: 5, name: "Logo", component: <Step5Logo />, fields: ["logoDescription"] },
  { id: 6, name: "Whitepaper", component: <Step6Whitepaper />, fields: ["problemStatement", "solutionStatement", "keyFeatures"] },
];

export default function ForgePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [explanation, setExplanation] = useState({ title: "", content: "", isLoading: false });

  const { toast } = useToast();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consensusMechanism: "",
      coinName: "",
      coinAbbreviation: "",
      addressLetter: "",
      coinUnit: "",
      timestamp: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
      websiteUrl: "",
      githubUrl: "",
      blockReward: 50,
      blockHalving: 210000,
      coinSupply: 21000000,
      coinbaseMaturity: 100,
      numberOfConfirmations: 6,
      targetSpacingInMinutes: 10,
      targetTimespanInMinutes: 1440,
      logoDescription: "A golden coin with a futuristic circuit pattern.",
      problemStatement: "Traditional financial systems are slow, expensive, and opaque.",
      solutionStatement: "A decentralized, peer-to-peer digital currency that enables instant, low-cost payments to anyone, anywhere in the world, without the need for a central authority.",
      keyFeatures: "- Fast and efficient transactions\n- Low network fees\n- Secure and immutable ledger\n- Decentralized governance",
    },
  });

  const { trigger, handleSubmit } = methods;

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
    setIsLoading(true);
    setResults(null);
    try {
        const resultData = await generateCrypto(data);
        setResults(resultData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: errorMessage,
        })
    } finally {
        setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResults(null);
    setCurrentStep(1);
    methods.reset();
  }

  const handleExplain = async (concept: string) => {
    setExplanation({ title: concept, content: "", isLoading: true });
    const explanationText = await explainConcept(concept);
    setExplanation({ title: concept, content: explanationText, isLoading: false });
  };


  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <h1 className="text-3xl font-headline font-bold text-primary">Generating Your Coin...</h1>
            <p className="text-muted-foreground mt-2">The AI is generating your genesis block, configuration, and instructions.</p>
            <p className="text-sm text-muted-foreground mt-2">(This may take up to a minute)</p>
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
              <h1 className="text-5xl font-headline font-bold text-primary">CoinGenius AI</h1>
              <p className="mt-2 text-lg text-muted-foreground">Your AI partner for creating custom cryptocurrencies.</p>
          </div>
          <div className="w-full max-w-5xl">
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
              {currentStep === steps.length ? "Generate My Coin" : "Next Step"}
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


type ExplanationContextType = {
  handleExplain: (concept: string) => void;
};
// Create a context to hold the handleExplain function.
// This avoids prop-drilling it down through multiple layers.
const ExplanationContext = createContext<ExplanationContextType>({ handleExplain: () => {} });

// Custom hook to easily access the context
export const useExplanation = () => useContext(ExplanationContext);
