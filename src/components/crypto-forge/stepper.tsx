"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export function Stepper({ currentStep, steps, className }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className={cn("flex items-center", className)}>
        {steps.map((step, index) => (
          <li key={step} className={cn("relative", index !== steps.length - 1 ? "flex-1" : "")}>
            <>
              {/* Completed Step */}
              {currentStep > index ? (
                <div className="group flex items-center w-full">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                    </span>
                    <span className="ml-4 hidden text-sm font-medium text-primary md:inline-flex">{step}</span>
                  </span>
                </div>
              ) : currentStep === index ? (
                // Current Step
                <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                   <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                    <span className="text-primary">{index + 1}</span>
                  </span>
                  <span className="ml-4 hidden text-sm font-medium text-primary md:inline-flex">{step}</span>
                </div>
              ) : (
                // Upcoming Step
                <div className="group flex items-center w-full">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                      <span className="text-gray-500">{index + 1}</span>
                    </span>
                    <span className="ml-4 hidden text-sm font-medium text-gray-500 md:inline-flex">{step}</span>
                  </span>
                </div>
              )}

              {/* Separator */}
              {index !== steps.length - 1 ? (
                <div className="absolute right-0 top-0 h-full w-5" aria-hidden="true">
                  <svg
                    className={cn("h-full w-full", currentStep > index ? "text-primary" : "text-gray-300")}
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0.5 0V30L10.5 40L0.5 50V80"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              ) : null}
            </>
          </li>
        ))}
      </ol>
    </nav>
  );
}
