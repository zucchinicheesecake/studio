
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex justify-between items-center w-full max-w-2xl mx-auto p-4 rounded-lg bg-card/50 border border-border">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center w-full">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                currentStep > index ? "bg-primary border-primary text-primary-foreground" :
                currentStep === index ? "bg-primary/20 border-primary text-primary" :
                "bg-muted border-border text-muted-foreground"
              )}
            >
              {currentStep > index ? <Check size={16} /> : <span className="font-bold text-sm">{index + 1}</span>}
            </div>
            <p className={cn(
                "text-xs mt-2 text-center",
                currentStep >= index ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </p>
          </div>

          {index < steps.length - 1 && (
             <div className={cn(
                "flex-1 h-0.5 mx-4",
                currentStep > index ? "bg-primary" : "bg-border"
             )} />
          )}
        </div>
      ))}
    </div>
  );
}
